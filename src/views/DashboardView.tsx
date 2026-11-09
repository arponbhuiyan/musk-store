/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { ProductCard } from '../components/ProductCard';
import { SEOHead } from '../components/SEOHead';
import { GoogleDriveManager, GoogleSignInButton } from '../components/GoogleDriveManager';
import { googleSignIn } from '../services/googleDrive';
import {
  User,
  ShoppingBag,
  Heart,
  MapPin,
  Compass,
  CheckCircle,
  Truck,
  PackageCheck,
  CheckCircle2,
  Calendar,
  XCircle,
  Search,
  Check,
  Sparkles,
  ClipboardList,
  LogOut,
  LogIn,
  ShieldCheck,
  HardDrive
} from 'lucide-react';
import { motion } from 'motion/react';

export const DashboardView: React.FC = () => {
  const {
    orders,
    wishlist,
    products,
    userSession,
    updateProfile,
    loginUser,
    logoutUser,
    isAdmin,
    adminEmail,
    setRoute,
    setCategoryFilter
  } = useApp();

  const [activeTab, setActiveTab] = useState<'orders' | 'wishlist' | 'addresses' | 'profile' | 'track' | 'drive'>('orders');

  // Sign-In Form Inputs (when logged out)
  const [loginName, setLoginName] = useState('');
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPhone, setLoginPhone] = useState('');

  // Track Orders Tool inputs
  const [trackInput, setTrackInput] = useState('');
  const [trackedOrder, setTrackedOrder] = useState<any | null>(null);
  const [trackError, setTrackError] = useState<string | null>(null);

  // Profile Inputs state
  const [fullName, setFullName] = useState(userSession.fullName);
  const [email, setEmail] = useState(userSession.email);
  const [phone, setPhone] = useState(userSession.phone);
  const [address, setAddress] = useState(userSession.address);
  const [city, setCity] = useState(userSession.city);
  const [postalCode, setPostalCode] = useState(userSession.postalCode);
  const [profileSuccess, setProfileSuccess] = useState(false);

  // Addresses Inputs state
  const [savedAddresses, setSavedAddresses] = useState([
    { id: '1', title: 'Home Address (Default)', line: userSession.address, city: userSession.city, zip: userSession.postalCode },
    { id: '2', title: 'Office Space', line: 'House 55, Road 11, Banani', city: 'Dhaka', zip: '1213' }
  ]);

  // Pull wishlist products fully
  const wishlistProducts = useMemo(() => {
    return products.filter((p) => wishlist.includes(p.id));
  }, [products, wishlist]);

  // Trigger quick tracker search
  const handleTrackingSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!trackInput.trim()) return;

    const found = orders.find(
      (o) =>
        o.trackingNumber.toUpperCase() === trackInput.trim().toUpperCase() ||
        o.id.toUpperCase() === trackInput.trim().toUpperCase()
    );

    if (found) {
      setTrackedOrder(found);
      setTrackError(null);
    } else {
      setTrackedOrder(null);
      setTrackError('Could not find orders with that reference number in Bangladesh logs.');
    }
  };

  // Profile updates submit
  const handleProfileUpdateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({ fullName, email, phone, address, city, postalCode, loggedIn: true });
    setProfileSuccess(true);
    setTimeout(() => setProfileSuccess(false), 2500);
  };

  const handleCustomerLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginEmail.trim()) return;
    const nameToUse = loginName.trim() || loginEmail.split('@')[0];
    loginUser({
      fullName: nameToUse,
      email: loginEmail.trim(),
      phone: loginPhone.trim()
    });
    setFullName(nameToUse);
    setEmail(loginEmail.trim());
    if (loginPhone.trim()) setPhone(loginPhone.trim());
  };

  const handleGoogleSignInClick = async () => {
    try {
      const res = await googleSignIn();
      if (res?.user?.email) {
        const displayName = res.user.displayName || res.user.email.split('@')[0];
        loginUser({
          fullName: displayName,
          email: res.user.email
        });
        setFullName(displayName);
        setEmail(res.user.email);
      }
    } catch (err) {
      console.error('Google Sign-In failed:', err);
    }
  };

  const handleLogoutClick = () => {
    logoutUser();
    setFullName('');
    setEmail('');
    setPhone('');
  };

  // Quick Tracker Trigger from order row click
  const handleTrackQuickClick = (order: any) => {
    setTrackInput(order.trackingNumber);
    setTrackedOrder(order);
    setActiveTab('track');
    setTrackError(null);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 md:py-12" id="dashboard-container">
      <SEOHead
        title="My Customer Portal - Manage Orders & Profiles"
        description="Verify active logistics tracking numbers, preview saved wishlist accessories, manage billing address slots, and customize notifications."
      />

      {/* Top Banner greeting user */}
      <div className="bg-gray-950 text-white rounded-3xl p-6 md:p-8 border border-gray-900 mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-primary/5 rounded-full filter blur-xl transform translate-x-[20%]" />
        <div className="z-10 relative">
          <span className="text-primary text-[10px] font-extrabold uppercase font-mono tracking-widest block mb-1">
            {isAdmin ? 'Verified Store Administrator' : userSession.loggedIn ? 'Registered Smart Client' : 'Customer Portal Access'}
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            {userSession.loggedIn ? `Assalamu Alaikum, ${userSession.fullName}!` : 'Welcome to Your Account Portal'}
          </h1>
          <p className="text-gray-400 text-xs sm:text-sm mt-1 max-w-lg font-medium">
            {userSession.loggedIn
              ? 'Manage your past invoices, verify courier status maps, and catalog list your favorites directly from your personalized control workspace.'
              : 'Sign in below to manage your saved profile, or track your Steadfast Courier orders anytime.'}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 self-stretch md:self-auto z-10">
          {userSession.loggedIn ? (
            <>
              <div className="bg-gray-900/60 border border-gray-800 p-3.5 rounded-2xl flex items-center gap-3 text-xs">
                <div className="w-9 h-9 rounded-full bg-primary/20 text-primary flex items-center justify-center font-black">
                  {userSession.fullName.charAt(0).toUpperCase()}
                </div>
                <div className="text-left font-mono">
                  <span className="font-sans font-bold text-gray-200 block leading-tight">{userSession.fullName}</span>
                  <span className="text-gray-400 font-semibold block text-[10.5px] mt-0.5">
                    {isAdmin && adminEmail ? adminEmail : userSession.email}
                  </span>
                </div>
              </div>

              {isAdmin && (
                <button
                  onClick={() => setRoute('admin')}
                  className="flex items-center gap-1.5 bg-cyan-500/15 hover:bg-cyan-500/25 text-cyan-400 border border-cyan-500/30 font-bold text-xs px-4 py-3 rounded-2xl transition-all cursor-pointer"
                >
                  <ShieldCheck size={15} />
                  Admin Panel
                </button>
              )}

              <button
                onClick={handleLogoutClick}
                className="flex items-center gap-2 bg-red-500/15 hover:bg-red-600 text-red-400 hover:text-white border border-red-500/30 hover:border-red-600 font-bold text-xs px-4 py-3 rounded-2xl transition-all cursor-pointer shadow-sm"
                id="dashboard-logout-btn"
              >
                <LogOut size={15} />
                Logout
              </button>
            </>
          ) : (
            <button
              onClick={() => setRoute('admin')}
              className="flex items-center gap-2 bg-gray-900 hover:bg-gray-800 text-gray-300 border border-gray-800 font-bold text-xs px-4 py-3 rounded-2xl transition-all cursor-pointer"
            >
              <ShieldCheck size={15} className="text-primary" />
              Store Owner / Admin Login
            </button>
          )}
        </div>
      </div>

      {/* Quick Sign-In Banner when Logged Out */}
      {!userSession.loggedIn && (
        <div className="bg-white border border-gray-200 rounded-3xl p-6 sm:p-8 mb-8 shadow-sm">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div>
              <h2 className="text-lg font-extrabold text-gray-950 flex items-center gap-2">
                <LogIn size={19} className="text-primary" />
                Sign In to Customer Account
              </h2>
              <p className="text-xs text-gray-500 mt-1">
                Sign in with Google or enter your name and email address to access your saved profile and Google Drive cloud workspace.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 flex-wrap">
              <GoogleSignInButton onClick={handleGoogleSignInClick} />
              <span className="text-xs text-gray-400 font-bold text-center">OR</span>
              <form onSubmit={handleCustomerLogin} className="flex flex-col sm:flex-row gap-2.5 flex-1">
                <input
                  type="text"
                  required
                  placeholder="Your Full Name"
                  value={loginName}
                  onChange={(e) => setLoginName(e.target.value)}
                  className="px-4 py-2.5 rounded-xl border border-gray-200 text-xs font-semibold focus:outline-none focus:border-primary"
                />
                <input
                  type="email"
                  required
                  placeholder="Email Address"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  className="px-4 py-2.5 rounded-xl border border-gray-200 text-xs font-semibold focus:outline-none focus:border-primary"
                />
                <button
                  type="submit"
                  className="bg-primary hover:bg-primary-hover text-white font-bold text-xs px-5 py-2.5 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 shrink-0"
                >
                  <LogIn size={14} />
                  Sign In
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* LEFT COLUMN: Navigation Drawer tabs buttons */}
        <aside className="lg:col-span-3 flex flex-row lg:flex-col gap-1.5 overflow-x-auto no-scrollbar bg-white border border-gray-100 p-3 rounded-2xl shadow-sm lg:sticky lg:top-[150px]">
          <button
            onClick={() => setActiveTab('orders')}
            className={`w-full text-left py-3 px-4 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2.5 whitespace-nowrap transition-all cursor-pointer select-none ${
              activeTab === 'orders' ? 'bg-primary-light text-primary' : 'hover:bg-gray-50 text-gray-600'
            }`}
          >
            <ShoppingBag size={17} />
            My Orders ({orders.length})
          </button>
          <button
            onClick={() => setActiveTab('wishlist')}
            className={`w-full text-left py-3 px-4 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2.5 whitespace-nowrap transition-all cursor-pointer select-none ${
              activeTab === 'wishlist' ? 'bg-primary-light text-primary' : 'hover:bg-gray-50 text-gray-600'
            }`}
          >
            <Heart size={17} />
            Wishlist ({wishlist.length})
          </button>
          <button
            onClick={() => setActiveTab('addresses')}
            className={`w-full text-left py-3 px-4 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2.5 whitespace-nowrap transition-all cursor-pointer select-none ${
              activeTab === 'addresses' ? 'bg-primary-light text-primary' : 'hover:bg-gray-50 text-gray-600'
            }`}
          >
            <MapPin size={17} />
            Saved Addresses
          </button>
          <button
            onClick={() => setActiveTab('profile')}
            className={`w-full text-left py-3 px-4 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2.5 whitespace-nowrap transition-all cursor-pointer select-none ${
              activeTab === 'profile' ? 'bg-primary-light text-primary' : 'hover:bg-gray-50 text-gray-600'
            }`}
          >
            <User size={17} />
            Profile Settings
          </button>
          <button
            onClick={() => setActiveTab('track')}
            className={`w-full text-left py-3 px-4 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2.5 whitespace-nowrap transition-all cursor-pointer select-none ${
              activeTab === 'track' ? 'bg-primary-light text-primary' : 'hover:bg-gray-50 text-gray-600'
            }`}
          >
            <Compass size={17} />
            Track Courier Orders
          </button>
          <button
            onClick={() => setActiveTab('drive')}
            className={`w-full text-left py-3 px-4 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2.5 whitespace-nowrap transition-all cursor-pointer select-none ${
              activeTab === 'drive' ? 'bg-blue-50 text-blue-600' : 'hover:bg-gray-50 text-gray-600'
            }`}
          >
            <HardDrive size={17} />
            Google Drive Cloud
          </button>

          {userSession.loggedIn && (
            <button
              onClick={handleLogoutClick}
              className="w-full text-left py-3 px-4 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2.5 whitespace-nowrap transition-all cursor-pointer select-none text-red-600 hover:bg-red-50 lg:mt-2 lg:border-t lg:border-gray-100"
              id="sidebar-logout-btn"
            >
              <LogOut size={17} />
              Logout Account
            </button>
          )}
        </aside>

        {/* RIGHT COLUMN: Active view modules boxes */}
        <main className="lg:col-span-9 bg-white border border-gray-100 rounded-3xl p-6 sm:p-8 shadow-sm min-h-[400px]">
          
          {/* TAB 1: MY ORDERS SUMMARY */}
          {activeTab === 'orders' && (
            <div>
              <h2 className="text-xl font-extrabold text-gray-950 mb-6 flex items-center gap-1.5 pb-2.5 border-b border-gray-55">
                <ShoppingBag size={20} className="text-primary" />
                Purchase & Invoicing History ({orders.length})
              </h2>

              {orders.length > 0 ? (
                <div className="flex flex-col gap-6">
                  {orders.map((order) => (
                    <div
                      key={order.id}
                      className="border border-gray-150 rounded-2xl overflow-hidden hover:border-gray-300 transition-all shadow-sm"
                    >
                      {/* Top status header */}
                      <div className="bg-gray-50 border-b border-gray-150 p-4 flex flex-col sm:flex-row justify-between gap-3 text-xs">
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-x-4 gap-y-1 text-gray-550">
                          <div>
                            <span className="block font-bold">DATE ORDERED:</span>
                            <span className="font-semibold text-gray-800 font-mono mt-0.5 inline-block">
                              {new Date(order.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                          <div>
                            <span className="block font-bold">INVOICE ID:</span>
                            <span className="font-bold text-gray-850 font-mono">{order.id}</span>
                          </div>
                          <div>
                            <span className="block font-bold">SHIPPED TO:</span>
                            <span className="font-semibold text-gray-800 truncate block mt-0.5" title={order.fullName}>
                              {order.fullName}
                            </span>
                          </div>
                          <div>
                            <span className="block font-bold">BILL PAID BDT:</span>
                            <span className="font-extrabold text-primary font-mono block mt-0.5">
                              ৳{order.totalAmount.toLocaleString()}
                            </span>
                          </div>
                        </div>

                        <div className="flex flex-wrap items-center gap-2 self-start sm:self-center">
                          {/* Order Status badge labels */}
                          <span
                            className={`py-1 px-3 text-[10px] font-mono font-bold uppercase rounded-full border ${
                              {
                                Pending: 'bg-amber-50 text-amber-600 border-amber-200/50',
                                Processing: 'bg-sky-50 text-sky-600 border-sky-200/50 animate-pulse',
                                Shipped: 'bg-indigo-50 text-indigo-600 border-indigo-200/50',
                                Delivered: 'bg-emerald-50 text-emerald-600 border-emerald-200/50',
                                Cancelled: 'bg-red-50 text-red-600 border-red-200/50'
                              }[order.orderStatus]
                            }`}
                          >
                            ● {order.orderStatus}
                          </span>

                          <button
                            onClick={() => handleTrackQuickClick(order)}
                            className="bg-gray-900 hover:bg-slate-950 text-white font-mono font-bold py-1 px-3.5 border rounded-full tracking-wide text-[10px] uppercase cursor-pointer"
                          >
                            Track Live
                          </button>
                        </div>
                      </div>

                      {/* Items details nested list */}
                      <div className="p-4 flex flex-col gap-3.5 divide-y divide-gray-100">
                        {order.items.map((item: any, id: number) => (
                          <div key={id} className="flex justify-between items-center text-xs pt-3.5 first:pt-0">
                            <div className="flex items-center gap-3.5">
                              <img
                                src={item.productImage}
                                alt=""
                                className="w-12 h-12 object-cover border rounded-xl bg-gray-50 shrink-0 referrerPolicy='no-referrer'"
                                referrerPolicy="no-referrer"
                              />
                              <div>
                                <span className="font-bold text-gray-900 block leading-snug">
                                  {item.productName}
                                </span>
                                <span className="text-[10px] text-gray-400 font-bold block mt-0.5 uppercase font-mono">
                                  Color: {item.selectedColor || 'Default'} • Qty: {item.quantity}
                                </span>
                              </div>
                            </div>
                            <span className="font-bold text-gray-900 font-mono text-right">
                              ৳{(item.price * item.quantity).toLocaleString()}
                            </span>
                          </div>
                        ))}
                      </div>

                      {/* Summary footer */}
                      <div className="bg-gray-50/50 px-4 py-3.5 border-t border-gray-100 text-[11px] text-gray-550 font-bold font-mono text-left flex flex-col sm:flex-row justify-between gap-2">
                        <div className="flex flex-wrap gap-x-4 gap-y-1">
                          <span>COURIER CARRIER: Steadfast Courier</span>
                          <span>TRACK REF: {order.trackingNumber}</span>
                          <span className="text-indigo-600">METHOD: {order.paymentMethod}</span>
                        </div>
                        {(order.senderNumber || order.transactionCode) && (
                          <div className="flex flex-wrap gap-x-4 gap-y-1 text-emerald-600 sm:text-right">
                            {order.senderNumber && <span>SENDER: {order.senderNumber}</span>}
                            {order.transactionCode && <span>TXID: <span className="underline select-all">{order.transactionCode}</span></span>}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                /* Empty state past orders list */
                <div className="py-12 text-center flex flex-col items-center">
                  <div className="p-4 bg-gray-50 border rounded-full text-gray-400 mb-4">
                    <ShoppingBag size={28} />
                  </div>
                  <h4 className="font-sans font-bold text-gray-900 mb-1">No Past Purchase Invoices Saved</h4>
                  <p className="text-xs text-gray-400 max-w-sm mt-0.5 leading-relaxed">
                    You haven't completed any transaction logs on this browser yet! Head back to our store and place an order today.
                  </p>
                  <button
                    onClick={() => {
                      setCategoryFilter(null);
                      setRoute('shop');
                    }}
                    className="bg-primary hover:bg-primary-hover text-white text-xs font-bold py-2.5 px-6 rounded-full mt-4 cursor-pointer shadow shadow-primary/20"
                  >
                    Browse Campaign Products
                  </button>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: MY WISHLIST CARD PREVIEWS */}
          {activeTab === 'wishlist' && (
            <div>
              <h2 className="text-xl font-extrabold text-gray-950 mb-6 flex items-center gap-1.5 pb-2.5 border-b border-gray-55">
                <Heart size={20} className="text-red-500 fill-red-500" />
                My Saved Wishlist Favorites ({wishlist.length})
              </h2>

              {wishlistProducts.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                  {wishlistProducts.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              ) : (
                /* Wishlist empty */
                <div className="py-12 text-center flex flex-col items-center">
                  <div className="p-4 bg-gray-50 border rounded-full text-gray-400 mb-4">
                    <Heart size={28} />
                  </div>
                  <h4 className="font-sans font-bold text-gray-900 mb-1">Your wishlist matches blank</h4>
                  <p className="text-xs text-gray-400 max-w-sm mt-0.5 leading-relaxed">
                    Voucher click the heart badges on our earbuds, smartwatches, or cases to save them dynamically on this tab drawer!
                  </p>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: SAVED ADDRESS SLOTS */}
          {activeTab === 'addresses' && (
            <div>
              <h2 className="text-xl font-extrabold text-gray-950 mb-6 flex items-center gap-1.5 pb-2.5 border-b border-gray-55">
                <MapPin size={20} className="text-primary" />
                My Saved Shipping Cargo Destinations
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {savedAddresses.map((addr) => (
                  <div key={addr.id} className="border border-gray-200 hover:border-primary/20 p-5 rounded-2xl relative bg-gray-50/20 text-xs">
                    <span className="font-extrabold text-gray-900 uppercase block tracking-wider pb-2 border-b border-gray-100 mb-3">{addr.title}</span>
                    <p className="text-gray-500 font-medium leading-relaxed mb-4">{addr.line}</p>
                    <div className="grid grid-cols-2 text-[11px] text-gray-400 font-bold font-mono">
                      <span>CITY: {addr.city}</span>
                      <span className="text-right">ZIP: {addr.zip}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: PROFILE INFO SETTINGS */}
          {activeTab === 'profile' && (
            <div>
              <h2 className="text-xl font-extrabold text-gray-950 mb-5 flex items-center gap-1.5 pb-2.5 border-b border-gray-55">
                <User size={20} className="text-primary" />
                Customer Account Profile Configuration
              </h2>

              <form onSubmit={handleProfileUpdateSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="text-xs font-bold text-gray-600 block mb-1">Full Legal Name</label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full bg-gray-50/70 border border-gray-250 p-3 rounded-xl text-xs sm:text-sm text-gray-800 focus:outline-none focus:ring-1 focus:ring-primary focus:bg-white text-left"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-600 block mb-1">Email Address</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-gray-50/70 border border-gray-250 p-3 rounded-xl text-xs sm:text-sm text-gray-800 focus:outline-none focus:ring-1 focus:ring-primary focus:bg-white text-left"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-600 block mb-1">Primary Telephone Contact</label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full bg-gray-50/70 border border-gray-250 p-3 rounded-xl text-xs sm:text-sm text-gray-800 focus:outline-none focus:ring-1 focus:ring-primary focus:bg-white text-left"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-600 block mb-1">Select Default Delivery City</label>
                  <select
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full bg-gray-50/70 border border-gray-250 p-3 rounded-xl text-xs sm:text-sm text-gray-850 focus:outline-none focus:ring-1 focus:ring-primary focus:bg-white"
                    title="profile city default Choice"
                  >
                    <option value="Dhaka">Dhaka</option>
                    <option value="Chattogram">Chattogram</option>
                    <option value="Sylhet">Sylhet</option>
                  </select>
                </div>
                <div className="sm:col-span-2">
                  <label className="text-xs font-bold text-gray-600 block mb-1">Permanent Shipping Address</label>
                  <input
                    type="text"
                    required
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="w-full bg-gray-50/70 border border-gray-250 p-3 rounded-xl text-xs sm:text-sm text-gray-800 focus:outline-none focus:ring-1 focus:ring-primary focus:bg-white text-left"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-600 block mb-1">Resident Postal Zip Code</label>
                  <input
                    type="text"
                    required
                    value={postalCode}
                    onChange={(e) => setPostalCode(e.target.value)}
                    className="w-full bg-gray-50/70 border border-gray-250 p-3 rounded-xl text-xs sm:text-sm text-gray-800 focus:outline-none focus:ring-1 focus:ring-primary focus:bg-white text-left"
                  />
                </div>

                <div className="sm:col-span-2 pt-4 border-t border-gray-50 flex items-center justify-between gap-4">
                  <button
                    type="submit"
                    className="bg-primary hover:bg-primary-hover text-white font-mono font-bold py-3 px-8 text-xs uppercase tracking-wider rounded-xl cursor-pointer shadow shadow-primary/10 transition-all text-center"
                    id="profile-save-button"
                  >
                    Save Changes & Synchronize
                  </button>

                  {profileSuccess && (
                    <span className="text-emerald-600 bg-emerald-50 border border-emerald-100 rounded-xl py-2 px-4 text-xs font-semibold flex items-center gap-1.5 animate-bounce">
                      <Check size={14} /> Profile metadata synchronized perfectly!
                    </span>
                  )}
                </div>
              </form>
            </div>
          )}

          {/* TAB 5: TRACK ORDERS UTILITY (Progessive bento map stats) */}
          {activeTab === 'track' && (
            <div>
              <h2 className="text-xl font-extrabold text-gray-950 mb-4 flex items-center gap-1.5 pb-2 border-b border-gray-55">
                <Compass size={20} className="text-primary" />
                Live Order Courier Cargo Tracker
              </h2>
              <p className="text-xs text-gray-400 mb-6 font-semibold">Entered references fetch real-time progressive testing logs compiled from our Dhaka logistics base.</p>

              {/* Enter Tracking key inputs */}
              <form onSubmit={handleTrackingSearch} className="flex gap-2 max-w-lg mb-8" id="tracker-form">
                <input
                  type="text"
                  placeholder="Enter Invoice Serial ID or Tracking key (e.g. TRK12345)"
                  value={trackInput}
                  onChange={(e) => setTrackInput(e.target.value)}
                  className="flex-1 bg-gray-50 border border-gray-250 pl-4 py-3 text-xs uppercase font-mono font-bold rounded-xl focus:outline-none focus:ring-1 focus:ring-primary focus:bg-white text-left"
                />
                <button
                  type="submit"
                  className="bg-gray-900 hover:bg-slate-950 text-white font-extrabold text-xs uppercase px-5 rounded-xl flex items-center gap-2 cursor-pointer"
                >
                  <Search size={14} />
                  Trace Route
                </button>
              </form>

              {trackError && <div className="text-xs text-red-500 bg-red-50 p-3 rounded-xl border border-red-100/40 mb-6">{trackError}</div>}

              {/* Render Tracking Timeline graphics */}
              {trackedOrder ? (
                <div className="bg-gray-50 border border-gray-150 rounded-2xl p-6 shadow-sm">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-gray-200 mb-6">
                    <div>
                      <span className="text-xs text-gray-400 font-bold block">TRACKING REFERENCE:</span>
                      <span className="text-sm font-extrabold text-gray-900 font-mono select-all uppercase">{trackedOrder.trackingNumber}</span>
                    </div>
                    <div className="text-left sm:text-right">
                      <span className="text-xs text-gray-400 font-bold block">INVOICE STAGE:</span>
                      <span className="text-sm font-black text-primary font-mono uppercase bg-primary-light border border-primary-light/40 py-0.5 px-3 rounded-full inline-block mt-0.5">{trackedOrder.orderStatus}</span>
                    </div>
                  </div>

                  {/* Progressive visual steps bullets circles bar */}
                  <div className="relative py-4">
                    {/* Visual straight bar path */}
                    <div className="absolute top-[41px] inset-x-8 h-1 bg-gray-200 z-0" />
                    
                    {/* Status progress bar fill percentage based on orderStatus */}
                    <div
                      className="absolute top-[41px] left-8 h-1 bg-primary z-0 transition-all duration-300"
                      style={{
                        width: {
                          Pending: '10%',
                          Processing: '35%',
                          Shipped: '65%',
                          Delivered: '100%',
                          Cancelled: '0%'
                        }[trackedOrder.orderStatus as string] || '0%'
                      }}
                    />

                    <div className="grid grid-cols-4 gap-2 z-10 relative">
                      {/* Step 1: Received */}
                      <div className="flex flex-col items-center text-center">
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center border-2 border-white shadow-md z-15 ${
                          trackedOrder.orderStatus !== 'Cancelled' ? 'bg-primary text-white font-bold' : 'bg-gray-200'
                        }`}>
                          <CheckCircle2 size={24} />
                        </div>
                        <span className="text-[11px] font-extrabold text-gray-900 mt-2 block">Order Received</span>
                        <span className="text-[9px] text-gray-400 block font-mono mt-0.5">Ref: Pending</span>
                      </div>

                      {/* Step 2: Packaging */}
                      <div className="flex flex-col items-center text-center">
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center border-2 border-white shadow-md z-15 ${
                          ['Processing', 'Shipped', 'Delivered'].includes(trackedOrder.orderStatus)
                            ? 'bg-primary text-white'
                            : 'bg-gray-200 text-gray-400'
                        }`}>
                          <ClipboardList size={20} />
                        </div>
                        <span className="text-[11px] font-extrabold text-gray-900 mt-2 block">Sealed & Packed</span>
                        <span className="text-[9px] text-gray-400 block font-mono mt-0.5">Mirsharai Hub</span>
                      </div>

                      {/* Step 3: Courier */}
                      <div className="flex flex-col items-center text-center">
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center border-2 border-white shadow-md z-15 ${
                          ['Shipped', 'Delivered'].includes(trackedOrder.orderStatus)
                            ? 'bg-primary text-white'
                            : 'bg-gray-200 text-gray-400'
                        }`}>
                          <Truck size={20} />
                        </div>
                        <span className="text-[11px] font-extrabold text-gray-900 mt-2 block">With Dispatcher</span>
                        <span className="text-[9px] text-gray-400 block font-mono mt-0.5">Express cargo</span>
                      </div>

                      {/* Step 4: Delivered */}
                      <div className="flex flex-col items-center text-center">
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center border-2 border-white shadow-md z-15 ${
                          trackedOrder.orderStatus === 'Delivered'
                            ? 'bg-emerald-500 text-white animate-bounce'
                            : 'bg-gray-200 text-gray-400'
                        }`}>
                          <PackageCheck size={20} />
                        </div>
                        <span className="text-[11px] font-extrabold text-gray-900 mt-2 block">Delivered</span>
                        <span className="text-[9px] text-gray-400 block font-mono mt-0.5">Tested & Safe</span>
                      </div>
                    </div>
                  </div>

                  {/* Delivery courier context notes */}
                  <div className="mt-8 bg-white border border-gray-150 p-4 rounded-xl text-xs flex flex-col gap-1.5 leading-relaxed text-gray-600">
                    <div><strong>Courier partner</strong>: Steadfast Courier</div>
                    <div><strong>Delivery date</strong>: Within 3-4 days all over Bangladesh</div>
                    <div className="text-[10px] text-gray-405 font-mono italic">Need packaging adjustments? Call customer care on +880 1555-123456 citing INVOICE: {trackedOrder.id}.</div>
                  </div>

                </div>
              ) : (
                /* No tracking active placeholder */
                <div className="border border-gray-150 p-8 rounded-2xl bg-gray-55 bg-gray-50/50 text-center text-xs text-gray-450 italic flex items-center gap-2 justify-center">
                  <ClipboardList size={22} className="text-gray-400 shrink-0" />
                  <span>Enter any invoice reference (like one from My Orders list) in the input form above to pull real-time progressive tracking charts.</span>
                </div>
              )}
            </div>
          )}

          {/* TAB 6: GOOGLE DRIVE CLOUD WORKSPACE */}
          {activeTab === 'drive' && (
            <GoogleDriveManager mode="customer" />
          )}

        </main>
      </div>
    </div>
  );
};
