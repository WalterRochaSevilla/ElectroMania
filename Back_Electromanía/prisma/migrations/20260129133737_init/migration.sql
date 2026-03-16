-- CreateEnum
CREATE TYPE "CartState" AS ENUM ('ACTIVE', 'RESERVED', 'CANCELED', 'EXPIRED', 'COMPLETED');

-- CreateEnum
CREATE TYPE "ProductState" AS ENUM ('AVAILABLE', 'UNAVAILABLE', 'OUT_OF_STOCK');

-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('ADMIN', 'USER', 'EMPLOYED');

-- CreateEnum
CREATE TYPE "UserState" AS ENUM ('ACTIVE', 'INACTIVE');

-- CreateEnum
CREATE TYPE "OrderStatus" AS ENUM ('PENDING', 'PAID', 'SHIPPED', 'DELIVERED', 'CANCELED');

-- CreateEnum
CREATE TYPE "PaymentMethod" AS ENUM ('CASH');

-- CreateEnum
CREATE TYPE "PaymentStatus" AS ENUM ('PENDING', 'PAID', 'CANCELED');

-- CreateEnum
CREATE TYPE "InvoiceStatus" AS ENUM ('ISSUED', 'CANCELED');

-- CreateTable
CREATE TABLE "users" (
    "uuid" TEXT NOT NULL,
    "name" VARCHAR(50) NOT NULL,
    "email" VARCHAR(50) NOT NULL,
    "password" VARCHAR(60) NOT NULL,
    "role" "UserRole" NOT NULL DEFAULT 'USER',
    "nit_ci" VARCHAR(15) NOT NULL,
    "social_reason" VARCHAR(100) NOT NULL,
    "state" "UserState" NOT NULL DEFAULT 'ACTIVE',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "phone_number" TEXT NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("uuid")
);

-- CreateTable
CREATE TABLE "cart" (
    "cart_id" SERIAL NOT NULL,
    "user_uuid" TEXT NOT NULL,
    "state" "CartState" NOT NULL DEFAULT 'ACTIVE',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "reserve_at" TIMESTAMP(3),

    CONSTRAINT "cart_pkey" PRIMARY KEY ("cart_id")
);

-- CreateTable
CREATE TABLE "cart_details" (
    "id" SERIAL NOT NULL,
    "cart_id" INTEGER NOT NULL,
    "product_id" INTEGER NOT NULL,
    "quantity" INTEGER NOT NULL,
    "unit_price" DECIMAL(10,2) NOT NULL,

    CONSTRAINT "cart_details_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "products" (
    "product_id" SERIAL NOT NULL,
    "product_name" VARCHAR(50) NOT NULL,
    "description" VARCHAR(255) NOT NULL,
    "price" DECIMAL(10,2) NOT NULL,
    "stock_total" INTEGER NOT NULL DEFAULT 0,
    "stock_reserved" INTEGER NOT NULL DEFAULT 0,
    "state" "ProductState" NOT NULL DEFAULT 'AVAILABLE',

    CONSTRAINT "products_pkey" PRIMARY KEY ("product_id")
);

-- CreateTable
CREATE TABLE "product_images" (
    "product_id" INTEGER NOT NULL,
    "image" VARCHAR(255) NOT NULL,

    CONSTRAINT "product_images_pkey" PRIMARY KEY ("product_id","image")
);

-- CreateTable
CREATE TABLE "categories" (
    "category_id" SERIAL NOT NULL,
    "category_name" VARCHAR(50) NOT NULL,
    "description" VARCHAR(100) NOT NULL,

    CONSTRAINT "categories_pkey" PRIMARY KEY ("category_id")
);

-- CreateTable
CREATE TABLE "product_categories" (
    "product_id" INTEGER NOT NULL,
    "category_id" INTEGER NOT NULL,

    CONSTRAINT "product_categories_pkey" PRIMARY KEY ("product_id","category_id")
);

-- CreateTable
CREATE TABLE "orders" (
    "order_id" SERIAL NOT NULL,
    "cart_id" INTEGER NOT NULL,
    "total" DECIMAL(10,2) NOT NULL,
    "status" "OrderStatus" NOT NULL DEFAULT 'PENDING',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "orders_pkey" PRIMARY KEY ("order_id")
);

