'use client';

import Link from 'next/link';
import { ShoppingCart, Package, User, Home, Heart } from 'lucide-react';
import { useCart } from '@/lib/adapters/cart';
import { useWishlist } from '@/lib/adapters/wishlist';
import { useEffect, useState } from 'react';

export default function Header() {
  const [mounted, setMounted] = useState(false);
  const [count, setCount] = useState(0);
  const [wishlistCount, setWishlistCount] = useState(0);

  useEffect(() => {
    setMounted(true);
    
    // Get initial state
    const cartStore = useCart.getState();
    const wishlistStore = useWishlist.getState();
    
    setCount(cartStore.count());
    setWishlistCount(wishlistStore.count());
    
    // Subscribe to changes
    const unsubscribeCart = useCart.subscribe((state) => {
      setCount(state.count());
    });
    
    const unsubscribeWishlist = useWishlist.subscribe((state) => {
      setWishlistCount(state.count());
    });
    
    return () => {
      unsubscribeCart();
      unsubscribeWishlist();
    };
  }, []);

  // Render badges only after mounting to prevent hydration mismatch
  const renderCartBadge = () => {
    if (!mounted) return null;
    if (count === 0) return null;
    
    return (
      <span className="absolute -top-1 -right-1 bg-brand-primary text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium badge-container count-badge">
        {count > 99 ? '99+' : count}
      </span>
    );
  };

  const renderWishlistBadge = () => {
    if (!mounted) return null;
    if (wishlistCount === 0) return null;
    
    return (
      <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium badge-container count-badge">
        {wishlistCount > 99 ? '99+' : wishlistCount}
      </span>
    );
  };

  return (
    <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-40">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <Package className="w-8 h-8 text-brand-primary" />
            <span className="text-xl font-bold text-gray-900 dark:text-white">
              China Wholesale
            </span>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link 
              href="/" 
              className="text-gray-600 dark:text-gray-300 hover:text-brand-primary dark:hover:text-brand-primary transition-colors flex items-center"
            >
              <Home className="w-4 h-4 mr-2" />
              <span>Home</span>
            </Link>
            <Link 
              href="/products" 
              className="text-gray-600 dark:text-gray-300 hover:text-brand-primary dark:hover:text-brand-primary transition-colors"
            >
              <span>Products</span>
            </Link>
            <Link 
              href="/wishlist" 
              className="text-gray-600 dark:text-gray-300 hover:text-brand-primary dark:hover:text-brand-primary transition-colors flex items-center relative"
            >
              <Heart className="w-4 h-4 mr-2" />
              <span>Wishlist</span>
              {renderWishlistBadge()}
            </Link>
            <Link 
              href="/account" 
              className="text-gray-600 dark:text-gray-300 hover:text-brand-primary dark:hover:text-brand-primary transition-colors flex items-center"
            >
              <User className="w-4 h-4 mr-2" />
              <span>Account</span>
            </Link>
          </nav>

          {/* Cart */}
          <Link
            href="/cart"
            className="relative p-2 text-gray-600 dark:text-gray-300 hover:text-brand-primary dark:hover:text-brand-primary transition-colors"
            title={`Cart ${mounted ? `(${count} items)` : ''}`}
          >
            <ShoppingCart className="w-6 h-6" />
            {renderCartBadge()}
          </Link>
        </div>
      </div>
    </header>
  );
}
