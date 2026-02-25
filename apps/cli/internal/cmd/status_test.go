package cmd

import (
	"context"
	"encoding/json"
	"errors"
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/AryanJ-NYC/weave-cash/apps/cli/internal/api"
	cliExit "github.com/AryanJ-NYC/weave-cash/apps/cli/internal/exit"
	"github.com/AryanJ-NYC/weave-cash/apps/cli/internal/watch"
)

func TestStatusCommandReturnsInvoiceJSON(t *testing.T) {
	t.Helper()

	server := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		if r.URL.Path != "/api/invoices/inv_1" {
			t.Fatalf("unexpected path: %s", r.URL.Path)
		}
		w.Header().Set("Content-Type", "application/json")
		_, _ = w.Write([]byte(`{"id":"inv_1","status":"PENDING","invoice":{"id":"inv_1","amount":"1","receiveToken":"BTC","receiveNetwork":"Bitcoin","walletAddress":"bc1q","description":null,"buyerName":null,"buyerEmail":null,"buyerAddress":null,"createdAt":"2026-02-20T00:00:00.000Z","updatedAt":"2026-02-20T00:00:00.000Z"},"paymentInstructions":{"payToken":null,"payNetwork":null,"depositAddress":null,"depositMemo":null,"amountIn":null,"expiresAt":null,"paidAt":null},"timeline":{"currentStatus":"PENDING","isTerminal":false,"createdAt":"2026-02-20T00:00:00.000Z","quotedAt":null,"expiresAt":null,"paidAt":null,"completedAt":null,"failedAt":null,"refundedAt":null,"expiredAt":null,"lastStatusChangeAt":"2026-02-20T00:00:00.000Z"}}`))
	}))
	defer server.Close()

	stdout, _, err := executeRootCommand(t, "status", "inv_1", "--api-url", server.URL)
	if err != nil {
		t.Fatalf("status command returned error: %v", err)
	}

	var payload map[string]any
	if err := json.Unmarshal([]byte(stdout), &payload); err != nil {
		t.Fatalf("invalid JSON output: %v", err)
	}
	if payload["status"] != "PENDING" {
		t.Fatalf("expected status PENDING, got %v", payload["status"])
	}
}

func TestStatusWatchReturnsExitCodeTwoOnTimeoutWithEvents(t *testing.T) {
	t.Helper()

	originalRunner := watchRunner
	watchRunner = func(_ context.Context, cfg watch.Config) (watch.Result, error) {
		event := watch.Event{
			Event:      "status_change",
			Status:     "AWAITING_DEPOSIT",
			Invoice:    api.InvoiceResponse{ID: "inv_1", Status: "AWAITING_DEPOSIT"},
			ObservedAt: "2026-02-20T00:00:00Z",
		}
		if err := cfg.OnEvent(event); err != nil {
			return watch.Result{}, err
		}

		timeoutEvent := watch.Event{
			Event:          "timeout",
			Status:         "AWAITING_DEPOSIT",
			Invoice:        api.InvoiceResponse{ID: "inv_1", Status: "AWAITING_DEPOSIT"},
			ObservedAt:     "2026-02-20T00:15:00Z",
			TimeoutSeconds: 900,
		}
		if err := cfg.OnEvent(timeoutEvent); err != nil {
			return watch.Result{}, err
		}

		return watch.Result{TimedOut: true, FinalStatus: "AWAITING_DEPOSIT"}, nil
	}
	defer func() { watchRunner = originalRunner }()

	stdout, _, err := executeRootCommand(
		t,
		"status",
		"inv_1",
		"--watch",
		"--interval-seconds", "5",
		"--timeout-seconds", "900",
	)
	if err == nil {
		t.Fatal("expected timeout error")
	}

	var exitErr *cliExit.Error
	if !errors.As(err, &exitErr) {
		t.Fatalf("expected *exit.Error, got %T", err)
	}
	if exitErr.ExitCode != 2 {
		t.Fatalf("expected exit code 2, got %d", exitErr.ExitCode)
	}

	lines := 0
	for _, c := range stdout {
		if c == '\n' {
			lines++
		}
	}
	if lines != 2 {
		t.Fatalf("expected two JSON event lines, got %d\nstdout=%s", lines, stdout)
	}
}

func TestGetAliasMatchesStatusBehavior(t *testing.T) {
	t.Helper()

	server := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		if r.URL.Path != "/api/invoices/inv_2" {
			t.Fatalf("unexpected path: %s", r.URL.Path)
		}
		w.Header().Set("Content-Type", "application/json")
		_, _ = w.Write([]byte(`{"id":"inv_2","status":"FAILED","invoice":{"id":"inv_2","amount":"1","receiveToken":"BTC","receiveNetwork":"Bitcoin","walletAddress":"bc1q","description":null,"buyerName":null,"buyerEmail":null,"buyerAddress":null,"createdAt":"2026-02-20T00:00:00.000Z","updatedAt":"2026-02-20T00:00:00.000Z"},"paymentInstructions":{"payToken":null,"payNetwork":null,"depositAddress":null,"depositMemo":null,"amountIn":null,"expiresAt":null,"paidAt":null},"timeline":{"currentStatus":"FAILED","isTerminal":true,"createdAt":"2026-02-20T00:00:00.000Z","quotedAt":null,"expiresAt":null,"paidAt":null,"completedAt":null,"failedAt":"2026-02-20T00:00:00.000Z","refundedAt":null,"expiredAt":null,"lastStatusChangeAt":"2026-02-20T00:00:00.000Z"}}`))
	}))
	defer server.Close()

	stdout, _, err := executeRootCommand(t, "get", "inv_2", "--api-url", server.URL)
	if err != nil {
		t.Fatalf("get alias returned error: %v", err)
	}

	var payload map[string]any
	if err := json.Unmarshal([]byte(stdout), &payload); err != nil {
		t.Fatalf("invalid JSON output: %v", err)
	}
	if payload["status"] != "FAILED" {
		t.Fatalf("expected status FAILED, got %v", payload["status"])
	}
}
