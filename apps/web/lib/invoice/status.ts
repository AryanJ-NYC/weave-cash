export const TERMINAL_STATUSES = ['COMPLETED', 'FAILED', 'REFUNDED', 'EXPIRED'] as const;

export function isTerminalStatus(status: string): status is TerminalStatus {
  return terminalStatusSet.has(status);
}

const terminalStatusSet = new Set<string>(TERMINAL_STATUSES);

type TerminalStatus = (typeof TERMINAL_STATUSES)[number];

type TerminalInfo = {
  status: string;
  paidAt: string | null;
};

export type { TerminalStatus, TerminalInfo };
