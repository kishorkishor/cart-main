'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { BarChart3, TrendingUp, TrendingDown, DollarSign, ShoppingCart, Users, Package, Calendar } from 'lucide-react';
import Link from 'next/link';

interface SalesData {
  date: string;
  revenue: number;
  orders: number;
  customers: number;
}

interface TopProduct {
  id: string;
  name: string;
  sales: number;
  revenue: number;
  growth: number;
}

interface TopCategory {
  name: string;
  sales: number;
  revenue: number;
  percentage: number;
}

const mockSalesData: SalesData[] = [
  { date: '2024-01-01', revenue: 1250, orders: 15, customers: 12 },
  { date: '2024-01-02', revenue: 980, orders: 12, customers: 10 },
  { date: '2024-01-03', revenue: 1450, orders: 18, customers: 15 },
  { date: '2024-01-04', revenue: 1100, orders: 14, customers: 11 },
  { date: '2024-01-05', revenue: 1350, orders: 17, customers: 14 },
  { date: '2024-01-06', revenue: 1600, orders: 20, customers: 16 },
  { date: '2024-01-07', revenue: 1400, orders: 18, customers: 15 },
];

const mockTopProducts: TopProduct[] = [
  { id: '1', name: 'Premium Jasmine Tea', sales: 45, revenue: 1125, growth: 12.5 },
  { id: '2', name: 'Natural Silk Scarf', sales: 38, revenue: 1710, growth: 8.2 },
  { id: '3', name: 'Traditional Porcelain Vase', sales: 22, revenue: 1978, growth: -2.1 },
  { id: '4', name: 'Chinese Calligraphy Set', sales: 31, revenue: 930, growth: 15.7 },
  { id: '5', name: 'Bamboo Tea Tray', sales: 28, revenue: 560, growth: 6.8 },
];

const mockTopCategories: TopCategory[] = [
  { name: 'Tea & Beverages', sales: 156, revenue: 3890, percentage: 35 },
  { name: 'Textiles', sales: 89, revenue: 4005, percentage: 25 },
  { name: 'Ceramics', sales: 67, revenue: 6023, percentage: 20 },
  { name: 'Art Supplies', sales: 45, revenue: 1350, percentage: 15 },
  { name: 'Home & Garden', sales: 23, revenue: 460, percentage: 5 },
];

