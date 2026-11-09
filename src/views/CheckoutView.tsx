/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { SEOHead } from '../components/SEOHead';
import {
  ShieldCheck,
  Check,
  CreditCard,
  MapPin,
  ClipboardList,
  Contact,
  CheckCircle2,
  ChevronRight,
  PackageOpen,
  ShoppingBag,
  Gift,
  HelpCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const CheckoutView: React.FC = () => {
  const {
    cart,
    userSession,
    activeCoupon,
    placeOrder,
    setRoute,
    setCategoryFilter
  } = useApp();

  // 1. Form Inputs State
  const [fullName, setFullName] = useState(userSession.fullName);
  const [email, setEmail] = useState(userSession.email);
  const [phone, setPhone] = useState(userSession.phone);
  const [address, setAddress] = useState(userSession.address);
  const [city, setCity] = useState(userSession.city);
  const [postalCode, setPostalCode] = useState(userSession.postalCode);
  const [paymentMethod, setPaymentMethod] = useState<'bKash' | 'Nagad' | 'Rocket' | 'SSLCommerz' | 'Cash On Delivery'>(
    'bKash'
  );
  const [senderNumber, setSenderNumber] = useState('');
  const [transactionCode, setTransactionCode] = useState('');
  const [isVerifyingDetails, setIsVerifyingDetails] = useState(false);

  // Success flow control states
  const [placedOrder, setPlacedOrder] = useState<any | null>(null);
  const [isPlacing, setIsPlacing] = useState(false);

  // Financial calculations
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

  const deliveryCharge = useMemo(() => {
    if (subtotal === 0 || subtotal > 1500) return 0;
    return 100;
  }, [subtotal]);

  const grandTotal = useMemo(() => {
    return Math.max(0, (subtotal - discountAmount) + deliveryCharge);
  }, [subtotal, discountAmount, deliveryCharge]);

  // Handle Form Submission
  const handlePlaceOrderSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !email || !phone || !address || !city || !postalCode) return;

    // Validate bKash/Nagad/Rocket fields
    const isMfs = paymentMethod === 'bKash' || paymentMethod === 'Nagad' || paymentMethod === 'Rocket';
    if (isMfs && (!senderNumber || !transactionCode)) {
      alert("దయచేসি আপনার বিকাশ/নগদ/রকেট মোবাইল নম্বর এবং ট্রানজেকশন কোড দুটোই প্রদান করুন।");
      return;
    }

    setIsPlacing(true);

    // Simulate payment transaction network lag
    setTimeout(() => {
      const completed = placeOrder({
        fullName,
        email,
        phone,
        address,
        city,
        postalCode,
        paymentMethod,
        ...(isMfs ? { senderNumber, transactionCode } : {})
      });

      setPlacedOrder(completed);
      setIsPlacing(false);
    }, 1500);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 md:py-12" id="checkout-workspace">
      <SEOHead
        title="Secure Checkout - MUSK Bangladesh"
        description="Verify shipping destinations and secure mobile financial payment channels like bKash, Nagad, and cash delivery. Guarantee genuine gadgets."
      />

      <AnimatePresence mode="wait">
        {!placedOrder ? (
          /* SECTION A: STANDARD CHECOUT FORM */
          <div key="checkout-form" className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* LEFT COLUMN FORM: Info collects */}
            <form onSubmit={handlePlaceOrderSubmit} className="lg:col-span-8 flex flex-col gap-6">
              
              {/* 1. CUSTOMER IDENTITY */}
              <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm">
                <h2 className="font-sans font-extrabold text-base md:text-lg text-gray-950 mb-5 flex items-center gap-2 pb-3 border-b border-gray-50">
                  <Contact size={20} className="text-primary" />
                  1. Customer Contact Identity
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-gray-600 block mb-1">Full Legal Name *</label>
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="e.g. Tanvir Hossain"
                      className="w-full bg-gray-50/70 border border-gray-250 p-3 rounded-xl text-xs sm:text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-primary focus:bg-white text-left"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-gray-600 block mb-1">Email Address *</label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="username@domain.com"
                      className="w-full bg-gray-50/70 border border-gray-250 p-3 rounded-xl text-xs sm:text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-primary focus:bg-white text-left"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="text-xs font-bold text-gray-600 block mb-1">Active Contact Number (WhatsApp alerts) *</label>
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+880 1712-345678"
                      className="w-full bg-gray-50/70 border border-gray-250 p-3 rounded-xl text-xs sm:text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-primary focus:bg-white text-left"
                    />
                  </div>
                </div>
              </div>

              {/* 2. SHIPPING ADDRESS details */}
              <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm">
                <h2 className="font-sans font-extrabold text-base md:text-lg text-gray-950 mb-5 flex items-center gap-2 pb-3 border-b border-gray-50">
                  <MapPin size={20} className="text-primary" />
                  2. Courier Shipping Address
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="sm:col-span-3">
                    <label className="text-xs font-bold text-gray-600 block mb-1">Full Delivery Street Address *</label>
                    <input
                      type="text"
                      required
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      placeholder="e.g. Apt 4B, House 12, Road 4, Sector 3, Uttara"
                      className="w-full bg-gray-50/70 border border-gray-250 p-3 rounded-xl text-xs sm:text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-primary focus:bg-white text-left"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-gray-600 block mb-1">City / Region *</label>
                    <select
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="w-full bg-gray-50/70 border border-gray-250 p-3 rounded-xl text-xs sm:text-sm text-gray-800 focus:outline-none focus:ring-1 focus:ring-primary focus:bg-white"
                      title="courier destination region"
                    >
                      <option value="Dhaka">Dhaka (In City Deliveries)</option>
                      <option value="Chattogram">Chattogram</option>
                      <option value="Sylhet">Sylhet</option>
                      <option value="Rajshahi">Rajshahi</option>
                      <option value="Khulna">Khulna</option>
                      <option value="Barishal">Barishal</option>
                      <option value="Rangpur">Rangpur</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-bold text-gray-600 block mb-1">Postal Zip Code *</label>
                    <input
                      type="text"
                      required
                      value={postalCode}
                      onChange={(e) => setPostalCode(e.target.value)}
                      placeholder="1230"
                      className="w-full bg-gray-50/70 border border-gray-250 p-3 rounded-xl text-xs sm:text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-primary focus:bg-white text-left"
                    />
                  </div>
                  <div className="flex items-center gap-1.5 self-end py-3 text-xs font-semibold text-emerald-600 sm:col-span-1">
                    <CheckCircle2 size={15} />
                    <span>Express domestic courier ready</span>
                  </div>
                </div>
              </div>

              {/* 3. SECURED BD CHANNELS PAYMENT METHOD */}
              <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm">
                <h2 className="font-sans font-extrabold text-base md:text-lg text-gray-950 mb-2 flex items-center gap-2 pb-1.5 border-b border-gray-50">
                  <CreditCard size={20} className="text-[#F26722]" />
                  3. Secure Shipping Payment
                </h2>
                <p className="text-xs text-gray-400 mb-5 font-semibold">Select your preferred payment channel. No additional fees on mobile MFS transfers.</p>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* bKash MFS */}
                  <label
                    className={`border-2 p-4 rounded-2xl flex items-center gap-3.5 cursor-pointer transition-all select-none ${
                      paymentMethod === 'bKash'
                        ? 'border-pink-500 bg-pink-50/30'
                        : 'border-gray-100 bg-gray-55/30 hover:border-gray-200'
                    }`}
                  >
                    <input
                      type="radio"
                      name="payment_choice"
                      checked={paymentMethod === 'bKash'}
                      onChange={() => setPaymentMethod('bKash')}
                      className="accent-pink-500 w-4 h-4"
                    />
                    <div className="text-left">
                      <span className="text-xs font-black text-pink-600 block uppercase font-mono">bKash Mobile Wallet</span>
                      <span className="block text-[10px] text-gray-400 mt-0.5 leading-tight">Instant 1-step checkout logs</span>
                    </div>
                  </label>

                  {/* Nagad MFS */}
                  <label
                    className={`border-2 p-4 rounded-2xl flex items-center gap-3.5 cursor-pointer transition-all select-none ${
                      paymentMethod === 'Nagad'
                        ? 'border-red-500 bg-rose-50/20'
                        : 'border-gray-100 bg-gray-55/30 hover:border-gray-200'
                    }`}
                  >
                    <input
                      type="radio"
                      name="payment_choice"
                      checked={paymentMethod === 'Nagad'}
                      onChange={() => setPaymentMethod('Nagad')}
                      className="accent-red-500 w-4 h-4"
                    />
                    <div className="text-left">
                      <span className="text-xs font-black text-rose-600 block uppercase font-mono">Nagad Wallet</span>
                      <span className="block text-[10px] text-gray-400 mt-0.5 leading-tight">Secured payment certification</span>
                    </div>
                  </label>

                  {/* Rocket MFS */}
                  <label
                    className={`border-2 p-4 rounded-2xl flex items-center gap-3.5 cursor-pointer transition-all select-none ${
                      paymentMethod === 'Rocket'
                        ? 'border-purple-600 bg-purple-50/30'
                        : 'border-gray-100 bg-gray-55/30 hover:border-gray-200'
                    }`}
                  >
                    <input
                      type="radio"
                      name="payment_choice"
                      checked={paymentMethod === 'Rocket'}
                      onChange={() => setPaymentMethod('Rocket')}
                      className="accent-purple-600 w-4 h-4"
                    />
                    <div className="text-left">
                      <span className="text-xs font-black text-purple-700 block uppercase font-mono">Rocket Wallet</span>
                      <span className="block text-[10px] text-gray-400 mt-0.5 leading-tight">Secured purple wallet routing</span>
                    </div>
                  </label>

                  {/* Cash On Delivery */}
                  <label
                    className={`border-2 p-4 rounded-2xl flex items-center gap-3.5 cursor-pointer transition-all select-none ${
                      paymentMethod === 'Cash On Delivery'
                        ? 'border-gray-900 bg-gray-50'
                        : 'border-gray-100 bg-gray-55/30 hover:border-gray-200'
                    }`}
                  >
                    <input
                      type="radio"
                      name="payment_choice"
                      checked={paymentMethod === 'Cash On Delivery'}
                      onChange={() => setPaymentMethod('Cash On Delivery')}
                      className="accent-gray-900 w-4 h-4"
                    />
                    <div className="text-left">
                      <span className="text-xs font-black text-gray-800 block uppercase font-mono">Cash On Delivery (COD)</span>
                      <span className="block text-[10px] text-gray-400 mt-0.5 leading-tight">Pay only when you test the goods</span>
                    </div>
                  </label>

                  {/* SSLCommerz PG */}
                  <label
                    className={`border-2 p-4 rounded-2xl flex items-center gap-3.5 cursor-pointer transition-all select-none sm:col-span-2 ${
                      paymentMethod === 'SSLCommerz'
                        ? 'border-indigo-500 bg-indigo-50/30'
                        : 'border-gray-100 bg-gray-55/30 hover:border-gray-200'
                    }`}
                  >
                    <input
                      type="radio"
                      name="payment_choice"
                      checked={paymentMethod === 'SSLCommerz'}
                      onChange={() => setPaymentMethod('SSLCommerz')}
                      className="accent-indigo-500 w-4 h-4"
                    />
                    <div className="text-left">
                      <span className="text-xs font-black text-indigo-700 block uppercase font-mono">SSLCommerz gateway</span>
                      <span className="block text-[10px] text-gray-400 mt-0.5 leading-tight">Cards (Visa/Mastercard) & Netbanking channels</span>
                    </div>
                  </label>
                </div>

                {/* Mobile Financial Services (MFS) payment details forms */}
                {(paymentMethod === 'bKash' || paymentMethod === 'Nagad' || paymentMethod === 'Rocket') && (
                  <div className="mt-6 p-5 bg-orange-50/40 border border-[#FFDECE] rounded-2xl flex flex-col gap-4 text-left">
                    <div className="flex items-center gap-2">
                      <span className="bg-[#F26722] text-white text-[10px] font-black px-2.5 py-1 rounded-full uppercase font-mono tracking-wider">
                        পেমেন্ট নির্দেশনাবলী (Instructions)
                      </span>
                    </div>

                    {/* Rules in Bangla */}
                    <div className="text-xs text-gray-700 leading-relaxed font-semibold flex flex-col gap-1.5 border-b border-[#FFD0B9] pb-4">
                      <p className="text-gray-900 font-extrabold text-sm mb-1">
                        টাকা পাঠানোর নিয়মাবলি ({paymentMethod}):
                      </p>
                      <ul className="list-decimal list-inside space-y-1.5 text-gray-800">
                        <li>আপনার <strong className="text-gray-950">{paymentMethod}</strong> মোবাইল অ্যাপ অথবা ডায়াল কোড ব্যবহার করে পেমেন্ট মেন্যুতে যান।</li>
                        <li>সেখান থেকে <strong>সেন্ড মানি (Send Money)</strong> অপশনটি নির্বাচন করুন।</li>
                        <li>প্রাপক নম্বর (Recipient Wallet) হিসেবে এই নম্বরটি লিখুন: 
                          <span className="bg-white text-gray-950 font-black px-2.5 py-1 rounded border border-[#FFCEB5] mx-1 tracking-wider inline-block font-mono select-all text-sm shadow-sm text-[#F26722]">
                            +8801816505013
                          </span>
                        </li>
                        <li>মোট অর্ডারের মূল্য পরিমাণ টাকা <strong className="text-gray-950 bg-white px-1.5 py-0.5 rounded border border-[#FFD0B9] font-mono font-extrabold">৳{grandTotal.toLocaleString()}</strong> টাকা সেন্ড মানি করুন।</li>
                        <li>টাকা পাঠানো সফল হলে নিচের ফর্মে আপনার <strong>প্রেরক নম্বর (যেই নম্বর থেকে টাকা পাঠিয়েছেন)</strong> এবং ফিরতি মেসেজে পাওয়া <strong>ট্রানজেকশন আইডি (Transaction Code)</strong> সঠিকভাবে লিখে অর্ডারটি প্লেস করুন।</li>
                      </ul>
                    </div>

                    {/* Inputs fields */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                      <div>
                        <label className="text-xs font-bold text-gray-700 block mb-1">প্রেরক মোবাইল নম্বর (Sender Mobile Number) *</label>
                        <input
                          type="tel"
                          required={paymentMethod === 'bKash' || paymentMethod === 'Nagad' || paymentMethod === 'Rocket'}
                          value={senderNumber}
                          onChange={(e) => setSenderNumber(e.target.value)}
                          placeholder="e.g. 0181XXXXXXXX"
                          className="w-full bg-white border border-[#FFC7AB] p-3 rounded-xl text-xs sm:text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-[#F26722] text-left font-semibold"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-bold text-gray-700 block mb-1">ট্রানজেকশন কোড / আইডি (Transaction ID) *</label>
                        <input
                          type="text"
                          required={paymentMethod === 'bKash' || paymentMethod === 'Nagad' || paymentMethod === 'Rocket'}
                          value={transactionCode}
                          onChange={(e) => setTransactionCode(e.target.value)}
                          placeholder="e.g. AM89XFGGH7"
                          className="w-full bg-white border border-[#FFC7AB] p-3 rounded-xl text-xs sm:text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-[#F26722] text-left font-mono font-bold tracking-widest uppercase animate-pulse-once"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* PLACE ORDER SUMISSION TRIGGERS */}
              <button
                type="submit"
                disabled={isPlacing || cart.length === 0}
                className="w-full bg-primary hover:bg-primary-hover text-white py-4 font-extrabold text-sm tracking-wide uppercase rounded-xl flex items-center justify-center gap-2.5 shadow-lg shadow-primary/20 hover:shadow-primary/35 cursor-pointer disabled:bg-gray-150 disabled:text-gray-400 disabled:shadow-none"
                id="place-order-submit-button"
              >
                {isPlacing ? (
                  <>
                    <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                    <span>Processing Secure Gateway Securely...</span>
                  </>
                ) : (
                  <>
                    <ShieldCheck size={18} />
                    <span>Confirm & Place Order (৳{grandTotal.toLocaleString()})</span>
                  </>
                )}
              </button>

            </form>

            {/* RIGHT COLUMN: Order summary checklists */}
            <aside className="lg:col-span-4 bg-white border border-gray-100 p-6 rounded-3xl shadow-sm sticky top-[150px]">
              
              <h3 className="font-sans font-extrabold text-[15px] uppercase tracking-wide text-gray-900 pb-3 border-b border-gray-50 mb-4 flex items-center gap-1.5 font-mono">
                <ClipboardList size={18} className="text-primary" />
                Voucher Summary
              </h3>

              {/* Item listings inside Checkout summary */}
              <div className="flex flex-col gap-3.5 divide-y divide-gray-50 max-h-[220px] overflow-y-auto no-scrollbar pr-1 mb-4">
                {cart.map((item) => {
                  const price = item.product.discountPrice || item.product.regularPrice;
                  return (
                    <div key={item.id} className="flex justify-between items-center text-xs pt-3.5 first:pt-0">
                      <div className="flex items-center gap-2.5">
                        <img
                          src={item.product.images[0]}
                          alt=""
                          className="w-10 h-10 object-cover rounded-lg border border-gray-100 shrink-0 referrerPolicy='no-referrer'"
                          referrerPolicy="no-referrer"
                        />
                        <div>
                          <span className="font-bold text-gray-900 line-clamp-1 max-w-[150px]">
                            {item.product.name}
                          </span>
                          <span className="block text-[10px] text-gray-400 font-bold font-mono">
                            Qty: {item.quantity} • {item.selectedColor}
                          </span>
                        </div>
                      </div>
                      <span className="font-bold text-gray-900 font-mono">
                        ৳{(price * item.quantity).toLocaleString()}
                      </span>
                    </div>
                  );
                })}
              </div>

              {/* Live monetary items mapping */}
              <div className="flex flex-col gap-2.5 text-xs font-semibold text-gray-500 pb-4 border-b border-gray-100 pt-3">
                <div className="flex justify-between items-center">
                  <span>Cart Subtotal *</span>
                  <span className="text-gray-900 font-bold font-mono">৳{subtotal.toLocaleString()}</span>
                </div>
                {activeCoupon && (
                  <div className="flex justify-between items-center text-emerald-600 font-bold">
                    <span>Voucher Rebates ({activeCoupon.code}):</span>
                    <span className="font-mono">-৳{discountAmount.toLocaleString()}</span>
                  </div>
                )}
                <div className="flex justify-between items-center">
                  <span>Emergency Delivery Charge:</span>
                  <span className="text-gray-900 font-bold font-mono">
                    {deliveryCharge === 0 ? 'FREE' : `৳${deliveryCharge}`}
                  </span>
                </div>
              </div>

              {/* Grand Total Checkout */}
              <div className="flex justify-between items-center font-extrabold text-gray-900 py-4 mb-2">
                <span className="text-xs uppercase tracking-wide font-mono">Grand Total To Pay:</span>
                <span className="text-xl font-black text-primary font-mono tracking-tight">
                  ৳{grandTotal.toLocaleString()}
                </span>
              </div>

              {/* Guarantees Assures Badge */}
              <div className="bg-emerald-50 bg-opacity-70 border border-emerald-100 rounded-2xl p-3.5 text-[10px] text-emerald-800 font-semibold leading-relaxed flex items-start gap-2">
                <ShieldCheck size={18} className="text-emerald-500 shrink-0" />
                <span>We guarantee <strong>100% Genuine, Sealed Box</strong> factory lines. Returns and replacements claims supported instantly within 7 days.</span>
              </div>

            </aside>

          </div>
        ) : (
          /* SECTION B: ORDER PLACED SUCCESS PANEL (Voucher screen receipt) */
          <motion.div
            key="success-receipt"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-xl mx-auto bg-white border border-gray-100 rounded-3xl p-6 sm:p-10 text-center shadow-2xl relative overflow-hidden"
          >
            {/* Top decorative stripe */}
            <div className="absolute top-0 inset-x-0 h-2.5 bg-emerald-500" />
            
            {/* Checked visual icon animations */}
            <div className="bg-emerald-50 text-emerald-500 p-4 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6 shadow shadow-emerald-50">
              <Check className="stroke-[3.5]" size={36} />
            </div>

            <span className="text-[10px] uppercase font-mono tracking-widest text-emerald-600 font-bold bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100">
              Invoice Issued & Ready
            </span>

            <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mt-4 leading-tight">
              Order Placed Successfully!
            </h2>
            <p className="text-xs sm:text-sm text-gray-400 mt-2 leading-relaxed max-w-sm mx-auto">
              Thank you, <strong className="text-gray-800">{placedOrder.fullName}</strong>. We have registered your tracking number and prepared your tech package.
            </p>

            {/* Custom Interactive Receipt Details cards */}
            <div className="bg-gray-50 border border-gray-150 p-5 rounded-2xl text-left mt-8 text-xs flex flex-col gap-2.5">
              <div className="flex justify-between border-b border-gray-100 pb-2.5">
                <span className="text-gray-400 font-bold font-mono">INVOICE ID:</span>
                <span className="font-extrabold text-gray-800 font-mono tracking-wide">{placedOrder.id}</span>
              </div>
              <div className="flex justify-between border-b border-gray-100 pb-2.5">
                <span className="text-gray-400 font-bold font-mono">TRACKING KEY:</span>
                <span className="font-extrabold text-primary font-mono tracking-wide hover:underline select-all">{placedOrder.trackingNumber}</span>
              </div>
              <div className="flex justify-between border-b border-gray-100 pb-2.5">
                <span className="text-gray-400 font-bold font-mono">DELIVERY DESTINATION:</span>
                <span className="font-extrabold text-gray-850 truncate max-w-[200px]">{placedOrder.address}, {placedOrder.city}</span>
              </div>
              <div className="flex justify-between border-b border-gray-100 pb-2.5">
                <span className="text-gray-400 font-bold font-mono">PAYMENT MODE:</span>
                <span className="font-extrabold text-indigo-700 font-mono uppercase">{placedOrder.paymentMethod}</span>
              </div>
              {placedOrder.senderNumber && (
                <div className="flex justify-between border-b border-gray-100 pb-2.5">
                  <span className="text-gray-400 font-bold font-mono">SENDER MOBILE:</span>
                  <span className="font-extrabold text-gray-800 font-mono">{placedOrder.senderNumber}</span>
                </div>
              )}
              {placedOrder.transactionCode && (
                <div className="flex justify-between border-b border-gray-100 pb-2.5">
                  <span className="text-gray-400 font-bold font-mono">TRANSACTION CODE:</span>
                  <span className="font-extrabold text-emerald-600 font-mono uppercase tracking-widest select-all">{placedOrder.transactionCode}</span>
                </div>
              )}
              <div className="flex justify-between pt-1 font-bold text-gray-900">
                <span className="text-gray-650 font-bold uppercase font-mono">Total paid BDT:</span>
                <span className="text-base font-black text-primary font-mono select-all">৳{placedOrder.totalAmount.toLocaleString()}</span>
              </div>
            </div>

            {/* Immediate tracking redirect links */}
            <div className="mt-8 flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => setRoute('dashboard')}
                className="flex-1 bg-gray-900 hover:bg-slate-950 text-white font-extrabold text-xs uppercase py-3 rounded-xl tracking-wider transition-all cursor-pointer shadow-md"
                id="receipt-track-order"
              >
                Track Live Order inside Dashboard
              </button>
              <button
                onClick={() => {
                  setCategoryFilter(null);
                  setRoute('shop');
                }}
                className="flex-1 border border-gray-200 text-gray-550 font-bold text-xs py-3 rounded-xl hover:bg-gray-50 transition-colors cursor-pointer"
              >
                ← Back to Catalog
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
