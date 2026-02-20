import { NextResponse } from 'next/server';
import { getInvoiceById } from '@/lib/invoice/get-invoice-by-id';

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const invoiceResponse = await getInvoiceById(id);

  if (!invoiceResponse) {
    return NextResponse.json({ error: 'Invoice not found' }, { status: 404 });
  }

  return NextResponse.json(invoiceResponse);
}
