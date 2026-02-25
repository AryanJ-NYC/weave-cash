package watch

import (
	"context"
	"testing"
	"time"

	"github.com/AryanJ-NYC/weave-cash/apps/cli/internal/api"
)

func TestRunEmitsEventsOnlyOnStatusChangesAndTerminal(t *testing.T) {
	t.Helper()

	statuses := []string{"PENDING", "PENDING", "PROCESSING", "PROCESSING", "COMPLETED"}
	index := 0
	fetch := func(context.Context) (api.InvoiceResponse, error) {
		if index >= len(statuses) {
			index = len(statuses) - 1
		}
		status := statuses[index]
		index++

		return api.InvoiceResponse{ID: "inv_1", Status: status}, nil
	}

	baseTime := time.Date(2026, 2, 20, 0, 0, 0, 0, time.UTC)
	now := baseTime

	events := make([]Event, 0)
	result, err := Run(context.Background(), Config{
		Interval: time.Second,
		Timeout:  10 * time.Second,
		Fetch:    fetch,
		OnEvent: func(event Event) error {
			events = append(events, event)
			return nil
		},
		Now: func() time.Time {
			return now
		},
		Sleep: func(_ context.Context, duration time.Duration) error {
			now = now.Add(duration)
			return nil
		},
	})
	if err != nil {
		t.Fatalf("Run returned error: %v", err)
	}

	if result.TimedOut {
		t.Fatal("expected non-timeout result")
	}
	if result.FinalStatus != "COMPLETED" {
		t.Fatalf("expected COMPLETED, got %s", result.FinalStatus)
	}

	if len(events) != 3 {
		t.Fatalf("expected 3 events, got %d", len(events))
	}
	if events[0].Event != "status_change" || events[0].Status != "PENDING" {
		t.Fatalf("unexpected first event: %#v", events[0])
	}
	if events[1].Event != "status_change" || events[1].Status != "PROCESSING" {
		t.Fatalf("unexpected second event: %#v", events[1])
	}
	if events[2].Event != "terminal" || events[2].Status != "COMPLETED" {
		t.Fatalf("unexpected third event: %#v", events[2])
	}
}

func TestRunEmitsTimeoutEventAndReturnsTimedOutResult(t *testing.T) {
	t.Helper()

	fetch := func(context.Context) (api.InvoiceResponse, error) {
		return api.InvoiceResponse{ID: "inv_1", Status: "AWAITING_DEPOSIT"}, nil
	}

	now := time.Date(2026, 2, 20, 0, 0, 0, 0, time.UTC)
	events := make([]Event, 0)

	result, err := Run(context.Background(), Config{
		Interval: 5 * time.Second,
		Timeout:  10 * time.Second,
		Fetch:    fetch,
		OnEvent: func(event Event) error {
			events = append(events, event)
			return nil
		},
		Now: func() time.Time {
			return now
		},
		Sleep: func(_ context.Context, duration time.Duration) error {
			now = now.Add(duration)
			return nil
		},
	})
	if err != nil {
		t.Fatalf("Run returned error: %v", err)
	}

	if !result.TimedOut {
		t.Fatal("expected timeout result")
	}
	if result.FinalStatus != "AWAITING_DEPOSIT" {
		t.Fatalf("expected AWAITING_DEPOSIT, got %s", result.FinalStatus)
	}

	if len(events) != 2 {
		t.Fatalf("expected 2 events, got %d", len(events))
	}
	if events[0].Event != "status_change" {
		t.Fatalf("expected first event to be status_change, got %s", events[0].Event)
	}
	if events[1].Event != "timeout" {
		t.Fatalf("expected second event to be timeout, got %s", events[1].Event)
	}
	if events[1].TimeoutSeconds != 10 {
		t.Fatalf("expected timeoutSeconds=10, got %d", events[1].TimeoutSeconds)
	}
}
