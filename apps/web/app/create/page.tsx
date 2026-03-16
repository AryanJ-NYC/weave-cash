import type { Metadata } from 'next';
import { CreateInvoiceFlow } from './_components/create-invoice-flow';
import { buildPageMetadata } from '@/lib/site-metadata';

export const metadata: Metadata = buildPageMetadata({
  title: 'Create Crypto Invoice | Weave Cash',
  description:
    'Create a no-sign-in crypto invoice and let buyers pay with supported cryptocurrencies while you receive your preferred asset.',
  path: '/create',
});

export default function CreateInvoicePage() {
  return (
    <div className="mx-auto max-w-lg px-4 py-16 md:py-24">
      <CreateInvoiceFlow />
    </div>
  );
}
