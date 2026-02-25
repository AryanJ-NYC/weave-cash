package cmd

import (
	"slices"
	"strings"

	"github.com/AryanJ-NYC/weave-cash/apps/cli/internal/api"
	cliExit "github.com/AryanJ-NYC/weave-cash/apps/cli/internal/exit"
	"github.com/AryanJ-NYC/weave-cash/apps/cli/internal/output"
	"github.com/spf13/cobra"
)

func newCreateCommand(opts *GlobalOptions) *cobra.Command {
	request := api.CreateInvoiceRequest{}

	createCmd := &cobra.Command{
		Use:   "create",
		Short: "Create a new invoice",
		RunE: func(cmd *cobra.Command, _ []string) error {
			if strings.TrimSpace(opts.APIURL) == "" {
				return cliExit.New(1, "api-url cannot be empty", map[string]any{
					"error": "api-url cannot be empty",
				})
			}
			request.ReceiveToken = strings.ToUpper(strings.TrimSpace(request.ReceiveToken))

			resolvedNetwork, err := resolveReceiveNetwork(
				request.ReceiveToken,
				request.ReceiveNetwork,
			)
			if err != nil {
				return err
			}
			request.ReceiveNetwork = resolvedNetwork

			client := api.NewClient(opts.APIURL, nil)
			response, err := client.CreateInvoice(cmd.Context(), request)
			if err != nil {
				return wrapCommandError(err)
			}

			renderer := output.NewRenderer(cmd.OutOrStdout(), opts.Human)
			payload := output.CreateOutput{
				ID:         response.ID,
				InvoiceURL: buildInvoiceURL(opts.APIURL, response.ID),
			}
			if err := renderer.PrintCreate(payload); err != nil {
				return cliExit.New(1, "failed to render create output", map[string]any{
					"error": err.Error(),
				})
			}

			return nil
		},
	}

	createCmd.Flags().StringVar(&request.ReceiveToken, "receive-token", "", "Token merchant wants to receive (e.g. BTC)")
	createCmd.Flags().StringVar(&request.ReceiveNetwork, "receive-network", "", "Network merchant wants to receive on (e.g. Bitcoin or BTC)")
	createCmd.Flags().StringVar(&request.Amount, "amount", "", "Invoice amount")
	createCmd.Flags().StringVar(&request.WalletAddress, "wallet-address", "", "Merchant wallet address")
	createCmd.Flags().StringVar(&request.Description, "description", "", "Optional invoice description")
	createCmd.Flags().StringVar(&request.BuyerName, "buyer-name", "", "Optional buyer name")
	createCmd.Flags().StringVar(&request.BuyerEmail, "buyer-email", "", "Optional buyer email")
	createCmd.Flags().StringVar(&request.BuyerAddress, "buyer-address", "", "Optional buyer address")

	_ = createCmd.MarkFlagRequired("receive-token")
	_ = createCmd.MarkFlagRequired("amount")
	_ = createCmd.MarkFlagRequired("wallet-address")

	return createCmd
}

func buildInvoiceURL(baseURL string, id string) string {
	return strings.TrimRight(baseURL, "/") + "/invoice/" + id
}

func resolveReceiveNetwork(token string, receiveNetwork string) (string, error) {
	validNetworks, tokenExists := tokenNetworkMap[token]
	if !tokenExists {
		return "", cliExit.New(1, "unsupported receive-token", map[string]any{
			"error":        "unsupported receive-token",
			"receiveToken": token,
		})
	}

	network := normalizeNetworkName(receiveNetwork)
	if network == "" {
		if len(validNetworks) == 1 {
			return validNetworks[0], nil
		}

		return "", cliExit.New(1, "receive-network required for selected token", map[string]any{
			"error":           "receive-network required for selected token",
			"receiveToken":    token,
			"validNetworks":   validNetworks,
			"providedNetwork": "",
		})
	}

	if !slices.Contains(validNetworks, network) {
		return "", cliExit.New(1, "invalid receive-network for receive-token", map[string]any{
			"error":           "invalid receive-network for receive-token",
			"receiveToken":    token,
			"providedNetwork": network,
			"validNetworks":   validNetworks,
		})
	}

	return network, nil
}
