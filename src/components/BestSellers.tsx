/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useRef } from 'react';
import { useApp } from '../context/AppContext';
import { ProductCard } from './ProductCard';
import { Award, ChevronLeft, ChevronRight, ArrowUpRight } from 'lucide-react';
import { motion } from 'motion/react';

export const BestSellers: React.FC = () => {
  const { products, setRoute, setCategoryFilter } = useApp();

  // Pick top 8 products, prioritized by isBestSeller, then score rating
  const bestSellerProducts = [...products]
    .sort((a, b) => {
      if (a.isBestSeller && !b.isBestSeller) return -1;
      if (!a.isBestSeller && b.isBestSeller) return 1;
      return b.rating - a.rating;
    })
    .slice(0, 8);

  const containerRef = useRef<HTMLDivElement>(null);

  const scrollLeft = () => {
    if (containerRef.current) {
      containerRef.current.scrollBy({ left: -300, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (containerRef.current) {
      containerRef.current.scrollBy({ left: 300, behavior: 'smooth' });
    }
  };

  return (
    <section className="py-12 md:py-16 max-w-7xl mx-auto px-4" id="best-sellers-section">
      {/* Visual Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-5 mb-8 md:mb-10">
        <div>
          <div className="flex items-center gap-1.5 text-primary text-xs font-bold uppercase tracking-wider mb-2 font-mono">
            <Award size={14} className="text-primary fill-primary/10" />
            <span>Guaranteed Satisfaction</span>
          </div>
          <h2 className="text-2xl sm:text-3.5xl font-extrabold tracking-tight text-gray-900 leading-none">
            Our Top Best Sellers
          </h2>
        </div>

        {/* Scrollers */}
        <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
          <button
            onClick={() => {
              setCategoryFilter(null);
              setRoute('shop');
            }}
            className="text-sm font-semibold text-primary hover:text-primary-hover flex items-center gap-0.5 group cursor-pointer transition-colors"
          >
            Explore Catalog
            <ArrowUpRight size={16} className="transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </button>
          
          <div className="flex items-center gap-1.5">
            <button
              onClick={scrollLeft}
              className="p-2 border border-gray-100 hover:bg-gray-50 text-gray-600 rounded-xl cursor-pointer transition-all bg-white shadow-sm"
              aria-label="Scroll Best Sellers Left"
            >
              <ChevronLeft size={16} />
            </button>
            <button
              onClick={scrollRight}
              className="p-2 border border-gray-100 hover:bg-gray-50 text-gray-600 rounded-xl cursor-pointer transition-all bg-white shadow-sm"
              aria-label="Scroll Best Sellers Right"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Grid horizontal scroller */}
      <div
        ref={containerRef}
        className="flex overflow-x-auto gap-6 pb-6 pt-1 snap-x scroll-smooth no-scrollbar"
      >
        {bestSellerProducts.map((product, idx) => (
          <motion.div
            key={product.id}
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: idx * 0.05, duration: 0.4 }}
            className="w-[240px] sm:w-[280px] shrink-0 snap-start"
          >
            <ProductCard product={product} />
          </motion.div>
        ))}
      </div>
    </section>
  );
};
