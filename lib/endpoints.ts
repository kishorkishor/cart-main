/**
 * Centralized endpoint mapping - no hard-coded routes in components
 * All API routes are defined here for easy maintenance and updates
 */

// Base endpoint configuration
export const API_VERSION = 'v1';

/**
 * Authentication endpoints
 */
export const auth = {
  me: () => `/auth/me`,
  login: () => `/auth/login`,
  register: () => `/auth/register`,
  logout: () => `/auth/logout`,
  refresh: () => `/auth/refresh`,
  forgotPassword: () => `/auth/forgot-password`,
  resetPassword: () => `/auth/reset-password`,
  verifyEmail: () => `/auth/verify-email`,
  resendVerification: () => `/auth/resend-verification`,
  // OAuth endpoints
  googleLogin: () => `/auth/google`,
  facebookLogin: () => `/auth/facebook`,
} as const;

/**
 * User/Profile endpoints
 */
export const users = {
  profile: () => `/users/profile`,
  updateProfile: () => `/users/profile`,
  changePassword: () => `/users/change-password`,
  uploadAvatar: () => `/users/avatar`,
  deleteAccount: () => `/users/delete-account`,
  // Admin user management
  list: (query?: string) => `/users${query ? `?${query}` : ''}`,
  detail: (id: string) => `/users/${id}`,
  create: () => `/users`,
  update: (id: string) => `/users/${id}`,
  delete: (id: string) => `/users/${id}`,
} as const;

/**
 * Product endpoints
 */
export const products = {
  // Public product endpoints
  list: (query?: string) => `/products${query ? `?${query}` : ''}`,
  detail: (id: string) => `/products/${id}`,
  bySlug: (slug: string) => `/products/slug/${slug}`,
  search: (query: string) => `/products/search?q=${encodeURIComponent(query)}`,
  categories: () => `/products/categories`,
  category: (id: string) => `/products/categories/${id}`,
  categoryProducts: (id: string, query?: string) => 
    `/products/categories/${id}/products${query ? `?${query}` : ''}`,
  reviews: (id: string) => `/products/${id}/reviews`,
  addReview: (id: string) => `/products/${id}/reviews`,
  // Admin product endpoints
  create: () => `/admin/products`,
  update: (id: string) => `/admin/products/${id}`,
  delete: (id: string) => `/admin/products/${id}`,
  bulkImport: () => `/admin/products/bulk-import`,
  bulkExport: () => `/admin/products/bulk-export`,
  inventory: (id: string) => `/admin/products/${id}/inventory`,
  updateInventory: (id: string) => `/admin/products/${id}/inventory`,
} as const;

/**
 * Shopping cart endpoints
 */
export const cart = {
  me: () => `/cart`,
  add: () => `/cart/items`,
  item: (id: string) => `/cart/items/${id}`,
  update: (id: string) => `/cart/items/${id}`,
  remove: (id: string) => `/cart/items/${id}`,
  clear: () => `/cart/clear`,
  count: () => `/cart/count`,
  total: () => `/cart/total`,
  applyCoupon: () => `/cart/coupon`,
  removeCoupon: () => `/cart/coupon`,
} as const;

/**
 * Wishlist endpoints
 */
export const wishlist = {
  me: () => `/wishlist`,
  add: () => `/wishlist/items`,
  remove: (id: string) => `/wishlist/items/${id}`,
  clear: () => `/wishlist/clear`,
  moveToCart: (id: string) => `/wishlist/items/${id}/move-to-cart`,
} as const;

/**
 * Order endpoints
 */
export const orders = {
  // Customer order endpoints
  me: (query?: string) => `/orders/me${query ? `?${query}` : ''}`,
  detail: (id: string) => `/orders/${id}`,
  create: () => `/orders`,
  cancel: (id: string) => `/orders/${id}/cancel`,
  track: (id: string) => `/orders/${id}/track`,
  reorder: (id: string) => `/orders/${id}/reorder`,
  // Admin order endpoints
  list: (query?: string) => `/admin/orders${query ? `?${query}` : ''}`,
  update: (id: string) => `/admin/orders/${id}`,
  updateStatus: (id: string) => `/admin/orders/${id}/status`,
  refund: (id: string) => `/admin/orders/${id}/refund`,
  printLabel: (id: string) => `/admin/orders/${id}/shipping-label`,
  bulkUpdate: () => `/admin/orders/bulk-update`,
} as const;

