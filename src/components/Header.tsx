/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import {
  Phone,
  Facebook,
  Search,
  User,
  Heart,
  ShoppingBag,
  Menu,
  X,
  ChevronDown,
  Zap,
  LogOut
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const Header: React.FC = () => {
  const {
    cart,
    wishlist,
    activeView,
    setRoute,
    searchQuery,
    setSearchQuery,
    setCategoryFilter,
    setBrandFilter,
    categoryFilter,
    userSession,
    orders,
    isAdmin,
    logoutUser
  } = useApp();

  const pendingOrdersCount = orders.filter((o) => o.orderStatus === 'Pending').length;

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [searchInput, setSearchInput] = useState(searchQuery);

  // Monitor scroll for premium sticky transition effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Calculate cart items total count
  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  // Search submit handler
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchQuery(searchInput);
    setCategoryFilter(null);
    setBrandFilter(null);
    setRoute('shop');
  };

  const handleNavClick = (view: typeof activeView, category?: string, brand?: string) => {
    setCategoryFilter(category || null);
    setBrandFilter(brand || null);
    setRoute(view);
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      {/* 1. TOP BAR */}
      <div className="bg-[#1F2937] text-white text-[10px] px-8 py-1.5 flex justify-between items-center transition-all duration-300">
        <div className="max-w-7xl mx-auto w-full flex justify-between items-center px-4">
          <div className="flex gap-4">
            <a href="tel:+8801816505013" className="hover:text-[#F26722] transition-colors font-medium">
              📞 +880 1816-505013
            </a>
            <span className="font-medium">🚚 Free Delivery over ৳1,500</span>
          </div>
          <div className="flex gap-4 uppercase tracking-wider font-semibold">
            <a href="https://www.facebook.com/themuskgadgets" target="_blank" rel="noreferrer" className="hover:text-[#F26722] transition-colors">
              Facebook
            </a>
            <button
              onClick={() => handleNavClick('dashboard')}
              className="hover:text-[#F26722] transition-colors uppercase cursor-pointer"
            >
              Support
            </button>
          </div>
        </div>
      </div>

      {/* 2. MAIN NAVIGATION HEADER */}
      <header
        className={`w-full z-40 transition-all duration-300 ${
          isScrolled
            ? 'fixed top-0 bg-white/95 backdrop-blur-md shadow-sm border-b border-gray-100 py-3'
            : 'relative bg-white border-b border-gray-100 py-4'
        }`}
      >
        <div className="max-w-7xl mx-auto px-8 flex items-center justify-between gap-4">
          
          {/* Logo & Slogan */}
          <button
            onClick={() => handleNavClick('home')}
            className="flex flex-col group cursor-pointer text-left focus:outline-none"
            id="header-logo-btn"
          >
            <h1 className="text-2xl font-black tracking-tighter text-[#F26722] leading-none group-hover:opacity-90 transition-opacity">
              MUSK
            </h1>
            <span className="text-[8px] uppercase tracking-[0.2em] font-bold text-gray-400 mt-0.5">
              Technology For Smartness
            </span>
          </button>

          {/* Search Bar - Responsive Medium Up */}
          <form
            onSubmit={handleSearchSubmit}
            className="hidden md:flex flex-1 max-w-xl mx-12 relative"
            id="desktop-search-form"
          >
            <input
              type="text"
              placeholder="Search for gadgets, accessories..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="w-full bg-gray-50 border border-gray-200 rounded-full py-2 px-5 text-sm outline-none focus:ring-1 focus:ring-[#F26722] focus:border-transparent font-sans"
            />
            <button
              type="submit"
              className="absolute right-3 top-1/2 -translate-y-1/2 bg-[#F26722] p-1.5 rounded-full text-white hover:opacity-95 transition-all cursor-pointer flex items-center justify-center border-none"
              aria-label="Search"
            >
              <Search size={12} strokeWidth={3} />
            </button>
          </form>

          {/* User Icons Group */}
          <div className="flex items-center gap-6">
            {/* Search Toggle Mobile Only */}
            <button
              onClick={() => handleNavClick('shop')}
              className="md:hidden p-2 text-gray-600 hover:text-primary rounded-full hover:bg-gray-50 cursor-pointer"
              aria-label="Search Shop"
              id="mobile-search-trigger"
            >
              <Search size={22} />
            </button>

            {/* Dashboard Routing */}
            <button
              onClick={() => handleNavClick('dashboard')}
              className={`flex flex-col items-center cursor-pointer group bg-transparent border-0 p-0 focus:outline-none relative ${
                activeView === 'dashboard' ? 'text-primary' : 'text-[#1F2937] hover:text-[#F26722]'
              }`}
              title="My Account"
              id="account-btn"
            >
              <User size={20} strokeWidth={1.5} className="mb-1 transition-colors group-hover:text-[#F26722]" />
              <span className="text-[9px] uppercase font-bold tracking-tighter">Account</span>
              <span className="absolute bottom-full left-1/2 -translate-x-1/2 bg-gray-900 text-white text-[10px] py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap mb-1">
                {userSession.loggedIn ? userSession.fullName : 'Sign In'}
              </span>
            </button>

            {/* Wishlist Tracking */}
            <button
              onClick={() => handleNavClick('dashboard')} // Dashboard integrates Wishlist
              className="flex flex-col items-center cursor-pointer group bg-transparent border-0 p-0 focus:outline-none relative text-[#1F2937] hover:text-[#F26722]"
              title="My Wishlist"
              id="wishlist-btn"
            >
              <div className="relative">
                <Heart size={20} strokeWidth={1.5} className={`mb-1 transition-colors group-hover:text-[#F26722] ${wishlist.length > 0 ? 'fill-red-500 text-red-500' : ''}`} />
                {wishlist.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-[#F26722] text-white text-[8px] w-3.5 h-3.5 rounded-full flex items-center justify-center font-bold">
                    {wishlist.length}
                  </span>
                )}
              </div>
              <span className="text-[9px] uppercase font-bold tracking-tighter">Wishlist</span>
            </button>

            {/* Cart Button */}
            <button
              onClick={() => handleNavClick('cart')}
              className={`flex flex-col items-center cursor-pointer group bg-transparent border-0 p-0 focus:outline-none relative ${
                activeView === 'cart' ? 'text-[#F26722]' : 'text-[#1F2937] hover:text-[#F26722]'
              }`}
              title="View Cart"
              id="cart-btn"
            >
              <div className="relative">
                <ShoppingBag size={20} strokeWidth={1.5} className="mb-1 transition-colors group-hover:text-[#F26722]" />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-[#F26722] text-white text-[8px] w-3.5 h-3.5 rounded-full flex items-center justify-center font-bold">
                    {cartCount}
                  </span>
                )}
              </div>
              <span className="text-[9px] uppercase font-bold tracking-tighter">Cart</span>
            </button>

            {/* Mobile Menu Icon */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 text-gray-800 hover:text-primary rounded-full hover:bg-gray-50 cursor-pointer"
              aria-label="Toggle Menu"
              id="burger-btn"
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* 3. DESKTOP NAVIGATION MENU */}
        <nav className="hidden md:block mt-2.5 pt-2.5 pb-1 border-t border-gray-100">
          <div className="max-w-7xl mx-auto px-8 flex items-center justify-between">
            <div className="flex items-center gap-8">
              <button
                onClick={() => handleNavClick('home')}
                className={`text-xs font-bold uppercase tracking-wide cursor-pointer transition-colors bg-transparent border-0 p-0 ${
                  activeView === 'home' ? 'text-[#F26722]' : 'text-gray-500 hover:text-[#F26722]'
                }`}
              >
                Home
              </button>
              <button
                onClick={() => handleNavClick('shop')}
                className={`text-xs font-bold uppercase tracking-wide cursor-pointer transition-colors bg-transparent border-0 p-0 ${
                  activeView === 'shop' && !categoryFilter ? 'text-[#F26722]' : 'text-gray-500 hover:text-[#F26722]'
                }`}
              >
                Shop
              </button>
              
              <button
                onClick={() => handleNavClick('shop', 'earbuds')}
                className={`text-xs font-bold uppercase tracking-wide cursor-pointer transition-colors bg-transparent border-0 p-0 ${
                  categoryFilter === 'earbuds' ? 'text-[#F26722]' : 'text-gray-550 hover:text-[#F26722]'
                }`}
              >
                Wireless Earbuds
              </button>
              
              <button
                onClick={() => handleNavClick('shop', 'watches')}
                className={`text-xs font-bold uppercase tracking-wide cursor-pointer transition-colors bg-transparent border-0 p-0 ${
                  categoryFilter === 'watches' ? 'text-[#F26722]' : 'text-gray-550 hover:text-[#F26722]'
                }`}
              >
                Smart Watches
              </button>

              <button
                onClick={() => handleNavClick('shop')}
                className="text-xs font-bold uppercase tracking-wide text-gray-500 hover:text-[#F26722] cursor-pointer transition-all bg-transparent border-0 p-0 flex items-center gap-1"
                id="flash-sale-nav-link"
              >
                Flash Sale <span className="w-1.5 h-1.5 bg-red-500 rounded-full"></span>
              </button>

              <button
                onClick={() => handleNavClick('blogs')}
                className={`text-xs font-bold uppercase tracking-wide cursor-pointer transition-colors bg-transparent border-0 p-0 ${
                  activeView === 'blogs' ? 'text-[#F26722]' : 'text-gray-500 hover:text-[#F26722]'
                }`}
              >
                Tech Blog
              </button>
            </div>
            
            <div className="flex items-center gap-2">
              {isAdmin && (
                <button
                  onClick={() => handleNavClick('admin')}
                  className={`flex items-center gap-1.5 text-xs font-mono font-bold uppercase py-1 px-3.5 border rounded-full transition-all cursor-pointer bg-transparent ${
                    activeView === 'admin'
                      ? 'border-[#F26722] text-[#F26722] bg-[#FFEDE5]'
                      : 'border-cyan-600/30 text-cyan-600 hover:border-cyan-600 hover:bg-cyan-50'
                  }`}
                >
                  <span className="w-1.5 h-1.5 bg-cyan-500 rounded-full animate-ping"></span>
                  Admin Panel
                  {pendingOrdersCount > 0 && (
                    <span className="ml-1 bg-red-500 text-white text-[9px] font-mono px-1.5 py-0.5 rounded-full font-extrabold animate-pulse">
                      {pendingOrdersCount} new
                    </span>
                  )}
                </button>
              )}

              {(userSession.loggedIn || isAdmin) && (
                <button
                  onClick={() => {
                    logoutUser();
                    if (activeView === 'admin') setRoute('home');
                  }}
                  className="flex items-center gap-1.5 text-[11px] font-bold uppercase py-1 px-3 border border-red-200 text-red-600 hover:bg-red-500 hover:text-white hover:border-red-500 rounded-full transition-all cursor-pointer bg-transparent"
                  title="Logout from Account & Admin"
                  id="header-logout-btn"
                >
                  <LogOut size={12} />
                  Logout
                </button>
              )}
            </div>
          </div>
        </nav>
      </header>

      {/* 4. MOBILE DRAWER NAVIGATION MENU */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 bg-black z-50 md:hidden"
            />

            {/* Side Drawer */}
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 bottom-0 left-0 w-[300px] bg-white shadow-2xl z-50 p-6 flex flex-col justify-between overflow-y-auto md:hidden"
            >
              <div>
                <div className="flex items-center justify-between pb-6 border-b border-gray-100">
                  <div className="flex items-center gap-2">
                    <div className="bg-primary text-white p-1.5 rounded-lg">
                      <Zap size={18} />
                    </div>
                    <div>
                      <span className="font-sans font-extrabold text-xl tracking-tight text-gray-900">
                        MUSK
                      </span>
                      <span className="block text-[8px] text-gray-400 tracking-wider">
                        Technology For Smartness
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="p-1.5 border border-gray-100 rounded-full hover:text-primary transition-all cursor-pointer"
                  >
                    <X size={20} />
                  </button>
                </div>

                {/* Mobile Search */}
                <form onSubmit={handleSearchSubmit} className="mt-5 relative">
                  <input
                    type="text"
                    placeholder="Search gadgets, lights etc..."
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                    className="w-full pl-4 pr-10 py-2.5 bg-gray-50 border border-gray-100 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:bg-white"
                  />
                  <button
                    type="submit"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-primary transition-colors cursor-pointer"
                  >
                    <Search size={16} />
                  </button>
                </form>

                {/* Navigation Links */}
                <div className="flex flex-col gap-1.5 mt-6 font-semibold text-gray-700">
                  <button
                    onClick={() => handleNavClick('home')}
                    className={`text-left p-3 rounded-xl transition-all ${
                      activeView === 'home' ? 'bg-primary-light text-primary' : 'hover:bg-gray-50'
                    }`}
                  >
                    Home Space
                  </button>
                  <button
                    onClick={() => handleNavClick('shop')}
                    className={`text-left p-3 rounded-xl transition-all ${
                      activeView === 'shop' && !categoryFilter ? 'bg-primary-light text-primary' : 'hover:bg-gray-50'
                    }`}
                  >
                    Shop Store
                  </button>

                  <div className="py-2.5 px-3">
                    <span className="text-[11px] uppercase tracking-widest text-gray-400 font-bold block mb-2 font-mono">
                      Main Categories
                    </span>
                    <div className="flex flex-col gap-1 pl-3 border-l border-gray-100">
                      <button
                        onClick={() => handleNavClick('shop', 'earbuds')}
                        className={`text-left py-2 text-sm transition-all block ${
                          categoryFilter === 'earbuds' ? 'text-primary font-bold' : 'text-gray-600 hover:text-primary'
                        }`}
                      >
                        Wireless Earbuds
                      </button>
                      <button
                        onClick={() => handleNavClick('shop', 'watches')}
                        className={`text-left py-2 text-sm transition-all block ${
                          categoryFilter === 'watches' ? 'text-primary font-bold' : 'text-gray-600 hover:text-primary'
                        }`}
                      >
                        Smart Watches
                      </button>
                      <button
                        onClick={() => handleNavClick('shop', 'speakers')}
                        className={`text-left py-2 text-sm transition-all block ${
                          categoryFilter === 'speakers' ? 'text-primary font-bold' : 'text-gray-600 hover:text-primary'
                        }`}
                      >
                        Bluetooth Speakers
                      </button>
                      <button
                        onClick={() => handleNavClick('shop', 'covers')}
                        className={`text-left py-2 text-sm transition-all block ${
                          categoryFilter === 'covers' ? 'text-primary font-bold' : 'text-gray-600 hover:text-primary'
                        }`}
                      >
                        Covers & Cases
                      </button>
                    </div>
                  </div>

                  <button
                    onClick={() => handleNavClick('blogs')}
                    className={`text-left p-3 rounded-xl transition-all ${
                      activeView === 'blogs' ? 'bg-primary-light text-primary' : 'hover:bg-gray-50'
                    }`}
                  >
                    Tech & Audio Blog
                  </button>

                  {isAdmin && (
                    <button
                      onClick={() => handleNavClick('admin')}
                      className={`text-left p-3 rounded-xl transition-all font-mono font-bold flex items-center justify-between ${
                        activeView === 'admin' ? 'bg-cyan-50 text-cyan-600' : 'text-cyan-700 hover:bg-cyan-50/50'
                      }`}
                    >
                      <span>🔐 Admin Dashboard</span>
                      {pendingOrdersCount > 0 && (
                        <span className="bg-red-500 text-white text-[10px] font-mono px-2 py-0.5 rounded-full font-black animate-pulse">
                          {pendingOrdersCount} New Orders
                        </span>
                      )}
                    </button>
                  )}

                  {(userSession.loggedIn || isAdmin) && (
                    <button
                      onClick={() => {
                        logoutUser();
                        setIsMobileMenuOpen(false);
                        if (activeView === 'admin') setRoute('home');
                      }}
                      className="text-left p-3 rounded-xl transition-all font-bold flex items-center gap-2 text-red-600 hover:bg-red-50 mt-1"
                    >
                      <LogOut size={16} />
                      <span>Logout Account</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Drawer Footer Contact */}
              <div className="border-t border-gray-100 pt-6 mt-6">
                <div className="flex items-center gap-3 text-xs text-gray-500 mb-4">
                  <Phone size={14} className="text-primary" />
                  <span>Call center: +880 1816-505013</span>
                </div>
                <div className="flex items-center gap-4 text-gray-400">
                  <a href="https://www.facebook.com/themuskgadgets" target="_blank" rel="noreferrer" className="hover:text-primary transition-colors" aria-label="Facebook">
                    <Facebook size={18} />
                  </a>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Adjust viewport clearance spacing when navigation header is sticky */}
      {isScrolled && <div className="h-[73px] md:h-[135px]"></div>}
    </>
  );
};
