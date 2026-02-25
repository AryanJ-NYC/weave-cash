package cmd

import "strings"

func normalizeNetworkName(input string) string {
	trimmed := strings.TrimSpace(input)
	if trimmed == "" {
		return ""
	}

	if canonical, ok := canonicalNetworkByAlias[strings.ToLower(trimmed)]; ok {
		return canonical
	}

	return trimmed
}
