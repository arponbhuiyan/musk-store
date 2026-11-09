/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { ProductCard } from './ProductCard';
import { Flame, Clock, Sparkles, ChevronLeft, ChevronRight } from 'lucide-react';

export const FlashSale: React.FC = () => {
  const { products, setRoute, setCategoryFilter } = useApp();
  const flashSaleProducts = products.filter((p) => p.isFlashSale);

  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // 1. Initial State for countdown timer (arbitrary fixed window: 14 hours countdown from load session)
  const [timeLeft, setTimeLeft] = useState({
    hours: 14,
    minutes: 42,
    seconds: 19
  });

  useEffect(() => {
    // Basic reactive timer ticking
    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { hours: prev.hours, minutes: prev.minutes - 1, seconds: 59 };
        } else if (prev.hours > 0) {
          return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        } else {
          // Reset session
          return { hours: 12, minutes: 0, seconds: 0 };
        }
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // Format indicators
  const formatTime = (num: number) => num.toString().padStart(2, '0');

  // Slide controls
  const handleScrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -320, behavior: 'smooth' });
    }
  };

  const handleScrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 320, behavior: 'smooth' });
    }
  };

  return (
    <section className="bg-gradient-to-br from-rose-50 via-white to-gray-50/50 py-12 md:py-16 border-y border-rose-100" id="flash-sale-section">
      <div className="max-w-7xl mx-auto px-4">
        
        {/* Campaign Header & Interactive Timer */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8 md:mb-10">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            {/* Flashing Campaign Title */}
            <div className="flex items-center gap-2">
              <div className="bg-rose-600 text-white p-2.5 rounded-2xl flex items-center justify-center animate-pulse shadow-md shadow-rose-600/20">
                <Flame size={20} className="fill-white" />
              </div>
              <div>
                <span className="text-[10px] text-rose-600 font-extrabold uppercase tracking-widest block font-mono">
                  Limited Ticking Offers
                </span>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight leading-none">
                  MUSK Flash Sale
                </h2>
              </div>
            </div>

            {/* Live Countdown Timer Digits */}
            <div className="flex items-center gap-2 bg-white/95 border border-rose-100 px-4 py-2 rounded-2xl shadow-sm self-start sm:self-auto">
              <Clock size={16} className="text-rose-600 animate-spin-slow" />
              <div className="flex items-center gap-1 text-xs font-bold text-gray-400">
                <span className="font-mono text-base font-extrabold text-rose-600 bg-rose-50 border border-rose-100/40 w-8 py-1 rounded-lg text-center inline-block">
                  {formatTime(timeLeft.hours)}
                </span>
                <span>:</span>
                <span className="font-mono text-base font-extrabold text-rose-600 bg-rose-50 border border-rose-100/40 w-8 py-1 rounded-lg text-center inline-block">
                  {formatTime(timeLeft.minutes)}
                </span>
                <span>:</span>
                <span className="font-mono text-base font-extrabold text-rose-600 bg-rose-50 border border-rose-100/40 w-8 py-1 rounded-lg text-center inline-block">
                  {formatTime(timeLeft.seconds)}
                </span>
                <span className="text-[9px] uppercase tracking-wider text-rose-500 font-bold ml-1 font-mono">
                  Left
                </span>
              </div>
            </div>
          </div>

          {/* Action Tools */}
          <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-end">
            <button
              onClick={() => {
                setCategoryFilter(null);
                setRoute('shop');
              }}
              className="text-xs font-bold uppercase tracking-wider text-rose-600 hover:text-rose-700 bg-rose-50 hover:bg-rose-100 py-2.5 px-4 rounded-xl cursor-pointer transition-colors"
            >
              See All Campaign Deals
            </button>
            <div className="flex items-center gap-1.5">
              <button
                onClick={handleScrollLeft}
                className="p-2 border border-gray-200 hover:border-gray-300 hover:bg-white text-gray-600 rounded-xl cursor-pointer transition-all bg-white/40 shadow-sm"
                aria-label="Scroll Flash Deals Left"
              >
                <ChevronLeft size={16} />
              </button>
              <button
                onClick={handleScrollRight}
                className="p-2 border border-gray-200 hover:border-gray-300 hover:bg-white text-gray-600 rounded-xl cursor-pointer transition-all bg-white/40 shadow-sm"
                aria-label="Scroll Flash Deals Right"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        </div>

        {/* Horizontal Track Slider */}
        <div
          ref={scrollContainerRef}
          className="flex overflow-x-auto gap-5 pb-4 pt-1 snap-x scroll-smooth no-scrollbar"
        >
          {flashSaleProducts.map((product) => (
            <div
              key={product.id}
              className="w-[260px] sm:w-[290px] shrink-0 snap-start"
            >
              {/* Product Card with inner additions */}
              <div className="h-full relative filter drop-shadow-sm hover:drop-shadow-md transition-all">
                <ProductCard product={product} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
