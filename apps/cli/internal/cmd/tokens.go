package cmd

import (
	"sort"
	"strings"

	cliExit "github.com/AryanJ-NYC/weave-cash/apps/cli/internal/exit"
	"github.com/AryanJ-NYC/weave-cash/apps/cli/internal/output"
	"github.com/spf13/cobra"
)

func newTokensCommand(opts *GlobalOptions) *cobra.Command {
	tokensCmd := &cobra.Command{
		Use:   "tokens",
		Short: "List supported tokens and networks",
		RunE: func(cmd *cobra.Command, _ []string) error {
			payload := buildTokensOutput()
			renderer := output.NewRenderer(cmd.OutOrStdout(), opts.Human)
			if err := renderer.PrintTokens(payload); err != nil {
				return cliExit.New(1, "failed to render tokens output", map[string]any{
					"error": err.Error(),
				})
			}

			return nil
		},
	}

	return tokensCmd
}

func buildTokensOutput() output.TokensOutput {
	tokens := make([]string, 0, len(tokenNetworkMap))
	networkSet := map[string]struct{}{}
	tokenNetworkOutput := make(map[string][]string, len(tokenNetworkMap))
	for token, networks := range tokenNetworkMap {
		tokens = append(tokens, token)
		tokenNetworks := make([]string, len(networks))
		copy(tokenNetworks, networks)
		tokenNetworkOutput[token] = tokenNetworks

		for _, network := range networks {
			networkSet[network] = struct{}{}
		}
	}
	sort.Strings(tokens)

	networks := make([]string, 0, len(networkSet))
	for network := range networkSet {
		networks = append(networks, network)
	}
	sort.Strings(networks)

	networkAliases := buildNetworkAliases()
	return output.TokensOutput{
		Tokens:          tokens,
		Networks:        networks,
		TokenNetworkMap: tokenNetworkOutput,
		NetworkAliases:  networkAliases,
	}
}

func buildNetworkAliases() map[string][]string {
	aliasesByNetwork := map[string][]string{}
	for alias, network := range canonicalNetworkByAlias {
		if alias == strings.ToLower(network) {
			continue
		}
		aliasesByNetwork[network] = append(aliasesByNetwork[network], alias)
	}

	for network := range aliasesByNetwork {
		sort.Strings(aliasesByNetwork[network])
	}

	return aliasesByNetwork
}
