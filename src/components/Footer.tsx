/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Facebook,
  Send,
  Check,
  Mail,
  MapPin,
  Phone,
  Zap,
  Lock
} from 'lucide-react';

export const Footer: React.FC = () => {
  const { setRoute, setCategoryFilter, isAdmin } = useApp();
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setEmail('');
      setTimeout(() => setSubscribed(false), 5000);
    }
  };

  const handleCategoryNav = (id: string) => {
    setCategoryFilter(id);
    setRoute('shop');
  };

  return (
    <footer className="bg-gray-950 text-gray-400 border-t border-gray-900 pt-16 pb-8" id="footer-section">
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
        
        {/* Column 1: Brand & Bio */}
        <div className="flex flex-col gap-5">
          <div className="flex flex-col group cursor-pointer" onClick={() => setRoute('home')}>
            <h1 className="text-2xl font-black tracking-tighter text-[#F26722] leading-none group-hover:opacity-90 transition-opacity">
              MUSK
            </h1>
            <span className="text-[8px] uppercase tracking-[0.2em] font-bold text-gray-500 mt-1">
              Technology For Smartness
            </span>
          </div>
          <p className="text-sm text-gray-400 leading-relaxed">
            Leading supplier of authentic smart gadgets, active ANC audio setups, wearables, RGB lighting arrays, and aesthetic mobile gears across Bangladesh. Inspired by minimal premium setups.
          </p>
          <div className="flex flex-col gap-2 text-xs">
            <div className="flex items-center gap-2">
              <MapPin size={14} className="text-primary" />
              <span>Bhuiyan Market, Mithachara, Mirsharai</span>
            </div>
            <div className="flex items-center gap-2">
              <Phone size={14} className="text-primary" />
              <a href="tel:+8801816505013" className="hover:text-[#F26722] transition-colors font-medium">+880 1816-505013</a>
            </div>
            <div className="flex items-center gap-2">
              <Mail size={14} className="text-primary" />
              <span>muskgadgets25@gmail.com</span>
            </div>
          </div>
        </div>

        {/* Column 2: Nav Maps */}
        <div>
          <h3 className="font-sans font-bold text-white text-sm uppercase tracking-wider mb-5 font-mono">
            Company Info
          </h3>
          <ul className="flex flex-col gap-3 text-sm">
            <li>
              <button onClick={() => setRoute('home')} className="hover:text-primary transition-colors cursor-pointer text-left focus:outline-none">
                About Us
              </button>
            </li>
            <li>
              <button onClick={() => setRoute('blogs')} className="hover:text-primary transition-colors cursor-pointer text-left focus:outline-none">
                Official Tech Blog
              </button>
            </li>
            <li>
              <button href="#" className="hover:text-primary transition-colors cursor-pointer text-left focus:outline-none">
                Contact Our Corporate Unit
              </button>
            </li>
            <li>
              <button href="#" className="hover:text-primary transition-colors cursor-pointer text-left focus:outline-none">
                Store Locator Maps
              </button>
            </li>
          </ul>

          <h3 className="font-sans font-bold text-white text-sm uppercase tracking-wider mt-6 mb-4 font-mono">
            Customer Support Policies
          </h3>
          <ul className="flex flex-col gap-3 text-sm">
            <li>
              <button onClick={() => setRoute('dashboard')} className="hover:text-primary transition-colors cursor-pointer text-left focus:outline-none">
                Returns & Replace Policy
              </button>
            </li>
            <li>
              <button onClick={() => setRoute('dashboard')} className="hover:text-primary transition-colors cursor-pointer text-left focus:outline-none">
                Warranty Claims Procedures
              </button>
            </li>
            <li>
              <button href="#" className="hover:text-primary transition-colors cursor-pointer text-left focus:outline-none">
                Domestic Express Shipping Map
              </button>
            </li>
          </ul>
        </div>

        {/* Column 3: Category Quicklinks */}
        <div>
          <h3 className="font-sans font-bold text-white text-sm uppercase tracking-wider mb-5 font-mono">
            Core Catalogues
          </h3>
          <ul className="flex flex-col gap-3 text-sm">
            <li>
              <button onClick={() => handleCategoryNav('earbuds')} className="hover:text-primary transition-colors cursor-pointer text-left focus:outline-none">
                Wireless Earbuds & ANC
              </button>
            </li>
            <li>
              <button onClick={() => handleCategoryNav('watches')} className="hover:text-primary transition-colors cursor-pointer text-left focus:outline-none">
                Smart Watches & Retinas
              </button>
            </li>
            <li>
              <button onClick={() => handleCategoryNav('speakers')} className="hover:text-primary transition-colors cursor-pointer text-left focus:outline-none">
                Bluetooth Speakers & Bars
              </button>
            </li>
            <li>
              <button onClick={() => handleCategoryNav('powerbanks')} className="hover:text-primary transition-colors cursor-pointer text-left focus:outline-none">
                Fast Power Banks
              </button>
            </li>
            <li>
              <button onClick={() => handleCategoryNav('ledstrips')} className="hover:text-primary transition-colors cursor-pointer text-left focus:outline-none">
                RGB LED Strip Yards
              </button>
            </li>
            <li>
              <button onClick={() => handleCategoryNav('covers')} className="hover:text-primary transition-colors cursor-pointer text-left focus:outline-none">
                MagSafe Protective Covers
              </button>
            </li>
            <li>
              <button onClick={() => handleCategoryNav('accessories')} className="hover:text-primary transition-colors cursor-pointer text-left focus:outline-none">
                Everyday Carbon Key Rings
              </button>
            </li>
          </ul>
        </div>

        {/* Column 4: Newsletter & Social */}
        <div className="flex flex-col gap-5">
          <h3 className="font-sans font-bold text-white text-sm uppercase tracking-wider font-mono">
            Direct Tech Newsletter
          </h3>
          <p className="text-sm text-gray-400 leading-relaxed">
            No spam guarantees. Receive custom coupons, campaign countdowns, and official reviews first inside BD.
          </p>

          <form onSubmit={handleSubscribe} className="relative" id="footer-newsletter-form">
            <input
              type="email"
              placeholder="Your email address"
              value={email}
              required
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-gray-900 border border-gray-800 text-sm text-gray-200 pl-4 pr-12 py-3 rounded-xl focus:outline-none focus:border-primary/50 text-left"
            />
            <button
              type="submit"
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-primary hover:bg-primary-hover text-white p-2 rounded-lg cursor-pointer transition-colors"
              aria-label="Subscribe"
            >
              <Send size={14} />
            </button>
          </form>

          {/* Feedback response toast */}
          {subscribed && (
            <div className="flex items-center gap-2 text-emerald-400 text-xs font-semibold animate-pulse mt-1">
              <Check size={14} />
              <span>🎉 Registered! Enjoy 15% off using Code: SMARTMUSK</span>
            </div>
          )}

          <div>
            <h4 className="text-xs font-bold text-gray-500 uppercase tracking-widest font-mono mb-3">
              Follow MUSK Spaces
            </h4>
            <div className="flex items-center gap-3">
              <a href="https://www.facebook.com/themuskgadgets" target="_blank" rel="noreferrer" className="bg-gray-900 hover:bg-primary hover:text-white p-2.5 rounded-xl transition-all cursor-pointer" aria-label="Facebook">
                <Facebook size={18} />
              </a>
            </div>
          </div>
        </div>

      </div>

      {/* Corporate Copy & Local MFS payments row */}
      <div className="max-w-7xl mx-auto px-4 border-t border-gray-900 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs font-medium">
        <div className="flex items-center gap-2 flex-wrap">
          <span>© {new Date().getFullYear()} MUSK Bangladesh Co. Ltd. Technology For Smartness. Licensed brand lines.</span>
          <button
            onClick={() => setRoute('admin')}
            className="text-gray-600 hover:text-primary transition-colors inline-flex items-center gap-1 text-[11px] font-mono cursor-pointer ml-1"
            title="Owner Portal"
          >
            <Lock size={11} />
            <span>{isAdmin ? 'Admin Console' : 'Portal'}</span>
          </button>
        </div>
        <div className="flex items-center gap-3 flex-wrap opacity-60">
          <span className="font-mono text-[9px] uppercase tracking-wider text-gray-500 font-bold">Secure BD Channels:</span>
          <span className="bg-gray-900 px-2 py-1 rounded select-none text-white">bKash</span>
          <span className="bg-gray-900 px-2 py-1 rounded select-none text-white">Nagad</span>
          <span className="bg-gray-900 px-2 py-1 rounded select-none text-white">SSLCommerz</span>
          <span className="bg-gray-900 px-2 py-1 rounded select-none text-white">Cash On Delivery</span>
        </div>
      </div>
    </footer>
  );
};
