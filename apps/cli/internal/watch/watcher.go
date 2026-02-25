package watch

import (
	"context"
	"errors"
	"fmt"
	"time"

	"github.com/AryanJ-NYC/weave-cash/apps/cli/internal/api"
)

type Event struct {
	Event          string              `json:"event"`
	Status         string              `json:"status"`
	Invoice        api.InvoiceResponse `json:"invoice"`
	ObservedAt     string              `json:"observedAt"`
	TimeoutSeconds int                 `json:"timeoutSeconds,omitempty"`
}

type Result struct {
	TimedOut     bool
	FinalStatus  string
	FinalInvoice api.InvoiceResponse
}

type Config struct {
	Interval time.Duration
	Timeout  time.Duration

	Fetch   func(context.Context) (api.InvoiceResponse, error)
	OnEvent func(Event) error

	Now   func() time.Time
	Sleep func(context.Context, time.Duration) error
}

func Run(ctx context.Context, cfg Config) (Result, error) {
	if cfg.Interval <= 0 {
		return Result{}, errors.New("interval must be greater than zero")
	}
	if cfg.Timeout <= 0 {
		return Result{}, errors.New("timeout must be greater than zero")
	}
	if cfg.Fetch == nil {
		return Result{}, errors.New("fetch function is required")
	}
	if cfg.OnEvent == nil {
		cfg.OnEvent = func(Event) error { return nil }
	}
	if cfg.Now == nil {
		cfg.Now = time.Now
	}
	if cfg.Sleep == nil {
		cfg.Sleep = sleepWithContext
	}

	start := cfg.Now()
	deadline := start.Add(cfg.Timeout)
	lastStatus := ""

	var latest api.InvoiceResponse

	for {
		if err := ctx.Err(); err != nil {
			return Result{}, err
		}

		invoice, err := cfg.Fetch(ctx)
		if err != nil {
			return Result{}, err
		}
		latest = invoice

		status := currentStatus(invoice)
		observedAt := cfg.Now().UTC().Format(time.RFC3339)

		if status != lastStatus {
			eventName := "status_change"
			if IsTerminalStatus(status) {
				eventName = "terminal"
			}

			event := Event{
				Event:      eventName,
				Status:     status,
				Invoice:    invoice,
				ObservedAt: observedAt,
			}
			if err := cfg.OnEvent(event); err != nil {
				return Result{}, err
			}

			lastStatus = status
			if IsTerminalStatus(status) {
				return Result{
					TimedOut:     false,
					FinalStatus:  status,
					FinalInvoice: invoice,
				}, nil
			}
		}

		if !cfg.Now().Before(deadline) {
			timeoutEvent := Event{
				Event:          "timeout",
				Status:         status,
				Invoice:        latest,
				ObservedAt:     observedAt,
				TimeoutSeconds: int(cfg.Timeout.Seconds()),
			}
			if err := cfg.OnEvent(timeoutEvent); err != nil {
				return Result{}, err
			}

			return Result{
				TimedOut:     true,
				FinalStatus:  status,
				FinalInvoice: latest,
			}, nil
		}

		if err := cfg.Sleep(ctx, cfg.Interval); err != nil {
			return Result{}, fmt.Errorf("watch sleep interrupted: %w", err)
		}
	}
}

func IsTerminalStatus(status string) bool {
	_, exists := terminalStatusSet[status]
	return exists
}

func currentStatus(invoice api.InvoiceResponse) string {
	if invoice.Status != "" {
		return invoice.Status
	}
	if invoice.Timeline.CurrentStatus != "" {
		return invoice.Timeline.CurrentStatus
	}
	return "UNKNOWN"
}

func sleepWithContext(ctx context.Context, duration time.Duration) error {
	timer := time.NewTimer(duration)
	defer timer.Stop()

	select {
	case <-ctx.Done():
		return ctx.Err()
	case <-timer.C:
		return nil
	}
}

var terminalStatusSet = map[string]struct{}{
	"COMPLETED": {},
	"FAILED":    {},
	"REFUNDED":  {},
	"EXPIRED":   {},
}
