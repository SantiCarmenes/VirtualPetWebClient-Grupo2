// ============================================================
// VIRTUALPET — Tipos globales (mapean respuestas de la API)
// Bloque 1 + 8b.1 del plan de implementación
// ============================================================

// ─── Auth / Usuario ─────────────────────────────────────────

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  username: string;
  role: 'USER' | 'BACKOFFICE';
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// ─── Catálogo ────────────────────────────────────────────────

export interface AttributeValue {
  id: string;
  value: string;
  slug: string;
  displayOrder: number;
}

export interface Attribute {
  id: string;
  name: string;
  slug: string;
  type: 'TEXT' | 'NUMERIC' | 'COLOR' | 'BOOLEAN';
  unit?: string;
  filterable: boolean;
  values: AttributeValue[];
}

export interface VariantImage {
  id: string;
  url: string;
}

export interface ProductImage {
  id: string;
  url: string;
  isPrimary: boolean;
}

/**
 * Un atributo de variante tal como lo devuelve la API.
 * IMPORTANTE: el campo se llama `variantAttributes`, NO `attributeValues`.
 */
export interface VariantAttribute {
  attributeValue: {
    id: string;
    value: string;
    slug: string;
    attribute: {
      name: string;
    };
  };
}

export interface Variant {
  id: string;
  productId: string;
  sku: string;
  price: number;
  active: boolean;
  images: VariantImage[];
  variantAttributes: VariantAttribute[];
  createdAt: string;
  /** Presente solo en respuestas del carrito */
  product?: {
    id: string;
    name: string;
    slug: string;
  };
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  imageUrl?: string;
  active: boolean;
  createdAt: string;
}

export interface Product {
  id: string;
  categoryId: string;
  name: string;
  slug: string;
  description: string;
  active: boolean;
  images: ProductImage[];
  variants: Variant[];
  category: {
    id: string;
    name: string;
    slug: string;
  };
  createdAt: string;
}

// ─── Paginación ──────────────────────────────────────────────

export interface Pagination {
  total: number;
  page: number;
  limit: number;
  /** El backend devuelve `totalPages`, no `pages` */
  totalPages: number;
}

export interface ProductsResponse {
  data: Product[];
  pagination: Pagination;
}

// ─── Carrito ─────────────────────────────────────────────────

export interface CartItem {
  id: string;
  variantId: string;
  quantity: number;
  variant: {
    id: string;
    sku: string;
    price: number;
    images: VariantImage[];
    product: {
      id: string;
      name: string;
      slug: string;
    };
  };
}

export interface Cart {
  id: string;
  userId: string;
  items: CartItem[];
  createdAt: string;
  updatedAt: string;
}

// ─── Órdenes ─────────────────────────────────────────────────

export type OrderStatus =
  | 'PENDING'
  | 'CONFIRMED'
  | 'SHIPPED'
  | 'DELIVERED'
  | 'CANCELLED';

export interface ShippingAddress {
  street: string;
  city: string;
  province: string;
  zipCode?: string;
  country: string;
}

export interface OrderItem {
  id: string;
  variantId: string;
  quantity: number;
  /** Precio unitario al momento de la compra (snapshot) */
  unitPrice: number;
  /** Total de la línea: unitPrice * quantity (calculado en backend) */
  lineTotal: number;
  /** Nombre del producto en el momento de la compra (snapshot) */
  productNameSnapshot: string;
  /** SKU en el momento de la compra (snapshot) */
  skuSnapshot: string;
}

export interface Order {
  id: string;
  userId: string;
  status: OrderStatus;
  customerEmail: string;
  customerName: string;
  shippingAddress: ShippingAddress;
  items: OrderItem[];
  subtotal: number;
  shippingCost: number;
  discountTotal: number;
  discount: number;
  total: number;
  createdAt: string;
  updatedAt: string;
}

// ─── Pago ────────────────────────────────────────────────────

export type PaymentMethod =
  | 'CASH'
  | 'CREDIT_CARD'
  | 'DEBIT_CARD'
  | 'TRANSFER';

export type PaymentStatus =
  | 'PENDING'
  | 'APPROVED'
  | 'REJECTED'
  | 'REFUNDED';

export interface PaymentMethodOption {
  code: PaymentMethod;
  name: string;
  description?: string;
}

export interface Payment {
  id: string;
  orderId: string;
  method: PaymentMethod;
  status: PaymentStatus;
  amount: number;
  currency: string;
  createdAt: string;
}

// ─── Envío ───────────────────────────────────────────────────

export interface ShippingMethod {
  id: string;
  name: string;
  description?: string;
  basePrice: number;
  estimatedDays?: number;
}

export type ShipmentStatus =
  | 'PENDING'
  | 'PROCESSING'
  | 'SHIPPED'
  | 'DELIVERED'
  | 'RETURNED';

export interface Shipment {
  id: string;
  orderId: string;
  methodId: string;
  methodName: string;
  status: ShipmentStatus;
  trackingNumber?: string;
  estimatedDelivery?: string;
  createdAt: string;
}

// ─── Checkout ────────────────────────────────────────────────

/**
 * Respuesta de POST /orders.
 * paymentUrl solo estará presente con gateways online (futuros).
 */
export interface CheckoutResponse {
  order: Order;
  payment: Payment;
  paymentUrl?: string;
}
