import { NextResponse } from 'next/server';
import { prisma } from '@repo/database';
import { createInvoiceSchema } from '@/lib/invoice';

export async function POST(request: Request) {
  const body = await request.json();
  const result = await createInvoiceSchema.safeParseAsync(body);

  if (!result.success) {
    return NextResponse.json(
      { error: result.error.flatten().fieldErrors },
      { status: 400 }
    );
  }

  const invoice = await prisma.invoice.create({
    data: result.data,
  });

  return NextResponse.json({ id: invoice.id }, { status: 201 });
}
