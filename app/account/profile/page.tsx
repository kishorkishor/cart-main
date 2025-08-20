'use client';

import { useState } from 'react';
import Link from 'next/link';
import { User, Mail, Phone } from 'lucide-react';

export default function ProfilePage() {
  const [form, setForm] = useState({ name: 'John Doe', email: 'john@example.com', phone: '+86 138 0000 0000' });

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: integrate with API
    alert('Profile saved');
  };

  return (
    <div className="container py-12">
      <h1 className="text-3xl font-bold mb-6">Profile Settings</h1>
      <div className="card p-6">
        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Name</label>
            <div className="relative">
              <User className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input className="input pl-9" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input type="email" className="input pl-9" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Phone</label>
            <div className="relative">
              <Phone className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input className="input pl-9" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
            </div>
          </div>
          <button type="submit" className="btn-primary">Save Changes</button>
        </form>
      </div>
      <Link href="/account" className="btn-outline mt-4 inline-block">Back to Account</Link>
    </div>
  );
}
