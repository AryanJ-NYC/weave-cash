package api

import (
	"bytes"
	"context"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"strings"
	"time"
)

const defaultHTTPTimeout = 30 * time.Second

type Client struct {
	baseURL    string
	httpClient *http.Client
}

type APIError struct {
	StatusCode   int
	ErrorMessage string
	Payload      any
}

func (e *APIError) Error() string {
	if e.ErrorMessage != "" {
		return e.ErrorMessage
	}

	return fmt.Sprintf("request failed with status %d", e.StatusCode)
}

func NewClient(baseURL string, httpClient *http.Client) *Client {
	if httpClient == nil {
		httpClient = &http.Client{Timeout: defaultHTTPTimeout}
	}

	return &Client{
		baseURL:    strings.TrimRight(baseURL, "/"),
		httpClient: httpClient,
	}
}

func (c *Client) CreateInvoice(
	ctx context.Context,
	request CreateInvoiceRequest,
) (CreateInvoiceResponse, error) {
	var response CreateInvoiceResponse
	if err := c.doJSON(ctx, http.MethodPost, "/api/invoices", request, &response); err != nil {
		return CreateInvoiceResponse{}, err
	}

	return response, nil
}

func (c *Client) QuoteInvoice(
	ctx context.Context,
	invoiceID string,
	request QuoteRequest,
) (QuoteResponse, error) {
	var response QuoteResponse
	path := fmt.Sprintf("/api/invoices/%s/quote", invoiceID)
	if err := c.doJSON(ctx, http.MethodPost, path, request, &response); err != nil {
		return QuoteResponse{}, err
	}

	return response, nil
}

func (c *Client) GetInvoice(
	ctx context.Context,
	invoiceID string,
) (InvoiceResponse, error) {
	var response InvoiceResponse
	path := fmt.Sprintf("/api/invoices/%s", invoiceID)
	if err := c.doJSON(ctx, http.MethodGet, path, nil, &response); err != nil {
		return InvoiceResponse{}, err
	}

	return response, nil
}

func (c *Client) doJSON(
	ctx context.Context,
	method string,
	path string,
	requestBody any,
	responseBody any,
) error {
	var bodyReader io.Reader
	if requestBody != nil {
		payload, err := json.Marshal(requestBody)
		if err != nil {
			return fmt.Errorf("failed to marshal request body: %w", err)
		}
		bodyReader = bytes.NewReader(payload)
	}

	url := c.baseURL + path
	req, err := http.NewRequestWithContext(ctx, method, url, bodyReader)
	if err != nil {
		return fmt.Errorf("failed to create request: %w", err)
	}

	req.Header.Set("Accept", "application/json")
	if requestBody != nil {
		req.Header.Set("Content-Type", "application/json")
	}

	resp, err := c.httpClient.Do(req)
	if err != nil {
		return fmt.Errorf("request failed: %w", err)
	}
	defer resp.Body.Close()

	bodyBytes, err := io.ReadAll(resp.Body)
	if err != nil {
		return fmt.Errorf("failed reading response body: %w", err)
	}

	if resp.StatusCode < 200 || resp.StatusCode >= 300 {
		return parseAPIError(resp.StatusCode, bodyBytes)
	}

	if responseBody == nil || len(bodyBytes) == 0 {
		return nil
	}

	if err := json.Unmarshal(bodyBytes, responseBody); err != nil {
		return fmt.Errorf("failed to decode response JSON: %w", err)
	}

	return nil
}

func parseAPIError(statusCode int, bodyBytes []byte) error {
	if len(bodyBytes) == 0 {
		return &APIError{
			StatusCode:   statusCode,
			ErrorMessage: fmt.Sprintf("request failed with status %d", statusCode),
		}
	}

	var payload any
	if err := json.Unmarshal(bodyBytes, &payload); err != nil {
		return &APIError{
			StatusCode:   statusCode,
			ErrorMessage: fmt.Sprintf("request failed with status %d", statusCode),
			Payload:      string(bodyBytes),
		}
	}

	return &APIError{
		StatusCode:   statusCode,
		ErrorMessage: extractErrorMessage(payload, statusCode),
		Payload:      payload,
	}
}

func extractErrorMessage(payload any, statusCode int) string {
	payloadMap, ok := payload.(map[string]any)
	if !ok {
		return fmt.Sprintf("request failed with status %d", statusCode)
	}

	rawError, exists := payloadMap["error"]
	if !exists {
		return fmt.Sprintf("request failed with status %d", statusCode)
	}

	switch value := rawError.(type) {
	case string:
		if value != "" {
			return value
		}
	}

	serialized, err := json.Marshal(rawError)
	if err != nil {
		return fmt.Sprintf("request failed with status %d", statusCode)
	}

	return string(serialized)
}
