import type { Metadata } from 'next';
import { Inter, Poppins } from 'next/font/google';
import { Toaster } from 'react-hot-toast';
import './globals.css';
import Header from '@/components/layout/Header';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800', '900'],
  variable: '--font-poppins',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'China Wholesale - Ecommerce Platform',
  description: 'Complete ecommerce platform with customer and admin panels for China Wholesale business.',
  keywords: 'china wholesale, ecommerce, trading, products, admin panel, customer portal',
  authors: [{ name: 'China Wholesale Dev Team' }],
  creator: 'China Wholesale',
  publisher: 'China Wholesale',
  robots: 'index, follow',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://chinawholesale.com',
    title: 'China Wholesale - Ecommerce Platform',
    description: 'Complete ecommerce platform with customer and admin panels for China Wholesale business.',
    siteName: 'China Wholesale',
    images: [
      {
        url: '/images/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'China Wholesale Ecommerce Platform',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'China Wholesale - Ecommerce Platform',
    description: 'Complete ecommerce platform with customer and admin panels for China Wholesale business.',
    images: ['/images/twitter-image.jpg'],
    creator: '@chinawholesale',
  },
  manifest: '/manifest.json',
  icons: {
    icon: [
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
    ],
    other: [
      { rel: 'mask-icon', url: '/safari-pinned-tab.svg', color: '#E3431F' },
    ],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${poppins.variable}`}>
      <head>
        {/* Additional meta tags */}
        <meta name="format-detection" content="telephone=no" />
        <meta name="msapplication-TileColor" content="#E3431F" />
        <meta name="msapplication-config" content="/browserconfig.xml" />
        
        {/* Preconnect to external domains for performance */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        
        {/* DNS prefetch for common domains */}
        <link rel="dns-prefetch" href="//www.google-analytics.com" />
        <link rel="dns-prefetch" href="//cdn.jsdelivr.net" />
        
        {/* Viewport & Theme Color moved from metadata for Next.js 14 compatibility */}
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
        <meta name="theme-color" media="(prefers-color-scheme: light)" content="#E3431F" />
        <meta name="theme-color" media="(prefers-color-scheme: dark)" content="#3b82f6" />
      </head>
      <body className={`${inter.className} antialiased`}>
        {/* Skip to main content for accessibility */}
        <a 
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-brand-primary text-white px-4 py-2 rounded-lg z-50"
        >
          Skip to main content
        </a>

        {/* Header with navigation */}
        <Header />

        {/* Main application content */}
        <div id="main-content" className="min-h-screen flex flex-col">
          {children}
        </div>

        {/* Global toast notifications */}
        <Toaster
          position="top-right"
          reverseOrder={false}
          gutter={8}
          containerClassName=""
          containerStyle={{}}
          toastOptions={{
            // Default options
            className: '',
            duration: 4000,
            style: {
              background: '#363636',
              color: '#fff',
            },
            // Success
            success: {
              duration: 3000,
              iconTheme: {
                primary: '#10B981',
                secondary: '#fff',
              },
              style: {
                background: '#10B981',
                color: '#fff',
              },
            },
            // Error
            error: {
              duration: 5000,
              iconTheme: {
                primary: '#EF4444',
                secondary: '#fff',
              },
              style: {
                background: '#EF4444',
                color: '#fff',
              },
            },
            // Loading
            loading: {
              duration: Infinity,
              iconTheme: {
                primary: '#3B82F6',
                secondary: '#fff',
              },
              style: {
                background: '#3B82F6',
                color: '#fff',
              },
            },
          }}
        />

        {/* Development helpers - only in development */}
        {process.env.NODE_ENV === 'development' && (
          <div className="fixed bottom-4 left-4 z-50">
            <div className="bg-black text-white text-xs px-2 py-1 rounded opacity-50">
              {process.env.NEXT_PUBLIC_USE_EXTERNAL_API === 'true' ? 'External API' : 'Mock API'}
            </div>
          </div>
        )}
      </body>
    </html>
  );
}