-- CreateTable
CREATE TABLE "order_items" (
    "id" SERIAL NOT NULL,
    "order_id" INTEGER NOT NULL,
    "product_id" INTEGER NOT NULL,
    "product_name" VARCHAR(50) NOT NULL,
    "unit_price" DECIMAL(10,2) NOT NULL,
    "quantity" INTEGER NOT NULL,
    "total" DECIMAL(10,2) NOT NULL,

    CONSTRAINT "order_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_orders" (
    "user_uuid" TEXT NOT NULL,
    "order_id" INTEGER NOT NULL,

    CONSTRAINT "user_orders_pkey" PRIMARY KEY ("user_uuid","order_id")
);

-- CreateTable
CREATE TABLE "payments" (
    "payment_id" SERIAL NOT NULL,
    "order_id" INTEGER NOT NULL,
    "amount" DECIMAL(10,2) NOT NULL,
    "method" "PaymentMethod" NOT NULL,
    "status" "PaymentStatus" NOT NULL DEFAULT 'PENDING',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "payments_pkey" PRIMARY KEY ("payment_id")
);

-- CreateTable
CREATE TABLE "invoices" (
    "invoice_id" SERIAL NOT NULL,
    "order_id" INTEGER NOT NULL,
    "invoice_number" VARCHAR(50) NOT NULL,
    "nit_ci" VARCHAR(15) NOT NULL,
    "social_reason" VARCHAR(100) NOT NULL,
    "total" DECIMAL(10,2) NOT NULL,
    "status" "InvoiceStatus" NOT NULL DEFAULT 'ISSUED',
    "issued_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "invoices_pkey" PRIMARY KEY ("invoice_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE INDEX "cart_user_uuid_state_reserve_at_idx" ON "cart"("user_uuid", "state", "reserve_at");

-- CreateIndex
CREATE UNIQUE INDEX "cart_details_cart_id_product_id_key" ON "cart_details"("cart_id", "product_id");

-- CreateIndex
CREATE UNIQUE INDEX "products_product_name_key" ON "products"("product_name");

-- CreateIndex
CREATE UNIQUE INDEX "categories_category_name_key" ON "categories"("category_name");

-- CreateIndex
CREATE UNIQUE INDEX "orders_cart_id_key" ON "orders"("cart_id");

-- CreateIndex
CREATE INDEX "orders_status_created_at_idx" ON "orders"("status", "created_at");

-- CreateIndex
CREATE INDEX "order_items_order_id_idx" ON "order_items"("order_id");

-- CreateIndex
CREATE UNIQUE INDEX "payments_order_id_key" ON "payments"("order_id");

-- CreateIndex
CREATE INDEX "payments_status_method_idx" ON "payments"("status", "method");

-- CreateIndex
CREATE UNIQUE INDEX "invoices_order_id_key" ON "invoices"("order_id");

-- CreateIndex
CREATE UNIQUE INDEX "invoices_invoice_number_key" ON "invoices"("invoice_number");

-- CreateIndex
CREATE INDEX "invoices_invoice_number_idx" ON "invoices"("invoice_number");

-- AddForeignKey
ALTER TABLE "cart" ADD CONSTRAINT "cart_user_uuid_fkey" FOREIGN KEY ("user_uuid") REFERENCES "users"("uuid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cart_details" ADD CONSTRAINT "cart_details_cart_id_fkey" FOREIGN KEY ("cart_id") REFERENCES "cart"("cart_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cart_details" ADD CONSTRAINT "cart_details_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "products"("product_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product_images" ADD CONSTRAINT "product_images_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "products"("product_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product_categories" ADD CONSTRAINT "product_categories_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "products"("product_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product_categories" ADD CONSTRAINT "product_categories_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "categories"("category_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "orders" ADD CONSTRAINT "orders_cart_id_fkey" FOREIGN KEY ("cart_id") REFERENCES "cart"("cart_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "order_items" ADD CONSTRAINT "order_items_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "orders"("order_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "order_items" ADD CONSTRAINT "order_items_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "products"("product_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_orders" ADD CONSTRAINT "user_orders_user_uuid_fkey" FOREIGN KEY ("user_uuid") REFERENCES "users"("uuid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_orders" ADD CONSTRAINT "user_orders_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "orders"("order_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payments" ADD CONSTRAINT "payments_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "orders"("order_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "invoices" ADD CONSTRAINT "invoices_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "orders"("order_id") ON DELETE RESTRICT ON UPDATE CASCADE;

INSERT INTO "users" ("uuid","name","email","password","role","nit_ci","social_reason","state","phone_number","updated_at") 
VALUES ('da51d1ae-039d-4ca2-a7aa-50644cdf2917','Administrador','admin@admin.com','$2b$12$cGW69lT1JN.vc5O61N8RMOTA6wIz003kyP2m/o31LdpqRidVpBn2e','ADMIN','12712123','Admin','ACTIVE','+5917787672',current_timestamp);

-- =========================
-- CATEGORÍAS
-- =========================
INSERT INTO categories (category_name, description) VALUES
('Componentes Pasivos', 'Resistencias, capacitores e inductores'),
('Microcontroladores', 'Placas y microcontroladores programables'),
('Sensores', 'Sensores para proyectos electrónicos');

-- =========================
-- PRODUCTOS
-- =========================
INSERT INTO products (product_name, description, price, stock_total) VALUES
-- Componentes Pasivos
('Resistencia 220Ω', 'Resistencia 220 ohm 1/4W', 0.10, 1000),
('Capacitor 100uF', 'Capacitor electrolítico 100uF 25V', 0.25, 800),
('Inductor 10mH', 'Inductor 10 miliHenry', 0.40, 500),

-- Microcontroladores
('Arduino UNO R3', 'Placa Arduino UNO R3 original', 6.50, 150),
('Arduino Nano', 'Placa Arduino Nano compatible', 4.80, 200),
('ESP32 Dev Module', 'Placa ESP32 con WiFi y Bluetooth', 7.90, 120),

-- Sensores
('Sensor DHT11', 'Sensor de temperatura y humedad', 2.10, 300),
('Sensor Ultrasonico HC-SR04', 'Sensor de distancia por ultrasonido', 2.50, 250),
('Sensor PIR', 'Sensor de movimiento PIR HC-SR501', 3.20, 180);

-- =========================
-- RELACIÓN PRODUCTO - CATEGORÍA
-- =========================
INSERT INTO product_categories (product_id, category_id)
SELECT p.product_id, c.category_id
FROM products p
JOIN categories c ON
  (p.product_name IN ('Resistencia 220Ω','Capacitor 100uF','Inductor 10mH')
      AND c.category_name = 'Componentes Pasivos')
  OR
  (p.product_name IN ('Arduino UNO R3','Arduino Nano','ESP32 Dev Module')
      AND c.category_name = 'Microcontroladores')
  OR
  (p.product_name IN ('Sensor DHT11','Sensor Ultrasonico HC-SR04','Sensor PIR')
      AND c.category_name = 'Sensores');

-- =========================
-- IMÁGENES (1 POR PRODUCTO)
-- =========================
INSERT INTO product_images (product_id, image)
SELECT p.product_id, imgs.image_url
FROM (
  VALUES
    ('Resistencia 220Ω', 'https://www.multimarcas.com.bo/storage/images/productos/5186-0-1739567595.jpg'),
    ('Capacitor 100uF', 'https://sieeg.com.mx/wp-content/uploads/2023/01/D_NQ_NP_753403-MLM44551513359_012021-O-1-600x600.jpg'),
    ('Inductor 10mH', 'https://electronicathido.com/assets/recursosImagenes/productos/841/imagenes/13A2_1.jpg'),
    ('Arduino UNO R3', 'https://naylampmechatronics.com/1766-superlarge_default/arduboard-uno-r3-smd-micro-usb-robotdyn.jpg'),
    ('Arduino Nano', 'https://static.cytron.io/image/catalog/products/ARDUINO-NANO/arduino-nano-d.png'),
    ('ESP32 Dev Module', 'https://www.az-delivery.de/cdn/shop/products/esp-32-dev-kit-c-v4-895689.jpg?v=1679398546'),
    ('Sensor DHT11', 'https://vva-industrial.net/wp-content/uploads/2025/08/%C2%BFQue-es-un-sensor-de-temperatura-DHT11.jpg'),
    ('Sensor Ultrasonico HC-SR04', 'https://ja-bots.com/wp-content/uploads/2019/08/HCSR04-1.jpg'),
    ('Sensor PIR', 'https://bugeados.com/wp-content/uploads/sensor-pir-arduino.jpg')
) AS imgs(product_name, image_url)
JOIN products p ON p.product_name = imgs.product_name;
