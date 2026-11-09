/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { useApp } from '../context/AppContext';
import { Sparkles, ArrowRight } from 'lucide-react';
import { motion } from 'motion/react';

export const Categories: React.FC = () => {
  const { categories, setRoute, setCategoryFilter } = useApp();

  const handleCategoryClick = (id: string) => {
    setCategoryFilter(id);
    setRoute('shop');
  };

  return (
    <section className="py-12 md:py-16 max-w-7xl mx-auto px-4" id="categories-section">
      {/* Editorial Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-3 mb-8 md:mb-10">
        <div>
          <div className="flex items-center gap-1.5 text-primary text-xs font-bold uppercase tracking-wider mb-2 font-mono">
            <Sparkles size={14} className="fill-primary" />
            <span>Discover Collections</span>
          </div>
          <h2 className="text-2xl sm:text-3.5xl font-extrabold tracking-tight text-gray-900 leading-none">
            Browse By Core Category
          </h2>
        </div>
        <button
          onClick={() => {
            setCategoryFilter(null);
            setRoute('shop');
          }}
          className="text-sm font-semibold text-primary hover:text-primary-hover flex items-center gap-1 group cursor-pointer transition-colors"
        >
          View All Products
          <ArrowRight size={16} className="transform group-hover:translate-x-1 transition-transform" />
        </button>
      </div>

      {/* Grid Canvas */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {categories.map((category) => (
          <motion.button
            key={category.id}
            onClick={() => handleCategoryClick(category.id)}
            whileHover={{ y: -6 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            className="flex flex-col bg-white text-left overflow-hidden border border-gray-100 rounded-2xl group cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary/20 shadow-sm hover:shadow-md transition-all h-full"
            id={`category-card-${category.id}`}
          >
            {/* Image Port */}
            <div className="w-full aspect-[4/3] bg-gray-50 overflow-hidden relative">
              <img
                src={category.image}
                alt={category.name}
                className="w-full h-full object-cover group-hover:scale-108 transition-all duration-500 rounded-t-2xl referrerPolicy='no-referrer'"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>

            {/* Inner Stats Card */}
            <div className="p-4 flex-1 flex flex-col justify-between">
              <h3 className="font-sans font-bold text-gray-900 group-hover:text-primary text-[14px] leading-tight tracking-tight transition-colors">
                {category.name}
              </h3>
              <span className="text-[10px] text-gray-400 font-medium font-mono block mt-1 uppercase tracking-wider">
                {category.productCount} Hot Items
              </span>
            </div>
          </motion.button>
        ))}
      </div>
    </section>
  );
};
