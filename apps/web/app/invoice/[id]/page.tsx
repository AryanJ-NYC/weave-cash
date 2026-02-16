import { notFound } from 'next/navigation';
import { prisma } from '@repo/database';
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/_components/ui/card';
import { getSwapStatus } from '@/lib/near-intents/status';
import { CopyLinkButton } from './_components/copy-link-button';
import { PaymentFlow } from './_components/payment-flow';

export default async function InvoicePaymentPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const invoice = await prisma.invoice.findUnique({ where: { id } });

  if (!invoice) {
    notFound();
  }

  let amountIn: string | null = null;
  let initialSdkStatus: string | null = null;
  if (invoice.depositAddress) {
    try {
      const sdkResponse = await getSwapStatus(
        invoice.depositAddress,
        invoice.depositMemo ?? undefined,
      );
      amountIn = sdkResponse.quoteResponse.quote.amountInFormatted;
      initialSdkStatus = sdkResponse.status;
    } catch {
      // SDK call failed; amountIn and sdkStatus will load on first poll
    }
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
          <PaymentFlow
            invoiceId={invoice.id}
            status={invoice.status}
            initialSdkStatus={initialSdkStatus}
            depositAddress={invoice.depositAddress}
            depositMemo={invoice.depositMemo}
            paidAt={invoice.paidAt?.toISOString() ?? null}
            amountIn={amountIn}
            payToken={invoice.payToken ?? null}
            expiresAt={invoice.expiresAt?.toISOString() ?? null}
            summary={{
              amount: invoice.amount,
              receiveToken: invoice.receiveToken,
              receiveNetwork: invoice.receiveNetwork,
              description: invoice.description,
              buyerName: invoice.buyerName,
              buyerEmail: invoice.buyerEmail,
              buyerAddress: invoice.buyerAddress,
            }}
          />
        </CardContent>
      </Card>
    </div>
  );
}
