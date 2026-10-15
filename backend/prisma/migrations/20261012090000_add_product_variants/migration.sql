ALTER TABLE "Product"
ADD COLUMN "variantGroup" TEXT,
ADD COLUMN "variantLabel" TEXT,
ADD COLUMN "variantOrder" INTEGER NOT NULL DEFAULT 0;

CREATE INDEX "Product_variantGroup_variantOrder_idx" ON "Product"("variantGroup", "variantOrder");
