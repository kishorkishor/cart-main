'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { 
  Heart, 
  ShoppingCart, 
  Trash2, 
  ArrowLeft, 
  Eye,
  Share2,
  Filter,
  SortAsc,
  Search
} from 'lucide-react';
import { useCart } from '@/lib/adapters/cart';
import { useWishlist } from '@/lib/adapters/wishlist';
import { toast } from 'react-hot-toast';
import { formatCurrency } from '@/lib/utils';

interface WishlistItem {
  id: string;
  productId: string;
  title: string;
  price: number;
  salePrice?: number;
  image: string;
  shortDescription: string;
  category: string | { id: string; name: string; slug: string };
  rating: number;
  addedAt: Date;
}

export default function WishlistPage() {
  const [mounted, setMounted] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState<'addedAt' | 'price' | 'name' | 'rating'>('addedAt');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  const { add: addToCart } = useCart();
  const { items: wishlistItems, remove: removeFromWishlist, clear: clearWishlist } = useWishlist();

  useEffect(() => {
    setMounted(true);
  }, []);



  const handleRemoveFromWishlist = (productId: string) => {
    removeFromWishlist(productId);
    toast.success('Item removed from wishlist');
  };

  const moveToCart = (item: WishlistItem) => {
    try {
      addToCart({
        productId: item.productId,
        title: item.title,
        price: item.salePrice || item.price,
        image: item.image,
        quantity: 1
      });
      
      // Remove from wishlist
      removeFromWishlist(item.id);
      toast.success('Item moved to cart');
    } catch (error) {
      toast.error('Failed to add item to cart');
    }
  };

  const handleClearWishlist = () => {
    clearWishlist();
    toast.success('Wishlist cleared');
  };

  const shareWishlist = () => {
    if (navigator.share) {
      navigator.share({
        title: 'My Wishlist - China Wholesale',
        text: 'Check out my wishlist on China Wholesale!',
        url: window.location.href
      });
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      toast.success('Wishlist link copied to clipboard');
    }
  };

  // Filter and sort wishlist items
  const filteredAndSortedItems = wishlistItems
    .filter(item => {
      const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           item.shortDescription.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === 'all' || 
        (typeof item.category === 'string' ? item.category === selectedCategory : item.category?.name === selectedCategory);
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      let comparison = 0;
      
      switch (sortBy) {
        case 'addedAt':
          // Ensure addedAt is a Date object
          const dateA = a.addedAt instanceof Date ? a.addedAt : new Date(a.addedAt);
          const dateB = b.addedAt instanceof Date ? b.addedAt : new Date(b.addedAt);
          comparison = dateA.getTime() - dateB.getTime();
          break;
        case 'price':
          comparison = (a.salePrice || a.price) - (b.salePrice || b.price);
          break;
        case 'name':
          comparison = a.title.localeCompare(b.title);
          break;
        case 'rating':
          comparison = a.rating - b.rating;
          break;
      }
      
      return sortOrder === 'asc' ? comparison : -comparison;
    });

  // Get unique categories for filter
  const categories = ['all', ...Array.from(new Set(wishlistItems.map(item => 
    typeof item.category === 'string' ? item.category : item.category?.name || 'Unknown'
  )))] as string[];

  if (!mounted) {
    return (
      <div className="container py-12">
        <div className="max-w-6xl mx-auto">
          <div className="skeleton h-8 w-48 mb-8"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="skeleton h-80 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }



  if (wishlistItems.length === 0) {
    return (
      <div className="container py-12">
        <div className="max-w-2xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="card p-12"
          >
            <Heart className="w-16 h-16 text-gray-400 mx-auto mb-6" />
            <h1 className="text-2xl font-bold mb-2">Your wishlist is empty</h1>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              Start building your wishlist by browsing our products and adding items you love.
            </p>
            <div className="space-y-3">
              <Link href="/products" className="btn-primary w-full">
                Browse Products
              </Link>
              <Link href="/" className="btn-outline w-full">
                Back to Home
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-12">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <Link 
              href="/" 
              className="inline-flex items-center text-gray-600 dark:text-gray-300 hover:text-brand-primary transition-colors mb-2"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Link>
            <h1 className="text-3xl font-bold">My Wishlist</h1>
            <p className="text-gray-600 dark:text-gray-300">
              {wishlistItems.length} {wishlistItems.length === 1 ? 'item' : 'items'} saved
            </p>
          </div>
          
          <div className="flex items-center gap-3">
                          <button
                onClick={shareWishlist}
                className="btn-outline"
                title="Share wishlist"
              >
                <Share2 className="w-4 h-4 mr-2" />
                Share
              </button>
              <button
                onClick={handleClearWishlist}
                className="btn-outline text-red-600 border-red-300 hover:bg-red-50 dark:hover:bg-red-900/20"
                title="Clear all items"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Clear All
              </button>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="card p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search */}
            <div className="md:col-span-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search wishlist items..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="input pl-10 w-full"
                />
              </div>
            </div>

            {/* Category Filter */}
            <div>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="input w-full"
              >
                {categories.map(category => (
                  <option key={category} value={category}>
                    {category === 'all' ? 'All Categories' : category}
                  </option>
                ))}
              </select>
            </div>

            {/* Sort */}
            <div>
              <select
                value={`${sortBy}-${sortOrder}`}
                onChange={(e) => {
                  const [newSortBy, newSortOrder] = e.target.value.split('-') as [any, 'asc' | 'desc'];
                  setSortBy(newSortBy);
                  setSortOrder(newSortOrder);
                }}
                className="input w-full"
              >
                <option value="addedAt-desc">Newest First</option>
                <option value="addedAt-asc">Oldest First</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="name-asc">Name: A to Z</option>
                <option value="name-desc">Name: Z to A</option>
                <option value="rating-desc">Highest Rated</option>
                <option value="rating-asc">Lowest Rated</option>
              </select>
            </div>
          </div>
        </div>

                                   {/* Wishlist Items */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
           <AnimatePresence>
             {filteredAndSortedItems.map((item, index) => (
               <motion.div
                 key={item.id}
                 initial={{ opacity: 0, y: 20 }}
                 animate={{ opacity: 1, y: 0 }}
                 exit={{ opacity: 0, y: -20 }}
                 transition={{ delay: index * 0.1 }}
                 className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 dark:border-gray-700 overflow-hidden group"
               >
                 <div className="flex flex-col md:flex-row h-full">
                   {/* Product Image Section */}
                   <div className="relative w-full md:w-48 h-48 md:h-auto bg-gray-50 dark:bg-gray-700 overflow-hidden">
                     <img
                       src={item.image || '/images/products/placeholder.jpg'}
                       alt={item.title}
                       className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                       onError={(e) => {
                         const el = e.currentTarget as HTMLImageElement;
                         if (el.src !== '/images/products/placeholder.jpg') {
                           el.src = '/images/products/placeholder.jpg';
                         }
                       }}
                     />
                     
                     {/* Sale Badge */}
                     {item.salePrice && (
                       <div className="absolute top-3 left-3 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs px-3 py-1.5 rounded-full font-semibold shadow-lg">
                         SALE
                       </div>
                     )}
                     
                     {/* Remove Button */}
                     <button
                       onClick={() => handleRemoveFromWishlist(item.productId)}
                       className="absolute top-3 right-3 p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-lg hover:bg-red-50 hover:scale-110 transition-all duration-200"
                       title="Remove from wishlist"
                     >
                       <Trash2 className="w-4 h-4 text-red-500" />
                     </button>
                   </div>

                   {/* Product Info Section */}
                   <div className="flex-1 p-6 flex flex-col justify-between">
                     <div className="space-y-3">
                       {/* Title and Category */}
                       <div>
                         <Link 
                           href={`/products/${item.productId}`}
                           className="text-xl font-bold text-gray-900 dark:text-white hover:text-brand-primary transition-colors line-clamp-2 leading-tight"
                         >
                           {item.title}
                         </Link>
                         <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                           {typeof item.category === 'string' ? item.category : item.category?.name || 'General'}
                         </p>
                       </div>

                       {/* Description */}
                       <p className="text-gray-600 dark:text-gray-300 line-clamp-2 text-sm leading-relaxed">
                         {item.shortDescription}
                       </p>

                       {/* Rating */}
                       <div className="flex items-center gap-2">
                         <div className="flex items-center">
                           {Array.from({ length: 5 }).map((_, i) => (
                             <svg
                               key={i}
                               className={`w-4 h-4 ${
                                 i < Math.floor(item.rating) 
                                   ? 'text-yellow-400 fill-current' 
                                   : 'text-gray-300 dark:text-gray-600'
                               }`}
                               viewBox="0 0 20 20"
                             >
                               <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                             </svg>
                           ))}
                         </div>
                         <span className="text-sm text-gray-600 dark:text-gray-400 font-medium">
                           {item.rating.toFixed(1)}
                         </span>
                         <span className="text-xs text-gray-400 dark:text-gray-500">•</span>
                         <span className="text-xs text-gray-400 dark:text-gray-500">
                           Added {(item.addedAt instanceof Date ? item.addedAt : new Date(item.addedAt)).toLocaleDateString()}
                         </span>
                       </div>
                     </div>

                     {/* Price and Actions */}
                     <div className="mt-6 space-y-4">
                                               {/* Price Section */}
                        <div className="flex items-baseline justify-between">
                          <div className="flex items-baseline gap-3">
                            <span className="text-2xl font-bold text-brand-primary">
                              {formatCurrency(item.salePrice || item.price)}
                            </span>
                            {item.salePrice && (
                              <span className="text-lg text-gray-500 line-through">
                                {formatCurrency(item.price)}
                              </span>
                            )}
                          </div>
                          
                          {/* Quick Actions */}
                          <div className="flex gap-2">
                            <Link
                              href={`/products/${item.productId}`}
                              className="p-2.5 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                              title="View details"
                            >
                              <Eye className="w-4 h-4 text-gray-600 dark:text-gray-300" />
                            </Link>
                          </div>
                        </div>

                        {/* Main Action Button */}
                        <button
                          onClick={() => moveToCart(item)}
                          className="w-full bg-gradient-to-r from-brand-primary to-brand-secondary hover:from-brand-secondary hover:to-brand-primary text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 transform hover:scale-[1.02] hover:shadow-lg active:scale-[0.98]"
                        >
                          <ShoppingCart className="w-5 h-5 mr-2 inline" />
                          Move to Cart
                        </button>                       
                     </div>
                   </div>
                 </div>
               </motion.div>
             ))}
           </AnimatePresence>
         </div>

        {/* Empty State for Filtered Results */}
        {filteredAndSortedItems.length === 0 && wishlistItems.length > 0 && (
          <div className="text-center py-12">
            <Heart className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">No items match your search</h3>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              Try adjusting your search terms or filters.
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('all');
              }}
              className="btn-outline"
            >
              Clear Filters
            </button>
          </div>
        )}

        {/* Summary */}
        <div className="mt-8 text-center">
          <p className="text-gray-600 dark:text-gray-400">
            {filteredAndSortedItems.length} of {wishlistItems.length} items shown
          </p>
        </div>
      </div>
    </div>
  );
}
