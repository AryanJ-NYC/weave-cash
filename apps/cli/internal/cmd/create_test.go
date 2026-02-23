package cmd

import (
	"encoding/json"
	"io"
	"net/http"
	"net/http/httptest"
	"testing"
)

func TestCreateCommandReturnsJSONEnvelope(t *testing.T) {
	t.Helper()

	var requestBody map[string]any
	server := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		if r.Method != http.MethodPost {
			t.Fatalf("expected POST, got %s", r.Method)
		}
		if r.URL.Path != "/api/invoices" {
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
		w.WriteHeader(http.StatusCreated)
		_, _ = w.Write([]byte(`{"id":"inv_test_123"}`))
	}))
	defer server.Close()

	stdout, _, err := executeRootCommand(
		t,
		"create",
		"--receive-token", "BTC",
		"--amount", "0.01",
		"--wallet-address", "bc1qmerchant",
		"--api-url", server.URL,
	)
	if err != nil {
		t.Fatalf("create command returned error: %v", err)
	}

	var payload map[string]any
	if err := json.Unmarshal([]byte(stdout), &payload); err != nil {
		t.Fatalf("stdout is not valid JSON: %v\nstdout=%s", err, stdout)
	}
	if payload["id"] != "inv_test_123" {
		t.Fatalf("expected id inv_test_123, got %v", payload["id"])
	}
	if payload["invoiceUrl"] != server.URL+"/invoice/inv_test_123" {
		t.Fatalf("unexpected invoiceUrl: %v", payload["invoiceUrl"])
	}
	if requestBody["receiveNetwork"] != "Bitcoin" {
		t.Fatalf("expected inferred receiveNetwork Bitcoin, got %v", requestBody["receiveNetwork"])
	}
}

func TestCreateCommandRejectsMissingRequiredFlagsBeforeNetworkCall(t *testing.T) {
	t.Helper()

	hits := 0
	server := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		hits++
		w.WriteHeader(http.StatusOK)
	}))
	defer server.Close()

	_, _, err := executeRootCommand(
		t,
		"create",
		"--receive-token", "BTC",
		"--wallet-address", "bc1qmerchant",
		"--api-url", server.URL,
	)
	if err == nil {
		t.Fatal("expected error for missing --amount")
	}
	if hits != 0 {
		t.Fatalf("expected zero network calls, got %d", hits)
	}
}

func TestCreateCommandRequiresReceiveNetworkForMultiNetworkToken(t *testing.T) {
	t.Helper()

	hits := 0
	server := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		hits++
		w.WriteHeader(http.StatusOK)
	}))
	defer server.Close()

	_, _, err := executeRootCommand(
		t,
		"create",
		"--receive-token", "USDC",
		"--amount", "1.0",
		"--wallet-address", "0xmerchant",
		"--api-url", server.URL,
	)
	if err == nil {
		t.Fatal("expected error for missing --receive-network with USDC")
	}
	if hits != 0 {
		t.Fatalf("expected zero network calls, got %d", hits)
	}
}

func TestCreateCommandRejectsInvalidNetworkForToken(t *testing.T) {
	t.Helper()

	hits := 0
	server := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		hits++
		w.WriteHeader(http.StatusOK)
	}))
	defer server.Close()

	_, _, err := executeRootCommand(
		t,
		"create",
		"--receive-token", "BTC",
		"--receive-network", "Ethereum",
		"--amount", "1.0",
		"--wallet-address", "bc1qmerchant",
		"--api-url", server.URL,
	)
	if err == nil {
		t.Fatal("expected error for invalid network/token combination")
	}
	if hits != 0 {
		t.Fatalf("expected zero network calls, got %d", hits)
	}
}
