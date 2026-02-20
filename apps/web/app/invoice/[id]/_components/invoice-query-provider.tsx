'use client';

import { useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

export function InvoiceQueryProvider({ children }: InvoiceQueryProviderProps) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}

type InvoiceQueryProviderProps = {
  children: React.ReactNode;
};
