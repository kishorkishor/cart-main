'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { 
  ShoppingCart, 
  Plus, 
  Minus, 
  Trash2, 
  ArrowLeft, 
  ArrowRight,
  Tag,
  Truck,
  Shield
} from 'lucide-react';
import { useCart } from '@/lib/adapters/cart';
import { toast } from 'react-hot-toast';
import { formatCurrency } from '@/lib/utils';

export default function CartPage() {
  const { items, remove, update, clear, total, count } = useCart();
  const [mounted, setMounted] = useState(false);
  const [promoCode, setPromoCode] = useState('');
  const [discount, setDiscount] = useState(0);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleQuantityChange = (productId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      handleRemoveItem(productId);
    } else {
      update(productId, newQuantity);
      toast.success('Quantity updated');
    }
  };

  const handleRemoveItem = (productId: string) => {
    remove(productId);
    toast.success('Item removed from cart');
  };

  const handleClearCart = () => {
    clear();
    toast.success('Cart cleared');
  };

  const handleApplyPromo = () => {
    // Mock promo code logic
    if (promoCode.toUpperCase() === 'SAVE10') {
      setDiscount(0.1); // 10% discount
      toast.success('Promo code applied! 10% discount');
    } else if (promoCode.toUpperCase() === 'WELCOME') {
      setDiscount(0.05); // 5% discount
      toast.success('Welcome discount applied! 5% off');
    } else if (promoCode.trim()) {
      toast.error('Invalid promo code');
    }
  };

  // Don't render until mounted to prevent hydration issues
  if (!mounted) {
    return (
      <div className="container py-12">
        <div className="max-w-4xl mx-auto">
          <div className="skeleton h-8 w-48 mb-8"></div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="skeleton h-32 rounded-lg"></div>
              ))}
            </div>
            <div className="skeleton h-96 rounded-lg"></div>
          </div>
        </div>
      </div>
    );
  }

  const subtotal = total();
  const discountAmount = subtotal * discount;
  const finalTotal = subtotal - discountAmount;
  const shipping = finalTotal >= 50 ? 0 : 9.99;
  const grandTotal = finalTotal + shipping;

  if (items.length === 0) {
    return (
      <div className="container py-12">
        <div className="max-w-4xl mx-auto text-center">
          <div className="card p-12">
            <ShoppingCart className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h1 className="text-2xl font-bold mb-2">Your cart is empty</h1>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              Looks like you haven't added any items to your cart yet.
            </p>
            <Link href="/products" className="btn-primary">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-12">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-1">Shopping Cart</h1>
            <p className="text-gray-600 dark:text-gray-300">
              {count} {count === 1 ? 'item' : 'items'} in your cart
            </p>
          </div>
          <button
            onClick={handleClearCart}
            className="btn-outline text-red-600 border-red-300 hover:bg-red-50 dark:hover:bg-red-900/20"
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Clear Cart
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <div className="space-y-4">
              {items.map((item, index) => (
                <motion.div
                  key={item.id}
                  className="card p-6"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <div className="flex items-start gap-4">
                    {/* Product Image */}
                    <div className="w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700">
                      <img
                        src={item.image || '/images/products/placeholder.jpg'}
                        alt={item.title}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          const el = e.currentTarget as HTMLImageElement;
                          el.src = '/images/products/placeholder.jpg';
                        }}
                      />
                    </div>

                    {/* Product Details */}
                    <div className="flex-1 min-w-0">
                      <Link 
                        href={`/products/${item.productId}`}
                        className="font-semibold text-lg hover:text-brand-primary transition-colors line-clamp-1"
                      >
                        {item.title}
                      </Link>
                      <p className="text-brand-primary font-medium mt-1">
                        {formatCurrency(item.price)}
                      </p>

                      {/* Quantity Controls */}
                      <div className="flex items-center gap-3 mt-4">
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                          Quantity:
                        </span>
                        <div className="flex items-center border border-gray-300 dark:border-gray-600 rounded-lg">
                          <button
                            onClick={() => handleQuantityChange(item.productId, item.quantity - 1)}
                            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                            disabled={item.quantity <= 1}
                          >
                            <Minus className="w-4 h-4" />
                          </button>
                          <span className="px-4 py-2 min-w-[3rem] text-center font-medium">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => handleQuantityChange(item.productId, item.quantity + 1)}
                            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Item Total & Remove */}
                    <div className="text-right">
                      <p className="font-semibold text-lg mb-2">
                        {formatCurrency(item.price * item.quantity)}
                      </p>
                      <button
                        onClick={() => handleRemoveItem(item.productId)}
                        className="text-red-600 hover:text-red-700 transition-colors"
                        title="Remove item"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Continue Shopping */}
            <div className="mt-6">
              <Link 
                href="/products" 
                className="btn-outline inline-flex items-center"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Continue Shopping
              </Link>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="card p-6 sticky top-6">
              <h2 className="text-xl font-semibold mb-6">Order Summary</h2>

              {/* Promo Code */}
              <div className="mb-6">
                <label className="block text-sm font-medium mb-2">
                  Promo Code
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Enter code"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                    className="input flex-1"
                  />
                  <button
                    onClick={handleApplyPromo}
                    className="btn-outline"
                  >
                    Apply
                  </button>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Try: SAVE10 or WELCOME
                </p>
              </div>

              {/* Price Breakdown */}
              <div className="space-y-3 pb-6 border-b border-gray-200 dark:border-gray-700">
                <div className="flex justify-between">
                  <span>Subtotal ({count} items)</span>
                  <span>{formatCurrency(subtotal)}</span>
                </div>
                
                {discount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span className="flex items-center">
                      <Tag className="w-4 h-4 mr-1" />
                      Discount ({Math.round(discount * 100)}%)
                    </span>
                    <span>-{formatCurrency(discountAmount)}</span>
                  </div>
                )}

                <div className="flex justify-between">
                  <span className="flex items-center">
                    <Truck className="w-4 h-4 mr-1" />
                    Shipping
                  </span>
                  <span>
                    {shipping === 0 ? (
                      <span className="text-green-600">Free</span>
                    ) : (
                      formatCurrency(shipping)
                    )}
                  </span>
                </div>

                {shipping > 0 && (
                  <p className="text-xs text-gray-500">
                    Free shipping on orders over $50
                  </p>
                )}
              </div>

              {/* Total */}
              <div className="flex justify-between text-lg font-semibold py-4">
                <span>Total</span>
                <span className="text-brand-primary">{formatCurrency(grandTotal)}</span>
              </div>

              {/* Checkout Button */}
              <Link href="/checkout" className="btn-primary w-full text-center block">
                <span className="flex items-center justify-center">
                  Proceed to Checkout
                  <ArrowRight className="w-4 h-4 ml-2" />
                </span>
              </Link>

              {/* Security Note */}
              <div className="flex items-center justify-center text-sm text-gray-500 mt-4">
                <Shield className="w-4 h-4 mr-1" />
                Secure checkout guaranteed
              </div>

              {/* Features */}
              <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                <div className="space-y-3 text-sm">
                  <div className="flex items-center text-gray-600 dark:text-gray-300">
                    <Truck className="w-4 h-4 mr-2 text-brand-primary" />
                    Free shipping on orders over $50
                  </div>
                  <div className="flex items-center text-gray-600 dark:text-gray-300">
                    <Shield className="w-4 h-4 mr-2 text-brand-primary" />
                    30-day return policy
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}