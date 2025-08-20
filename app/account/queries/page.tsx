'use client';

import { useState } from 'react';
import Link from 'next/link';
import { MessageSquare, Plus, Calendar, Clock } from 'lucide-react';

interface Query {
  id: string;
  subject: string;
  message: string;
  status: 'open' | 'closed' | 'pending';
  date: string;
  lastUpdate: string;
}

const mockQueries: Query[] = [
  {
    id: 'Q-001',
    subject: 'Bulk Order Inquiry',
    message: 'I would like to place a bulk order for 100 units of the Premium Jasmine Tea. What would be the wholesale pricing?',
    status: 'open',
    date: '2024-01-12',
    lastUpdate: '2024-01-12'
  },
  {
    id: 'Q-002',
    subject: 'Product Specifications',
    message: 'Can you provide detailed specifications for the Natural Silk Scarf? I need to know the exact dimensions and material composition.',
    status: 'closed',
    date: '2024-01-08',
    lastUpdate: '2024-01-10'
  },
  {
    id: 'Q-003',
    subject: 'Shipping Information',
    message: 'What are the shipping options and estimated delivery times to Europe?',
    status: 'pending',
    date: '2024-01-15',
    lastUpdate: '2024-01-15'
  }
];

const getStatusColor = (status: string) => {
  switch (status) {
    case 'open':
      return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200';
    case 'closed':
      return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
    case 'pending':
      return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
    default:
      return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
  }
};

const getStatusText = (status: string) => {
  return status.charAt(0).toUpperCase() + status.slice(1);
};

export default function QueriesPage() {
  const [queries] = useState<Query[]>(mockQueries);
  const [showNewQueryForm, setShowNewQueryForm] = useState(false);

  return (
    <div className="container py-12">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">My Queries</h1>
        <button 
          onClick={() => setShowNewQueryForm(!showNewQueryForm)}
          className="btn-primary inline-flex items-center"
        >
          <Plus className="w-4 h-4 mr-2" />
          New Query
        </button>
      </div>

      {/* New Query Form */}
      {showNewQueryForm && (
        <div className="card p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Submit New Query</h2>
          <form className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Subject</label>
              <input 
                type="text" 
                className="input w-full" 
                placeholder="Brief description of your inquiry"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Message</label>
              <textarea 
                className="input w-full h-32" 
                placeholder="Please provide details about your inquiry..."
              />
            </div>
            <div className="flex gap-3">
              <button type="submit" className="btn-primary">Submit Query</button>
              <button 
                type="button" 
                onClick={() => setShowNewQueryForm(false)}
                className="btn-outline"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Queries List */}
      <div className="card p-6">
        {queries.length === 0 ? (
          <div className="text-center py-8">
            <MessageSquare className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 dark:text-gray-300 mb-4">No queries yet</p>
            <p className="text-sm text-gray-500">Contact us if you have any questions about our products or services.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {queries.map((query) => (
              <div key={query.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg mb-1">{query.subject}</h3>
                    <p className="text-gray-600 dark:text-gray-300 text-sm mb-2">{query.message}</p>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(query.status)}`}>
                    {getStatusText(query.status)}
                  </span>
                </div>
                <div className="flex items-center gap-4 text-xs text-gray-500">
                  <span className="flex items-center">
                    <Calendar className="w-3 h-3 mr-1" />
                    Created: {query.date}
                  </span>
                  <span className="flex items-center">
                    <Clock className="w-3 h-3 mr-1" />
                    Updated: {query.lastUpdate}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <Link href="/account" className="btn-outline mt-6 inline-block">Back to Account</Link>
    </div>
  );
}
