export interface Order {
  id: string;
  orderId?: string;
  customer?: string;
  status: string;
  total: number;
  createdAt: string;
  items?: Array<{
    _id: string;
    productId: string;
    name: string;
    sku: string;
    price: number;
    quantity: number;
    attributes?: Record<string, string>;
  }>;
  shippingAddress?: {
    fullName?: string;
    addressLine1?: string;
    city?: string;
    postalCode?: string;
    country?: string;
    phone?: string;
    email?: string;
  };
  paymentStatus?: string;
  paymentMethod?: string;
  shippingStatus?: string;
  shippingMethod?: string;
  trackingNumber?: string;
  subtotal?: number;
  tax?: number;
  discount?: number;
  notes?: string;
  shippingCost?: number;
}
