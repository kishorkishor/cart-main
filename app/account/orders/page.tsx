'use client';

import Link from 'next/link';
import { Calendar, Package } from 'lucide-react';

const mockOrders = [
  { id: 'ORD-001', date: '2024-01-15', status: 'delivered', total: 89.99 },
  { id: 'ORD-002', date: '2024-01-10', status: 'shipped', total: 45.0 },
  { id: 'ORD-003', date: '2024-01-05', status: 'processing', total: 29.99 },
];

export default function OrdersPage() {
  return (
    <div className="container py-12">
      <h1 className="text-3xl font-bold mb-6">Order History</h1>
      <div className="card p-6">
        {mockOrders.length === 0 ? (
          <p className="text-gray-600 dark:text-gray-300">No orders yet.</p>
        ) : (
          <div className="space-y-3">
            {mockOrders.map((o) => (
              <div key={o.id} className="flex items-center justify-between p-3 border border-gray-200 dark:border-gray-700 rounded-lg">
                <div className="flex items-center gap-3">
                  <Package className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="font-medium">{o.id}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      <Calendar className="w-3 h-3 inline mr-1" />
                      {o.date}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold">${o.total.toFixed(2)}</p>
                  <p className="text-xs text-gray-500">{o.status}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <Link href="/account" className="btn-outline mt-4 inline-block">Back to Account</Link>
    </div>
  );
}