/**
 * Address endpoints
 */
export const addresses = {
  list: () => `/addresses`,
  detail: (id: string) => `/addresses/${id}`,
  create: () => `/addresses`,
  update: (id: string) => `/addresses/${id}`,
  delete: (id: string) => `/addresses/${id}`,
  setDefault: (id: string, type: 'shipping' | 'billing') => 
    `/addresses/${id}/set-default/${type}`,
} as const;

/**
 * Payment endpoints
 */
export const payments = {
  methods: () => `/payments/methods`,
  addMethod: () => `/payments/methods`,
  removeMethod: (id: string) => `/payments/methods/${id}`,
  setDefault: (id: string) => `/payments/methods/${id}/set-default`,
  process: () => `/payments/process`,
  refund: () => `/payments/refund`,
  webhook: (provider: string) => `/payments/webhook/${provider}`,
} as const;

/**
 * Query system endpoints
 */
export const queries = {
  // Customer query endpoints
  list: (query?: string) => `/queries${query ? `?${query}` : ''}`,
  detail: (id: string) => `/queries/${id}`,
  create: () => `/queries`,
  update: (id: string) => `/queries/${id}`,
  delete: (id: string) => `/queries/${id}`,
  attachFile: (id: string) => `/queries/${id}/attachments`,
  removeFile: (id: string, fileId: string) => `/queries/${id}/attachments/${fileId}`,
  // Admin query endpoints
  adminList: (query?: string) => `/admin/queries${query ? `?${query}` : ''}`,
  respond: (id: string) => `/admin/queries/${id}/respond`,
  close: (id: string) => `/admin/queries/${id}/close`,
  assignTo: (id: string) => `/admin/queries/${id}/assign`,
} as const;

/**
 * Quotation endpoints
 */
export const quotations = {
  list: (query?: string) => `/quotations${query ? `?${query}` : ''}`,
  detail: (id: string) => `/quotations/${id}`,
  create: () => `/quotations`,
  update: (id: string) => `/quotations/${id}`,
  delete: (id: string) => `/quotations/${id}`,
  accept: (id: string) => `/quotations/${id}/accept`,
  reject: (id: string) => `/quotations/${id}/reject`,
  convertToOrder: (id: string) => `/quotations/${id}/convert-to-order`,
  // Admin quotation endpoints
  adminList: (query?: string) => `/admin/quotations${query ? `?${query}` : ''}`,
  adminCreate: () => `/admin/quotations`,
  sendToCustomer: (id: string) => `/admin/quotations/${id}/send`,
} as const;

/**
 * Invoice endpoints
 */
export const invoices = {
  list: (query?: string) => `/invoices${query ? `?${query}` : ''}`,
  detail: (id: string) => `/invoices/${id}`,
  download: (id: string) => `/invoices/${id}/download`,
  send: (id: string) => `/invoices/${id}/send`,
  // Admin invoice endpoints
  adminList: (query?: string) => `/admin/invoices${query ? `?${query}` : ''}`,
  generate: () => `/admin/invoices/generate`,
  regenerate: (id: string) => `/admin/invoices/${id}/regenerate`,
  markPaid: (id: string) => `/admin/invoices/${id}/mark-paid`,
} as const;

/**
 * Financial ledger endpoints
 */
export const ledger = {
  me: (query?: string) => `/ledger/me${query ? `?${query}` : ''}`,
  statement: (query?: string) => `/ledger/statement${query ? `?${query}` : ''}`,
  downloadStatement: () => `/ledger/statement/download`,
  transactions: (query?: string) => `/ledger/transactions${query ? `?${query}` : ''}`,
  balance: () => `/ledger/balance`,
  // Admin ledger endpoints
  customer: (userId: string, query?: string) => 
    `/admin/ledger/customer/${userId}${query ? `?${query}` : ''}`,
  addEntry: () => `/admin/ledger/entries`,
  adjustBalance: (userId: string) => `/admin/ledger/adjust/${userId}`,
} as const;

