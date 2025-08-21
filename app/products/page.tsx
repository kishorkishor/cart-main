'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Search, ShoppingCart, Heart, Filter, SortAsc } from 'lucide-react';
import { useCart } from '@/lib/adapters/cart';
import { useWishlist } from '@/lib/adapters/wishlist';
import { getProducts } from '@/lib/adapters/products';
import { toast } from 'react-hot-toast';

export default function ProductsPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const { add: addToWishlist, remove: removeFromWishlist, isInWishlist } = useWishlist();
  const cartCount = useCart((state) => state.count());

  // Mock categories - in real app, fetch from API
  const categories = [
    { id: 'all', name: 'All Categories' },
    { id: 'tea-beverages', name: 'Tea & Beverages' },
    { id: 'fashion-accessories', name: 'Fashion & Accessories' },
    { id: 'ceramics', name: 'Ceramics & Pottery' },
    { id: 'art-supplies', name: 'Art Supplies' },
    { id: 'home-garden', name: 'Home & Garden' }
  ];

  const load = async () => {
    setError(null);
    setLoading(true);
    try {
      const filters: any = { 
        search: query, 
        limit: 24,
        sortBy,
        sortOrder
      };
      
      if (selectedCategory !== 'all') {
        filters.category = selectedCategory;
      }
      
      const res = await getProducts(filters);
      setProducts(res.data);
    } catch (e: any) {
      // Fallback: direct fetch from mock API route
      try {
        const params = new URLSearchParams();
        params.append('limit', '24');
        if (query) params.append('q', query);
        if (selectedCategory !== 'all') params.append('category', selectedCategory);
        if (sortBy) params.append('sort_by', sortBy);
        if (sortOrder) params.append('sort_order', sortOrder);
        
        const r = await fetch(`/api/products?${params.toString()}`);
        if (r.ok) {
          const j = await r.json();
          setProducts(j?.data || []);
          setError(null);
        } else {
          setError(e?.message || 'Failed to load products');
        }
      } catch {
        setError(e?.message || 'Failed to load products');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    console.log('selectedCategory:', selectedCategory, typeof selectedCategory);
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCategory, sortBy, sortOrder]);

  const toggleWishlist = (product: any) => {
    if (isInWishlist(product.id)) {
      removeFromWishlist(product.id);
      toast.success('Removed from wishlist');
    } else {
                        addToWishlist({
                    productId: product.id,
                    title: product.title,
                    price: product.price,
                    salePrice: product.salePrice,
                    image: product.image,
                    shortDescription: product.shortDescription || product.description,
                    category: typeof product.category === 'string' ? product.category : product.category?.name || 'Unknown',
                    rating: product.rating || 4.5
                  });
      toast.success('Added to wishlist');
    }
  };

  return (
    <div className="container py-12">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-1">Products</h1>
          <p className="text-gray-600 dark:text-gray-300">Browse our catalog and start shopping</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 w-full md:w-auto">
            <div className="relative flex-1 md:w-80">
              <input
                className="input pl-10"
                placeholder="Search products..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && load()}
              />
              <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            </div>
            <button className="btn-primary" onClick={load} disabled={loading}>
              {loading ? 'Searching...' : 'Search'}
            </button>
          </div>
          <Link 
            href="/cart" 
            className="relative p-2 text-gray-600 dark:text-gray-300 hover:text-brand-primary dark:hover:text-brand-primary transition-colors"
          >
            <ShoppingCart className="w-6 h-6" />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-brand-primary text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium">
                {cartCount > 99 ? '99+' : cartCount}
              </span>
            )}
          </Link>
        </div>
      </div>

      {/* Filters and Sorting */}
      <div className="card p-4 mb-6">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
            <Filter className="w-4 h-4" />
            Filters:
          </div>
          
          <select
            className="input text-sm w-auto min-w-[140px]"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            {categories.map(cat => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </select>

          <div className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
            <SortAsc className="w-4 h-4" />
            Sort:
          </div>

          <select
            className="input text-sm w-auto min-w-[100px]"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="name">Name</option>
            <option value="price">Price</option>
            <option value="rating">Rating</option>
            <option value="created">Newest</option>
          </select>

          <button
            className="btn-outline text-sm px-3 py-1.5 h-9 flex items-center justify-center min-w-[40px]"
            onClick={() => setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc')}
            title={`Sort ${sortOrder === 'asc' ? 'Descending' : 'Ascending'}`}
          >
            {sortOrder === 'asc' ? '↑' : '↓'}
          </button>
        </div>
        
        {/* Active Filters Summary */}
        <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
            <span>
              {products.length} product{products.length !== 1 ? 's' : ''} found
            </span>
            {selectedCategory !== 'all' && (
              <span className="flex items-center gap-1">
                Category: <span className="font-medium text-gray-700 dark:text-gray-300">
                  {categories.find(c => c.id === selectedCategory)?.name || String(selectedCategory)}
                </span>
              </span>
            )}
            {query && (
              <span className="flex items-center gap-1">
                Search: <span className="font-medium text-gray-700 dark:text-gray-300">"{query}"</span>
              </span>
            )}
            <span className="flex items-center gap-1">
              Sorted by: <span className="font-medium text-gray-700 dark:text-gray-300">
                {sortBy === 'name' ? 'Name' : sortBy === 'price' ? 'Price' : sortBy === 'rating' ? 'Rating' : 'Newest'} 
                {sortOrder === 'asc' ? ' (A-Z)' : ' (Z-A)'}
              </span>
            </span>
          </div>
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-lg bg-red-50 border border-red-200 text-red-700 mb-6">{error}</div>
      )}

      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="card p-4 skeleton h-64" />
          ))}
        </div>
      ) : products.length === 0 ? (
        <div className="card p-8 text-center">
          <p className="text-gray-600 dark:text-gray-300">No products found.</p>
          {query && <p className="text-sm text-gray-500 mt-2">Try adjusting your search terms or filters.</p>}
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {products.map((p) => (
            <motion.div
              key={p.id}
              className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 border-0 overflow-hidden group"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              whileHover={{ y: -8 }}
            >
              {/* Image Container - Larger and more prominent */}
              <div className="relative aspect-[4/3] overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900">
                <img
                  src={p.images?.[0]?.url || '/images/products/placeholder.jpg'}
                  alt={p.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                  onError={(e) => {
                    const el = e.currentTarget as HTMLImageElement;
                    if (el.src.endsWith('/placeholder.jpg')) return;
                    el.src = '/images/products/placeholder.jpg';
                  }}
                />
                
                {/* Sale Badge - More prominent */}
                {p.salePrice && (
                  <div className="absolute top-4 left-4 bg-red-600 text-white text-xs px-3 py-1.5 rounded-full font-semibold shadow-lg">
                    SALE
                  </div>
                )}

                {/* Rating Badge - Cleaner design */}
                <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-sm text-gray-800 text-xs px-2.5 py-1.5 rounded-full font-medium shadow-lg flex items-center gap-1.5">
                  <svg className="w-3.5 h-3.5 text-yellow-500 fill-current" viewBox="0 0 20 20">
                    <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                  </svg>
                  {p.rating?.toFixed(1) || '4.5'}
                </div>

                {/* Subtle overlay on hover */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-500" />
              </div>

              {/* Content Section - More spacious and elegant */}
              <div className="p-6 space-y-4">
                {/* Title - Larger and more prominent */}
                <Link href={`/products/${p.slug || p.id}`} className="block group">
                  <h3 className="font-bold text-gray-900 dark:text-white text-lg leading-tight line-clamp-2 group-hover:text-brand-primary transition-colors duration-300">
                    {p.title}
                  </h3>
                </Link>

                {/* Description - Better spacing */}
                <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 leading-relaxed">
                  {p.shortDescription || p.description}
                </p>

                {/* Price Section - More prominent */}
                <div className="flex items-baseline justify-between pt-2">
                  <div className="flex items-baseline gap-3">
                    <span className="text-2xl font-bold text-brand-primary">
                      ${(p.salePrice ?? p.price).toFixed(2)}
                    </span>
                    {p.salePrice && (
                      <span className="text-base text-gray-500 line-through">
                        ${p.price.toFixed(2)}
                      </span>
                    )}
                  </div>
                  
                  {/* Savings indicator */}
                  {p.salePrice && (
                    <div className="text-xs text-green-600 dark:text-green-400 font-medium">
                      Save ${(p.price - p.salePrice).toFixed(2)}
                    </div>
                  )}
                </div>

                {/* Action Buttons - More formal and minimalistic */}
                <div className="flex gap-2 pt-2">
                  <button
                    className={`flex-1 px-2 py-1.5 rounded-md text-sm font-medium transition-all duration-300 ${
                      isInWishlist(p.id)
                        ? 'bg-red-500 hover:bg-red-600 text-white shadow-sm'
                        : 'bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-600'
                    }`}
                    onClick={() => toggleWishlist(p)}
                  >
                    <Heart className={`w-3 h-3 inline mr-1.5 ${isInWishlist(p.id) ? 'fill-current' : ''}`} />
                    {isInWishlist(p.id) ? 'Saved' : 'Wishlist'}
                  </button>
                  
                  <AddToCartButton product={p} />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}

function AddToCartButton({ product }: { product: any }) {
  const add = useCart((s) => s.add);
  const onAdd = () => {
    add({
      productId: product.id,
      title: product.title,
      price: product.salePrice ?? product.price,
      quantity: 1,
      image: product.images?.[0]?.url,
    });
    toast.success('Added to cart');
  };
  return (
    <button 
      className="flex-1 px-2 py-1.5 bg-brand-primary hover:bg-brand-secondary text-white text-sm font-medium rounded-md transition-all duration-300 shadow-sm hover:shadow-md" 
      onClick={onAdd}
    >
      <ShoppingCart className="w-3 h-3 inline mr-1.5" />
      Add to Cart
    </button>
  );
}


