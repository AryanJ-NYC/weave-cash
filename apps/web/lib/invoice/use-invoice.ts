'use client';

import { useEffect, useMemo, useReducer } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  derivePhaseFromSnapshot,
  getInvoiceSummaryData,
  type InvoiceNormalizedResponse,
  type PaymentInstructions,
  type PaymentQuote,
  type TrackerPhase,
  type TrackerInstructions,
} from './payment';

const POLL_INTERVAL_MS = 10_000;

export function useInvoice({ invoiceId, initialInvoice }: UseInvoiceParams) {
  const queryClient = useQueryClient();
  const [state, dispatch] = useReducer(
    invoiceReducer,
    initialInvoice,
    buildInitialInvoiceState
  );

  const invoiceQuery = useQuery({
    queryKey: ['invoice', invoiceId],
    queryFn: async (): Promise<InvoiceNormalizedResponse> => {
      const res = await fetch(`/api/invoices/${invoiceId}`);
      if (!res.ok) {
        throw new Error('Failed to fetch invoice');
      }
      return res.json();
    },
    initialData: initialInvoice,
    refetchInterval: () =>
      state.phase === 'terminal' ? false : POLL_INTERVAL_MS,
  });

  useEffect(() => {
    if (invoiceQuery.data) {
      dispatch({ type: 'INVOICE_SYNCED', invoice: invoiceQuery.data });
    }
  }, [invoiceQuery.data]);

  const quoteMutation = useMutation({
    mutationFn: (input: QuoteRequestInput) =>
      requestInvoiceQuote(invoiceId, input),
    onMutate: () => {
      dispatch({ type: 'QUOTE_REQUESTED' });
    },
    onSuccess: (quote) => {
      dispatch({ type: 'QUOTE_SUCCEEDED', quote });
      void queryClient.invalidateQueries({ queryKey: ['invoice', invoiceId] });
    },
    onError: (error) => {
      dispatch({ type: 'QUOTE_FAILED', message: getErrorMessage(error) });
    },
  });

  const trackerView = useMemo(
    () =>
      buildTrackerView(invoiceQuery.data ?? initialInvoice, {
        ...state,
        quotePending: quoteMutation.isPending,
      }),
    [invoiceQuery.data, initialInvoice, state, quoteMutation.isPending]
  );

  return {
    ...trackerView,
    refetch: invoiceQuery.refetch,
    requestQuote: async (input: QuoteRequestInput) => {
      await quoteMutation.mutateAsync(input);
    },
    onCountdownExpired: () => {
      dispatch({ type: 'COUNTDOWN_EXPIRED' });
    },
  };
}

export function buildInitialInvoiceState(
  invoice: InvoiceNormalizedResponse
): InvoiceState {
  return {
    phase: derivePhaseFromSnapshot(
      invoice.timeline.currentStatus,
      Boolean(invoice.paymentInstructions.depositAddress)
    ),
    quoteError: null,
    optimisticInstructions: null,
    lastKnownAmountIn: invoice.paymentInstructions.amountIn,
    terminalOverrideStatus: null,
    quotePending: false,
  };
}

export function invoiceReducer(
  state: InvoiceState,
  action: InvoiceAction
): InvoiceState {
  switch (action.type) {
    case 'INVOICE_SYNCED': {
      const hasServerInstructions = Boolean(
        action.invoice.paymentInstructions.depositAddress
      );
      const shouldForceExpiredTerminal =
        state.terminalOverrideStatus === 'EXPIRED' &&
        !action.invoice.timeline.isTerminal;
      const phase = shouldForceExpiredTerminal
        ? 'terminal'
        : derivePhaseFromSnapshot(
            action.invoice.timeline.currentStatus,
            Boolean(
              action.invoice.paymentInstructions.depositAddress ||
                state.optimisticInstructions?.depositAddress
            )
          );

      return {
        ...state,
        phase,
        optimisticInstructions: hasServerInstructions
          ? null
          : state.optimisticInstructions,
        lastKnownAmountIn:
          action.invoice.paymentInstructions.amountIn ??
          state.lastKnownAmountIn,
        terminalOverrideStatus: action.invoice.timeline.isTerminal
          ? null
          : state.terminalOverrideStatus,
      };
    }

    case 'QUOTE_REQUESTED':
      return {
        ...state,
        quoteError: null,
      };

    case 'QUOTE_SUCCEEDED':
      return {
        ...state,
        phase: 'awaitingDeposit',
        quoteError: null,
        terminalOverrideStatus: null,
        lastKnownAmountIn: action.quote.amountIn,
        optimisticInstructions: {
          payToken: action.quote.payToken,
          payNetwork: action.quote.payNetwork,
          depositAddress: action.quote.depositAddress,
          depositMemo: action.quote.depositMemo ?? null,
          expiresAt: action.quote.expiresAt,
          amountIn: action.quote.amountIn,
        },
      };

    case 'QUOTE_FAILED':
      return {
        ...state,
        quoteError: action.message,
      };

    case 'COUNTDOWN_EXPIRED':
      return {
        ...state,
        phase: 'terminal',
        terminalOverrideStatus: 'EXPIRED',
      };

    default:
      return state;
  }
}

