'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Heart, ShoppingCart, Trash2, ArrowRight } from 'lucide-react';
import { useCart } from '@/lib/adapters/cart';
import toast from 'react-hot-toast';

// Mock wishlist data - in real app this would come from API
const mockWishlistItems = [
  {
    id: '1',
    productId: 'premium-jasmine-tea',
    title: 'Premium Jasmine Tea',
    price: 29.99,
    image: '/images/products/jasmine-tea-main.jpg',
    description: 'High-quality jasmine tea with delicate floral notes',
    inStock: true,
  },
  {
    id: '2',
    productId: 'natural-silk-scarf',
    title: 'Natural Silk Scarf',
    price: 45.00,
    image: '/images/products/silk-scarf-main.jpg',
    description: 'Luxurious 100% natural silk scarf',
    inStock: true,
  },
  {
    id: '3',
    productId: 'porcelain-vase',
    title: 'Traditional Porcelain Vase',
    price: 89.99,
    image: '/images/products/porcelain-vase-main.jpg',
    description: 'Handcrafted traditional Chinese porcelain vase',
    inStock: false,
  },
];

export default function WishlistPage() {
  const [wishlistItems, setWishlistItems] = useState(mockWishlistItems);
  const addToCart = useCart((state) => state.add);

  const removeFromWishlist = (id: string) => {
    setWishlistItems(items => items.filter(item => item.id !== id));
    toast.success('Removed from wishlist');
  };

  const moveToCart = (item: any) => {
    addToCart({
      productId: item.productId,
      title: item.title,
      price: item.price,
      quantity: 1,
      image: item.image,
    });
    removeFromWishlist(item.id);
    toast.success('Moved to cart');
  };

  if (wishlistItems.length === 0) {
    return (
      <div className="container py-12">
        <div className="card p-8 text-center">
          <Heart className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-semibold mb-2">Your wishlist is empty</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            Start adding products you love to your wishlist
          </p>
          <Link href="/products" className="btn-primary inline-block">
            Browse Products
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-12">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-1">My Wishlist</h1>
          <p className="text-gray-600 dark:text-gray-300">
            Save products you love for later
          </p>
        </div>
        <Link href="/products" className="btn-outline inline-flex items-center">
          Continue Shopping
          <ArrowRight className="w-4 h-4 ml-2" />
        </Link>
      </div>

      <div className="grid gap-6">
        {wishlistItems.map((item) => (
          <motion.div
            key={item.id}
            className="card p-6"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="flex items-center gap-6">
              <img
                src={item.image || '/images/placeholder.svg'}
                alt={item.title}
                className="w-24 h-24 object-cover rounded-lg"
                onError={(e) => {
                  const el = e.currentTarget as HTMLImageElement;
                  if (el.src.endsWith('/placeholder.svg')) return;
                  el.src = '/images/placeholder.svg';
                }}
              />
              <div className="flex-1">
                <h3 className="text-lg font-semibold mb-1">{item.title}</h3>
                <p className="text-gray-600 dark:text-gray-300 mb-2 line-clamp-2">
                  {item.description}
                </p>
                <div className="flex items-center gap-4">
                  <span className="text-xl font-bold text-brand-primary">
                    ${item.price.toFixed(2)}
                  </span>
                  <span className={`text-sm px-2 py-1 rounded-full ${
                    item.inStock 
                      ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                      : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                  }`}>
                    {item.inStock ? 'In Stock' : 'Out of Stock'}
                  </span>
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <button
                  onClick={() => moveToCart(item)}
                  disabled={!item.inStock}
                  className={`btn-primary px-4 py-2 inline-flex items-center ${
                    !item.inStock ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  <ShoppingCart className="w-4 h-4 mr-2" />
                  Move to Cart
                </button>
                <button
                  onClick={() => removeFromWishlist(item.id)}
                  className="btn-outline px-4 py-2 inline-flex items-center text-red-600 hover:text-red-700 hover:border-red-300"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Remove
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {wishlistItems.length > 0 && (
        <div className="mt-8 text-center">
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            {wishlistItems.length} item{wishlistItems.length !== 1 ? 's' : ''} in your wishlist
          </p>
          <Link href="/products" className="btn-primary">
            Continue Shopping
          </Link>
        </div>
      )}
    </div>
  );
}
