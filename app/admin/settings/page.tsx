'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Settings, Store, Truck, CreditCard, Globe, Shield, Bell, Palette } from 'lucide-react';
import Link from 'next/link';

interface StoreSettings {
  storeName: string;
  storeEmail: string;
  storePhone: string;
  storeAddress: string;
  currency: string;
  timezone: string;
  language: string;
}

interface ShippingSettings {
  freeShippingThreshold: number;
  flatRate: number;
  expressShipping: number;
  internationalShipping: number;
}

interface PaymentSettings {
  stripeEnabled: boolean;
  paypalEnabled: boolean;
  alipayEnabled: boolean;
  wechatEnabled: boolean;
}

const mockStoreSettings: StoreSettings = {
  storeName: 'China Wholesale',
  storeEmail: 'admin@chinawholesale.com',
  storePhone: '+86 138 0000 0000',
  storeAddress: '123 Silk Road, Guangzhou, China',
  currency: 'USD',
  timezone: 'Asia/Shanghai',
  language: 'English'
};

const mockShippingSettings: ShippingSettings = {
  freeShippingThreshold: 100,
  flatRate: 15,
  expressShipping: 25,
  internationalShipping: 50
};

const mockPaymentSettings: PaymentSettings = {
  stripeEnabled: true,
  paypalEnabled: true,
  alipayEnabled: true,
  wechatEnabled: true
};

