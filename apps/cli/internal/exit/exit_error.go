package exit

import (
	"encoding/json"
	"errors"
	"io"
)

type Error struct {
	ExitCode int
	Message  string
	Payload  any
}

func (e *Error) Error() string {
	if e.Message != "" {
		return e.Message
	}
	return "command failed"
}

func New(code int, message string, payload any) *Error {
	if code <= 0 {
		code = 1
	}

	return &Error{
		ExitCode: code,
		Message:  message,
		Payload:  payload,
	}
}

func Code(err error) int {
	var exitErr *Error
	if errors.As(err, &exitErr) {
		return exitErr.ExitCode
	}

	return 1
}

func Write(w io.Writer, err error) {
	var exitErr *Error
	if errors.As(err, &exitErr) {
		if exitErr.Payload != nil {
			_ = json.NewEncoder(w).Encode(exitErr.Payload)
			return
		}

		_ = json.NewEncoder(w).Encode(map[string]string{
			"error": exitErr.Error(),
		})
		return
	}

	_ = json.NewEncoder(w).Encode(map[string]string{
		"error": err.Error(),
	})
}
