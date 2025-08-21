/**
 * Product adapter - transforms external API responses to internal format
 * Handles product data normalization and business logic
 */

import { apiClient } from '../apiClient';
import { endpoints } from '../endpoints';
import type { ApiResponse, PaginatedResponse } from '../apiClient';

export interface Product {
  id: string;
  sku: string;
  title: string;
  slug: string;
  description: string;
  shortDescription?: string;
  price: number;
  salePrice?: number;
  stock: number;
  lowStockThreshold?: number;
  images: ProductImage[];
  category: ProductCategory;
  tags: string[];
  attributes: ProductAttribute[];
  variants?: ProductVariant[];
  reviews: ProductReview[];
  averageRating: number;
  reviewCount: number;
  status: 'draft' | 'published' | 'archived';
  featured: boolean;
  weight?: number;
  dimensions?: ProductDimensions;
  seoTitle?: string;
  seoDescription?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ProductImage {
  id: string;
  url: string;
  alt?: string;
  position: number;
  thumbnail?: string;
  medium?: string;
  large?: string;
}

export interface ProductCategory {
  id: string;
  name: string;
  slug: string;
  parentId?: string;
  description?: string;
  image?: string;
  productCount?: number;
}

export interface ProductAttribute {
  name: string;
  value: string;
  type: 'text' | 'number' | 'boolean' | 'select';
}

export interface ProductVariant {
  id: string;
  name: string;
  price: number;
  stock: number;
  sku: string;
  attributes: ProductAttribute[];
}

export interface ProductReview {
  id: string;
  userId: string;
  userName: string;
  rating: number;
  title?: string;
  comment: string;
  verified: boolean;
  helpful: number;
  createdAt: string;
}

export interface ProductDimensions {
  length: number;
  width: number;
  height: number;
  unit: 'cm' | 'in';
}

export interface ProductFilters {
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  inStock?: boolean;
  featured?: boolean;
  tags?: string[];
  rating?: number;
  search?: string;
  sortBy?: 'name' | 'price' | 'rating' | 'created' | 'updated';
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
  exclude?: string;
}

/**
 * Product API adapter class
 */
export class ProductAdapter {
  /**
   * Get paginated list of products
   */
  static async getProducts(filters: ProductFilters = {}): Promise<PaginatedResponse<Product>> {
    const query = ProductAdapter.buildProductQuery(filters);
    const response = await apiClient.get(endpoints.products.list(query));
    return ProductAdapter.transformProductList(response);
  }

  /**
   * Get single product by ID
   */
  static async getProduct(id: string): Promise<Product> {
    const response = await apiClient.get(endpoints.products.detail(id));
    return ProductAdapter.transformProduct(response.data);
  }

  /**
   * Get product by slug
   */
  static async getProductBySlug(slug: string): Promise<Product> {
    // Fallback: our mock API doesn’t have /slug route, try /products/{id}
    try {
      const response = await apiClient.get(endpoints.products.bySlug(slug));
      return ProductAdapter.transformProduct(response.data);
    } catch {
      const response = await apiClient.get(endpoints.products.detail(slug));
      return ProductAdapter.transformProduct(response.data);
    }
  }

  /**
   * Search products
   */
  static async searchProducts(query: string, filters: ProductFilters = {}): Promise<PaginatedResponse<Product>> {
    const searchQuery = ProductAdapter.buildProductQuery({ ...filters, search: query });
    const response = await apiClient.get(endpoints.products.search(searchQuery));
    return ProductAdapter.transformProductList(response);
  }

  /**
   * Get product categories
   */
  static async getCategories(): Promise<ProductCategory[]> {
    const response = await apiClient.get(endpoints.products.categories());
    return response.data.map(ProductAdapter.transformCategory);
  }

  /**
   * Get products by category
   */
  static async getProductsByCategory(categoryId: string, filters: ProductFilters = {}): Promise<PaginatedResponse<Product>> {
    const query = ProductAdapter.buildProductQuery(filters);
    const response = await apiClient.get(endpoints.products.categoryProducts(categoryId, query));
    return ProductAdapter.transformProductList(response);
  }

  /**
   * Get product reviews
   */
  static async getProductReviews(productId: string): Promise<ProductReview[]> {
    const response = await apiClient.get(endpoints.products.reviews(productId));
    return response.data.map(ProductAdapter.transformReview);
  }

  /**
   * Add product review
   */
  static async addReview(productId: string, review: Partial<ProductReview>): Promise<ProductReview> {
    const response = await apiClient.post(endpoints.products.addReview(productId), review);
    return ProductAdapter.transformReview(response.data);
  }

  /**
   * Admin: Create product
   */
  static async createProduct(product: Partial<Product>): Promise<Product> {
    const response = await apiClient.post(endpoints.products.create(), product);
    return ProductAdapter.transformProduct(response.data);
  }

  /**
   * Admin: Update product
   */
  static async updateProduct(id: string, updates: Partial<Product>): Promise<Product> {
    const response = await apiClient.put(endpoints.products.update(id), updates);
    return ProductAdapter.transformProduct(response.data);
  }

  /**
   * Admin: Delete product
   */
  static async deleteProduct(id: string): Promise<void> {
    await apiClient.delete(endpoints.products.delete(id));
  }

