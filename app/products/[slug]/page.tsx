'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useParams, useRouter } from 'next/navigation';
import { ShoppingCart, Heart, Star, Truck, Shield, RefreshCw, ArrowLeft } from 'lucide-react';
import { useCart } from '@/lib/adapters/cart';
import { getProduct, getProducts } from '@/lib/adapters/products';
import { toast } from 'react-hot-toast';
import Link from 'next/link';

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;
  
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [relatedProducts, setRelatedProducts] = useState<any[]>([]);
  const [wishlist, setWishlist] = useState<Set<string>>(new Set());
  
  const addToCart = useCart((state) => state.add);

  useEffect(() => {
    const loadProduct = async () => {
      try {
        setLoading(true);
        const res = await getProduct(slug);
        setProduct(res.data);
        
        // Load related products from same category
        if (res.data.category) {
          const related = await getProducts({ 
            category: res.data.category.slug, 
            limit: 4,
            exclude: res.data.id 
          });
          setRelatedProducts(related.data.filter(p => p.id !== res.data.id));
        }
      } catch (e: any) {
        // Fallback to direct API call
        try {
          const r = await fetch(`/api/products/${slug}`);
          if (r.ok) {
            const data = await r.json();
            setProduct(data.data);
            
            // Load related products
            if (data.data.category) {
              const relatedRes = await fetch(`/api/products?category=${data.data.category.slug}&limit=4`);
              if (relatedRes.ok) {
                const relatedData = await relatedRes.json();
                setRelatedProducts(relatedData.data.filter((p: any) => p.id !== data.data.id));
              }
            }
          } else {
            setError('Product not found');
          }
        } catch {
          setError(e?.message || 'Failed to load product');
        }
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      loadProduct();
    }
  }, [slug]);

  const handleAddToCart = () => {
    if (!product) return;
    
    addToCart({
      productId: product.id,
      title: product.title,
      price: product.salePrice ?? product.price,
      quantity,
      image: product.images?.[0]?.url,
    });
    
    toast.success(`Added ${quantity} ${quantity === 1 ? 'item' : 'items'} to cart`);
  };

  const toggleWishlist = () => {
    setWishlist(prev => {
      const newSet = new Set(prev);
      if (newSet.has(product.id)) {
        newSet.delete(product.id);
        toast.success('Removed from wishlist');
      } else {
        newSet.add(product.id);
        toast.success('Added to wishlist');
      }
      return newSet;
    });
  };

  if (loading) {
    return (
      <div className="container py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div className="skeleton h-96 rounded-lg"></div>
          <div className="space-y-4">
            <div className="skeleton h-8 w-3/4"></div>
            <div className="skeleton h-6 w-1/2"></div>
            <div className="skeleton h-4 w-full"></div>
            <div className="skeleton h-4 w-2/3"></div>
            <div className="skeleton h-12 w-1/3"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="container py-12">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Product Not Found</h1>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            The product you're looking for doesn't exist or has been removed.
          </p>
          <Link href="/products" className="btn-primary">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Products
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-12">
      {/* Breadcrumb */}
      <nav className="mb-8">
        <ol className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
          <li>
            <Link href="/" className="hover:text-brand-primary">Home</Link>
          </li>
          <li>/</li>
          <li>
            <Link href="/products" className="hover:text-brand-primary">Products</Link>
          </li>
          <li>/</li>
          <li>
            <Link href={`/products?category=${product.category?.slug}`} className="hover:text-brand-primary">
              {product.category?.name}
            </Link>
          </li>
          <li>/</li>
          <li className="text-gray-900 dark:text-white font-medium">{product.title}</li>
        </ol>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Product Images */}
        <div className="space-y-4">
          <div className="aspect-square overflow-hidden rounded-lg border border-gray-200 dark:border-gray-700">
            <img
              src={product.images?.[selectedImage]?.url || '/images/products/placeholder.jpg'}
              alt={product.title}
              className="w-full h-full object-cover"
              onError={(e) => {
                const el = e.currentTarget as HTMLImageElement;
                el.src = '/images/products/placeholder.jpg';
              }}
            />
          </div>
          
          {/* Thumbnail Gallery */}
          {product.images && product.images.length > 1 && (
            <div className="flex space-x-2">
              {product.images.map((image: any, index: number) => (
                <button
                  key={image.id}
                  onClick={() => setSelectedImage(index)}
                  className={`w-20 h-20 rounded-lg border-2 overflow-hidden ${
                    selectedImage === index 
                      ? 'border-brand-primary' 
                      : 'border-gray-200 dark:border-gray-700'
                  }`}
                >
                  <img
                    src={image.url}
                    alt={`${product.title} - Image ${index + 1}`}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      const el = e.currentTarget as HTMLImageElement;
                      el.src = '/images/products/placeholder.jpg';
                    }}
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold mb-2">{product.title}</h1>
            <p className="text-gray-600 dark:text-gray-300 mb-4">{product.shortDescription || product.description}</p>
            
            {/* Rating */}
            <div className="flex items-center space-x-2 mb-4">
              <div className="flex items-center">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`w-5 h-5 ${
                      i < Math.floor(product.averageRating || 0)
                        ? 'text-yellow-400 fill-current'
                        : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>
              <span className="text-sm text-gray-600 dark:text-gray-400">
                ({product.reviewCount || 0} reviews)
              </span>
            </div>

            {/* Price */}
            <div className="flex items-baseline space-x-3 mb-6">
              <span className="text-3xl font-bold text-brand-primary">
                ${(product.salePrice ?? product.price).toFixed(2)}
              </span>
              {product.salePrice && (
                <span className="text-xl text-gray-500 line-through">
                  ${product.price.toFixed(2)}
                </span>
              )}
              {product.salePrice && (
                <span className="text-sm bg-red-100 text-red-800 px-2 py-1 rounded-full">
                  Save ${(product.price - product.salePrice).toFixed(2)}
                </span>
              )}
            </div>
          </div>

          {/* Stock Status */}
          <div className="flex items-center space-x-4 text-sm">
            <span className={`flex items-center space-x-2 ${
              product.stock > 0 ? 'text-green-600' : 'text-red-600'
            }`}>
              <div className={`w-2 h-2 rounded-full ${
                product.stock > 0 ? 'bg-green-500' : 'bg-red-500'
              }`} />
              {product.stock > 0 ? `In Stock (${product.stock})` : 'Out of Stock'}
            </span>
            {product.stock > 0 && product.stock <= (product.lowStockThreshold || 10) && (
              <span className="text-orange-600">Low Stock</span>
            )}
          </div>

          {/* Add to Cart Section */}
          <div className="space-y-4">
            <div className="flex items-center space-x-4">
              <label className="text-sm font-medium">Quantity:</label>
              <div className="flex items-center border border-gray-300 dark:border-gray-600 rounded-lg">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  disabled={quantity <= 1}
                >
                  -
                </button>
                <span className="px-4 py-2 min-w-[3rem] text-center">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  disabled={product.stock <= 0 || quantity >= product.stock}
                >
                  +
                </button>
              </div>
            </div>

            <div className="flex space-x-3">
              <button
                onClick={handleAddToCart}
                disabled={product.stock <= 0}
                className="btn-primary flex-1 flex items-center justify-center space-x-2"
              >
                <ShoppingCart className="w-5 h-5" />
                <span>Add to Cart</span>
              </button>
              
              <button
                onClick={toggleWishlist}
                className={`btn-outline p-3 ${
                  wishlist.has(product.id) ? 'text-red-600 border-red-300' : ''
                }`}
                title={wishlist.has(product.id) ? 'Remove from Wishlist' : 'Add to Wishlist'}
              >
                <Heart className={`w-5 h-5 ${wishlist.has(product.id) ? 'fill-current' : ''}`} />
              </button>
            </div>
          </div>

          {/* Product Features */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-6 border-t border-gray-200 dark:border-gray-700">
            <div className="flex items-center space-x-3">
              <Truck className="w-5 h-5 text-brand-primary" />
              <div>
                <div className="font-medium">Free Shipping</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">On orders over $50</div>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Shield className="w-5 h-5 text-brand-primary" />
              <div>
                <div className="font-medium">Secure Payment</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">100% secure checkout</div>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <RefreshCw className="w-5 h-5 text-brand-primary" />
              <div>
                <div className="font-medium">Easy Returns</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">30-day return policy</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Product Details Tabs */}
      <div className="mt-16">
        <div className="border-b border-gray-200 dark:border-gray-700">
          <nav className="flex space-x-8">
            <button className="py-4 px-1 border-b-2 border-brand-primary text-brand-primary font-medium">
              Description
            </button>
            <button className="py-4 px-1 border-b-2 border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 font-medium">
              Specifications
            </button>
            <button className="py-4 px-1 border-b-2 border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 font-medium">
              Reviews
            </button>
          </nav>
        </div>

        <div className="py-8">
          <div className="prose max-w-none">
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              {product.description}
            </p>
            
            {/* Product Attributes */}
            {product.attributes && product.attributes.length > 0 && (
              <div className="mt-6">
                <h3 className="text-lg font-semibold mb-4">Product Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {product.attributes.map((attr: any, index: number) => (
                    <div key={index} className="flex justify-between py-2 border-b border-gray-100 dark:border-gray-800">
                      <span className="font-medium text-gray-700 dark:text-gray-300">{attr.name}</span>
                      <span className="text-gray-600 dark:text-gray-400">{attr.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <div className="mt-16">
          <h2 className="text-2xl font-bold mb-8">Related Products</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedProducts.map((relatedProduct) => (
              <motion.div
                key={relatedProduct.id}
                className="card group overflow-hidden"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <Link href={`/products/${relatedProduct.slug || relatedProduct.id}`}>
                  <div className="aspect-square overflow-hidden">
                    <img
                      src={relatedProduct.images?.[0]?.url || '/images/products/placeholder.jpg'}
                      alt={relatedProduct.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      onError={(e) => {
                        const el = e.currentTarget as HTMLImageElement;
                        el.src = '/images/products/placeholder.jpg';
                      }}
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold mb-1 line-clamp-1">{relatedProduct.title}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2 mb-3">
                      {relatedProduct.shortDescription || relatedProduct.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="price">${(relatedProduct.salePrice ?? relatedProduct.price).toFixed(2)}</span>
                      {relatedProduct.salePrice && (
                        <span className="price-sale">${relatedProduct.price.toFixed(2)}</span>
                      )}
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
