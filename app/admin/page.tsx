'use client';

import { motion } from 'framer-motion';
import { Package, Users, ShoppingCart, BarChart3, Settings } from 'lucide-react';
import Link from 'next/link';

export default function AdminDashboardPage() {
  return (
    <div className="container py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <p className="text-gray-600 dark:text-gray-300">Manage products, orders, customers, and settings</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard icon={<Package className="w-6 h-6" />} label="Products" value="24" />
        <StatCard icon={<ShoppingCart className="w-6 h-6" />} label="Orders" value="12" />
        <StatCard icon={<Users className="w-6 h-6" />} label="Customers" value="6" />
        <StatCard icon={<BarChart3 className="w-6 h-6" />} label="Revenue" value="$2,450" />
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
        <Link href="/admin/products" className="card p-6 hover:shadow-lg transition-shadow cursor-pointer">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold mb-2">Product Management</h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm">Manage your product catalog, inventory, and pricing</p>
            </div>
            <Package className="w-8 h-8 text-brand-primary" />
          </div>
        </Link>

        <Link href="/admin/orders" className="card p-6 hover:shadow-lg transition-shadow cursor-pointer">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold mb-2">Order Management</h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm">Process orders, update statuses, and manage fulfillment</p>
            </div>
            <ShoppingCart className="w-8 h-8 text-brand-primary" />
          </div>
        </Link>

        <Link href="/admin/customers" className="card p-6 hover:shadow-lg transition-shadow cursor-pointer">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold mb-2">Customer Management</h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm">View customer profiles and manage accounts</p>
            </div>
            <Users className="w-8 h-8 text-brand-primary" />
          </div>
        </Link>

        <Link href="/admin/analytics" className="card p-6 hover:shadow-lg transition-shadow cursor-pointer">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold mb-2">Analytics & Reports</h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm">Sales analytics, inventory reports, and insights</p>
            </div>
            <BarChart3 className="w-8 h-8 text-brand-primary" />
          </div>
        </Link>

        <Link href="/admin/settings" className="card p-6 hover:shadow-lg transition-shadow cursor-pointer">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold mb-2">Settings</h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm">Configure store settings and preferences</p>
            </div>
            <Settings className="w-8 h-8 text-brand-primary" />
          </div>
        </Link>
      </div>
    </div>
  );
}

function StatCard({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <motion.div className="card p-6" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-600 dark:text-gray-300">{label}</p>
          <p className="text-2xl font-bold">{value}</p>
        </div>
        <div className="w-10 h-10 rounded-lg bg-brand-primary/10 text-brand-primary flex items-center justify-center">
          {icon}
        </div>
      </div>
    </motion.div>
  );
}
