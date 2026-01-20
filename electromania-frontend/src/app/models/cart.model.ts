export type CartState = 'ACTIVE' | 'INACTIVE' | 'COMPLETED';

export interface CartItem {
  id: number;
  nombre: string;
  descripcion: string;
  precio: number;
  cantidad: number;
  categoria?: string;
  imagen?: string;
}

export interface Cart {
  cart_id: number;
  user_uuid: string;
  state: CartState;
  created_at: Date;
  items: CartItem[];
}

export interface CartTotals {
  totalItems: number;
  subtotal: number;
  impuestos: number;
  total: number;
}

export interface CartDetails {
  id: number;
  cart_id: number;
  product_id: number;
  quantity: number;
  unit_price: number;
  sub_total: number;
}

export interface InvoiceData {
  generarFactura: boolean;
  nombre: string;
  nit: string;
  email: string;
}
