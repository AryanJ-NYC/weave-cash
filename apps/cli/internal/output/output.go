package output

import (
	"encoding/json"
	"fmt"
	"io"
	"strings"

	"github.com/AryanJ-NYC/weave-cash/apps/cli/internal/api"
	"github.com/AryanJ-NYC/weave-cash/apps/cli/internal/watch"
)

type Renderer struct {
	out   io.Writer
	human bool
}

type CreateOutput struct {
	ID         string `json:"id"`
	InvoiceURL string `json:"invoiceUrl"`
}

type TokensOutput struct {
	Tokens          []string            `json:"tokens"`
	Networks        []string            `json:"networks"`
	TokenNetworkMap map[string][]string `json:"tokenNetworkMap"`
	NetworkAliases  map[string][]string `json:"networkAliases"`
}

func NewRenderer(out io.Writer, human bool) *Renderer {
	return &Renderer{out: out, human: human}
}

func (r *Renderer) PrintCreate(payload CreateOutput) error {
	if r.human {
		_, err := fmt.Fprintf(r.out, "invoice_id: %s\ninvoice_url: %s\n", payload.ID, payload.InvoiceURL)
		return err
	}

	return r.printJSON(payload)
}

func (r *Renderer) PrintQuote(payload api.QuoteResponse) error {
	if r.human {
		var builder strings.Builder
		builder.WriteString(fmt.Sprintf("deposit_address: %s\n", payload.DepositAddress))
		if payload.DepositMemo != "" {
			builder.WriteString(fmt.Sprintf("deposit_memo: %s\n", payload.DepositMemo))
		}
		builder.WriteString(fmt.Sprintf("amount_in: %s\n", payload.AmountIn))
		builder.WriteString(fmt.Sprintf("amount_out: %s\n", payload.AmountOut))
		if payload.TimeEstimate != nil {
			builder.WriteString(fmt.Sprintf("time_estimate: %v\n", payload.TimeEstimate))
		}
		builder.WriteString(fmt.Sprintf("expires_at: %s\n", payload.ExpiresAt))
		_, err := io.WriteString(r.out, builder.String())
		return err
	}

	return r.printJSON(payload)
}

func (r *Renderer) PrintInvoice(payload api.InvoiceResponse) error {
	if r.human {
		status := payload.Status
		if status == "" {
			status = payload.Timeline.CurrentStatus
		}
		_, err := fmt.Fprintf(r.out, "invoice_id: %s\nstatus: %s\n", payload.ID, status)
		return err
	}

	return r.printJSON(payload)
}

func (r *Renderer) PrintWatchEvent(payload watch.Event) error {
	if r.human {
		suffix := ""
		if payload.Event == "timeout" {
			suffix = fmt.Sprintf(" timeout_seconds=%d", payload.TimeoutSeconds)
		}
		_, err := fmt.Fprintf(
			r.out,
			"%s event=%s status=%s%s\n",
			payload.ObservedAt,
			payload.Event,
			payload.Status,
			suffix,
		)
		return err
	}

	return r.printJSON(payload)
}

func (r *Renderer) PrintTokens(payload TokensOutput) error {
	if r.human {
		var builder strings.Builder
		builder.WriteString("tokens:\n")
		for _, token := range payload.Tokens {
			networks := payload.TokenNetworkMap[token]
			builder.WriteString(
				fmt.Sprintf("- %s (%s)\n", token, strings.Join(networks, ", ")),
			)
		}

		builder.WriteString("\nnetworks:\n")
		for _, network := range payload.Networks {
			aliases := payload.NetworkAliases[network]
			if len(aliases) == 0 {
				builder.WriteString(fmt.Sprintf("- %s\n", network))
				continue
			}

			builder.WriteString(
				fmt.Sprintf("- %s (%s)\n", network, strings.Join(aliases, ", ")),
			)
		}

		_, err := io.WriteString(r.out, builder.String())
		return err
	}

	return r.printJSON(payload)
}

func (r *Renderer) printJSON(payload any) error {
	encoder := json.NewEncoder(r.out)
	encoder.SetEscapeHTML(false)
	return encoder.Encode(payload)
}
