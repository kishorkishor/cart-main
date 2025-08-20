'use client';

import Link from 'next/link';
import { useCart } from '@/lib/adapters/cart';
import { formatCurrency } from '@/lib/utils';
import { Trash2, Minus, Plus } from 'lucide-react';

export default function CartPage() {
  const { items, remove, update, clear, total, count } = useCart();

  const handleQuantityChange = (productId: string, newQuantity: number) => {
    if (newQuantity < 1) return;
    update(productId, newQuantity);
  };

  return (
    <div className="container py-12">
      <h1 className="text-3xl font-bold mb-6">Your Cart</h1>

      {items.length === 0 ? (
        <div className="card p-8 text-center">
          <p className="text-gray-600 dark:text-gray-300 mb-4">Your cart is empty.</p>
          <Link href="/products" className="btn-primary inline-block">Continue Shopping</Link>
        </div>
      ) : (
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="card p-6">
              <h2 className="text-xl font-semibold mb-4">Cart Items</h2>
              <div className="space-y-4">
                {items.map((item) => (
                  <div key={item.id} className="flex items-center gap-4 p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                    <img 
                      src={item.image || '/images/placeholder.svg'} 
                      alt={item.title} 
                      className="w-20 h-20 object-cover rounded-lg"
                      onError={(e) => {
                        const el = e.currentTarget as HTMLImageElement;
                        if (el.src.endsWith('/placeholder.svg')) return;
                        el.src = '/images/placeholder.svg';
                      }}
                    />
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900 dark:text-white">{item.title}</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-300">{formatCurrency(item.price)}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleQuantityChange(item.productId, item.quantity - 1)}
                        className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                        disabled={item.quantity <= 1}
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="w-12 text-center font-medium">{item.quantity}</span>
                      <button
                        onClick={() => handleQuantityChange(item.productId, item.quantity + 1)}
                        className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">{formatCurrency(item.price * item.quantity)}</p>
                      <button
                        onClick={() => remove(item.productId)}
                        className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 transition-colors mt-1"
                        title="Remove item"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          <div className="card p-6 h-fit">
            <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
            <div className="space-y-3 mb-6">
              <div className="flex items-center justify-between">
                <span className="text-gray-600 dark:text-gray-300">Items ({count()})</span>
                <span className="font-medium">{formatCurrency(total())}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600 dark:text-gray-300">Shipping</span>
                <span className="font-medium">Free</span>
              </div>
              <div className="border-t border-gray-200 dark:border-gray-700 pt-3">
                <div className="flex items-center justify-between">
                  <span className="text-lg font-semibold">Total</span>
                  <span className="text-xl font-bold text-brand-primary">{formatCurrency(total())}</span>
                </div>
              </div>
            </div>
            <Link href="/checkout" className="btn-primary w-full inline-block text-center mb-3">
              Proceed to Checkout
            </Link>
            <button 
              onClick={clear} 
              className="btn-outline w-full"
            >
              Clear Cart
            </button>
          </div>
        </div>
      )}
    </div>
  );
}


