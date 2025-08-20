'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { 
  Package, 
  ShoppingCart, 
  Heart, 
  FileText, 
  MessageSquare, 
  Settings, 
  User,
  CreditCard,
  MapPin,
  Bell,
  TrendingUp,
  Calendar
} from 'lucide-react';
import { useCart } from '@/lib/adapters/cart';

// Mock data - in real app this would come from API
const mockRecentOrders = [
  {
    id: 'ORD-001',
    date: '2024-01-15',
    status: 'delivered',
    total: 89.99,
    items: 2,
  },
  {
    id: 'ORD-002',
    date: '2024-01-10',
    status: 'shipped',
    total: 45.00,
    items: 1,
  },
  {
    id: 'ORD-003',
    date: '2024-01-05',
    status: 'processing',
    total: 29.99,
    items: 1,
  },
];

const mockQueries = [
  {
    id: 'Q-001',
    subject: 'Bulk Order Inquiry',
    status: 'open',
    date: '2024-01-12',
  },
  {
    id: 'Q-002',
    subject: 'Product Specifications',
    status: 'closed',
    date: '2024-01-08',
  },
];

const getStatusColor = (status: string) => {
  switch (status) {
    case 'delivered':
      return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
    case 'shipped':
      return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
    case 'processing':
      return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
    case 'open':
      return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200';
    case 'closed':
      return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    default:
      return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
  }
};

const getStatusText = (status: string) => {
  return status.charAt(0).toUpperCase() + status.slice(1);
};

export default function AccountPage() {
  const cartCount = useCart((state) => state.count());

  return (
    <div className="container py-12">
      <h1 className="text-3xl font-bold mb-8">My Account</h1>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <motion.div
          className="card p-6 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <ShoppingCart className="w-8 h-8 text-brand-primary mx-auto mb-2" />
          <h3 className="text-lg font-semibold">{cartCount}</h3>
          <p className="text-gray-600 dark:text-gray-300">Cart Items</p>
        </motion.div>

        <motion.div
          className="card p-6 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Package className="w-8 h-8 text-brand-primary mx-auto mb-2" />
          <h3 className="text-lg font-semibold">{mockRecentOrders.length}</h3>
          <p className="text-gray-600 dark:text-gray-300">Total Orders</p>
        </motion.div>

        <motion.div
          className="card p-6 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <MessageSquare className="w-8 h-8 text-brand-primary mx-auto mb-2" />
          <h3 className="text-lg font-semibold">{mockQueries.filter(q => q.status === 'open').length}</h3>
          <p className="text-gray-600 dark:text-gray-300">Open Queries</p>
        </motion.div>

        <motion.div
          className="card p-6 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <TrendingUp className="w-8 h-8 text-brand-primary mx-auto mb-2" />
          <h3 className="text-lg font-semibold">$165.98</h3>
          <p className="text-gray-600 dark:text-gray-300">Total Spent</p>
        </motion.div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Quick Actions */}
        <div className="lg:col-span-1">
          <div className="card p-6">
            <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
            <div className="space-y-3">
              <Link
                href="/products"
                className="flex items-center p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
              >
                <ShoppingCart className="w-5 h-5 mr-3 text-brand-primary" />
                <span>Browse Products</span>
              </Link>
              <Link
                href="/cart"
                className="flex items-center p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
              >
                <Package className="w-5 h-5 mr-3 text-brand-primary" />
                <span>View Cart</span>
              </Link>
              <Link
                href="/wishlist"
                className="flex items-center p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
              >
                <Heart className="w-5 h-5 mr-3 text-brand-primary" />
                <span>My Wishlist</span>
              </Link>
              <Link
                href="/account/queries"
                className="flex items-center p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
              >
                <MessageSquare className="w-5 h-5 mr-3 text-brand-primary" />
                <span>My Queries</span>
              </Link>
              <Link
                href="/account/profile"
                className="flex items-center p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
              >
                <User className="w-5 h-5 mr-3 text-brand-primary" />
                <span>Profile Settings</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Recent Orders & Queries */}
        <div className="lg:col-span-2 space-y-6">
          {/* Recent Orders */}
          <div className="card p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">Recent Orders</h2>
              <Link href="/account/orders" className="text-brand-primary hover:underline text-sm">
                View All
              </Link>
            </div>
            {mockRecentOrders.length === 0 ? (
              <p className="text-gray-600 dark:text-gray-300 text-center py-8">
                No orders yet. Start shopping to see your order history.
              </p>
            ) : (
              <div className="space-y-3">
                {mockRecentOrders.map((order) => (
                  <div key={order.id} className="flex items-center justify-between p-3 border border-gray-200 dark:border-gray-700 rounded-lg">
                    <div className="flex items-center gap-3">
                      <Package className="w-5 h-5 text-gray-400" />
                      <div>
                        <p className="font-medium">{order.id}</p>
                        <p className="text-sm text-gray-600 dark:text-gray-300">
                          <Calendar className="w-3 h-3 inline mr-1" />
                          {order.date}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">${order.total.toFixed(2)}</p>
                      <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(order.status)}`}>
                        {getStatusText(order.status)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Recent Queries */}
          <div className="card p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">Recent Queries</h2>
              <Link href="/account/queries" className="text-brand-primary hover:underline text-sm">
                View All
              </Link>
            </div>
            {mockQueries.length === 0 ? (
              <p className="text-gray-600 dark:text-gray-300 text-center py-8">
                No queries yet. Contact us if you have any questions.
              </p>
            ) : (
              <div className="space-y-3">
                {mockQueries.map((query) => (
                  <div key={query.id} className="flex items-center justify-between p-3 border border-gray-200 dark:border-gray-700 rounded-lg">
                    <div className="flex items-center gap-3">
                      <MessageSquare className="w-5 h-5 text-gray-400" />
                      <div>
                        <p className="font-medium">{query.subject}</p>
                        <p className="text-sm text-gray-600 dark:text-gray-300">
                          <Calendar className="w-3 h-3 inline mr-1" />
                          {query.date}
                        </p>
                      </div>
                    </div>
                    <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(query.status)}`}>
                      {getStatusText(query.status)}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