  /**
   * Admin: Bulk import products
   */
  static async bulkImport(file: File): Promise<{ success: number; errors: any[] }> {
    const response = await apiClient.post(endpoints.products.bulkImport(), { file });
    return response.data;
  }

  /**
   * Admin: Update inventory
   */
  static async updateInventory(id: string, stock: number): Promise<Product> {
    const response = await apiClient.patch(endpoints.products.updateInventory(id), { stock });
    return ProductAdapter.transformProduct(response.data);
  }

  // Private transformation methods

  private static transformProduct(data: any): Product {
    return {
      id: data.id,
      sku: data.sku,
      title: data.title || data.name,
      slug: data.slug,
      description: data.description || '',
      shortDescription: data.short_description || data.shortDescription,
      price: parseFloat(data.price) || 0,
      salePrice: data.sale_price ? parseFloat(data.sale_price) : undefined,
      stock: parseInt(data.stock) || 0,
      lowStockThreshold: data.low_stock_threshold || data.lowStockThreshold,
      images: (data.images || []).map(ProductAdapter.transformImage),
      category: ProductAdapter.transformCategory(data.category),
      tags: data.tags || [],
      attributes: (data.attributes || []).map(ProductAdapter.transformAttribute),
      variants: (data.variants || []).map(ProductAdapter.transformVariant),
      reviews: (data.reviews || []).map(ProductAdapter.transformReview),
      averageRating: parseFloat(data.average_rating || data.averageRating) || 0,
      reviewCount: parseInt(data.review_count || data.reviewCount) || 0,
      status: data.status || 'draft',
      featured: Boolean(data.featured),
      weight: data.weight ? parseFloat(data.weight) : undefined,
      dimensions: data.dimensions ? ProductAdapter.transformDimensions(data.dimensions) : undefined,
      seoTitle: data.seo_title || data.seoTitle,
      seoDescription: data.seo_description || data.seoDescription,
      createdAt: data.created_at || data.createdAt,
      updatedAt: data.updated_at || data.updatedAt,
    };
  }

  private static transformProductList(response: any): PaginatedResponse<Product> {
    return {
      data: (response.data || []).map(ProductAdapter.transformProduct),
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

  private static transformCategory(data: any): ProductCategory {
    return {
      id: data.id,
      name: data.name,
      slug: data.slug,
      parentId: data.parent_id || data.parentId,
      description: data.description,
      image: data.image,
      productCount: data.product_count || data.productCount,
    };
  }

  private static transformImage(data: any): ProductImage {
    return {
      id: data.id,
      url: data.url,
      alt: data.alt,
      position: data.position || 0,
      thumbnail: data.thumbnail,
      medium: data.medium,
      large: data.large,
    };
  }

  private static transformAttribute(data: any): ProductAttribute {
    return {
      name: data.name,
      value: data.value,
      type: data.type || 'text',
    };
  }

  private static transformVariant(data: any): ProductVariant {
    return {
      id: data.id,
      name: data.name,
      price: parseFloat(data.price),
      stock: parseInt(data.stock),
      sku: data.sku,
      attributes: (data.attributes || []).map(ProductAdapter.transformAttribute),
    };
  }

  private static transformReview(data: any): ProductReview {
    return {
      id: data.id,
      userId: data.user_id || data.userId,
      userName: data.user_name || data.userName,
      rating: parseInt(data.rating),
      title: data.title,
      comment: data.comment,
      verified: Boolean(data.verified),
      helpful: parseInt(data.helpful) || 0,
      createdAt: data.created_at || data.createdAt,
    };
  }

  private static transformDimensions(data: any): ProductDimensions {
    return {
      length: parseFloat(data.length),
      width: parseFloat(data.width),
      height: parseFloat(data.height),
      unit: data.unit || 'cm',
    };
  }

  private static buildProductQuery(filters: ProductFilters): string {
    const params: Record<string, any> = {};

    if (filters.category) params.category = filters.category;
    if (filters.minPrice) params.min_price = filters.minPrice;
    if (filters.maxPrice) params.max_price = filters.maxPrice;
    if (filters.inStock !== undefined) params.in_stock = filters.inStock;
    if (filters.featured !== undefined) params.featured = filters.featured;
    if (filters.tags?.length) params.tags = filters.tags.join(',');
    if (filters.rating) params.rating = filters.rating;
    if (filters.search) params.q = filters.search;
    if (filters.sortBy) params.sort_by = filters.sortBy;
    if (filters.sortOrder) params.sort_order = filters.sortOrder;
    if (filters.page) params.page = filters.page;
    if (filters.limit) params.limit = filters.limit;

    return new URLSearchParams(params).toString();
  }
}

// Export convenience functions
export const getProducts = ProductAdapter.getProducts.bind(ProductAdapter);
export const getProduct = ProductAdapter.getProduct.bind(ProductAdapter);
export const getProductBySlug = ProductAdapter.getProductBySlug.bind(ProductAdapter);
export const searchProducts = ProductAdapter.searchProducts.bind(ProductAdapter);
export const getCategories = ProductAdapter.getCategories.bind(ProductAdapter);
export const getProductsByCategory = ProductAdapter.getProductsByCategory.bind(ProductAdapter);
