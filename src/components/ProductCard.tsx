/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Product } from '../types';
import { useApp } from '../context/AppContext';
import {
  Heart,
  ShoppingCart,
  Eye,
  Star,
  Check,
  Percent,
  X,
  Plus,
  Minus,
  Sparkles,
  ShieldCheck,
  Flame
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart, toggleWishlist, isInWishlist, setRoute } = useApp();
  const [isQuickViewOpen, setIsQuickViewOpen] = useState(false);
  const [selectedColor, setSelectedColor] = useState(product.colors[0] || 'Default');
  const [quantity, setQuantity] = useState(1);
  const [showToast, setShowToast] = useState(false);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  const discountPercent = product.discountPrice
    ? Math.round(((product.regularPrice - product.discountPrice) / product.regularPrice) * 100)
    : 0;

  const currentPrice = product.discountPrice || product.regularPrice;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart(product, 1, selectedColor);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2500);
  };

  const handleQuickViewAdd = () => {
    addToCart(product, quantity, selectedColor);
    setIsQuickViewOpen(false);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2500);
  };

  const handleCardClick = () => {
    setRoute('product-details', product.id);
  };

  const handleWishlistClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleWishlist(product.id);
  };

  return (
    <>
      <div
        onClick={handleCardClick}
        className="group relative bg-white border border-gray-100 rounded-2xl overflow-hidden hover:shadow-xl hover:border-gray-200 transition-all cursor-pointer flex flex-col h-full h-stretch"
        id={`product-card-${product.id}`}
      >
        {/* Dynamic Image Canvas */}
        <div className="w-full aspect-square bg-gray-50 overflow-hidden relative">
          <img
            src={product.images[0]}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 rounded-t-2xl referrerPolicy='no-referrer'"
            referrerPolicy="no-referrer"
          />

          {/* Luxury Tags Overlay */}
          <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
            {product.isFlashSale && (
              <span className="flex items-center gap-1.5 px-2.5 py-0.5 bg-rose-600 text-white font-mono font-extrabold text-[10px] uppercase rounded-full shadow-md animate-pulse">
                <Flame size={10} className="fill-white" />
                Flash Sale
              </span>
            )}
            {discountPercent > 0 && (
              <span className="flex items-center gap-1 px-2.5 py-0.5 bg-amber-500 text-white font-mono font-extrabold text-[10px] uppercase rounded-full shadow-md">
                <Percent size={9} />
                Save {discountPercent}%
              </span>
            )}
            {product.isNewArrival && (
              <span className="bg-primary text-white font-mono font-extrabold text-[10px] px-2.5 py-0.5 uppercase rounded-full shadow-md">
                New
              </span>
            )}
          </div>

          {/* Quick-Access Tools */}
          <button
            onClick={handleWishlistClick}
            className={`absolute top-3 right-3 z-10 p-2 rounded-full border shadow-sm transition-all cursor-pointer ${
              isInWishlist(product.id)
                ? 'bg-red-50 text-red-500 border-red-200'
                : 'bg-white border-gray-100 text-gray-500 hover:text-red-500'
            }`}
            title="Add to Wishlist"
            id={`wishlist-toggle-${product.id}`}
          >
            <Heart size={16} className={isInWishlist(product.id) ? 'fill-red-500' : ''} />
          </button>

          {/* Bottom Hover Action Drawer */}
          <div className="absolute bottom-3 inset-x-3 z-10 flex items-center gap-2 transform translate-y-8 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsQuickViewOpen(true);
              }}
              className="flex-1 bg-gray-900 border border-gray-800 hover:bg-slate-950 text-white font-semibold text-xs py-2 px-3 rounded-xl flex items-center justify-center gap-1.5 shadow-md shadow-gray-950/20 backdrop-blur-md cursor-pointer"
              title="Quick View"
              id={`quickview-trigger-${product.id}`}
            >
              <Eye size={14} />
              Quick View
            </button>
            <button
              onClick={handleAddToCart}
              className="bg-primary hover:bg-primary-hover text-white p-2 border border-primary rounded-xl flex items-center justify-center shadow-lg shadow-primary/20 cursor-pointer"
              title="Add to Cart"
              id={`add-to-cart-quick-${product.id}`}
            >
              <ShoppingCart size={15} />
            </button>
          </div>
        </div>

        {/* Content Section */}
        <div className="p-4 flex flex-col justify-between flex-1">
          <div>
            <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block font-mono h-4">
              {product.brandName}
            </span>
            <h3 className="font-sans font-bold text-gray-900 group-hover:text-primary text-[14px] sm:text-[15px] leading-tight tracking-tight mt-1 line-clamp-2 h-10 transition-colors">
              {product.name}
            </h3>

            {/* Ratings and Reviews */}
            <div className="flex items-center gap-1 mt-1.5">
              <div className="flex text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={11}
                    className={i < Math.floor(product.rating) ? 'fill-amber-400' : 'text-gray-200'}
                  />
                ))}
              </div>
              <span className="text-[10px] text-gray-400 font-semibold mt-px">
                {product.rating} ({product.ratingCount})
              </span>
            </div>
          </div>

          <div className="mt-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-t border-gray-50 pt-3">
            {/* Price Columns */}
            <div className="flex flex-col">
              {product.discountPrice ? (
                <>
                  <span className="text-[11px] text-gray-400 line-through font-semibold leading-none">
                    ৳{product.regularPrice.toLocaleString()}
                  </span>
                  <span className="text-base font-extrabold text-primary tracking-tight mt-0.5 leading-none">
                    ৳{(product.discountPrice || 0).toLocaleString()}
                  </span>
                </>
              ) : (
                <span className="text-base font-extrabold text-gray-900 tracking-tight leading-none">
                  ৳{product.regularPrice.toLocaleString()}
                </span>
              )}
            </div>

            {/* Quick stock status indicators */}
            <div className="text-[10px] font-semibold text-gray-400">
              {product.stock <= 5 ? (
                <span className="text-red-500 font-bold animate-pulse">Only {product.stock} Left</span>
              ) : (
                <span>In Stock</span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Reactive Floating Toast Feedback */}
      <AnimatePresence>
        {showToast && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="fixed bottom-6 right-6 z-50 bg-gray-950 text-white py-3 px-5 rounded-2xl flex items-center gap-3 shadow-2xl border border-gray-800 text-sm max-w-sm"
          >
            <div className="bg-emerald-500 text-white p-1 rounded-full flex items-center justify-center">
              <Check size={14} />
            </div>
            <div>
              <p className="font-semibold text-xs text-white">Item added to your shopping cart!</p>
              <p className="text-[10px] text-gray-400 font-mono italic mt-0.5 line-clamp-1">{product.name}</p>
            </div>
            <button
              onClick={() => {
                setRoute('cart');
                setShowToast(false);
              }}
              className="text-xs text-primary font-bold hover:underline cursor-pointer ml-2 whitespace-nowrap"
            >
              View Cart
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 5. DETAILED QUICK VIEW OVERLAY MODAL */}
      <AnimatePresence>
        {isQuickViewOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Dark blur backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.6 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsQuickViewOpen(false)}
              className="absolute inset-0 bg-gray-950/70 backdrop-blur-sm"
            />

            {/* Modal Body */}
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 220 }}
              className="relative w-full max-w-4xl bg-white rounded-3xl overflow-hidden shadow-2xl border border-gray-100 z-10 max-h-[90vh] overflow-y-auto"
            >
              <button
                onClick={() => setIsQuickViewOpen(false)}
                className="absolute top-4 right-4 z-20 p-2 border border-gray-100 rounded-full hover:text-primary transition-all cursor-pointer bg-white"
                id={`close-quickview-${product.id}`}
              >
                <X size={18} />
              </button>

              <div className="grid grid-cols-1 md:grid-cols-2 p-6 md:p-8 gap-8">
                {/* Gallery Port */}
                <div className="flex flex-col gap-4">
                  <div className="aspect-square bg-gray-50 border border-gray-100 rounded-2xl overflow-hidden">
                    <img
                      src={product.images[activeImageIndex] || product.images[0]}
                      alt={product.name}
                      className="w-full h-full object-cover rounded-2xl referrerPolicy='no-referrer'"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  {/* Gallery Slide Thumbnails */}
                  {product.images.length > 1 && (
                    <div className="flex items-center gap-2">
                      {product.images.map((img, idx) => (
                        <button
                          key={idx}
                          onClick={() => setActiveImageIndex(idx)}
                          className={`w-16 h-16 rounded-xl overflow-hidden border-2 cursor-pointer transition-all ${
                            activeImageIndex === idx ? 'border-primary' : 'border-transparent opacity-70 hover:opacity-100'
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

                {/* Info and Actions Port */}
                <div className="flex flex-col justify-between">
                  <div>
                    <span className="text-[11px] text-primary-hover font-bold font-mono tracking-wider uppercase block bg-primary-light/50 border border-primary-light px-2.5 py-0.5 rounded-full w-fit mb-3">
                      {product.brandName}
                    </span>
                    <h2 className="text-2xl font-extrabold tracking-tight text-gray-900 leading-tight">
                      {product.name}
                    </h2>

                    {/* rating */}
                    <div className="flex items-center gap-1.5 mt-2 pb-4 border-b border-gray-100">
                      <div className="flex text-amber-400">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            size={14}
                            className={i < Math.floor(product.rating) ? 'fill-amber-400' : 'text-gray-200'}
                          />
                        ))}
                      </div>
                      <span className="text-xs font-semibold text-gray-500">
                        {product.rating} Star rating from {product.ratingCount} Customers
                      </span>
                    </div>

                    {/* Prices */}
                    <div className="mt-4 flex items-baseline gap-2.5">
                      {product.discountPrice ? (
                        <>
                          <span className="text-3xl font-extrabold text-primary tracking-tight">
                            ৳{product.discountPrice.toLocaleString()}
                          </span>
                          <span className="text-lg text-gray-400 font-semibold line-through">
                            ৳{product.regularPrice.toLocaleString()}
                          </span>
                        </>
                      ) : (
                        <span className="text-3xl font-extrabold text-gray-900 tracking-tight">
                          ৳{product.regularPrice.toLocaleString()}
                        </span>
                      )}
                    </div>

                    {/* Paragraph */}
                    <p className="mt-4 text-sm text-gray-500 leading-relaxed max-w-md">
                      {product.description}
                    </p>

                    {/* Specs List preview */}
                    <div className="mt-5 bg-gray-50 p-4 rounded-2xl border border-gray-100">
                      <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block mb-2.5 font-mono">
                        Key Specifications
                      </span>
                      <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 text-xs">
                        {Object.entries(product.specs).slice(0, 4).map(([key, value]) => (
                          <div key={key} className="flex flex-col">
                            <span className="text-gray-400">{key}</span>
                            <span className="font-bold text-gray-800 line-clamp-1">{value}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Available Color options */}
                    {product.colors.length > 0 && (
                      <div className="mt-5">
                        <span className="text-xs font-bold text-gray-600 block mb-2">Available Palette Colors:</span>
                        <div className="flex items-center gap-2">
                          {product.colors.map((col) => (
                            <button
                              key={col}
                              onClick={() => setSelectedColor(col)}
                              className={`py-1 px-3.5 text-xs font-semibold border rounded-full transition-all cursor-pointer ${
                                selectedColor === col
                                  ? 'border-primary text-primary bg-primary-light/40'
                                  : 'border-gray-200 text-gray-500 hover:border-gray-300'
                              }`}
                            >
                              {col}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  <div>
                    {/* Quantity selectors & triggers */}
                    <div className="mt-6 flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-6 border-t border-gray-100">
                      <div className="flex items-center border border-gray-200 rounded-xl bg-gray-50 self-start">
                        <button
                          onClick={() => setQuantity(Math.max(1, quantity - 1))}
                          className="p-3 text-gray-500 hover:text-primary transition-colors cursor-pointer"
                        >
                          <Minus size={14} strokeWidth={2.5} />
                        </button>
                        <span className="w-10 text-center font-bold text-gray-800 text-sm">
                          {quantity}
                        </span>
                        <button
                          onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                          className="p-3 text-gray-500 hover:text-primary transition-colors cursor-pointer"
                        >
                          <Plus size={14} strokeWidth={2.5} />
                        </button>
                      </div>

                      {/* Add Button */}
                      <button
                        onClick={handleQuickViewAdd}
                        disabled={product.stock <= 0}
                        className="flex-1 bg-primary hover:bg-primary-hover text-white py-3 px-6 font-bold text-sm tracking-wide uppercase rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-primary/20 cursor-pointer disabled:bg-gray-200 disabled:text-gray-400 disabled:shadow-none"
                      >
                        <ShoppingCart size={16} />
                        {product.stock <= 0 ? 'Out of Stock' : 'Add to Cart Box'}
                      </button>
                    </div>

                    {/* Trust assurances footer inside quick-view */}
                    <div className="mt-4 flex items-center justify-between text-[11px] text-gray-400 border-t border-gray-50 pt-3">
                      <div className="flex items-center gap-1">
                        <ShieldCheck size={14} className="text-emerald-500" />
                        <span>{product.warranty}</span>
                      </div>
                      <span>SKU: {product.sku}</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};
