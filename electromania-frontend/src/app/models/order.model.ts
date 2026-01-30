export type OrderStatus = 'PENDING' | 'PAID' | 'SHIPPED' | 'DELIVERED' | 'CANCELED';
export type PaymentMethod = 'CASH';
export type PaymentStatus = 'PENDING' | 'PAID' | 'CANCELED';
export type InvoiceStatus = 'ISSUED' | 'CANCELED';

export interface OrderItem {
  id: number;
  order_id: number;
  product_id: number;
  product_name: string;
  unit_price: number;
  quantity: number;
  total: number;
}

export interface Payment {
  payment_id: number;
  order_id: number;
  amount: number;
  method: PaymentMethod;
  status: PaymentStatus;
  created_at: string;
}

export interface Invoice {
  invoice_id: number;
  order_id: number;
  invoice_number: string;
  nit_ci: string;
  social_reason: string;
  total: number;
  status: InvoiceStatus;
  issued_at: string;
}

export interface CartDetail {
  id: number;
  quantity: number;
  unitPrice: number;
  total: number;
  product: {
    product_id: number;
    product_name: string;
    description: string;
    price: number;
    stock: number;
    state: string;
    images: string[];
  };
}

export interface CartResponse {
  id: number;
  userUUID: string;
  state: string;
  createdAt: string;
  details: CartDetail[];
  subtotal: number;
  total: number;
}

export interface Order {
  id: number;
  order_id?: number; // alias for id
  uuid: string;
  total: number;
  status: OrderStatus;
  createdAt: string;
  created_at?: string; // alias for createdAt
  cart: CartResponse;
  items?: OrderItem[];
  payment?: Payment;
  invoice?: Invoice;
  user?: {
    uuid: string;
    name: string;
    email: string;
  };
}

export interface CreateOrderRequest {
  cart_id: number;
}

export interface UpdateOrderStatusRequest {
  status: OrderStatus;
}

export interface OrderSummary {
  total_orders: number;
  pending_orders: number;
  completed_orders: number;
  canceled_orders: number;
  total_revenue: number;
}
