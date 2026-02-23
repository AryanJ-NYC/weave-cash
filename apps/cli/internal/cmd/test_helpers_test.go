package cmd

import (
	"bytes"
	"testing"
)

func executeRootCommand(t *testing.T, args ...string) (string, string, error) {
	t.Helper()

	rootCmd := NewRootCommand()
	stdout := &bytes.Buffer{}
	stderr := &bytes.Buffer{}
	rootCmd.SetOut(stdout)
	rootCmd.SetErr(stderr)
	rootCmd.SetArgs(args)

	err := rootCmd.Execute()
	return stdout.String(), stderr.String(), err
}
