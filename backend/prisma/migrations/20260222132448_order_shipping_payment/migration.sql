-- AlterTable
ALTER TABLE "Order" ADD COLUMN     "customerCity" TEXT,
ADD COLUMN     "customerCounty" TEXT,
ADD COLUMN     "customerPhone" TEXT,
ADD COLUMN     "paymentMethod" TEXT NOT NULL DEFAULT 'cod',
ADD COLUMN     "paymentStatus" TEXT NOT NULL DEFAULT 'unpaid',
ADD COLUMN     "postalCode" TEXT,
ADD COLUMN     "shippingCents" INTEGER NOT NULL DEFAULT 0;