export function buildTrackerView(
  invoice: InvoiceNormalizedResponse,
  state: InvoiceState
): TrackerView {
  const mergedInstructions = mergeInstructions(
    invoice.paymentInstructions,
    state.optimisticInstructions,
    state.lastKnownAmountIn
  );

  const status = state.terminalOverrideStatus ?? invoice.timeline.currentStatus;

  return {
    id: invoice.id,
    status,
    phase: state.phase,
    quoteError: state.quoteError,
    quotePending: state.quotePending,
    summary: getInvoiceSummaryData(invoice),
    timeline: invoice.timeline,
    instructions: mergedInstructions,
  };
}

function mergeInstructions(
  base: PaymentInstructions,
  optimistic: Partial<TrackerInstructions> | null,
  lastKnownAmountIn: string | null
): TrackerInstructions {
  const merged = {
    ...base,
    ...(optimistic ?? {}),
  };

  return {
    ...merged,
    amountIn: merged.amountIn ?? lastKnownAmountIn,
  };
}

async function requestInvoiceQuote(
  invoiceId: string,
  input: QuoteRequestInput
): Promise<PaymentQuote> {
  const res = await fetch(`/api/invoices/${invoiceId}/quote`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      payToken: input.payToken,
      payNetwork: input.payNetwork,
      refundAddress: input.refundAddress,
    }),
  });

  if (!res.ok) {
    let errorMessage = 'Failed to get quote. Please try again.';
    try {
      const data = await res.json();
      if (typeof data.error === 'string') {
        errorMessage = data.error;
      }
    } catch {
      // Keep default error message.
    }

    throw new Error(errorMessage);
  }

  const data = await res.json();

  return {
    amountIn: data.amountIn,
    amountOut: data.amountOut,
    payToken: input.payToken,
    payNetwork: input.payNetwork,
    depositAddress: data.depositAddress,
    depositMemo: data.depositMemo,
    timeEstimate: data.timeEstimate,
    expiresAt: data.expiresAt,
  };
}

function getErrorMessage(error: unknown): string {
  if (error instanceof Error && error.message) {
    return error.message;
  }

  return 'Failed to get quote. Please try again.';
}

type UseInvoiceParams = {
  invoiceId: string;
  initialInvoice: InvoiceNormalizedResponse;
};

type QuoteRequestInput = {
  payToken: string;
  payNetwork: string;
  refundAddress: string;
};

type InvoiceState = {
  phase: TrackerPhase;
  quoteError: string | null;
  optimisticInstructions: Partial<TrackerInstructions> | null;
  lastKnownAmountIn: string | null;
  terminalOverrideStatus: 'EXPIRED' | null;
  quotePending: boolean;
};

type TrackerView = {
  id: string;
  status: string;
  phase: TrackerPhase;
  quoteError: string | null;
  quotePending: boolean;
  summary: ReturnType<typeof getInvoiceSummaryData>;
  instructions: TrackerInstructions;
  timeline: InvoiceNormalizedResponse['timeline'];
};

type InvoiceAction =
  | { type: 'INVOICE_SYNCED'; invoice: InvoiceNormalizedResponse }
  | { type: 'QUOTE_REQUESTED' }
  | { type: 'QUOTE_SUCCEEDED'; quote: PaymentQuote }
  | { type: 'QUOTE_FAILED'; message: string }
  | { type: 'COUNTDOWN_EXPIRED' };
