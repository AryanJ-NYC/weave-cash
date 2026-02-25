package cmd

import (
	"encoding/json"
	"strings"
	"testing"
)

func TestTokensCommandReturnsJSON(t *testing.T) {
	t.Helper()

	stdout, _, err := executeRootCommand(t, "tokens")
	if err != nil {
		t.Fatalf("tokens command returned error: %v", err)
	}

	var payload struct {
		Tokens          []string            `json:"tokens"`
		Networks        []string            `json:"networks"`
		TokenNetworkMap map[string][]string `json:"tokenNetworkMap"`
		NetworkAliases  map[string][]string `json:"networkAliases"`
	}
	if err := json.Unmarshal([]byte(stdout), &payload); err != nil {
		t.Fatalf("stdout is not valid JSON: %v\nstdout=%s", err, stdout)
	}

	if len(payload.Tokens) != len(tokenNetworkMap) {
		t.Fatalf("expected %d tokens, got %d", len(tokenNetworkMap), len(payload.Tokens))
	}
	if !containsString(payload.TokenNetworkMap["USDT"], "Tron") {
		t.Fatalf("expected USDT to include Tron, got %v", payload.TokenNetworkMap["USDT"])
	}
	if payload.TokenNetworkMap["ZEC"][0] != "Zcash" {
		t.Fatalf("expected ZEC network Zcash, got %v", payload.TokenNetworkMap["ZEC"])
	}
	if payload.NetworkAliases["Ethereum"][0] != "eth" {
		t.Fatalf("expected Ethereum alias eth, got %v", payload.NetworkAliases["Ethereum"])
	}
	if payload.NetworkAliases["Zcash"][0] != "zec" {
		t.Fatalf("expected Zcash alias zec, got %v", payload.NetworkAliases["Zcash"])
	}
}

func containsString(values []string, expected string) bool {
	for _, value := range values {
		if value == expected {
			return true
		}
	}

	return false
}

func TestTokensCommandReturnsHumanOutput(t *testing.T) {
	t.Helper()

	stdout, _, err := executeRootCommand(t, "tokens", "--human")
	if err != nil {
		t.Fatalf("tokens --human returned error: %v", err)
	}

	if !strings.Contains(stdout, "tokens:\n") {
		t.Fatalf("expected tokens section in human output, got:\n%s", stdout)
	}
	if !strings.Contains(stdout, "- USDC (Ethereum, Solana)") {
		t.Fatalf("expected USDC line in human output, got:\n%s", stdout)
	}
	if !strings.Contains(stdout, "networks:\n") {
		t.Fatalf("expected networks section in human output, got:\n%s", stdout)
	}
	if !strings.Contains(stdout, "- Ethereum (eth)") {
		t.Fatalf("expected Ethereum alias line in human output, got:\n%s", stdout)
	}
}
