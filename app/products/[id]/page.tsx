'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { ShoppingCart, ArrowLeft, Heart } from 'lucide-react';
import { getProduct, getProductBySlug } from '@/lib/adapters/products';
import { useCart } from '@/lib/adapters/cart';
import toast from 'react-hot-toast';

export default function ProductDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [p, setP] = useState<any | null>(null);
  const [isInWishlist, setIsInWishlist] = useState(false);

  useEffect(() => {
    const load = async () => {
      setError(null);
      setLoading(true);
      try {
        const id = params?.id as string;
        let res;
        // try slug, then id
        try {
          res = await getProductBySlug(id);
        } catch {
          res = await getProduct(id);
        }
        setP(res);
      } catch (e: any) {
        setError(e?.message || 'Failed to load product');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [params]);

  const toggleWishlist = () => {
    setIsInWishlist(!isInWishlist);
    toast.success(isInWishlist ? 'Removed from wishlist' : 'Added to wishlist');
  };

  if (loading) {
    return (
      <div className="container py-12">
        <div className="card p-8 skeleton h-64" />
      </div>
    );
  }

  if (error || !p) {
    return (
      <div className="container py-12">
        <div className="card p-8">
          <p className="text-red-600">{error || 'Product not found'}</p>
          <Link href="/products" className="btn-outline mt-4 inline-flex items-center">
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to products
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-12">
      <Link href="/products" className="inline-flex items-center text-sm text-gray-600 dark:text-gray-300 mb-6">
        <ArrowLeft className="w-4 h-4 mr-2" /> Back to products
      </Link>

      <div className="grid md:grid-cols-2 gap-8">
        <div className="card overflow-hidden">
          <div className="aspect-square">
            <img
              src={p.images?.[0]?.url || '/images/placeholder.svg'}
              alt={p.title}
              className="w-full h-full object-cover"
              onError={(e) => {
                const el = e.currentTarget as HTMLImageElement;
                if (el.src.endsWith('/placeholder.svg')) return;
                el.src = '/images/placeholder.svg';
              }}
            />
          </div>
        </div>
        <div>
          <h1 className="text-3xl font-bold mb-2">{p.title}</h1>
          <p className="text-gray-600 dark:text-gray-300 mb-4">{p.description}</p>
          <div className="flex items-center gap-3 mb-6">
            <span className="price text-2xl">${(p.salePrice ?? p.price).toFixed(2)}</span>
            {p.salePrice && <span className="price-sale">${p.price.toFixed(2)}</span>}
          </div>

          <div className="flex items-center gap-3">
            <AddToCart product={p} />
            <button 
              className={`btn-outline inline-flex items-center ${
                isInWishlist ? 'text-red-600 border-red-300' : ''
              }`}
              onClick={toggleWishlist}
            >
              <Heart className={`w-4 h-4 mr-2 ${isInWishlist ? 'fill-current' : ''}`} /> 
              {isInWishlist ? 'In Wishlist' : 'Wishlist'}
            </button>
          </div>

          <div className="mt-8">
            <h2 className="text-lg font-semibold mb-2">Details</h2>
            <ul className="space-y-1 text-sm text-gray-700 dark:text-gray-300">
              {p.attributes?.map((a: any, i: number) => (
                <li key={i}>
                  <span className="font-medium">{a.name}:</span> {String(a.value)}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

function AddToCart({ product }: { product: any }) {
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
    <button className="btn-primary inline-flex items-center" onClick={onAdd}>
      <ShoppingCart className="w-4 h-4 mr-2" /> Add to cart
    </button>
  );
}