export default function AdminAnalyticsPage() {
  const [selectedPeriod, setSelectedPeriod] = useState('7d');
  const [selectedMetric, setSelectedMetric] = useState('revenue');

  const periods = [
    { value: '7d', label: 'Last 7 Days' },
    { value: '30d', label: 'Last 30 Days' },
    { value: '90d', label: 'Last 90 Days' },
    { value: '1y', label: 'Last Year' },
  ];

  const metrics = [
    { value: 'revenue', label: 'Revenue', icon: DollarSign, color: 'text-green-600' },
    { value: 'orders', label: 'Orders', icon: ShoppingCart, color: 'text-blue-600' },
    { value: 'customers', label: 'Customers', icon: Users, color: 'text-purple-600' },
  ];

  // Calculate summary metrics
  const totalRevenue = mockSalesData.reduce((sum, day) => sum + day.revenue, 0);
  const totalOrders = mockSalesData.reduce((sum, day) => sum + day.orders, 0);
  const totalCustomers = mockSalesData.reduce((sum, day) => sum + day.customers, 0);
  const avgOrderValue = totalRevenue / totalOrders;

  // Calculate growth rates
  const revenueGrowth = 8.5; // Mock data
  const ordersGrowth = 12.3;
  const customersGrowth = 6.7;

  const getGrowthColor = (growth: number) => {
    return growth >= 0 ? 'text-green-600' : 'text-red-600';
  };

  const getGrowthIcon = (growth: number) => {
    return growth >= 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />;
  };

  return (
    <div className="container py-12">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Analytics & Reports</h1>
        <div className="flex items-center gap-4">
          <select
            className="input"
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
          >
            {periods.map(period => (
              <option key={period.value} value={period.value}>
                {period.label}
              </option>
            ))}
          </select>
          <select
            className="input"
            value={selectedMetric}
            onChange={(e) => setSelectedMetric(e.target.value)}
          >
            {metrics.map(metric => (
              <option key={metric.value} value={metric.value}>
                {metric.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <motion.div className="card p-6" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-300">Total Revenue</p>
              <p className="text-2xl font-bold">${totalRevenue.toLocaleString()}</p>
              <div className={`flex items-center text-sm ${getGrowthColor(revenueGrowth)}`}>
                {getGrowthIcon(revenueGrowth)}
                <span className="ml-1">{revenueGrowth}%</span>
              </div>
            </div>
            <div className="w-12 h-12 rounded-lg bg-green-100 text-green-600 flex items-center justify-center">
              <DollarSign className="w-6 h-6" />
            </div>
          </div>
        </motion.div>

        <motion.div className="card p-6" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-300">Total Orders</p>
              <p className="text-2xl font-bold">{totalOrders}</p>
              <div className={`flex items-center text-sm ${getGrowthColor(ordersGrowth)}`}>
                {getGrowthIcon(ordersGrowth)}
                <span className="ml-1">{ordersGrowth}%</span>
              </div>
            </div>
            <div className="w-12 h-12 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center">
              <ShoppingCart className="w-6 h-6" />
            </div>
          </div>
        </motion.div>

        <motion.div className="card p-6" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-300">Total Customers</p>
              <p className="text-2xl font-bold">{totalCustomers}</p>
              <div className={`flex items-center text-sm ${getGrowthColor(customersGrowth)}`}>
                {getGrowthIcon(customersGrowth)}
                <span className="ml-1">{customersGrowth}%</span>
              </div>
            </div>
            <div className="w-12 h-12 rounded-lg bg-purple-100 text-purple-600 flex items-center justify-center">
              <Users className="w-6 h-6" />
            </div>
          </div>
        </motion.div>

        <motion.div className="card p-6" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-300">Avg Order Value</p>
              <p className="text-2xl font-bold">${avgOrderValue.toFixed(2)}</p>
              <p className="text-sm text-gray-500">Per order</p>
            </div>
            <div className="w-12 h-12 rounded-lg bg-yellow-100 text-yellow-600 flex items-center justify-center">
              <Package className="w-6 h-6" />
            </div>
          </div>
        </motion.div>
      </div>

      {/* Charts and Data */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Sales Trend Chart */}
        <div className="card p-6">
          <h3 className="text-lg font-semibold mb-4">Sales Trend</h3>
          <div className="space-y-3">
            {mockSalesData.map((day, index) => (
              <div key={day.date} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Calendar className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-600 dark:text-gray-300">
                    {new Date(day.date).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-sm font-medium">${day.revenue}</span>
                  <span className="text-xs text-gray-500">{day.orders} orders</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Categories */}
        <div className="card p-6">
          <h3 className="text-lg font-semibold mb-4">Top Categories</h3>
          <div className="space-y-4">
            {mockTopCategories.map((category, index) => (
              <div key={category.name} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 rounded-full" style={{ backgroundColor: `hsl(${index * 60}, 70%, 60%)` }} />
                  <span className="text-sm font-medium">{category.name}</span>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium">${category.revenue.toLocaleString()}</div>
                  <div className="text-xs text-gray-500">{category.percentage}%</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Top Products */}
      <div className="card p-6 mb-8">
        <h3 className="text-lg font-semibold mb-4">Top Performing Products</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-800">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Product
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Sales
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Revenue
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Growth
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
              {mockTopProducts.map((product) => (
                <motion.tr
                  key={product.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="hover:bg-gray-50 dark:hover:bg-gray-800"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-gray-200 rounded-lg flex items-center justify-center mr-3">
                        <Package className="w-4 h-4 text-gray-400" />
                      </div>
                      <span className="text-sm font-medium text-gray-900 dark:text-white">
                        {product.name}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                    {product.sales} units
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                    ${product.revenue.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className={`flex items-center text-sm ${getGrowthColor(product.growth)}`}>
                      {getGrowthIcon(product.growth)}
                      <span className="ml-1">{product.growth}%</span>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link href="/admin/products" className="card p-6 hover:shadow-lg transition-shadow cursor-pointer">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold mb-2">Product Performance</h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm">View detailed product analytics</p>
            </div>
            <Package className="w-8 h-8 text-brand-primary" />
          </div>
        </Link>

        <Link href="/admin/orders" className="card p-6 hover:shadow-lg transition-shadow cursor-pointer">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold mb-2">Order Analytics</h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm">Track order patterns and trends</p>
            </div>
            <ShoppingCart className="w-8 h-8 text-brand-primary" />
          </div>
        </Link>

        <Link href="/admin/customers" className="card p-6 hover:shadow-lg transition-shadow cursor-pointer">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold mb-2">Customer Insights</h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm">Analyze customer behavior</p>
            </div>
            <Users className="w-8 h-8 text-brand-primary" />
          </div>
        </Link>
      </div>

      <div className="mt-6">
        <Link href="/admin" className="btn-outline">Back to Admin Dashboard</Link>
      </div>
    </div>
  );
}
