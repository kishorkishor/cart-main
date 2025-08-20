'use client';

import { useState } from 'react';
import Link from 'next/link';
import { MapPin, Plus, Trash2 } from 'lucide-react';

interface Address {
  id: string;
  name: string;
  line1: string;
  city: string;
  state: string;
  zip: string;
  country: string;
  isDefault?: boolean;
}

const initial: Address[] = [
  { id: 'addr-1', name: 'Home', line1: '123 Silk Road', city: 'Guangzhou', state: 'GD', zip: '510000', country: 'China', isDefault: true },
];

export default function AddressesPage() {
  const [addresses, setAddresses] = useState<Address[]>(initial);

  const remove = (id: string) => setAddresses(a => a.filter(x => x.id !== id));
  const setDefault = (id: string) => setAddresses(a => a.map(x => ({ ...x, isDefault: x.id === id })));

  return (
    <div className="container py-12">
      <h1 className="text-3xl font-bold mb-6">Addresses</h1>
      <div className="card p-6">
        <div className="flex items-center justify-between mb-4">
          <p className="text-gray-600 dark:text-gray-300">Manage your shipping addresses</p>
          <button className="btn-primary inline-flex items-center">
            <Plus className="w-4 h-4 mr-2" /> Add Address
          </button>
        </div>
        <div className="space-y-3">
          {addresses.map((a) => (
            <div key={a.id} className="flex items-center justify-between p-3 border border-gray-200 dark:border-gray-700 rounded-lg">
              <div className="flex items-center gap-3">
                <MapPin className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="font-medium">{a.name} {a.isDefault && <span className="text-xs text-brand-primary ml-2">(Default)</span>}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-300">{a.line1}, {a.city}, {a.state} {a.zip}, {a.country}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {!a.isDefault && (
                  <button className="btn-outline" onClick={() => setDefault(a.id)}>Set Default</button>
                )}
                <button className="btn-outline text-red-600" onClick={() => remove(a.id)}>
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
      <Link href="/account" className="btn-outline mt-4 inline-block">Back to Account</Link>
    </div>
  );
}
