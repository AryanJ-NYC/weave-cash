package main

import (
	"os"

	"github.com/AryanJ-NYC/weave-cash/apps/cli/internal/cmd"
	cliExit "github.com/AryanJ-NYC/weave-cash/apps/cli/internal/exit"
)

func main() {
	rootCmd := cmd.NewRootCommand()
	if err := rootCmd.Execute(); err != nil {
		cliExit.Write(os.Stderr, err)
		os.Exit(cliExit.Code(err))
	}
}
