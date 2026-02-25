package api

import (
	"context"
	"encoding/json"
	"io"
	"net/http"
	"net/http/httptest"
	"testing"
)

func TestCreateInvoiceSendsRequestAndParsesResponse(t *testing.T) {
	t.Helper()

	var capturedBody []byte
	server := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		if r.Method != http.MethodPost {
			t.Fatalf("expected POST, got %s", r.Method)
		}
		if r.URL.Path != "/api/invoices" {
			t.Fatalf("unexpected path: %s", r.URL.Path)
		}

		body, err := io.ReadAll(r.Body)
		if err != nil {
			t.Fatalf("failed reading request body: %v", err)
		}
		capturedBody = body

		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusCreated)
		_, _ = w.Write([]byte(`{"id":"inv_123"}`))
	}))
	defer server.Close()

	client := NewClient(server.URL, server.Client())
	response, err := client.CreateInvoice(context.Background(), CreateInvoiceRequest{
		ReceiveToken:   "BTC",
		ReceiveNetwork: "Bitcoin",
		Amount:         "0.01",
		WalletAddress:  "bc1qmerchant",
		Description:    "Invoice for design",
	})
	if err != nil {
		t.Fatalf("CreateInvoice returned error: %v", err)
	}

	if response.ID != "inv_123" {
		t.Fatalf("expected id inv_123, got %s", response.ID)
	}

	var payload map[string]any
	if err := json.Unmarshal(capturedBody, &payload); err != nil {
		t.Fatalf("request payload is not valid JSON: %v", err)
	}
	if payload["receiveToken"] != "BTC" {
		t.Fatalf("expected receiveToken BTC, got %v", payload["receiveToken"])
	}
	if payload["walletAddress"] != "bc1qmerchant" {
		t.Fatalf("expected walletAddress bc1qmerchant, got %v", payload["walletAddress"])
	}
}

func TestQuoteInvoiceReturnsStructuredAPIError(t *testing.T) {
	t.Helper()

	server := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusConflict)
		_, _ = w.Write([]byte(`{"error":"Invoice is not in PENDING status"}`))
	}))
	defer server.Close()

	client := NewClient(server.URL, server.Client())
	_, err := client.QuoteInvoice(context.Background(), "inv_123", QuoteRequest{
		PayToken:      "USDC",
		PayNetwork:    "Ethereum",
		RefundAddress: "0xrefund",
	})
	if err == nil {
		t.Fatal("expected error, got nil")
	}

	apiErr, ok := err.(*APIError)
	if !ok {
		t.Fatalf("expected *APIError, got %T", err)
	}
	if apiErr.StatusCode != http.StatusConflict {
		t.Fatalf("expected status 409, got %d", apiErr.StatusCode)
	}
	if apiErr.ErrorMessage != "Invoice is not in PENDING status" {
		t.Fatalf("unexpected api error message: %s", apiErr.ErrorMessage)
	}
}