/**
 * Notification endpoints
 */
export const notifications = {
  list: (query?: string) => `/notifications${query ? `?${query}` : ''}`,
  unread: () => `/notifications/unread`,
  markRead: (id: string) => `/notifications/${id}/mark-read`,
  markAllRead: () => `/notifications/mark-all-read`,
  preferences: () => `/notifications/preferences`,
  updatePreferences: () => `/notifications/preferences`,
  // Admin notification endpoints
  send: () => `/admin/notifications/send`,
  broadcast: () => `/admin/notifications/broadcast`,
  templates: () => `/admin/notifications/templates`,
} as const;

/**
 * Analytics and reporting endpoints
 */
export const analytics = {
  dashboard: () => `/admin/analytics/dashboard`,
  sales: (query?: string) => `/admin/analytics/sales${query ? `?${query}` : ''}`,
  products: (query?: string) => `/admin/analytics/products${query ? `?${query}` : ''}`,
  customers: (query?: string) => `/admin/analytics/customers${query ? `?${query}` : ''}`,
  revenue: (query?: string) => `/admin/analytics/revenue${query ? `?${query}` : ''}`,
  inventory: () => `/admin/analytics/inventory`,
  reports: {
    generate: () => `/admin/reports/generate`,
    list: () => `/admin/reports`,
    download: (id: string) => `/admin/reports/${id}/download`,
  }
} as const;

/**
 * File upload endpoints
 */
export const uploads = {
  image: () => `/uploads/images`,
  document: () => `/uploads/documents`,
  avatar: () => `/uploads/avatar`,
  productImages: () => `/uploads/products/images`,
  bulkUpload: () => `/uploads/bulk`,
  delete: (id: string) => `/uploads/${id}`,
} as const;

/**
 * Settings and configuration endpoints
 */
export const settings = {
  general: () => `/admin/settings/general`,
  shipping: () => `/admin/settings/shipping`,
  payment: () => `/admin/settings/payment`,
  email: () => `/admin/settings/email`,
  notifications: () => `/admin/settings/notifications`,
  security: () => `/admin/settings/security`,
  integrations: () => `/admin/settings/integrations`,
  backup: () => `/admin/settings/backup`,
  export: () => `/admin/settings/export`,
  import: () => `/admin/settings/import`,
} as const;

/**
 * Search endpoints
 */
export const search = {
  global: (query: string) => `/search?q=${encodeURIComponent(query)}`,
  products: (query: string) => `/search/products?q=${encodeURIComponent(query)}`,
  customers: (query: string) => `/admin/search/customers?q=${encodeURIComponent(query)}`,
  orders: (query: string) => `/admin/search/orders?q=${encodeURIComponent(query)}`,
  suggestions: (query: string) => `/search/suggestions?q=${encodeURIComponent(query)}`,
} as const;

/**
 * Health and status endpoints
 */
export const system = {
  health: () => `/health`,
  status: () => `/status`,
  version: () => `/version`,
  metrics: () => `/admin/metrics`,
} as const;

/**
 * Export all endpoint collections
 */
export const endpoints = {
  auth,
  users,
  products,
  cart,
  wishlist,
  orders,
  addresses,
  payments,
  queries,
  quotations,
  invoices,
  ledger,
  notifications,
  analytics,
  uploads,
  settings,
  search,
  system,
} as const;

/**
 * Helper function to build query string from object
 */
export function buildQuery(params: Record<string, any>): string {
  const searchParams = new URLSearchParams();
  
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      if (Array.isArray(value)) {
        value.forEach(v => searchParams.append(key, String(v)));
      } else {
        searchParams.append(key, String(value));
      }
    }
  });
  
  return searchParams.toString();
}

/**
 * Helper function to get paginated endpoint
 */
export function paginated(baseEndpoint: string, page: number = 1, limit: number = 20): string {
  const query = buildQuery({ page, limit });
  return `${baseEndpoint}${query ? `?${query}` : ''}`;
}
