-- CreateEnum
CREATE TYPE "CartState" AS ENUM ('ACTIVE', 'INACTIVE', 'COMPLETED');

-- CreateEnum
CREATE TYPE "ProductState" AS ENUM ('AVAILABLE', 'UNAVAILABLE', 'OUT_OF_STOCK');

-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('ADMIN', 'USER');

-- CreateEnum
CREATE TYPE "UserState" AS ENUM ('ACTIVE', 'INACTIVE');

-- CreateTable
CREATE TABLE "cart" (
    "cart_id" SERIAL NOT NULL,
    "user_uuid" VARCHAR(100) NOT NULL,
    "state" "CartState" NOT NULL DEFAULT 'ACTIVE',
    "created_at" TIMESTAMP(6) NOT NULL,

    CONSTRAINT "cart_pkey" PRIMARY KEY ("cart_id")
);

-- CreateTable
CREATE TABLE "cart_details" (
    "id" SERIAL NOT NULL,
    "cart_id" INTEGER NOT NULL,
    "product_id" INTEGER NOT NULL,
    "quantity" INTEGER NOT NULL,
    "unit_price" DECIMAL(10,2) NOT NULL,
    "sub_total" DECIMAL(10,2) NOT NULL,

    CONSTRAINT "cart_details_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "product_images" (
    "product_id" INTEGER NOT NULL,
    "image" VARCHAR(100) NOT NULL,

    CONSTRAINT "product_images_pkey" PRIMARY KEY ("product_id","image")
);

-- CreateTable
CREATE TABLE "products" (
    "product_id" SERIAL NOT NULL,
    "product_name" VARCHAR(50) NOT NULL,
    "description" VARCHAR(50) NOT NULL,
    "price" DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    "stock" INTEGER NOT NULL DEFAULT 0,
    "state" "ProductState" NOT NULL DEFAULT 'AVAILABLE',

    CONSTRAINT "products_pkey" PRIMARY KEY ("product_id")
);

-- CreateTable
CREATE TABLE "users" (
    "uuid" TEXT NOT NULL,
    "name" VARCHAR(50) NOT NULL,
    "email" VARCHAR(50) NOT NULL,
    "password" VARCHAR(60) NOT NULL,
    "role" "UserRole" NOT NULL DEFAULT 'USER',
    "nit_ci" VARCHAR(10) NOT NULL,
    "social_reason" VARCHAR(50) NOT NULL,
    "is_active" "UserState" NOT NULL DEFAULT 'ACTIVE',

    CONSTRAINT "users_pkey" PRIMARY KEY ("uuid")
);

-- CreateTable
CREATE TABLE "_UserCarts" (
    "A" INTEGER NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_UserCarts_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "products_product_name_key" ON "products"("product_name");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE INDEX "_UserCarts_B_index" ON "_UserCarts"("B");

-- AddForeignKey
ALTER TABLE "cart_details" ADD CONSTRAINT "cart_details_cart_id_fkey" FOREIGN KEY ("cart_id") REFERENCES "cart"("cart_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cart_details" ADD CONSTRAINT "cart_details_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "products"("product_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product_images" ADD CONSTRAINT "product_images_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "products"("product_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_UserCarts" ADD CONSTRAINT "_UserCarts_A_fkey" FOREIGN KEY ("A") REFERENCES "cart"("cart_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_UserCarts" ADD CONSTRAINT "_UserCarts_B_fkey" FOREIGN KEY ("B") REFERENCES "users"("uuid") ON DELETE CASCADE ON UPDATE CASCADE;
