import { describe, expect, it } from 'vitest';
import { getVisibleSectionsForPhase } from './payment-flow';

describe('PaymentFlow phase rendering', () => {
  it('shows quote section only in selecting phase', () => {
    expect(getVisibleSectionsForPhase('selecting')).toEqual({
      showQuote: true,
      showInstructions: false,
      showTerminal: false,
    });
  });

  it('shows payment instructions in awaitingDeposit and processing phases', () => {
    expect(getVisibleSectionsForPhase('awaitingDeposit')).toEqual({
      showQuote: false,
      showInstructions: true,
      showTerminal: false,
    });
    expect(getVisibleSectionsForPhase('processing')).toEqual({
      showQuote: false,
      showInstructions: true,
      showTerminal: false,
    });
  });

  it('shows terminal section only in terminal phase', () => {
    expect(getVisibleSectionsForPhase('terminal')).toEqual({
      showQuote: false,
      showInstructions: false,
      showTerminal: true,
    });
  });
});