export default function AdminSettingsPage() {
  const [storeSettings, setStoreSettings] = useState<StoreSettings>(mockStoreSettings);
  const [shippingSettings, setShippingSettings] = useState<ShippingSettings>(mockShippingSettings);
  const [paymentSettings, setPaymentSettings] = useState<PaymentSettings>(mockPaymentSettings);
  const [activeTab, setActiveTab] = useState('store');

  const tabs = [
    { id: 'store', label: 'Store Settings', icon: Store },
    { id: 'shipping', label: 'Shipping', icon: Truck },
    { id: 'payment', label: 'Payment', icon: CreditCard },
    { id: 'general', label: 'General', icon: Settings },
  ];

  const currencies = ['USD', 'EUR', 'GBP', 'CNY', 'JPY'];
  const timezones = ['Asia/Shanghai', 'UTC', 'America/New_York', 'Europe/London'];
  const languages = ['English', 'Chinese', 'Spanish', 'French'];

  const handleStoreSettingsSave = () => {
    // TODO: Implement API call to save store settings
    console.log('Saving store settings:', storeSettings);
  };

  const handleShippingSettingsSave = () => {
    // TODO: Implement API call to save shipping settings
    console.log('Saving shipping settings:', shippingSettings);
  };

  const handlePaymentSettingsSave = () => {
    // TODO: Implement API call to save payment settings
    console.log('Saving payment settings:', paymentSettings);
  };

  return (
    <div className="container py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-gray-600 dark:text-gray-300">Configure your store settings and preferences</p>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-gray-200 dark:border-gray-700 mb-8">
        <nav className="flex space-x-8">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-brand-primary text-brand-primary'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Store Settings Tab */}
      {activeTab === 'store' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
          <div className="card p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <Store className="w-5 h-5 mr-2" />
              Store Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Store Name</label>
                <input
                  type="text"
                  className="input w-full"
                  value={storeSettings.storeName}
                  onChange={(e) => setStoreSettings({ ...storeSettings, storeName: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Store Email</label>
                <input
                  type="email"
                  className="input w-full"
                  value={storeSettings.storeEmail}
                  onChange={(e) => setStoreSettings({ ...storeSettings, storeEmail: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Store Phone</label>
                <input
                  type="tel"
                  className="input w-full"
                  value={storeSettings.storePhone}
                  onChange={(e) => setStoreSettings({ ...storeSettings, storePhone: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Currency</label>
                <select
                  className="input w-full"
                  value={storeSettings.currency}
                  onChange={(e) => setStoreSettings({ ...storeSettings, currency: e.target.value })}
                >
                  {currencies.map(currency => (
                    <option key={currency} value={currency}>{currency}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Timezone</label>
                <select
                  className="input w-full"
                  value={storeSettings.timezone}
                  onChange={(e) => setStoreSettings({ ...storeSettings, timezone: e.target.value })}
                >
                  {timezones.map(timezone => (
                    <option key={timezone} value={timezone}>{timezone}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Language</label>
                <select
                  className="input w-full"
                  value={storeSettings.language}
                  onChange={(e) => setStoreSettings({ ...storeSettings, language: e.target.value })}
                >
                  {languages.map(language => (
                    <option key={language} value={language}>{language}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="mt-4">
              <label className="block text-sm font-medium mb-1">Store Address</label>
              <textarea
                className="input w-full h-20"
                value={storeSettings.storeAddress}
                onChange={(e) => setStoreSettings({ ...storeSettings, storeAddress: e.target.value })}
              />
            </div>
            <div className="mt-6">
              <button onClick={handleStoreSettingsSave} className="btn-primary">
                Save Store Settings
              </button>
            </div>
          </div>
        </motion.div>
      )}

      {/* Shipping Settings Tab */}
      {activeTab === 'shipping' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
          <div className="card p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <Truck className="w-5 h-5 mr-2" />
              Shipping Configuration
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Free Shipping Threshold ($)</label>
                <input
                  type="number"
                  className="input w-full"
                  value={shippingSettings.freeShippingThreshold}
                  onChange={(e) => setShippingSettings({ ...shippingSettings, freeShippingThreshold: Number(e.target.value) })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Flat Rate Shipping ($)</label>
                <input
                  type="number"
                  className="input w-full"
                  value={shippingSettings.flatRate}
                  onChange={(e) => setShippingSettings({ ...shippingSettings, flatRate: Number(e.target.value) })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Express Shipping ($)</label>
                <input
                  type="number"
                  className="input w-full"
                  value={shippingSettings.expressShipping}
                  onChange={(e) => setShippingSettings({ ...shippingSettings, expressShipping: Number(e.target.value) })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">International Shipping ($)</label>
                <input
                  type="number"
                  className="input w-full"
                  value={shippingSettings.internationalShipping}
                  onChange={(e) => setShippingSettings({ ...shippingSettings, internationalShipping: Number(e.target.value) })}
                />
              </div>
            </div>
            <div className="mt-6">
              <button onClick={handleShippingSettingsSave} className="btn-primary">
                Save Shipping Settings
              </button>
            </div>
          </div>
        </motion.div>
      )}

      {/* Payment Settings Tab */}
      {activeTab === 'payment' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
          <div className="card p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <CreditCard className="w-5 h-5 mr-2" />
              Payment Methods
            </h3>
            <div className="space-y-4">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  className="mr-3"
                  checked={paymentSettings.stripeEnabled}
                  onChange={(e) => setPaymentSettings({ ...paymentSettings, stripeEnabled: e.target.checked })}
                />
                <span>Enable Stripe Payments</span>
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  className="mr-3"
                  checked={paymentSettings.paypalEnabled}
                  onChange={(e) => setPaymentSettings({ ...paymentSettings, paypalEnabled: e.target.checked })}
                />
                <span>Enable PayPal</span>
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  className="mr-3"
                  checked={paymentSettings.alipayEnabled}
                  onChange={(e) => setPaymentSettings({ ...paymentSettings, alipayEnabled: e.target.checked })}
                />
                <span>Enable Alipay</span>
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  className="mr-3"
                  checked={paymentSettings.wechatEnabled}
                  onChange={(e) => setPaymentSettings({ ...paymentSettings, wechatEnabled: e.target.checked })}
                />
                <span>Enable WeChat Pay</span>
              </label>
            </div>
            <div className="mt-6">
              <button onClick={handlePaymentSettingsSave} className="btn-primary">
                Save Payment Settings
              </button>
            </div>
          </div>
        </motion.div>
      )}

      {/* General Settings Tab */}
      {activeTab === 'general' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="card p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <Globe className="w-5 h-5 mr-2" />
                Localization
              </h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">
                Configure language and regional settings for your store.
              </p>
              <button className="btn-outline">Configure</button>
            </div>

            <div className="card p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <Shield className="w-5 h-5 mr-2" />
                Security
              </h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">
                Manage security settings and access controls.
              </p>
              <button className="btn-outline">Configure</button>
            </div>

            <div className="card p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <Bell className="w-5 h-5 mr-2" />
                Notifications
              </h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">
                Set up email and push notification preferences.
              </p>
              <button className="btn-outline">Configure</button>
            </div>

            <div className="card p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <Palette className="w-5 h-5 mr-2" />
                Appearance
              </h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">
                Customize store theme and branding.
              </p>
              <button className="btn-outline">Configure</button>
            </div>
          </div>
        </motion.div>
      )}

      <div className="mt-6">
        <Link href="/admin" className="btn-outline">Back to Admin Dashboard</Link>
      </div>
    </div>
  );
}
