package cmd

import (
	"errors"

	"github.com/AryanJ-NYC/weave-cash/apps/cli/internal/api"
	cliExit "github.com/AryanJ-NYC/weave-cash/apps/cli/internal/exit"
)

func wrapCommandError(err error) error {
	var apiErr *api.APIError
	if errors.As(err, &apiErr) {
		return cliExit.New(1, "api request failed", map[string]any{
			"error":   apiErr.ErrorMessage,
			"status":  apiErr.StatusCode,
			"details": apiErr.Payload,
		})
	}

	return cliExit.New(1, err.Error(), map[string]any{
		"error": err.Error(),
	})
}
