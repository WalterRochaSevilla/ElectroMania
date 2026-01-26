-- CreateTable
CREATE TABLE "cloudflare_usage" (
    "id" SERIAL NOT NULL,
    "key" TEXT NOT NULL,
    "size" INTEGER NOT NULL,
    "mimeType" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "cloudflare_usage_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "cloudflare_usage_key_key" ON "cloudflare_usage"("key");
