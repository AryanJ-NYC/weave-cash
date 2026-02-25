package cmd

import (
	"encoding/json"
	"errors"
	"io"
	"net/http"
	"net/http/httptest"
	"testing"

	cliExit "github.com/AryanJ-NYC/weave-cash/apps/cli/internal/exit"
)

func TestQuoteCommandReturnsQuoteJSON(t *testing.T) {
	t.Helper()

	var requestBody map[string]any
	server := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		if r.Method != http.MethodPost {
			t.Fatalf("expected POST, got %s", r.Method)
		}
		if r.URL.Path != "/api/invoices/inv_1/quote" {
			t.Fatalf("unexpected path %s", r.URL.Path)
		}
		bodyBytes, err := io.ReadAll(r.Body)
		if err != nil {
			t.Fatalf("failed reading request body: %v", err)
		}
		if err := json.Unmarshal(bodyBytes, &requestBody); err != nil {
			t.Fatalf("request body is not valid JSON: %v", err)
		}

		w.Header().Set("Content-Type", "application/json")
		_, _ = w.Write([]byte(`{"depositAddress":"0xdep","depositMemo":"memo","amountIn":"10","amountOut":"0.01","timeEstimate":"2m","expiresAt":"2026-02-21T00:00:00.000Z"}`))
	}))
	defer server.Close()

	stdout, _, err := executeRootCommand(
		t,
		"quote",
		"inv_1",
		"--pay-token", "USDC",
		"--pay-network", "Ethereum",
		"--refund-address", "0xrefund",
		"--api-url", server.URL,
	)
	if err != nil {
		t.Fatalf("quote command returned error: %v", err)
	}

	var payload map[string]any
	if err := json.Unmarshal([]byte(stdout), &payload); err != nil {
		t.Fatalf("stdout is not valid JSON: %v\nstdout=%s", err, stdout)
	}
	if payload["depositAddress"] != "0xdep" {
		t.Fatalf("expected depositAddress 0xdep, got %v", payload["depositAddress"])
	}
	if requestBody["payNetwork"] != "Ethereum" {
		t.Fatalf("expected canonical payNetwork Ethereum, got %v", requestBody["payNetwork"])
	}
}

func TestQuoteCommandMapsAPIErrorToExitCodeOne(t *testing.T) {
	t.Helper()

	server := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusConflict)
		_, _ = w.Write([]byte(`{"error":"Invoice is not in PENDING status"}`))
	}))
	defer server.Close()

	_, _, err := executeRootCommand(
		t,
		"quote",
		"inv_1",
		"--pay-token", "USDC",
		"--pay-network", "Ethereum",
		"--refund-address", "0xrefund",
		"--api-url", server.URL,
	)
	if err == nil {
		t.Fatal("expected command error")
	}

	var exitErr *cliExit.Error
	if !errors.As(err, &exitErr) {
		t.Fatalf("expected *exit.Error, got %T", err)
	}
	if exitErr.ExitCode != 1 {
		t.Fatalf("expected exit code 1, got %d", exitErr.ExitCode)
	}
}

func TestQuoteCommandAcceptsPayNetworkAlias(t *testing.T) {
	t.Helper()

	var requestBody map[string]any
	server := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		bodyBytes, err := io.ReadAll(r.Body)
		if err != nil {
			t.Fatalf("failed reading request body: %v", err)
		}
		if err := json.Unmarshal(bodyBytes, &requestBody); err != nil {
			t.Fatalf("request body is not valid JSON: %v", err)
		}
		w.Header().Set("Content-Type", "application/json")
		_, _ = w.Write([]byte(`{"depositAddress":"0xdep","depositMemo":"memo","amountIn":"10","amountOut":"0.01","timeEstimate":"2m","expiresAt":"2026-02-21T00:00:00.000Z"}`))
	}))
	defer server.Close()

	_, _, err := executeRootCommand(
		t,
		"quote",
		"inv_1",
		"--pay-token", "USDC",
		"--pay-network", "eth",
		"--refund-address", "0xrefund",
		"--api-url", server.URL,
	)
	if err != nil {
		t.Fatalf("quote command returned error: %v", err)
	}

	if requestBody["payNetwork"] != "Ethereum" {
		t.Fatalf("expected canonical payNetwork Ethereum, got %v", requestBody["payNetwork"])
	}
}
