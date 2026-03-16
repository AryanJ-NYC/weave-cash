import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/_components/ui/card';
import { getInvoiceById } from '@/lib/invoice/get-invoice-by-id';
import { buildInvoiceMetadata } from '@/lib/site-metadata';
import { CopyLinkButton } from './_components/copy-link-button';
import { InvoiceQueryProvider } from './_components/invoice-query-provider';
import { PaymentFlow } from './_components/payment-flow';

export async function generateMetadata({
  params,
}: InvoicePageProps): Promise<Metadata> {
  const { id } = await params;

  return buildInvoiceMetadata(id);
}

export default async function InvoicePaymentPage({
  params,
}: InvoicePageProps) {
  const { id } = await params;
  const invoice = await getInvoiceById(id);

  if (!invoice) {
    notFound();
  }

  return (
    <div className="mx-auto max-w-lg px-4 py-16 md:py-24">
      <Card className="border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <CardHeader>
          <CardTitle className="text-2xl text-slate-900 dark:text-white">
            Pay Invoice
          </CardTitle>
          <CardDescription className="text-pretty text-slate-600 dark:text-slate-400">
            Complete your payment by selecting your preferred cryptocurrency.
          </CardDescription>
          <CardAction>
            <CopyLinkButton />
          </CardAction>
        </CardHeader>
        <CardContent className="flex flex-col gap-6">
          <InvoiceQueryProvider>
            <PaymentFlow invoiceId={invoice.id} initialInvoice={invoice} />
          </InvoiceQueryProvider>
        </CardContent>
      </Card>
    </div>
  );
}

type InvoicePageProps = {
  params: Promise<{ id: string }>;
};
