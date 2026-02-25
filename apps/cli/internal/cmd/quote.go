package cmd

import (
	"strings"

	"github.com/AryanJ-NYC/weave-cash/apps/cli/internal/api"
	cliExit "github.com/AryanJ-NYC/weave-cash/apps/cli/internal/exit"
	"github.com/AryanJ-NYC/weave-cash/apps/cli/internal/output"
	"github.com/spf13/cobra"
)

func newQuoteCommand(opts *GlobalOptions) *cobra.Command {
	request := api.QuoteRequest{}

	quoteCmd := &cobra.Command{
		Use:   "quote [invoice-id]",
		Short: "Generate a payment quote for an invoice",
		Args:  cobra.ExactArgs(1),
		RunE: func(cmd *cobra.Command, args []string) error {
			if strings.TrimSpace(opts.APIURL) == "" {
				return cliExit.New(1, "api-url cannot be empty", map[string]any{
					"error": "api-url cannot be empty",
				})
			}
			request.PayToken = strings.ToUpper(strings.TrimSpace(request.PayToken))
			request.PayNetwork = normalizeNetworkName(request.PayNetwork)
			request.RefundAddress = strings.TrimSpace(request.RefundAddress)

			invoiceID := args[0]
			client := api.NewClient(opts.APIURL, nil)
			response, err := client.QuoteInvoice(cmd.Context(), invoiceID, request)
			if err != nil {
				return wrapCommandError(err)
			}

			renderer := output.NewRenderer(cmd.OutOrStdout(), opts.Human)
			if err := renderer.PrintQuote(response); err != nil {
				return cliExit.New(1, "failed to render quote output", map[string]any{
					"error": err.Error(),
				})
			}

			return nil
		},
	}

	quoteCmd.Flags().StringVar(&request.PayToken, "pay-token", "", "Token customer will pay with (e.g. USDC)")
	quoteCmd.Flags().StringVar(&request.PayNetwork, "pay-network", "", "Network customer will pay on (e.g. Ethereum or ETH)")
	quoteCmd.Flags().StringVar(&request.RefundAddress, "refund-address", "", "Refund address for the paying wallet")

	_ = quoteCmd.MarkFlagRequired("pay-token")
	_ = quoteCmd.MarkFlagRequired("pay-network")
	_ = quoteCmd.MarkFlagRequired("refund-address")

	return quoteCmd
}
