'use client';

import { useState } from 'react';
import { useCart } from '@/lib/adapters/cart';
import { formatCurrency } from '@/lib/utils';
import { CreditCard, Truck, Shield, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import toast from 'react-hot-toast';

export default function CheckoutPage() {
  const { items, total, clear } = useCart();
  const [step, setStep] = useState<'shipping' | 'payment' | 'review'>('shipping');
  const [shippingData, setShippingData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'China',
  });
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'bank' | 'alipay' | 'wechat'>('card');

  if (items.length === 0) {
    return (
      <div className="container py-12">
        <div className="card p-8 text-center">
          <p className="text-gray-600 dark:text-gray-300 mb-4">Your cart is empty.</p>
          <Link href="/products" className="btn-primary inline-block">Continue Shopping</Link>
        </div>
      </div>
    );
  }

  const handleShippingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStep('payment');
  };

  const handlePaymentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStep('review');
  };

  const handlePlaceOrder = async () => {
    // TODO: Implement order placement
    toast.success('Order placed successfully!');
    clear();
    // Redirect to order confirmation
  };

  return (
    <div className="container py-12">
      <Link href="/cart" className="inline-flex items-center text-sm text-gray-600 dark:text-gray-300 mb-6">
        <ArrowLeft className="w-4 h-4 mr-2" /> Back to Cart
      </Link>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Checkout Steps */}
        <div className="lg:col-span-2">
          <div className="card p-6">
            {/* Progress Steps */}
            <div className="flex items-center justify-between mb-8">
              <div className={`flex items-center ${step === 'shipping' ? 'text-brand-primary' : 'text-gray-400'}`}>
                <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center text-sm font-medium ${
                  step === 'shipping' ? 'border-brand-primary bg-brand-primary text-white' : 'border-gray-300'
                }`}>
                  1
                </div>
                <span className="ml-2">Shipping</span>
              </div>
              <div className={`flex items-center ${step === 'payment' ? 'text-brand-primary' : 'text-gray-400'}`}>
                <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center text-sm font-medium ${
                  step === 'payment' ? 'border-brand-primary bg-brand-primary text-white' : 'border-gray-300'
                }`}>
                  2
                </div>
                <span className="ml-2">Payment</span>
              </div>
              <div className={`flex items-center ${step === 'review' ? 'text-brand-primary' : 'text-gray-400'}`}>
                <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center text-sm font-medium ${
                  step === 'review' ? 'border-brand-primary bg-brand-primary text-white' : 'border-gray-300'
                }`}>
                  3
                </div>
                <span className="ml-2">Review</span>
              </div>
            </div>

            {/* Shipping Form */}
            {step === 'shipping' && (
              <form onSubmit={handleShippingSubmit}>
                <h2 className="text-xl font-semibold mb-4">Shipping Information</h2>
                <div className="grid md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">First Name</label>
                    <input
                      type="text"
                      required
                      className="input w-full"
                      value={shippingData.firstName}
                      onChange={(e) => setShippingData({ ...shippingData, firstName: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Last Name</label>
                    <input
                      type="text"
                      required
                      className="input w-full"
                      value={shippingData.lastName}
                      onChange={(e) => setShippingData({ ...shippingData, lastName: e.target.value })}
                    />
                  </div>
                </div>
                <div className="grid md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Email</label>
                    <input
                      type="email"
                      required
                      className="input w-full"
                      value={shippingData.email}
                      onChange={(e) => setShippingData({ ...shippingData, email: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Phone</label>
                    <input
                      type="tel"
                      required
                      className="input w-full"
                      value={shippingData.phone}
                      onChange={(e) => setShippingData({ ...shippingData, phone: e.target.value })}
                    />
                  </div>
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-1">Address</label>
                  <input
                    type="text"
                    required
                    className="input w-full"
                    value={shippingData.address}
                    onChange={(e) => setShippingData({ ...shippingData, address: e.target.value })}
                  />
                </div>
                <div className="grid md:grid-cols-3 gap-4 mb-6">
                  <div>
                    <label className="block text-sm font-medium mb-1">City</label>
                    <input
                      type="text"
                      required
                      className="input w-full"
                      value={shippingData.city}
                      onChange={(e) => setShippingData({ ...shippingData, city: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">State/Province</label>
                    <input
                      type="text"
                      required
                      className="input w-full"
                      value={shippingData.state}
                      onChange={(e) => setShippingData({ ...shippingData, state: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">ZIP Code</label>
                    <input
                      type="text"
                      required
                      className="input w-full"
                      value={shippingData.zipCode}
                      onChange={(e) => setShippingData({ ...shippingData, zipCode: e.target.value })}
                    />
                  </div>
                </div>
                <button type="submit" className="btn-primary w-full">
                  Continue to Payment
                </button>
              </form>
            )}

            {/* Payment Form */}
            {step === 'payment' && (
              <form onSubmit={handlePaymentSubmit}>
                <h2 className="text-xl font-semibold mb-4">Payment Method</h2>
                <div className="space-y-4 mb-6">
                  <label className="flex items-center p-4 border border-gray-200 dark:border-gray-700 rounded-lg cursor-pointer hover:border-brand-primary">
                    <input
                      type="radio"
                      name="payment"
                      value="card"
                      checked={paymentMethod === 'card'}
                      onChange={(e) => setPaymentMethod(e.target.value as any)}
                      className="mr-3"
                    />
                    <CreditCard className="w-5 h-5 mr-2" />
                    <span>Credit/Debit Card</span>
                  </label>
                  <label className="flex items-center p-4 border border-gray-200 dark:border-gray-700 rounded-lg cursor-pointer hover:border-brand-primary">
                    <input
                      type="radio"
                      name="payment"
                      value="bank"
                      checked={paymentMethod === 'bank'}
                      onChange={(e) => setPaymentMethod(e.target.value as any)}
                      className="mr-3"
                    />
                    <span>Bank Transfer</span>
                  </label>
                  <label className="flex items-center p-4 border border-gray-200 dark:border-gray-700 rounded-lg cursor-pointer hover:border-brand-primary">
                    <input
                      type="radio"
                      name="payment"
                      value="alipay"
                      checked={paymentMethod === 'alipay'}
                      onChange={(e) => setPaymentMethod(e.target.value as any)}
                      className="mr-3"
                    />
                    <span>Alipay</span>
                  </label>
                  <label className="flex items-center p-4 border border-gray-200 dark:border-gray-700 rounded-lg cursor-pointer hover:border-brand-primary">
                    <input
                      type="radio"
                      name="payment"
                      value="wechat"
                      checked={paymentMethod === 'wechat'}
                      onChange={(e) => setPaymentMethod(e.target.value as any)}
                      className="mr-3"
                    />
                    <span>WeChat Pay</span>
                  </label>
                </div>
                <div className="flex gap-4">
                  <button type="button" onClick={() => setStep('shipping')} className="btn-outline flex-1">
                    Back
                  </button>
                  <button type="submit" className="btn-primary flex-1">
                    Review Order
                  </button>
                </div>
              </form>
            )}

            {/* Order Review */}
            {step === 'review' && (
              <div>
                <h2 className="text-xl font-semibold mb-4">Order Review</h2>
                <div className="space-y-4 mb-6">
                  <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                    <h3 className="font-medium mb-2">Shipping Information</h3>
                    <p>{shippingData.firstName} {shippingData.lastName}</p>
                    <p>{shippingData.address}</p>
                    <p>{shippingData.city}, {shippingData.state} {shippingData.zipCode}</p>
                    <p>{shippingData.country}</p>
                    <p>{shippingData.email} | {shippingData.phone}</p>
                  </div>
                  <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                    <h3 className="font-medium mb-2">Payment Method</h3>
                    <p className="capitalize">{paymentMethod}</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <button onClick={() => setStep('payment')} className="btn-outline flex-1">
                    Back
                  </button>
                  <button onClick={handlePlaceOrder} className="btn-primary flex-1">
                    Place Order
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Order Summary */}
        <div className="card p-6 h-fit">
          <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
          <div className="space-y-3 mb-6">
            {items.map((item) => (
              <div key={item.id} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <img 
                    src={item.image || '/images/placeholder.svg'} 
                    alt={item.title} 
                    className="w-12 h-12 object-cover rounded"
                    onError={(e) => {
                      const el = e.currentTarget as HTMLImageElement;
                      if (el.src.endsWith('/placeholder.svg')) return;
                      el.src = '/images/placeholder.svg';
                    }}
                  />
                  <div>
                    <p className="font-medium text-sm">{item.title}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-300">Qty: {item.quantity}</p>
                  </div>
                </div>
                <span className="font-medium">{formatCurrency(item.price * item.quantity)}</span>
              </div>
            ))}
          </div>
          <div className="border-t border-gray-200 dark:border-gray-700 pt-4 space-y-2">
            <div className="flex items-center justify-between">
              <span>Subtotal</span>
              <span>{formatCurrency(total())}</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Shipping</span>
              <span>Free</span>
            </div>
            <div className="flex items-center justify-between text-lg font-semibold">
              <span>Total</span>
              <span className="text-brand-primary">{formatCurrency(total())}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
