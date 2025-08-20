/**
 * Order adapter - handles order data transformation and business logic
 * Manages order lifecycle, status updates, and payment processing
 */

import { apiClient } from '../apiClient';
import { endpoints } from '../endpoints';
import type { ApiResponse, PaginatedResponse } from '../apiClient';

export interface Order {
  id: string;
  orderNumber: string;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  shippingStatus: ShippingStatus;
  customerId: string;
  customerEmail: string;
  customerName: string;
  items: OrderItem[];
  shipping: ShippingDetails;
  billing: BillingDetails;
  payment: PaymentDetails;
  totals: OrderTotals;
  notes?: string;
  createdAt: string;
  updatedAt: string;
  statusHistory: OrderStatusHistory[];
  tracking?: TrackingInfo;
}

export interface OrderItem {
  id: string;
  productId: string;
  variantId?: string;
  productName: string;
  productSku: string;
  productImage?: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  attributes?: { [key: string]: string };
}

export interface ShippingDetails {
  method: string;
  cost: number;
  estimatedDelivery?: string;
  address: Address;
  carrier?: string;
  trackingNumber?: string;
}

export interface BillingDetails {
  address: Address;
  paymentMethod: string;
}

export interface Address {
  firstName: string;
  lastName: string;
  company?: string;
  address1: string;
  address2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  phone?: string;
}

export interface PaymentDetails {
  method: string;
  transactionId?: string;
  amount: number;
  currency: string;
  gateway: string;
  gatewayTransactionId?: string;
  metadata?: { [key: string]: any };
}

export interface OrderTotals {
  subtotal: number;
  tax: number;
  shipping: number;
  discount: number;
  total: number;
  currency: string;
}

export interface OrderStatusHistory {
  id: string;
  status: OrderStatus;
  note?: string;
  createdAt: string;
  createdBy?: string;
}

export interface TrackingInfo {
  carrier: string;
  trackingNumber: string;
  trackingUrl?: string;
  events: TrackingEvent[];
}

export interface TrackingEvent {
  status: string;
  description: string;
  location?: string;
  timestamp: string;
}

export type OrderStatus = 
  | 'pending'
  | 'confirmed'
  | 'processing'
  | 'shipped'
  | 'delivered'
  | 'cancelled'
  | 'refunded'
  | 'returned';

export type PaymentStatus = 
  | 'pending'
  | 'paid'
  | 'failed'
  | 'refunded'
  | 'partially_refunded';

export type ShippingStatus = 
  | 'pending'
  | 'shipped'
  | 'in_transit'
  | 'delivered'
  | 'returned';

export interface OrderFilters {
  status?: OrderStatus;
  paymentStatus?: PaymentStatus;
  shippingStatus?: ShippingStatus;
  dateFrom?: string;
  dateTo?: string;
  customerId?: string;
  search?: string;
  sortBy?: 'created' | 'updated' | 'total' | 'status';
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}

export interface CreateOrderData {
  items: Array<{
    productId: string;
    variantId?: string;
    quantity: number;
    unitPrice: number;
  }>;
  shipping: Omit<ShippingDetails, 'cost' | 'estimatedDelivery'>;
  billing: BillingDetails;
  payment: Omit<PaymentDetails, 'transactionId' | 'gatewayTransactionId'>;
  notes?: string;
  couponCode?: string;
}

/**
 * Order API adapter class
 */
export class OrderAdapter {
  /**
   * Get customer orders with pagination
   */
  static async getCustomerOrders(filters: OrderFilters = {}): Promise<PaginatedResponse<Order>> {
    const query = this.buildOrderQuery(filters);
    const response = await apiClient.get(endpoints.orders.me(query));
    return this.transformOrderList(response);
  }

  /**
   * Get single order by ID
   */
  static async getOrder(id: string): Promise<Order> {
    const response = await apiClient.get(endpoints.orders.detail(id));
    return this.transformOrder(response.data);
  }

  /**
   * Create new order
   */
  static async createOrder(orderData: CreateOrderData): Promise<Order> {
    const response = await apiClient.post(endpoints.orders.create(), orderData);
    return this.transformOrder(response.data);
  }

