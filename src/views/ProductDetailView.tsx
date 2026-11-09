/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { SEOHead } from '../components/SEOHead';
import { ProductCard } from '../components/ProductCard';
import {
  Star,
  Check,
  Heart,
  Plus,
  Minus,
  ShoppingCart,
  Zap,
  ShieldCheck,
  Sparkles,
  Award,
  Package2,
  CalendarDays,
  PlusSquare,
  BookmarkCheck,
  MessageSquareDiff
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const ProductDetailView: React.FC = () => {
  const {
    products,
    reviews,
    addReview,
    selectedProductId,
    addToCart,
    toggleWishlist,
    isInWishlist,
    setRoute
  } = useApp();

  // Find currently open product
  const product = useMemo(() => {
    return products.find((p) => p.id === selectedProductId) || products[0];
  }, [products, selectedProductId]);

  const [activeTab, setActiveTab] = useState<'desc' | 'specs' | 'reviews' | 'warranty'>('desc');
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [selectedColor, setSelectedColor] = useState(product.colors[0] || 'Default');
  const [quantity, setQuantity] = useState(1);

  // Reviews submission state
  const [newRating, setNewRating] = useState(5);
  const [newComment, setNewComment] = useState('');
  const [reviewSuccess, setReviewSuccess] = useState(false);

  // Sync image index on product shift
  React.useEffect(() => {
    setActiveImageIndex(0);
    setSelectedColor(product.colors[0] || 'Default');
    setQuantity(1);
  }, [product]);

  // Pull reviews related to current product slug
  const productReviews = useMemo(() => {
    return reviews.filter((r) => r.productId === product.id);
  }, [reviews, product]);

  // Calculate save percentages
  const discountPercent = product.discountPrice
    ? Math.round(((product.regularPrice - product.discountPrice) / product.regularPrice) * 100)
    : 0;

  // Calculate recommendations (matching category or brand)
  const relatedProducts = useMemo(() => {
    return products
      .filter((p) => p.id !== product.id && (p.categoryId === product.categoryId || p.brandId === product.brandId))
      .slice(0, 4);
  }, [products, product]);

  // Frequently Bought Together Bundle configuration
  // Grab another random product from accessories or general to bundle
  const bundleProduct = useMemo(() => {
    return products.find((p) => p.id !== product.id && p.categoryId === 'accessories') || products[products.length - 1];
  }, [products, product]);

  const totalBundlePrice = useMemo(() => {
    const mainP = product.discountPrice || product.regularPrice;
    const bundleP = bundleProduct.discountPrice || bundleProduct.regularPrice;
    return mainP + bundleP;
  }, [product, bundleProduct]);

  const handleAddToCart = () => {
    addToCart(product, quantity, selectedColor);
  };

  const handleBuyNow = () => {
    addToCart(product, quantity, selectedColor);
    setRoute('checkout');
  };

  const handleAddBundleToCart = () => {
    addToCart(product, 1, selectedColor);
    addToCart(bundleProduct, 1, bundleProduct.colors[0] || 'Default');
    setRoute('cart');
  };

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newComment.trim()) {
      addReview(product.id, newRating, newComment);
      setNewComment('');
      setNewRating(5);
      setReviewSuccess(true);
      setTimeout(() => setReviewSuccess(false), 4000);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 md:py-12" id="product-detail-view-container">
      <SEOHead
        title={`${product.name} - Price in Bangladesh`}
        description={`Buy ${product.name} starting at low rates. Specifications: ${Object.entries(product.specs).slice(0, 3).map(([k, v]) => `${k}: ${v}`).join(', ')}. Warranty: ${product.warranty}`}
        product={product}
      />

      {/* Main product configuration grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 md:gap-14 bg-white border border-gray-100 p-6 md:p-10 rounded-3xl shadow-sm mb-12">
        
        {/* LEFT COLUMN: Gallery Port */}
        <div className="flex flex-col gap-5">
          <div className="relative aspect-square bg-gray-50 border border-gray-100 rounded-2xl overflow-hidden group shadow-sm flex items-center justify-center">
            <img
              src={product.images[activeImageIndex] || product.images[0]}
              alt={product.name}
              className="w-full h-full object-cover transition-transform duration-500 hover:scale-105 rounded-2xl referrerPolicy='no-referrer'"
              referrerPolicy="no-referrer"
            />

            {/* Campaign indicators floating inside detail gallery */}
            <div className="absolute top-4 left-4 flex flex-col gap-2">
              {product.isFlashSale && (
                <span className="bg-rose-600 text-white font-mono font-bold text-[10px] uppercase py-1 px-3 rounded-full shadow-md">
                  Active Campaign Deal
                </span>
              )}
              {discountPercent > 0 && (
                <span className="bg-amber-500 text-white font-mono font-bold text-[10px] uppercase py-1 px-3 rounded-full shadow-md">
                  Save {discountPercent}% Instant BDT
                </span>
              )}
            </div>
          </div>

          {/* Interactive thumb navigators */}
          {product.images.length > 1 && (
            <div className="flex items-center gap-3">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImageIndex(idx)}
                  className={`w-20 h-20 bg-gray-50 rounded-xl overflow-hidden border-2 transition-all cursor-pointer ${
                    activeImageIndex === idx ? 'border-primary shadow shadow-primary/10' : 'border-gray-100 opacity-80 hover:opacity-100'
                  }`}
                >
                  <img
                    src={img}
                    alt=""
                    className="w-full h-full object-cover referrerPolicy='no-referrer'"
                    referrerPolicy="no-referrer"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* RIGHT COLUMN: Product buy options */}
        <div className="flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="text-xs font-mono font-bold text-primary-hover tracking-wider uppercase bg-primary-light border border-primary-light/40 py-0.5 px-3 rounded-full">
                {product.brandName}
              </span>
              <span className="text-gray-300">|</span>
              <span className="text-xs text-gray-400 font-bold font-mono">CODE: {product.sku}</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-gray-900 leading-tight">
              {product.name}
            </h1>

            {/* Micro rating tracker */}
            <div className="flex items-center gap-2 mt-3 pb-5 border-b border-gray-100">
              <div className="flex text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={15}
                    className={i < Math.floor(product.rating) ? 'fill-amber-400' : 'text-gray-200'}
                  />
                ))}
              </div>
              <span className="text-xs font-bold text-gray-500 mt-0.5">
                {product.rating} Star Rating based on ({productReviews.length} Community Reviews)
              </span>
            </div>

            {/* Pricing metrics */}
            <div className="mt-5 flex items-baseline gap-3">
              {product.discountPrice ? (
                <>
                  <span className="text-3xl sm:text-4.5xl font-extrabold text-primary tracking-tight">
                    ৳{product.discountPrice.toLocaleString()}
                  </span>
                  <span className="text-lg sm:text-xl text-gray-400 line-through font-semibold font-mono">
                    ৳{product.regularPrice.toLocaleString()}
                  </span>
                  <span className="bg-amber-500/10 text-amber-600 text-xs font-black px-2.5 py-0.5 rounded uppercase border border-amber-500/20">
                    ৳{product.regularPrice - product.discountPrice} OFF
                  </span>
                </>
              ) : (
                <span className="text-3xl sm:text-4.5xl font-extrabold text-gray-900 tracking-tight">
                  ৳{product.regularPrice.toLocaleString()}
                </span>
              )}
            </div>

            {/* Highlighted Stock status */}
            <div className="mt-4 flex items-center gap-2.5">
              <div className={`w-2.5 h-2.5 rounded-full ${product.stock > 0 ? 'bg-emerald-500' : 'bg-red-500'}`} />
              <span className="text-xs font-bold text-gray-700 uppercase tracking-wider font-mono">
                {product.stock > 0 ? (
                  `Stock Available: ${product.stock} items left in Mirsharai store`
                ) : (
                  'Currently Out of Stock / In Procurement'
                )}
              </span>
            </div>

            <p className="text-sm sm:text-base text-gray-550 leading-relaxed mt-5 max-w-xl">
              {product.description}
            </p>

            {/* Custom Palette switches */}
            {product.colors.length > 0 && (
              <div className="mt-6">
                <span className="text-xs font-extrabold text-gray-900 uppercase tracking-widest font-mono block mb-2.5">
                  Choose Color Accent
                </span>
                <div className="flex items-center gap-2">
                  {product.colors.map((col) => (
                    <button
                      key={col}
                      onClick={() => setSelectedColor(col)}
                      className={`py-1.5 px-4 text-xs font-semibold border rounded-full transition-all cursor-pointer ${
                        selectedColor === col
                          ? 'border-primary text-primary bg-primary-light/40 shadow shadow-primary/10'
                          : 'border-gray-200 text-gray-500 bg-gray-50 hover:border-gray-300'
                      }`}
                    >
                      {col}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="mt-8 border-t border-gray-100 pt-6">
            {/* Quantity adjustment & checkout buttons */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
              
              <div className="flex items-center border border-gray-200 rounded-xl bg-gray-50 self-start sm:self-auto shrink-0">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="p-3 text-gray-500 hover:text-primary transition-colors cursor-pointer"
                  title="Decrement item count"
                >
                  <Minus size={15} strokeWidth={2.5} />
                </button>
                <span className="w-12 text-center font-bold text-gray-800 text-sm font-mono">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                  className="p-3 text-gray-500 hover:text-primary transition-colors cursor-pointer"
                  title="Increment item count"
                >
                  <Plus size={15} strokeWidth={2.5} />
                </button>
              </div>

              {/* Add to Cart Trigger */}
              <button
                onClick={handleAddToCart}
                disabled={product.stock <= 0}
                className="flex-1 bg-gray-900 hover:bg-slate-950 text-white py-3.5 px-6 font-bold text-sm tracking-wide uppercase rounded-xl flex items-center justify-center gap-2 shadow hover:shadow-md cursor-pointer disabled:bg-gray-200 disabled:text-gray-400 disabled:shadow-none"
                id="details-add-to-cart"
              >
                <ShoppingCart size={16} />
                Add to Cart Box
              </button>

              {/* Buy Now Trigger */}
              <button
                onClick={handleBuyNow}
                disabled={product.stock <= 0}
                className="flex-1 bg-primary hover:bg-primary-hover text-white py-3.5 px-6 font-bold text-sm tracking-wide uppercase rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-primary/20 hover:shadow-primary/35 cursor-pointer disabled:bg-gray-250 disabled:text-gray-400 disabled:shadow-none"
                id="details-buy-now"
              >
                <Zap size={16} className="fill-white" />
                Buy Now
              </button>

              {/* Wishlist toggle */}
              <button
                onClick={() => toggleWishlist(product.id)}
                className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                  isInWishlist(product.id)
                    ? 'border-red-200 bg-red-50 text-red-500'
                    : 'border-gray-200 text-gray-400 hover:text-red-500 hover:border-red-100 bg-white'
                }`}
                title="Save product to wishlist"
                id="wishlist-detail-toggle"
              >
                <Heart size={18} className={isInWishlist(product.id) ? 'fill-red-500' : ''} />
              </button>
            </div>

            {/* Quick credentials assuring lines */}
            <div className="mt-5 grid grid-cols-2 gap-4 text-xs text-gray-500 bg-gray-50 p-4 rounded-2xl border border-gray-100">
              <div className="flex items-center gap-2">
                <ShieldCheck size={16} className="text-emerald-500" />
                <span>{product.warranty}</span>
              </div>
              <div className="flex items-center gap-2">
                <Package2 size={16} className="text-emerald-500" />
                <span>Immediate Mirsharai Warehouse dispatch</span>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* TABS INTERACTIVE SYSTEM */}
      <section className="bg-white border border-gray-100 rounded-3xl p-6 md:p-8 mb-12 shadow-sm" id="details-tabs-module">
        <div className="flex border-b border-gray-100 gap-4 mb-6 overflow-x-auto no-scrollbar">
          {(['desc', 'specs', 'reviews', 'warranty'] as const).map((tab) => {
            const label = {
              desc: 'Detailed Description',
              specs: 'Technical Specifications',
              reviews: `Verified Reviews (${productReviews.length})`,
              warranty: 'Warranty & Claims'
            }[tab];
            const isActive = activeTab === tab;
            return (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`py-3.5 px-2 font-bold text-xs sm:text-sm tracking-wide cursor-pointer border-b-2 uppercase font-mono whitespace-nowrap transition-colors ${
                  isActive ? 'border-primary text-primary' : 'border-transparent text-gray-400 hover:text-gray-900'
                }`}
              >
                {label}
              </button>
            );
          })}
        </div>

        {/* Tab contents panel rendering */}
        <div className="min-h-[220px]">
          {/* DESCRIPTION TAB */}
          {activeTab === 'desc' && (
            <div className="text-gray-600 text-sm leading-relaxed max-w-4xl">
              <h3 className="font-sans font-extrabold text-gray-900 text-lg mb-3">Product Overview</h3>
              <p className="mb-4">{product.description}</p>
              <p>Every element in the MUSK collection is engineered for fast-paced modern environments. Our sound engineers, panel manufacturers, and cover leather auditors prioritize seamless compatibility, safety resistance bounds, and responsive interfaces. Order now and claims instant replacements if defect logs surface.</p>
              <div className="mt-6 flex items-center gap-2 text-xs font-bold text-gray-500 font-mono">
                <Award size={16} className="text-primary" />
                <span>MUSK Signature Line Warranty Assures Covered</span>
              </div>
            </div>
          )}

          {/* SPECIFICATIONS TAB */}
          {activeTab === 'specs' && (
            <div className="max-w-2xl">
              <h3 className="font-sans font-extrabold text-gray-900 text-lg mb-4">Technical Specs Sheet</h3>
              <div className="border border-gray-100 rounded-2xl overflow-hidden shadow-sm">
                {Object.entries(product.specs).map(([key, val], idx) => (
                  <div
                    key={key}
                    className={`grid grid-cols-3 p-3.5 text-xs font-semibold leading-relaxed ${
                      idx % 2 === 0 ? 'bg-gray-55/40 bg-gray-50' : 'bg-white'
                    }`}
                  >
                    <span className="text-gray-400 uppercase tracking-wider font-mono col-span-1">{key}</span>
                    <span className="text-gray-800 col-span-2 font-sans font-bold">{val}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* WARRANTY TAB */}
          {activeTab === 'warranty' && (
            <div className="text-gray-600 text-sm leading-relaxed max-w-3xl">
              <h3 className="font-sans font-extrabold text-gray-900 text-lg mb-3">Replacement & Repair Assurance</h3>
              <p className="mb-3">This gadget is fully backed by MUSK’s premium framework support map. For {product.warranty} duration:</p>
              <ul className="list-disc pl-5 flex flex-col gap-2.5 mt-3">
                <li><strong>No Questions Asked Replacement</strong>: If the audio node, wireless antenna, display panel, or battery circuit behaves erratically within the first 7 days, we deliver an identical fresh replacement box.</li>
                <li><strong>Repair Logistics</strong>: We have official repair laboratories in Dhaka, Chattogram, and Sylhet. Dropping gear gives speedy 24-48 hours expert testing.</li>
                <li><strong>Warranty support exclusion</strong>: Physical frame cracking as a result of liquid spills, heavy drops, or unauthorized opening bypasses official replacement support.</li>
              </ul>
            </div>
          )}

          {/* REVIEWS TAB: Including real input submitting reviews */}
          {activeTab === 'reviews' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              
              {/* Existing Reviews List column */}
              <div className="lg:col-span-7 flex flex-col gap-5">
                <h3 className="font-sans font-extrabold text-gray-900 text-lg mb-2">Customer Feedback Stream</h3>
                
                {productReviews.length > 0 ? (
                  productReviews.map((rev) => (
                    <div key={rev.id} className="border-b border-gray-100 pb-5">
                      <div className="flex justify-between items-center mb-1 bg-gray-50 py-1.5 px-3.5 rounded-xl border border-gray-100/50">
                        <span className="text-xs font-extrabold text-gray-900">{rev.userName}</span>
                        <div className="flex text-amber-400">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} size={11} className={i < rev.rating ? 'fill-amber-400 text-amber-400' : 'text-gray-200'} />
                          ))}
                        </div>
                      </div>
                      <p className="text-xs text-gray-500 font-mono px-3.5">{rev.date} • {rev.isVerified ? '✓ Verified Smart Purchase' : 'Guest'}</p>
                      <p className="text-sm text-gray-650 leading-relaxed mt-2.5 px-3.5 font-medium">"{rev.comment}"</p>
                    </div>
                  ))
                ) : (
                  <div className="text-gray-400 text-xs italic">No reviews written for this item yet. Be the first to draft a comment on performance!</div>
                )}
              </div>

              {/* Write review form column */}
              <div className="lg:col-span-5 bg-gray-50 p-6 rounded-2xl border border-gray-100/80 h-fit">
                <h4 className="font-sans font-extrabold text-gray-900 text-sm uppercase tracking-wide flex items-center gap-2 mb-1.5">
                  <MessageSquareDiff size={18} className="text-primary" />
                  Leave a verified review
                </h4>
                <p className="text-xs text-gray-400 mb-4 font-medium">Share your practical acoustics or wrist-tracking logs with other tech shoppers.</p>

                <form onSubmit={handleReviewSubmit} className="flex flex-col gap-3">
                  {/* Star selector */}
                  <div>
                    <label className="text-xs font-bold text-gray-600 block mb-1">Your Score Rating:</label>
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map((starVal) => (
                        <button
                          key={starVal}
                          type="button"
                          onClick={() => setNewRating(starVal)}
                          className="text-amber-400 hover:scale-110 transition-transform cursor-pointer"
                        >
                          <Star size={20} className={starVal <= newRating ? 'fill-amber-400 text-amber-400' : 'text-gray-300'} />
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Comment Input */}
                  <div>
                    <label className="text-xs font-bold text-gray-600 block mb-1">Review comment:</label>
                    <textarea
                      placeholder="Comment on ANC audio depth, battery efficiency, dial sharpness..."
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      required
                      rows={3}
                      className="w-full bg-white border border-gray-150 p-3 rounded-xl text-xs text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary text-left"
                    />
                  </div>

                  <button
                    type="submit"
                    className="bg-primary hover:bg-primary-hover text-white text-xs font-bold py-2.5 px-4 rounded-xl cursor-pointer shadow transition-all block w-full uppercase tracking-wider font-mono text-center"
                  >
                    Post Review Comment
                  </button>
                </form>

                {reviewSuccess && (
                  <div className="mt-3 text-emerald-600 bg-emerald-50 border border-emerald-100 rounded-xl p-2.5 text-[11px] font-semibold text-center flex items-center gap-1 justify-center animate-bounce">
                    <Check size={14} />
                    <span>Your product review comments registered successfully!</span>
                  </div>
                )}
              </div>

            </div>
          )}
        </div>
      </section>

      {/* FREQUENTLY BOUGHT TOGETHER BUNDLE ADVISOR */}
      <section className="bg-gradient-to-br from-primary-light/40 to-white border border-primary-light/50 p-6 md:p-8 rounded-3xl mb-12 flex flex-col lg:flex-row justify-between items-center gap-8" id="bundle-upsell-module">
        <div className="flex flex-col sm:flex-row items-center gap-6">
          <div className="flex -space-x-4">
            <div className="w-20 h-20 bg-white border border-gray-150 rounded-2xl overflow-hidden relative shadow z-10">
              <img
                src={product.images[0]}
                alt=""
                className="w-full h-full object-cover referrerPolicy='no-referrer'"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="w-10 h-10 bg-primary text-white rounded-full flex items-center justify-center font-bold text-lg select-none shadow z-20 self-center">
              +
            </div>
            <div className="w-20 h-20 bg-white border border-gray-150 rounded-2xl overflow-hidden relative shadow z-10">
              <img
                src={bundleProduct.images[0]}
                alt=""
                className="w-full h-full object-cover referrerPolicy='no-referrer'"
                referrerPolicy="no-referrer"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center gap-1.5 text-primary text-[10px] font-extrabold uppercase tracking-wider font-mono mb-1">
              <Sparkles size={11} className="fill-primary" />
              <span>Smart Bundle Offer</span>
            </div>
            <h3 className="font-sans font-extrabold text-base md:text-lg text-gray-900 leading-tight">
              Frequently Bought Together Bundle
            </h3>
            <p className="text-xs text-gray-500 mt-1 max-w-sm font-semibold">
              Pair your open <span className="text-primary font-bold">{product.name}</span> with a customized <span className="text-gray-850 font-bold">{bundleProduct.name}</span> to claim automated packing!
            </p>
          </div>
        </div>

        <div className="flex items-center gap-6 shrink-0 flex-col sm:flex-row w-full lg:w-auto border-t lg:border-t-0 border-primary-light/30 pt-6 lg:pt-0">
          <div className="flex flex-col text-center sm:text-right">
            <span className="text-xs text-gray-400 font-bold uppercase font-mono">Special combo:</span>
            <span className="text-2xl font-black text-gray-950 font-mono">
              ৳{totalBundlePrice.toLocaleString()}
            </span>
            <span className="text-[10px] text-emerald-600 font-bold uppercase font-mono mt-0.5">
              🚚 Saves delivery charges!
            </span>
          </div>
          <button
            onClick={handleAddBundleToCart}
            className="w-full sm:w-auto bg-primary hover:bg-primary-hover text-white font-extrabold text-xs uppercase tracking-wider py-3.5 px-6 rounded-xl shadow-lg shadow-primary/20 hover:shadow-primary/35 cursor-pointer transition-all"
            id="buy-bundle-trigger"
          >
            Add Both to Cart
          </button>
        </div>
      </section>

      {/* RELATED PRODUCTS */}
      {relatedProducts.length > 0 && (
        <section id="related-products-section">
          <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight text-gray-900 mb-6 flex items-center gap-1.5">
            <PlusSquare size={20} className="text-primary" />
            Related Products & Accessorize
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {relatedProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
};
