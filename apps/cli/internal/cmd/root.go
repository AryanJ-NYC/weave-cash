package cmd

import "github.com/spf13/cobra"

const defaultAPIURL = "https://www.weavecash.com"

type GlobalOptions struct {
	APIURL string
	Human  bool
}

func NewRootCommand() *cobra.Command {
	opts := &GlobalOptions{
		APIURL: defaultAPIURL,
	}

	rootCmd := &cobra.Command{
		Use:           "weave",
		Short:         "Agent-first CLI for Weave Cash invoice flows",
		SilenceErrors: true,
		SilenceUsage:  true,
	}

	rootCmd.PersistentFlags().StringVar(
		&opts.APIURL,
		"api-url",
		defaultAPIURL,
		"Base URL for the Weave Cash API",
	)
	rootCmd.PersistentFlags().BoolVar(
		&opts.Human,
		"human",
		false,
		"Render human-readable output instead of JSON",
	)

	rootCmd.AddCommand(newCreateCommand(opts))
	rootCmd.AddCommand(newQuoteCommand(opts))
	rootCmd.AddCommand(newStatusCommand(opts))

	return rootCmd
}