  /**
   * Cancel order
   */
  static async cancelOrder(id: string, reason?: string): Promise<Order> {
    const response = await apiClient.post(endpoints.orders.cancel(id), { reason });
    return this.transformOrder(response.data);
  }

  /**
   * Track order
   */
  static async trackOrder(id: string): Promise<TrackingInfo> {
    const response = await apiClient.get(endpoints.orders.track(id));
    return this.transformTrackingInfo(response.data);
  }

  /**
   * Reorder (create new order from existing order)
   */
  static async reorder(id: string): Promise<Order> {
    const response = await apiClient.post(endpoints.orders.reorder(id));
    return this.transformOrder(response.data);
  }

  /**
   * Admin: Get all orders with filters
   */
  static async getAdminOrders(filters: OrderFilters = {}): Promise<PaginatedResponse<Order>> {
    const query = this.buildOrderQuery(filters);
    const response = await apiClient.get(endpoints.orders.list(query));
    return this.transformOrderList(response);
  }

  /**
   * Admin: Update order
   */
  static async updateOrder(id: string, updates: Partial<Order>): Promise<Order> {
    const response = await apiClient.put(endpoints.orders.update(id), updates);
    return this.transformOrder(response.data);
  }

  /**
   * Admin: Update order status
   */
  static async updateOrderStatus(
    id: string, 
    status: OrderStatus, 
    note?: string
  ): Promise<Order> {
    const response = await apiClient.patch(endpoints.orders.updateStatus(id), { 
      status, 
      note 
    });
    return this.transformOrder(response.data);
  }

  /**
   * Admin: Process refund
   */
  static async processRefund(
    id: string, 
    amount: number, 
    reason?: string
  ): Promise<Order> {
    const response = await apiClient.post(endpoints.orders.refund(id), { 
      amount, 
      reason 
    });
    return this.transformOrder(response.data);
  }

  /**
   * Admin: Generate shipping label
   */
  static async generateShippingLabel(id: string): Promise<{ labelUrl: string }> {
    const response = await apiClient.post(endpoints.orders.printLabel(id));
    return response.data;
  }

  /**
   * Admin: Bulk update orders
   */
  static async bulkUpdateOrders(
    orderIds: string[], 
    updates: { status?: OrderStatus; notes?: string }
  ): Promise<{ updated: number; errors: any[] }> {
    const response = await apiClient.post(endpoints.orders.bulkUpdate(), {
      orderIds,
      updates
    });
    return response.data;
  }

  // Private transformation methods

  private static transformOrder(data: any): Order {
    return {
      id: data.id,
      orderNumber: data.order_number || data.orderNumber,
      status: data.status,
      paymentStatus: data.payment_status || data.paymentStatus,
      shippingStatus: data.shipping_status || data.shippingStatus,
      customerId: data.customer_id || data.customerId,
      customerEmail: data.customer_email || data.customerEmail,
      customerName: data.customer_name || data.customerName,
      items: (data.items || []).map(this.transformOrderItem),
      shipping: this.transformShippingDetails(data.shipping),
      billing: this.transformBillingDetails(data.billing),
      payment: this.transformPaymentDetails(data.payment),
      totals: this.transformOrderTotals(data.totals),
      notes: data.notes,
      createdAt: data.created_at || data.createdAt,
      updatedAt: data.updated_at || data.updatedAt,
      statusHistory: (data.status_history || data.statusHistory || []).map(this.transformStatusHistory),
      tracking: data.tracking ? this.transformTrackingInfo(data.tracking) : undefined,
    };
  }

  private static transformOrderList(response: any): PaginatedResponse<Order> {
    return {
      data: (response.data || []).map(this.transformOrder.bind(this)),
      pagination: {
        page: response.pagination?.page || 1,
        limit: response.pagination?.limit || 20,
        total: response.pagination?.total || 0,
        totalPages: response.pagination?.totalPages || response.pagination?.total_pages || 0,
      },
      message: response.message,
      status: response.status,
    };
  }

