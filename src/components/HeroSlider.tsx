/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const HeroSlider: React.FC = () => {
  const { banners, setRoute, setCategoryFilter } = useApp();
  const [currentIndex, setCurrentIndex] = useState(0);

  // Auto scroll effect
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % banners.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [banners.length]);

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? banners.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % banners.length);
  };

  const handleShopNowClick = (link: string) => {
    if (link.includes('watches')) {
      setCategoryFilter('watches');
      setRoute('shop');
    } else if (link.includes('accessories')) {
      setCategoryFilter('accessories');
      setRoute('shop');
    } else {
      setCategoryFilter(null);
      setRoute('shop');
    }
  };

  return (
    <div className="relative w-full h-[320px] sm:h-[420px] md:h-[500px] lg:h-[580px] bg-slate-950 overflow-hidden group">
      {/* Dynamic Slide Background with Fade Effects */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 0.9, scale: 1 }}
          exit={{ opacity: 0, scale: 0.98 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="absolute inset-0 w-full h-full bg-cover bg-center"
          style={{ backgroundImage: `url(${banners[currentIndex].image})` }}
        />
      </AnimatePresence>

      {/* Elegant Radial Dark Gradients Overlay like Apple / Dark Store theme */}
      <div className="absolute inset-0 bg-gradient-to-r from-gray-950 via-gray-950/70 to-transparent z-10" />
      <div className="absolute inset-0 bg-gradient-to-t from-gray-950/20 via-transparent to-transparent z-10" />

      {/* slide content context container */}
      <div className="absolute inset-0 z-20 flex items-center max-w-7xl mx-auto px-6 sm:px-12 flex-row">
        <div className="max-w-xl md:max-w-2xl text-white">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
            >
              {banners[currentIndex].badge && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-primary text-white text-xs font-semibold tracking-wider uppercase rounded-full mb-4 md:mb-5 shadow-lg shadow-primary/20">
                  <Sparkles size={11} className="fill-white" />
                  {banners[currentIndex].badge}
                </span>
              )}
              
              <h1 className="text-3xl sm:text-5xl md:text-6xl font-extrabold tracking-tight mb-3 md:mb-5 leading-[1.1] font-sans antialiased text-white drop-shadow-sm">
                {banners[currentIndex].title}
              </h1>

              <p className="text-sm sm:text-lg md:text-xl font-medium text-gray-300 mb-6 md:mb-8 font-sans max-w-lg leading-relaxed">
                {banners[currentIndex].subtitle}
              </p>

              <div className="flex items-center gap-4">
                <button
                  onClick={() => handleShopNowClick(banners[currentIndex].link)}
                  className="bg-primary hover:bg-primary-hover text-white py-3 px-7 sm:px-9 font-bold text-sm tracking-wide uppercase rounded-full shadow-lg shadow-primary/30 hover:shadow-primary/50 cursor-pointer transform hover:-translate-y-0.5 transition-all"
                  id={`hero-shop-btn-${currentIndex}`}
                >
                  {banners[currentIndex].buttonText}
                </button>
                <div className="text-xs text-gray-400 font-mono hidden sm:block">
                  🔥 Instant 15% off coupon <span className="text-primary font-bold">SMARTMUSK</span>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Navigation Arrow Controls */}
      <button
        onClick={handlePrev}
        className="absolute left-4 sm:left-6 top-1/2 -translate-y-1/2 z-30 p-2 sm:p-2.5 rounded-full border border-gray-800 bg-black/40 hover:bg-black/90 text-white backdrop-blur-sm cursor-pointer opacity-0 group-hover:opacity-100 transition-all shadow-md"
        aria-label="Previous Slide"
        id="hero-prev-btn"
      >
        <ChevronLeft size={20} />
      </button>
      <button
        onClick={handleNext}
        className="absolute right-4 sm:right-6 top-1/2 -translate-y-1/2 z-30 p-2 sm:p-2.5 rounded-full border border-gray-800 bg-black/40 hover:bg-black/90 text-white backdrop-blur-sm cursor-pointer opacity-0 group-hover:opacity-100 transition-all shadow-md"
        aria-label="Next Slide"
        id="hero-next-btn"
      >
        <ChevronRight size={20} />
      </button>

      {/* Indicator Bullets */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-30 flex items-center gap-2">
        {banners.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`h-2 rounded-full cursor-pointer transition-all ${
              currentIndex === index ? 'w-8 bg-primary shadow shadow-primary' : 'w-2 bg-white/40'
            }`}
            aria-label={`Slide target ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};
