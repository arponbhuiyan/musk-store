/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { SEOHead } from '../components/SEOHead';
import {
  Trash2,
  Plus,
  Minus,
  ArrowRight,
  Ticket,
  Percent,
  CheckCircle2,
  XCircle,
  Truck,
  RotateCcw,
  Sparkles,
  ShoppingBag,
  Gift
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const CartView: React.FC = () => {
  const {
    cart,
    updateCartQuantity,
    removeFromCart,
    activeCoupon,
    applyCoupon,
    removeCoupon,
    setRoute,
    setCategoryFilter
  } = useApp();

  const [couponInput, setCouponInput] = useState('');
  const [couponFeedback, setCouponFeedback] = useState<{ success: boolean; message: string } | null>(null);

  // Calculate live financials
  const subtotal = useMemo(() => {
    return cart.reduce((acc, item) => {
      const price = item.product.discountPrice || item.product.regularPrice;
      return acc + price * item.quantity;
    }, 0);
  }, [cart]);

  const discountAmount = useMemo(() => {
    if (!activeCoupon) return 0;
    if (activeCoupon.discountType === 'percentage') {
      return Math.round((subtotal * activeCoupon.discountValue) / 100);
    } else {
      return activeCoupon.discountValue;
    }
  }, [activeCoupon, subtotal]);

  // Delivery charge inside Bangladesh (simulated: free above BDT 1,500)
  const deliveryCharge = useMemo(() => {
    if (subtotal === 0 || subtotal > 1500) return 0;
    return 100;
  }, [subtotal]);

  const grandTotal = useMemo(() => {
    return Math.max(0, (subtotal - discountAmount) + deliveryCharge);
  }, [subtotal, discountAmount, deliveryCharge]);

  const percentToFreeDelivery = useMemo(() => {
    if (subtotal >= 1500) return 100;
    return Math.round((subtotal / 1500) * 100);
  }, [subtotal]);

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponInput.trim()) return;
    const res = applyCoupon(couponInput);
    setCouponFeedback(res);
    if (res.success) {
      setCouponInput('');
    }
  };

  const handleRemoveCouponClick = () => {
    removeCoupon();
    setCouponFeedback(null);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 md:py-12" id="cart-workspace">
      <SEOHead
        title="My Shopping Cart - Manage Purchases"
        description="Review items added to your MUSK shopping bag. Check discount allocations and delivery charge thresholds before entering secure checkout."
      />

      <div className="flex items-center gap-2 mb-8">
        <div className="bg-primary-light text-primary p-2 rounded-xl">
          <ShoppingBag size={22} />
        </div>
        <div>
          <span className="text-[10px] text-gray-400 font-extrabold uppercase tracking-wider block font-mono">
            Purchase pipeline
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-gray-900 leading-none">
            Shopping Cart Summary
          </h1>
        </div>
      </div>

      {cart.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* LEFT TABLE: Product Listing Columns */}
          <div className="lg:col-span-8 flex flex-col gap-4">
            
            {/* Free Delivery dynamic slider progress indicator */}
            <div className="bg-emerald-50/70 border border-emerald-100 rounded-2xl p-4 flex flex-col gap-2 shadow-sm">
              <div className="flex justify-between items-center text-xs text-emerald-800 font-semibold">
                {subtotal >= 1500 ? (
                  <span className="flex items-center gap-1">
                    <Truck size={15} className="animate-bounce" />
                    Good News! Your cart qualifies for <strong>100% Free Nationwide Delivery!</strong>
                  </span>
                ) : (
                  <span>
                    Add <strong>৳{(1500 - subtotal).toLocaleString()}</strong> more to claim <strong>Free Delivery!</strong>
                  </span>
                )}
                <span className="font-mono text-[10px] uppercase font-black">{percentToFreeDelivery}% reached</span>
              </div>
              <div className="w-full bg-emerald-100 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-emerald-500 h-full transition-all duration-500"
                  style={{ width: `${percentToFreeDelivery}%` }}
                />
              </div>
            </div>

            {/* Cart Items list cards */}
            <div className="flex flex-col bg-white border border-gray-100 rounded-3xl p-5 md:p-6 shadow-sm divide-y divide-gray-50">
              {cart.map((item) => {
                const itemPrice = item.product.discountPrice || item.product.regularPrice;
                return (
                  <div
                    key={item.id}
                    className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center py-5 first:pt-0 last:pb-0 gap-4"
                  >
                    {/* Img and core info */}
                    <div className="flex items-center gap-4">
                      <div className="w-20 h-20 bg-gray-50 border border-gray-100 rounded-2xl overflow-hidden relative shrink-0">
                        <img
                          src={item.product.images[0]}
                          alt={item.product.name}
                          className="w-full h-full object-cover referrerPolicy='no-referrer'"
                          referrerPolicy="no-referrer"
                        />
                      </div>
                      <div>
                        <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider font-mono">
                          {item.product.brandName}
                        </span>
                        <h3
                          onClick={() => setRoute('product-details', item.productId)}
                          className="font-sans font-bold text-gray-900 text-sm hover:text-primary transition-colors cursor-pointer leading-snug line-clamp-2 max-w-sm"
                        >
                          {item.product.name}
                        </h3>
                        {/* Choice of Accent spec color */}
                        <span className="inline-block bg-gray-100 text-gray-550 text-[10px] font-bold font-mono uppercase tracking-wider py-0.5 px-2 rounded-md mt-1 border border-gray-200">
                          Color: {item.selectedColor}
                        </span>
                      </div>
                    </div>

                    {/* Quantity selectors & price tags */}
                    <div className="flex items-center justify-between sm:justify-end gap-6 sm:gap-10 border-t sm:border-t-0 border-gray-50 pt-3 sm:pt-0">
                      {/* Interactive incrementators */}
                      <div className="flex items-center border border-gray-200 rounded-xl bg-gray-50">
                        <button
                          onClick={() => updateCartQuantity(item.id, item.quantity - 1)}
                          className="p-2 sm:p-2.5 text-gray-500 hover:text-primary cursor-pointer"
                          aria-label="Reduce"
                        >
                          <Minus size={13} strokeWidth={2.5} />
                        </button>
                        <span className="w-8 text-center font-bold text-gray-800 text-xs sm:text-sm font-mono select-none">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateCartQuantity(item.id, item.quantity + 1)}
                          className="p-2 sm:p-2.5 text-gray-500 hover:text-primary cursor-pointer"
                          aria-label="Increase"
                        >
                          <Plus size={13} strokeWidth={2.5} />
                        </button>
                      </div>

                      {/* Cash Tag values */}
                      <div className="flex flex-col text-right min-w-[80px]">
                        <span className="text-xs text-gray-400 leading-none mb-1 font-mono">
                          ৳{itemPrice.toLocaleString()} x {item.quantity}
                        </span>
                        <span className="text-base font-extrabold text-gray-950 tracking-tight leading-none font-mono">
                          ৳{(itemPrice * item.quantity).toLocaleString()}
                        </span>
                      </div>

                      {/* Remove trashbin items */}
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="p-2.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all border border-transparent hover:border-red-100 cursor-pointer"
                        title="Remove Item"
                        id={`delete-cart-item-${item.id}`}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Shopping Continuation Quicklink */}
            <div className="flex justify-between items-center">
              <button
                onClick={() => {
                  setCategoryFilter(null);
                  setRoute('shop');
                }}
                className="bg-gray-50 hover:bg-gray-100 border border-gray-200 py-2.5 px-6 rounded-xl font-bold text-xs text-gray-750 uppercase tracking-wider transition-colors cursor-pointer"
              >
                ← Continue Shopping
              </button>
            </div>
          </div>

          {/* RIGHT COLUMN: Order Summary Panels */}
          <div className="lg:col-span-4 flex flex-col gap-6 sticky top-[150px]">
            
            {/* Promo Codes Engine Input Form */}
            <div className="bg-white border border-gray-100 p-5 rounded-2xl shadow-sm">
              <span className="text-xs font-bold text-gray-950 uppercase tracking-widest font-mono block mb-2.5 flex items-center gap-1.5">
                <Ticket size={16} className="text-primary" />
                Apply Discount Coupon
              </span>
              <p className="text-[11px] text-gray-400 mb-3.5 leading-relaxed font-semibold">
                Apply exclusive keys like <span className="text-primary underline">SMARTMUSK</span> (15%), <span className="text-primary underline">FLASH20</span> (৳200), or <span className="text-primary underline">FREESHIP</span>.
              </p>

              {!activeCoupon ? (
                <form onSubmit={handleApplyCoupon} className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Enter Coupon Code"
                    value={couponInput}
                    onChange={(e) => setCouponInput(e.target.value)}
                    className="flex-1 bg-gray-50 border border-gray-150 pl-3 py-2 text-xs uppercase font-mono font-bold rounded-xl focus:outline-none focus:ring-1 focus:ring-primary focus:bg-white text-left"
                  />
                  <button
                    type="submit"
                    className="bg-gray-900 hover:bg-slate-950 text-white font-extrabold text-xs uppercase tracking-wide px-4 rounded-xl cursor-pointer transition-colors"
                  >
                    Apply
                  </button>
                </form>
              ) : (
                <div className="bg-emerald-50 border border-emerald-100 px-4 py-3 rounded-xl flex items-center justify-between gap-3 animate-ping-once">
                  <div className="flex items-center gap-2">
                    <Percent size={14} className="text-emerald-500" />
                    <div>
                      <span className="text-xs font-black text-emerald-800 font-mono tracking-wider">
                        {activeCoupon.code}
                      </span>
                      <span className="block text-[9px] text-emerald-600 font-bold">
                        Voucher verified! Enjoy savings
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={handleRemoveCouponClick}
                    className="text-xs text-red-500 font-bold hover:underline cursor-pointer"
                  >
                    Remove
                  </button>
                </div>
              )}

              {/* Response banner triggers */}
              {couponFeedback && (
                <div
                  className={`mt-2.5 text-[11px] font-semibold flex items-center gap-1 ${
                    couponFeedback.success ? 'text-emerald-600' : 'text-red-500'
                  }`}
                >
                  {couponFeedback.success ? <CheckCircle2 size={13} /> : <XCircle size={13} />}
                  <span>{couponFeedback.message}</span>
                </div>
              )}
            </div>

            {/* General Financial calculation lists cards */}
            <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
              <h3 className="font-sans font-extrabold text-[15px] uppercase tracking-wide text-gray-900 pb-3.5 border-b border-gray-100 mb-4 flex items-center gap-2">
                <Gift size={16} className="text-primary" />
                Purchase Summary
              </h3>

              <div className="flex flex-col gap-2.5 text-xs font-semibold text-gray-500 pb-4 border-b border-gray-100">
                <div className="flex justify-between items-center">
                  <span>Items Subtotal ({cart.length} product lines):</span>
                  <span className="text-gray-900 font-bold font-mono">৳{subtotal.toLocaleString()}</span>
                </div>
                {activeCoupon && (
                  <div className="flex justify-between items-center text-emerald-600 font-bold">
                    <span>Coupon Voucher Savings ({activeCoupon.code}):</span>
                    <span className="font-mono">-৳{discountAmount.toLocaleString()}</span>
                  </div>
                )}
                <div className="flex justify-between items-center">
                  <span className="flex items-center gap-1">
                    Emergency Delivery Charge:
                    <span className="text-[10px] text-primary">(Dhaka Warehouse)</span>
                  </span>
                  <span className="text-gray-900 font-bold font-mono">
                    {deliveryCharge === 0 ? 'FREE' : `৳${deliveryCharge}`}
                  </span>
                </div>
              </div>

              {/* Grand totals */}
              <div className="flex justify-between items-center font-extrabold text-gray-900 py-4 mb-5 border-b border-gray-50">
                <span className="text-[13px] uppercase tracking-wide font-mono">Total Estimated BDT:</span>
                <span className="text-2xl font-black text-primary font-mono tracking-tight">
                  ৳{grandTotal.toLocaleString()}
                </span>
              </div>

              {/* Proceed Trigger */}
              <button
                onClick={() => setRoute('checkout')}
                className="w-full bg-primary hover:bg-primary-hover text-white py-4 px-6 font-extrabold text-sm tracking-wide uppercase rounded-xl flex items-center justify-center gap-2.5 shadow-lg shadow-primary/20 hover:shadow-primary/35 cursor-pointer transform hover:-translate-y-0.5 transition-all"
                id="cart-checkout-proceed"
              >
                Proceed To Checkout
                <ArrowRight size={16} />
              </button>

              <div className="mt-4 text-[11px] text-gray-400 font-mono text-center leading-relaxed">
                🔒 256-bit Secure TLS Encription. We support authentic bKash, Nagad, and local Cash on Delivery channels safely.
              </div>
            </div>

          </div>
        </div>
      ) : (
        /* Blank empty state */
        <div className="bg-white border border-gray-100 rounded-3xl p-16 text-center flex flex-col items-center">
          <div className="bg-gray-50 p-5 rounded-full text-gray-400 mb-5 border border-gray-100">
            <ShoppingBag size={48} />
          </div>
          <h2 className="font-sans font-extrabold text-2xl text-gray-900 leading-tight">
            Your shopping basket is empty
          </h2>
          <p className="text-sm text-gray-400 max-w-sm mt-2 leading-relaxed">
            Looks like you haven't selected any smart tech accessories yet! Go check out our latest campaign earbuds and watch models.
          </p>
          <button
            onClick={() => {
              setCategoryFilter(null);
              setRoute('shop');
            }}
            className="bg-primary hover:bg-primary-hover text-white text-xs font-bold py-3.5 px-8 rounded-full mt-6 shadow shadow-primary/20 transition-all cursor-pointer uppercase tracking-wider"
            id="empty-cart-return-shop"
          >
            Go Browse Shop
          </button>
        </div>
      )}
    </div>
  );
};