  private static transformOrderItem(data: any): OrderItem {
    return {
      id: data.id,
      productId: data.product_id || data.productId,
      variantId: data.variant_id || data.variantId,
      productName: data.product_name || data.productName,
      productSku: data.product_sku || data.productSku,
      productImage: data.product_image || data.productImage,
      quantity: parseInt(data.quantity),
      unitPrice: parseFloat(data.unit_price || data.unitPrice),
      totalPrice: parseFloat(data.total_price || data.totalPrice),
      attributes: data.attributes,
    };
  }

  private static transformShippingDetails(data: any): ShippingDetails {
    return {
      method: data.method,
      cost: parseFloat(data.cost),
      estimatedDelivery: data.estimated_delivery || data.estimatedDelivery,
      address: this.transformAddress(data.address),
      carrier: data.carrier,
      trackingNumber: data.tracking_number || data.trackingNumber,
    };
  }

  private static transformBillingDetails(data: any): BillingDetails {
    return {
      address: this.transformAddress(data.address),
      paymentMethod: data.payment_method || data.paymentMethod,
    };
  }

  private static transformPaymentDetails(data: any): PaymentDetails {
    return {
      method: data.method,
      transactionId: data.transaction_id || data.transactionId,
      amount: parseFloat(data.amount),
      currency: data.currency,
      gateway: data.gateway,
      gatewayTransactionId: data.gateway_transaction_id || data.gatewayTransactionId,
      metadata: data.metadata,
    };
  }

  private static transformAddress(data: any): Address {
    return {
      firstName: data.first_name || data.firstName,
      lastName: data.last_name || data.lastName,
      company: data.company,
      address1: data.address_1 || data.address1,
      address2: data.address_2 || data.address2,
      city: data.city,
      state: data.state,
      postalCode: data.postal_code || data.postalCode,
      country: data.country,
      phone: data.phone,
    };
  }

  private static transformOrderTotals(data: any): OrderTotals {
    return {
      subtotal: parseFloat(data.subtotal),
      tax: parseFloat(data.tax),
      shipping: parseFloat(data.shipping),
      discount: parseFloat(data.discount),
      total: parseFloat(data.total),
      currency: data.currency,
    };
  }

  private static transformStatusHistory(data: any): OrderStatusHistory {
    return {
      id: data.id,
      status: data.status,
      note: data.note,
      createdAt: data.created_at || data.createdAt,
      createdBy: data.created_by || data.createdBy,
    };
  }

  private static transformTrackingInfo(data: any): TrackingInfo {
    return {
      carrier: data.carrier,
      trackingNumber: data.tracking_number || data.trackingNumber,
      trackingUrl: data.tracking_url || data.trackingUrl,
      events: (data.events || []).map(this.transformTrackingEvent),
    };
  }

  private static transformTrackingEvent(data: any): TrackingEvent {
    return {
      status: data.status,
      description: data.description,
      location: data.location,
      timestamp: data.timestamp,
    };
  }

  private static buildOrderQuery(filters: OrderFilters): string {
    const params: Record<string, any> = {};

    if (filters.status) params.status = filters.status;
    if (filters.paymentStatus) params.payment_status = filters.paymentStatus;
    if (filters.shippingStatus) params.shipping_status = filters.shippingStatus;
    if (filters.dateFrom) params.date_from = filters.dateFrom;
    if (filters.dateTo) params.date_to = filters.dateTo;
    if (filters.customerId) params.customer_id = filters.customerId;
    if (filters.search) params.q = filters.search;
    if (filters.sortBy) params.sort_by = filters.sortBy;
    if (filters.sortOrder) params.sort_order = filters.sortOrder;
    if (filters.page) params.page = filters.page;
    if (filters.limit) params.limit = filters.limit;

    return new URLSearchParams(params).toString();
  }
}

// Export convenience functions
export const getCustomerOrders = OrderAdapter.getCustomerOrders.bind(OrderAdapter);
export const getOrder = OrderAdapter.getOrder.bind(OrderAdapter);
export const createOrder = OrderAdapter.createOrder.bind(OrderAdapter);
export const cancelOrder = OrderAdapter.cancelOrder.bind(OrderAdapter);
export const trackOrder = OrderAdapter.trackOrder.bind(OrderAdapter);
export const reorder = OrderAdapter.reorder.bind(OrderAdapter);
