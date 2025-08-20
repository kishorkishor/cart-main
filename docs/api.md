# 🔌 API Documentation - China Wholesale Ecommerce

## 📖 **Table of Contents**
- [Overview](#overview)
- [Authentication](#authentication)
- [API Client Usage](#api-client-usage)
- [Endpoints](#endpoints)
- [Data Models](#data-models)
- [Error Handling](#error-handling)
- [Examples](#examples)
- [Mock vs External API](#mock-vs-external-api)

---

## 🎯 **Overview**

The China Wholesale Ecommerce platform uses a unified API client that can seamlessly switch between mock data (for development) and external APIs (for production).

### **Key Features**
- **Environment Switching**: Toggle between mock and real APIs
- **Automatic Retry**: Exponential backoff for failed requests
- **Type Safety**: Full TypeScript support
- **Error Standardization**: Consistent error handling
- **Authentication**: Automatic token management

---

## 🔐 **Authentication**

### **Token-Based Authentication**
```typescript
// Login and get token
const response = await apiClient.post('/auth/login', {
  email: 'user@example.com',
  password: 'password123'
});

// Token is automatically stored and used for subsequent requests
const token = response.data.token;
localStorage.setItem('auth_token', token);
```

### **Automatic Token Injection**
The API client automatically adds the Authorization header:
```typescript
// This request automatically includes: Authorization: Bearer <token>
const products = await apiClient.get('/products');
```

### **Token Refresh**
```typescript
// Refresh expired token
const newToken = await apiClient.post('/auth/refresh');
```

---

## 📡 **API Client Usage**

### **Basic Usage**
```typescript
import { apiClient } from '@/lib/apiClient';

// GET request
const products = await apiClient.get('/products');

// POST request
const newProduct = await apiClient.post('/products', {
  name: 'New Product',
  price: 29.99
});

// PUT request
const updated = await apiClient.put('/products/123', { name: 'Updated Name' });

// DELETE request
await apiClient.delete('/products/123');
```

### **Using Adapters (Recommended)**
```typescript
import { getProducts, createProduct } from '@/lib/adapters/products';

// Get products with filters
const products = await getProducts({
  category: 'tea',
  minPrice: 10,
  maxPrice: 50,
  page: 1,
  limit: 20
});

// Create new product
const newProduct = await createProduct({
  title: 'Premium Green Tea',
  price: 24.99,
  stock: 100
});
```

### **File Upload**
```typescript
import { uploadFile } from '@/lib/apiClient';

const handleFileUpload = async (file: File) => {
  try {
    const result = await uploadFile('/uploads/images', file, (progress) => {
      console.log(`Upload progress: ${progress}%`);
    });
    console.log('File uploaded:', result.url);
  } catch (error) {
    console.error('Upload failed:', error);
  }
};
```

---

## 📋 **Endpoints**

### **Authentication Endpoints**
```typescript
POST   /auth/login              // User login
POST   /auth/register           // User registration  
POST   /auth/logout             // User logout
GET    /auth/me                 // Get current user
POST   /auth/refresh            // Refresh token
POST   /auth/forgot-password    // Request password reset
POST   /auth/reset-password     // Reset password
```

### **Product Endpoints**
```typescript
GET    /products                // List products
GET    /products/{id}           // Get product by ID
GET    /products/slug/{slug}    // Get product by slug
GET    /products/search?q=      // Search products
GET    /products/categories     // List categories
POST   /admin/products          // Create product (admin)
PUT    /admin/products/{id}     // Update product (admin)
DELETE /admin/products/{id}     // Delete product (admin)
```

### **Cart Endpoints**
```typescript
GET    /cart                    // Get current cart
POST   /cart/items              // Add item to cart
PUT    /cart/items/{id}         // Update cart item
DELETE /cart/items/{id}         // Remove from cart
DELETE /cart/clear              // Clear cart
POST   /cart/coupon             // Apply coupon
```

### **Order Endpoints**
```typescript
GET    /orders/me               // Get customer orders
GET    /orders/{id}             // Get order details
POST   /orders                  // Create new order
POST   /orders/{id}/cancel      // Cancel order
GET    /orders/{id}/track       // Track order
GET    /admin/orders            // List all orders (admin)
PATCH  /admin/orders/{id}/status // Update order status (admin)
```

### **Query & Quotation Endpoints**
```typescript
GET    /queries                 // List queries
POST   /queries                 // Create query
GET    /queries/{id}            // Get query details
GET    /quotations              // List quotations
POST   /quotations/{id}/accept  // Accept quotation
POST   /quotations/{id}/convert-to-order // Convert to order
```

---

## 🗂️ **Data Models**

### **Product Model**
```typescript
interface Product {
  id: string;
  sku: string;
  title: string;
  slug: string;
  description: string;
  price: number;
  salePrice?: number;
  stock: number;
  images: ProductImage[];
  category: ProductCategory;
  tags: string[];
  attributes: ProductAttribute[];
  averageRating: number;
  reviewCount: number;
  status: 'draft' | 'published' | 'archived';
  featured: boolean;
  createdAt: string;
  updatedAt: string;
}
```

### **Order Model**
```typescript
interface Order {
  id: string;
  orderNumber: string;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  customerId: string;
  items: OrderItem[];
  shipping: ShippingDetails;
  billing: BillingDetails;
  totals: OrderTotals;
  createdAt: string;
  statusHistory: OrderStatusHistory[];
}
```

### **User Model**
```typescript
interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: 'customer' | 'admin';
  status: 'active' | 'inactive';
  emailVerified: boolean;
  avatar?: string;
  profile: UserProfile;
  createdAt: string;
}
```

---

## ❌ **Error Handling**

### **Error Types**
```typescript
interface ApiError {
  status: number;
  message: string;
  data?: any;
}
```

### **Common Error Codes**
- **400** - Bad Request (validation errors)
- **401** - Unauthorized (invalid token)
- **403** - Forbidden (insufficient permissions)
- **404** - Not Found (resource doesn't exist)
- **408** - Request Timeout
- **500** - Internal Server Error

### **Handling Errors**
```typescript
try {
  const products = await getProducts();
} catch (error) {
  if (error.status === 401) {
    // Redirect to login
    router.push('/login');
  } else if (error.status === 404) {
    // Show not found message
    toast.error('Products not found');
  } else {
    // Generic error handling
    toast.error(error.message || 'Something went wrong');
  }
}
```

### **Automatic Retry**
The API client automatically retries failed requests:
```typescript
// Retries 3 times with exponential backoff (1s, 2s, 4s)
const data = await apiClient.get('/products');
```

---

## 💡 **Examples**

### **Product Listing with Filters**
```typescript
import { getProducts } from '@/lib/adapters/products';

const ProductListPage = async () => {
  const products = await getProducts({
    category: 'tea',
    featured: true,
    inStock: true,
    sortBy: 'price',
    sortOrder: 'asc',
    page: 1,
    limit: 20
  });

  return (
    <div>
      {products.data.map(product => (
        <ProductCard key={product.id} product={product} />
      ))}
      <Pagination {...products.pagination} />
    </div>
  );
};
```

### **Shopping Cart Management**
```typescript
import { apiClient } from '@/lib/apiClient';
import { endpoints } from '@/lib/endpoints';

const addToCart = async (productId: string, quantity: number) => {
  try {
    const cartItem = await apiClient.post(endpoints.cart.add(), {
      product_id: productId,
      quantity
    });
    
    toast.success('Added to cart!');
    return cartItem;
  } catch (error) {
    toast.error('Failed to add to cart');
    throw error;
  }
};

const updateCartItem = async (itemId: string, quantity: number) => {
  return apiClient.put(endpoints.cart.update(itemId), { quantity });
};

const removeFromCart = async (itemId: string) => {
  return apiClient.delete(endpoints.cart.remove(itemId));
};
```

### **Order Creation**
```typescript
import { createOrder } from '@/lib/adapters/orders';

const checkout = async (orderData: CreateOrderData) => {
  try {
    const order = await createOrder({
      items: [
        {
          productId: 'prod_001',
          quantity: 2,
          unitPrice: 29.99
        }
      ],
      shipping: {
        method: 'standard',
        address: {
          firstName: 'John',
          lastName: 'Doe',
          address1: '123 Main St',
          city: 'New York',
          state: 'NY',
          postalCode: '10001',
          country: 'US'
        }
      },
      billing: {
        address: { /* billing address */ },
        paymentMethod: 'credit_card'
      },
      payment: {
        method: 'stripe',
        amount: 59.98,
        currency: 'USD',
        gateway: 'stripe'
      }
    });

    // Redirect to success page
    router.push(`/orders/${order.id}/success`);
  } catch (error) {
    toast.error('Order failed: ' + error.message);
  }
};
```

### **Admin Product Management**
```typescript
import { ProductAdapter } from '@/lib/adapters/products';

const AdminProductPage = () => {
  const createProduct = async (productData: Partial<Product>) => {
    try {
      const product = await ProductAdapter.createProduct({
        title: 'New Product',
        price: 29.99,
        stock: 100,
        category: { id: 'cat_001' },
        status: 'published'
      });
      
      toast.success('Product created!');
      router.refresh();
    } catch (error) {
      toast.error('Failed to create product');
    }
  };

  const updateInventory = async (productId: string, stock: number) => {
    try {
      await ProductAdapter.updateInventory(productId, stock);
      toast.success('Inventory updated!');
    } catch (error) {
      toast.error('Failed to update inventory');
    }
  };
};
```

---

## 🔄 **Mock vs External API**

### **Development (Mock API)**
```typescript
// .env.local
NEXT_PUBLIC_USE_EXTERNAL_API=false
NEXT_PUBLIC_EXTERNAL_API_BASE_URL=

// API calls go to Next.js route handlers
// GET /products → /api/products
// Data from mocks/data/products.json
```

### **Production (External API)**
```typescript
// .env.local
NEXT_PUBLIC_USE_EXTERNAL_API=true
NEXT_PUBLIC_EXTERNAL_API_BASE_URL=https://api.chinawholesale.com

// API calls go to external API
// GET /products → https://api.chinawholesale.com/products
// Data from your real API
```

### **Adapter Benefits**
The adapter pattern ensures components work with both:
```typescript
// This code works with both mock and real APIs
const products = await getProducts({ featured: true });

// Adapter handles the transformation:
// Mock data: transforms mocks/data/products.json
// Real API: transforms your API response format
```

### **Testing Both APIs**
```typescript
// Test with mock data
NEXT_PUBLIC_USE_EXTERNAL_API=false npm run test

// Test with real API  
NEXT_PUBLIC_USE_EXTERNAL_API=true npm run test:integration
```

---

## 🧪 **API Testing**

### **Unit Testing Adapters**
```typescript
// tests/unit/adapters/products.test.ts
import { ProductAdapter } from '@/lib/adapters/products';

describe('ProductAdapter', () => {
  it('should transform product data correctly', async () => {
    const mockResponse = { /* mock API response */ };
    const product = ProductAdapter.transformProduct(mockResponse);
    
    expect(product.id).toBe('prod_001');
    expect(product.price).toBe(29.99);
  });
});
```

### **Integration Testing**
```typescript
// tests/e2e/products.spec.ts
test('should load and display products', async ({ page }) => {
  await page.goto('/products');
  
  // Should load products from API
  await expect(page.locator('[data-testid="product-card"]')).toBeVisible();
  
  // Should handle search
  await page.fill('[data-testid="search-input"]', 'tea');
  await page.click('[data-testid="search-button"]');
  await expect(page.locator('[data-testid="product-title"]')).toContainText('tea');
});
```

---

## 📚 **Best Practices**

### **1. Always Use Adapters**
```typescript
// ❌ Don't call API client directly in components
const response = await apiClient.get('/products');

// ✅ Use adapters for type safety and consistency
const products = await getProducts();
```

### **2. Handle Loading States**
```typescript
const [loading, setLoading] = useState(false);

const loadProducts = async () => {
  setLoading(true);
  try {
    const products = await getProducts();
    setProducts(products.data);
  } catch (error) {
    toast.error('Failed to load products');
  } finally {
    setLoading(false);
  }
};
```

### **3. Use TypeScript**
```typescript
// Define interfaces for your data
interface ProductFilters {
  category?: string;
  minPrice?: number;
  maxPrice?: number;
}

// Type your API responses
const products: PaginatedResponse<Product> = await getProducts(filters);
```

### **4. Implement Proper Error Boundaries**
```typescript
const ProductPage = () => {
  return (
    <ErrorBoundary fallback={<ErrorPage />}>
      <ProductList />
    </ErrorBoundary>
  );
};
```

---

**🚀 This API structure provides flexibility, type safety, and easy testing for your ecommerce platform!**
