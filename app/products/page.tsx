'use client';

import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Search, ShoppingCart, Heart } from 'lucide-react';
import { getProducts } from '@/lib/adapters/products';
import { useCart } from '@/lib/adapters/cart';
import toast from 'react-hot-toast';

export default function ProductsPage() {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [products, setProducts] = useState<any[]>([]);
  const [wishlist, setWishlist] = useState<Set<string>>(new Set());
  const cartCount = useCart((state) => state.count());

  const load = async () => {
    setError(null);
    setLoading(true);
    try {
      const res = await getProducts({ search: query, limit: 24 });
      setProducts(res.data);
    } catch (e: any) {
      // Fallback: direct fetch from mock API route
      try {
        const r = await fetch(`/api/products?limit=24${query ? `&q=${encodeURIComponent(query)}` : ''}`);
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
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const toggleWishlist = (productId: string) => {
    setWishlist(prev => {
      const newSet = new Set(prev);
      if (newSet.has(productId)) {
        newSet.delete(productId);
        toast.success('Removed from wishlist');
      } else {
        newSet.add(productId);
        toast.success('Added to wishlist');
      }
      return newSet;
    });
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
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((p) => (
            <motion.div
              key={p.id}
              className="card group overflow-hidden"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="aspect-square overflow-hidden">
                <img
                  src={p.images?.[0]?.url || '/images/placeholder.svg'}
                  alt={p.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  onError={(e) => {
                    const el = e.currentTarget as HTMLImageElement;
                    if (el.src.endsWith('/placeholder.svg')) return;
                    el.src = '/images/placeholder.svg';
                  }}
                />
              </div>
              <div className="p-4">
                <Link href={`/products/${p.slug || p.id}`} className="block">
                  <h3 className="font-semibold mb-1 line-clamp-1">{p.title}</h3>
                </Link>
                <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2 mb-3">{p.shortDescription || p.description}</p>
                <div className="flex items-center justify-between">
                  <div className="flex items-baseline gap-2">
                    <span className="price">${(p.salePrice ?? p.price).toFixed(2)}</span>
                    {p.salePrice && (
                      <span className="price-sale">${p.price.toFixed(2)}</span>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <button 
                      className={`btn-outline px-3 py-1.5 text-sm ${
                        wishlist.has(p.id) ? 'text-red-600 border-red-300' : ''
                      }`}
                      onClick={() => toggleWishlist(p.id)}
                    >
                      <Heart className={`w-4 h-4 ${wishlist.has(p.id) ? 'fill-current' : ''}`} />
                    </button>
                    <AddToCartButton product={p} />
                  </div>
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
    <button className="btn-primary px-3 py-1.5 text-sm" onClick={onAdd}>
      <ShoppingCart className="w-4 h-4" />
    </button>
  );
}


