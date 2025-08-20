'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { 
  ShoppingCart, 
  Package, 
  Users, 
  BarChart3, 
  Settings, 
  Heart,
  Search,
  ChevronRight,
  Star,
  Shield,
  Zap,
  Globe
} from 'lucide-react';

// Animation variants
const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

const staggerChildren = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

export default function HomePage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
      {/* Header */}
      <header className="container mx-auto px-4 py-8">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeInUp}
          className="text-center"
        >
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 dark:text-white mb-4">
            China Wholesale
            <span className="text-gradient"> Ecommerce</span>
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto">
            Complete ecommerce platform with customer and admin panels. 
            Built with Next.js 14, TypeScript, and modern web technologies.
          </p>
          
          {/* API Status Indicator */}
          <div className="inline-flex items-center space-x-2 bg-white dark:bg-gray-800 rounded-full px-4 py-2 shadow-soft border border-gray-200 dark:border-gray-700">
            <div className={`w-2 h-2 rounded-full ${process.env.NEXT_PUBLIC_USE_EXTERNAL_API === 'true' ? 'bg-green-500' : 'bg-blue-500'}`}></div>
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              {process.env.NEXT_PUBLIC_USE_EXTERNAL_API === 'true' ? 'External API' : 'Mock API'} Mode
            </span>
          </div>
        </motion.div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 pb-16">
        {/* Quick Access Cards */}
        <motion.section
          initial="hidden"
          animate="visible"
          variants={staggerChildren}
          className="grid md:grid-cols-2 gap-8 mb-16"
        >
          {/* Customer Portal */}
          <motion.div variants={fadeInUp}>
            <div className="card p-8 h-full group hover:shadow-large transition-all duration-300">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-brand-primary rounded-xl flex items-center justify-center mr-4 group-hover:scale-110 transition-transform">
                  <ShoppingCart className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Customer Portal</h2>
                  <p className="text-gray-600 dark:text-gray-300">Shop products and manage orders</p>
                </div>
              </div>
              
              <div className="space-y-3 mb-6">
                <Link href="/products" className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors group/item">
                  <span className="flex items-center">
                    <Search className="w-4 h-4 mr-3 text-gray-400" />
                    Browse Products
                  </span>
                  <ChevronRight className="w-4 h-4 text-gray-400 group-hover/item:translate-x-1 transition-transform" />
                </Link>
                
                <Link href="/cart" className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors group/item">
                  <span className="flex items-center">
                    <ShoppingCart className="w-4 h-4 mr-3 text-gray-400" />
                    Shopping Cart
                  </span>
                  <ChevronRight className="w-4 h-4 text-gray-400 group-hover/item:translate-x-1 transition-transform" />
                </Link>
                
                <Link href="/wishlist" className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors group/item">
                  <span className="flex items-center">
                    <Heart className="w-4 h-4 mr-3 text-gray-400" />
                    Wishlist
                  </span>
                  <ChevronRight className="w-4 h-4 text-gray-400 group-hover/item:translate-x-1 transition-transform" />
                </Link>
                
                <Link href="/account" className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors group/item">
                  <span className="flex items-center">
                    <Users className="w-4 h-4 mr-3 text-gray-400" />
                    My Account
                  </span>
                  <ChevronRight className="w-4 h-4 text-gray-400 group-hover/item:translate-x-1 transition-transform" />
                </Link>
              </div>
              
              <Link href="/products" className="btn-primary w-full">
                Start Shopping
              </Link>
            </div>
          </motion.div>

          {/* Admin Portal */}
          <motion.div variants={fadeInUp}>
            <div className="card p-8 h-full group hover:shadow-large transition-all duration-300">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-gray-900 dark:bg-blue-600 rounded-xl flex items-center justify-center mr-4 group-hover:scale-110 transition-transform">
                  <BarChart3 className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Admin Portal</h2>
                  <p className="text-gray-600 dark:text-gray-300">Manage store and analytics</p>
                </div>
              </div>
              
              <div className="space-y-3 mb-6">
                <Link href="/admin" className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors group/item">
                  <span className="flex items-center">
                    <BarChart3 className="w-4 h-4 mr-3 text-gray-400" />
                    Dashboard
                  </span>
                  <ChevronRight className="w-4 h-4 text-gray-400 group-hover/item:translate-x-1 transition-transform" />
                </Link>
                
                <Link href="/admin/products" className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors group/item">
                  <span className="flex items-center">
                    <Package className="w-4 h-4 mr-3 text-gray-400" />
                    Products
                  </span>
                  <ChevronRight className="w-4 h-4 text-gray-400 group-hover/item:translate-x-1 transition-transform" />
                </Link>
                
                <Link href="/admin/orders" className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors group/item">
                  <span className="flex items-center">
                    <ShoppingCart className="w-4 h-4 mr-3 text-gray-400" />
                    Orders
                  </span>
                  <ChevronRight className="w-4 h-4 text-gray-400 group-hover/item:translate-x-1 transition-transform" />
                </Link>
                
                <Link href="/admin/customers" className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors group/item">
                  <span className="flex items-center">
                    <Users className="w-4 h-4 mr-3 text-gray-400" />
                    Customers
                  </span>
                  <ChevronRight className="w-4 h-4 text-gray-400 group-hover/item:translate-x-1 transition-transform" />
                </Link>
              </div>
              
              <Link href="/admin" className="btn-secondary w-full">
                Access Admin
              </Link>
            </div>
          </motion.div>
        </motion.section>

        {/* Features Grid */}
        <motion.section
          initial="hidden"
          animate="visible"
          variants={staggerChildren}
          className="mb-16"
        >
          <motion.div variants={fadeInUp} className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Platform Features
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Everything you need for a complete ecommerce experience
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: <Zap className="w-6 h-6" />,
                title: "Fast Performance",
                description: "Built with Next.js 14 and optimized for speed"
              },
              {
                icon: <Shield className="w-6 h-6" />,
                title: "Secure & Reliable",
                description: "Enterprise-grade security and error handling"
              },
              {
                icon: <Globe className="w-6 h-6" />,
                title: "API Ready",
                description: "Seamless switching between mock and real APIs"
              },
              {
                icon: <Star className="w-6 h-6" />,
                title: "Modern UI",
                description: "Beautiful, responsive design with dark mode"
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                variants={fadeInUp}
                className="card p-6 text-center group hover:shadow-medium transition-all duration-300"
              >
                <div className="w-12 h-12 bg-brand-primary/10 dark:bg-blue-500/10 rounded-xl flex items-center justify-center mx-auto mb-4 text-brand-primary dark:text-blue-500 group-hover:scale-110 transition-transform">
                  {feature.icon}
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Development Status */}
        <motion.section
          initial="hidden"
          animate="visible"
          variants={fadeInUp}
          className="text-center"
        >
          <div className="card p-8 bg-gradient-to-r from-brand-primary/5 to-blue-500/5 dark:from-blue-500/10 dark:to-brand-primary/10">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Development Ready
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-6 max-w-2xl mx-auto">
              This platform is built with a comprehensive roadmap, API-ready architecture, and systematic task tracking. 
              Follow the development guide to build your complete ecommerce solution.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/docs" className="btn-outline">
                View Documentation
              </Link>
              <Link href="/roadmap" className="btn-primary">
                Development Roadmap
              </Link>
            </div>
          </div>
        </motion.section>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-200 dark:border-gray-700 py-8">
        <div className="container mx-auto px-4 text-center">
          <p className="text-gray-600 dark:text-gray-300">
            © 2025 China Wholesale Ecommerce Platform. Built with Next.js 14 and TypeScript.
          </p>
        </div>
      </footer>
    </div>
  );
}


