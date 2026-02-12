-- CreateEnum
CREATE TYPE "InvoiceStatus" AS ENUM ('PENDING', 'AWAITING_DEPOSIT', 'PROCESSING', 'COMPLETED', 'FAILED', 'REFUNDED', 'EXPIRED');

-- CreateTable
CREATE TABLE "Invoice" (
    "id" TEXT NOT NULL,
    "status" "InvoiceStatus" NOT NULL DEFAULT 'PENDING',
    "receiveToken" TEXT NOT NULL,
    "receiveNetwork" TEXT NOT NULL,
    "amount" TEXT NOT NULL,
    "walletAddress" TEXT NOT NULL,
    "buyerName" TEXT,
    "buyerEmail" TEXT,
    "buyerAddress" TEXT,
    "payToken" TEXT,
    "payNetwork" TEXT,
    "depositAddress" TEXT,
    "depositMemo" TEXT,
    "expiresAt" TIMESTAMP(3),
    "paidAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Invoice_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Invoice_status_idx" ON "Invoice"("status");

-- CreateIndex
CREATE INDEX "Invoice_walletAddress_idx" ON "Invoice"("walletAddress");
