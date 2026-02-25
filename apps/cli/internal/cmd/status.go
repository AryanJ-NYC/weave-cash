package cmd

import (
	"context"
	"strings"
	"time"

	"github.com/AryanJ-NYC/weave-cash/apps/cli/internal/api"
	cliExit "github.com/AryanJ-NYC/weave-cash/apps/cli/internal/exit"
	"github.com/AryanJ-NYC/weave-cash/apps/cli/internal/output"
	"github.com/AryanJ-NYC/weave-cash/apps/cli/internal/watch"
	"github.com/spf13/cobra"
)

var watchRunner = watch.Run

func newStatusCommand(opts *GlobalOptions) *cobra.Command {
	watchMode := false
	intervalSeconds := 5
	timeoutSeconds := 900

	statusCmd := &cobra.Command{
		Use:     "status [invoice-id]",
		Aliases: []string{"get"},
		Short:   "Fetch invoice status (or watch for changes)",
		Args:    cobra.ExactArgs(1),
		RunE: func(cmd *cobra.Command, args []string) error {
			if strings.TrimSpace(opts.APIURL) == "" {
				return cliExit.New(1, "api-url cannot be empty", map[string]any{
					"error": "api-url cannot be empty",
				})
			}

			invoiceID := args[0]
			client := api.NewClient(opts.APIURL, nil)
			renderer := output.NewRenderer(cmd.OutOrStdout(), opts.Human)

			if !watchMode {
				invoice, err := client.GetInvoice(cmd.Context(), invoiceID)
				if err != nil {
					return wrapCommandError(err)
				}
				if err := renderer.PrintInvoice(invoice); err != nil {
					return cliExit.New(1, "failed to render status output", map[string]any{
						"error": err.Error(),
					})
				}

				return nil
			}

			if intervalSeconds <= 0 {
				return cliExit.New(1, "interval-seconds must be greater than zero", map[string]any{
					"error": "interval-seconds must be greater than zero",
				})
			}
			if timeoutSeconds <= 0 {
				return cliExit.New(1, "timeout-seconds must be greater than zero", map[string]any{
					"error": "timeout-seconds must be greater than zero",
				})
			}

			result, err := watchRunner(cmd.Context(), watch.Config{
				Interval: time.Duration(intervalSeconds) * time.Second,
				Timeout:  time.Duration(timeoutSeconds) * time.Second,
				Fetch: func(ctx context.Context) (api.InvoiceResponse, error) {
					return client.GetInvoice(ctx, invoiceID)
				},
				OnEvent: func(event watch.Event) error {
					return renderer.PrintWatchEvent(event)
				},
			})
			if err != nil {
				return wrapCommandError(err)
			}

			if result.TimedOut {
				return cliExit.New(2, "status watch timed out", map[string]any{
					"error":          "status watch timed out",
					"status":         result.FinalStatus,
					"timeoutSeconds": timeoutSeconds,
				})
			}

			return nil
		},
	}

	statusCmd.Flags().BoolVar(&watchMode, "watch", false, "Poll the invoice until terminal status or timeout")
	statusCmd.Flags().IntVar(&intervalSeconds, "interval-seconds", 5, "Polling interval in seconds for watch mode")
	statusCmd.Flags().IntVar(&timeoutSeconds, "timeout-seconds", 900, "Polling timeout in seconds for watch mode")

	return statusCmd
}
