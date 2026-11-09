/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { ProductCard } from '../components/ProductCard';
import { SEOHead } from '../components/SEOHead';
import {
  SlidersHorizontal,
  ChevronDown,
  X,
  Sparkles,
  HelpCircle,
  XCircle,
  PackageCheck
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const ShopView: React.FC = () => {
  const {
    products,
    categories,
    brands,
    categoryFilter,
    brandFilter,
    setCategoryFilter,
    setBrandFilter,
    searchQuery,
    setSearchQuery
  } = useApp();

  // Internal filters state
  const [selectedBrands, setSelectedBrands] = useState<string[]>(
    brandFilter ? [brandFilter] : []
  );
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [maxPrice, setMaxPrice] = useState<number>(10000);
  const [onlyInStock, setOnlyInStock] = useState<boolean>(false);
  const [sortOption, setSortOption] = useState<string>('best-selling');
  
  // Mobile filter accordion toggler
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  // Synchronize context category filter with state if needed
  const selectedCategory = categoryFilter;

  // Derive unique colors across all products for filter option swatches
  const availableColors = useMemo(() => {
    const colorsSet = new Set<string>();
    products.forEach((p) => p.colors.forEach((col) => colorsSet.add(col)));
    return Array.from(colorsSet);
  }, [products]);

  // Handle Brand selection toggles
  const handleBrandToggle = (brandId: string) => {
    setSelectedBrands((prev) => {
      const isExist = prev.includes(brandId);
      const next = isExist ? prev.filter((id) => id !== brandId) : [...prev, brandId];
      // update context if needed
      if (next.length === 1) {
        setBrandFilter(next[0]);
      } else {
        setBrandFilter(null);
      }
      return next;
    });
  };

  // Color selection toggler
  const handleColorToggle = (color: string) => {
    setSelectedColors((prev) =>
      prev.includes(color) ? prev.filter((c) => c !== color) : [...prev, color]
    );
  };

  // Clear all filters action
  const handleClearAllFilters = () => {
    setSelectedBrands([]);
    setCategoryFilter(null);
    setBrandFilter(null);
    setSelectedColors([]);
    setMaxPrice(10000);
    setOnlyInStock(false);
    setSearchQuery('');
  };

  // Filter and sort products recursively
  const filteredProducts = useMemo(() => {
    let result = [...products];

    // 1. Filter by search query
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.brandName.toLowerCase().includes(q) ||
          p.categoryName.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q)
      );
    }

    // 2. Filter by Category
    if (selectedCategory) {
      result = result.filter((p) => p.categoryId === selectedCategory);
    }

    // 3. Filter by Selected Brands (from sidebar arrays)
    if (selectedBrands.length > 0) {
      result = result.filter((p) => selectedBrands.includes(p.brandId));
    }

    // 4. Filter by Max Price
    result = result.filter((p) => {
      const price = p.discountPrice || p.regularPrice;
      return price <= maxPrice;
    });

    // 5. Filter by selected colors
    if (selectedColors.length > 0) {
      result = result.filter((p) =>
        p.colors.some((themeColor) => selectedColors.includes(themeColor))
      );
    }

    // 6. Filter by Availability (stock levels)
    if (onlyInStock) {
      result = result.filter((p) => p.stock > 0);
    }

    // 7. Sort options
    switch (sortOption) {
      case 'price-low-high':
        result.sort((a, b) => {
          const priceA = a.discountPrice || a.regularPrice;
          const priceB = b.discountPrice || b.regularPrice;
          return priceA - priceB;
        });
        break;
      case 'price-high-low':
        result.sort((a, b) => {
          const priceA = a.discountPrice || a.regularPrice;
          const priceB = b.discountPrice || b.regularPrice;
          return priceB - priceA;
        });
        break;
      case 'newest':
        result.sort((a, b) => (a.isNewArrival && !b.isNewArrival ? -1 : 1));
        break;
      case 'best-selling':
      default:
        result.sort((a, b) => {
          if (a.isBestSeller && !b.isBestSeller) return -1;
          if (!a.isBestSeller && b.isBestSeller) return 1;
          return b.rating - a.rating;
        });
        break;
    }

    return result;
  }, [products, searchQuery, selectedCategory, selectedBrands, maxPrice, selectedColors, onlyInStock, sortOption]);

  // Find active category naming info
  const activeCategoryName = useMemo(() => {
    if (!selectedCategory) return 'All Catalog Store';
    return categories.find((c) => c.id === selectedCategory)?.name || 'Accessories';
  }, [selectedCategory, categories]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 md:py-12" id="shop-container">
      <SEOHead
        title={`${activeCategoryName} - Buy Premium Gadgets BD`}
        description={`Explore the highest quality ${activeCategoryName} filters in Bangladesh. Check out prices on ANC buds, wearable smart devices, covers and military keys.`}
      />

      {/* Top Banner layout */}
      <div className="bg-gray-900 border border-gray-800 p-8 rounded-3xl mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-primary/5 rounded-full filter blur-2xl transform translate-x-[20%]" />
        <div className="z-10 relative">
          <div className="flex items-center gap-1 bg-primary/10 text-primary uppercase text-[10px] font-bold py-1 px-3 w-fit rounded-full border border-primary/20 mb-2 font-mono">
            <Sparkles size={11} className="fill-primary" />
            <span>Official BD Distributor</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            {activeCategoryName}
          </h1>
          <p className="text-gray-400 text-xs sm:text-sm mt-1 max-w-xl font-medium">
            Showing premium gear customized for Apple layouts, smartwatches, fast charging setups, and aesthetic everyday carries in Dhaka.
          </p>
        </div>

        {searchQuery && (
          <div className="bg-gray-800/60 border border-gray-700/50 py-2 px-4 rounded-xl z-10 text-xs">
            <span>Search Key: </span>
            <span className="font-bold text-primary font-mono select-all">"{searchQuery}"</span>
            <button
              onClick={() => setSearchQuery('')}
              className="ml-2 hover:text-red-400 transition-colors cursor-pointer"
            >
              ×
            </button>
          </div>
        )}
      </div>

      {/* Main Grid Content */}
      <div className="flex flex-col lg:flex-row gap-8">
        
        {/* 1. SIDEBAR FILTER MODULE: Desktop view */}
        <aside className="hidden lg:block w-[280px] shrink-0 bg-white border border-gray-100 p-6 rounded-2xl h-fit shadow-sm sticky top-[150px]">
          <div className="flex justify-between items-center pb-4 border-b border-gray-150 mb-5">
            <h3 className="font-sans font-extrabold text-[15px] uppercase tracking-wide text-gray-900 flex items-center gap-2">
              <SlidersHorizontal size={16} className="text-primary" />
              Sidebar Filters
            </h3>
            <button
              onClick={handleClearAllFilters}
              className="text-[11px] font-bold text-gray-400 hover:text-primary cursor-pointer transition-colors"
            >
              Clear All
            </button>
          </div>

          {/* Filtering by Categories list links */}
          <div className="mb-6 pb-5 border-b border-gray-100">
            <span className="text-xs font-bold text-gray-900 uppercase tracking-widest font-mono block mb-3">
              Categories
            </span>
            <div className="flex flex-col gap-1.5 text-sm font-semibold text-gray-600">
              <button
                onClick={() => setCategoryFilter(null)}
                className={`text-left py-1 hover:text-primary transition-all cursor-pointer ${
                  !selectedCategory ? 'text-primary font-extrabold pl-1.5 border-l-2 border-primary' : ''
                }`}
              >
                All Departments
              </button>
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setCategoryFilter(cat.id)}
                  className={`text-left py-1 hover:text-primary leading-tight transition-all cursor-pointer ${
                    selectedCategory === cat.id ? 'text-primary font-extrabold pl-1.5 border-l-2 border-primary' : ''
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>

          {/* Filtering by Brand Checkboxes */}
          <div className="mb-6 pb-5 border-b border-gray-100">
            <span className="text-xs font-bold text-gray-900 uppercase tracking-widest font-mono block mb-3">
              Elite Brands
            </span>
            <div className="flex flex-col gap-2">
              {brands.map((b) => (
                <label
                  key={b.id}
                  className="flex items-center gap-2.5 text-xs font-semibold text-gray-600 hover:text-gray-900 cursor-pointer select-none"
                >
                  <input
                    type="checkbox"
                    checked={selectedBrands.includes(b.id)}
                    onChange={() => handleBrandToggle(b.id)}
                    className="accent-primary rounded w-4 h-4 border-gray-300 focus:ring-primary"
                  />
                  <span>{b.name}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Price Range Slider */}
          <div className="mb-6 pb-5 border-b border-gray-100">
            <div className="flex justify-between items-center mb-2.5">
              <span className="text-xs font-bold text-gray-900 uppercase tracking-widest font-mono block">
                Price Budget (৳)
              </span>
              <span className="text-xs font-mono font-bold text-primary">
                Up to ৳{maxPrice.toLocaleString()}
              </span>
            </div>
            <input
              type="range"
              min={500}
              max={10000}
              step={200}
              value={maxPrice}
              onChange={(e) => setMaxPrice(parseInt(e.target.value))}
              className="w-full accent-primary h-1.5 bg-gray-150 rounded"
            />
            <div className="flex justify-between text-[10px] text-gray-400 font-bold font-mono mt-1.5">
              <span>৳500</span>
              <span>৳10,000+</span>
            </div>
          </div>

          {/* Colors Swatches palettes */}
          <div className="mb-6 pb-5 border-b border-gray-100">
            <span className="text-xs font-bold text-gray-900 uppercase tracking-widest font-mono block mb-3">
              Color Palette
            </span>
            <div className="flex flex-wrap gap-1.5">
              {availableColors.map((color) => {
                const isSelected = selectedColors.includes(color);
                return (
                  <button
                    key={color}
                    onClick={() => handleColorToggle(color)}
                    className={`py-1 px-2.5 text-[10px] font-bold border rounded-full transition-all cursor-pointer ${
                      isSelected
                        ? 'border-primary text-primary bg-primary-light/45'
                        : 'border-gray-150 text-gray-500 bg-gray-50 hover:border-gray-300'
                    }`}
                  >
                    {color}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Availability Status switches */}
          <div>
            <label className="flex items-center gap-3 cursor-pointer select-none text-xs font-semibold text-gray-700">
              <input
                type="checkbox"
                checked={onlyInStock}
                onChange={() => setOnlyInStock(!onlyInStock)}
                className="accent-primary rounded w-4 h-4"
              />
              <span className="flex items-center gap-1.5">
                <PackageCheck size={14} className="text-primary" />
                Hide Out of Stock Items
              </span>
            </label>
          </div>
        </aside>

        {/* 2. MAIN GRID SECTION LISTS */}
        <div className="flex-1">
          {/* Header toolbar controls */}
          <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center bg-white border border-gray-100/80 rounded-2xl py-3 px-4 mb-6 shadow-sm gap-4">
            <div className="text-xs font-semibold text-gray-500">
              Showing <span className="font-extrabold text-gray-800">{filteredProducts.length}</span> Premium Gadget Accessories found
            </div>

            <div className="flex items-center justify-between sm:justify-end gap-3">
              {/* Mobile filter toggle trigger button */}
              <button
                onClick={() => setIsMobileFilterOpen(true)}
                className="lg:hidden py-2 px-4 border border-gray-150 text-gray-700 rounded-xl flex items-center gap-1.5 text-xs font-bold bg-gray-50/50 cursor-pointer hover:bg-gray-100 transition-colors"
                id="mobile-filter-drawer-trigger"
              >
                <SlidersHorizontal size={14} className="text-primary" />
                Filters
              </button>

              {/* Sorting Options Selector */}
              <div className="flex items-center gap-1">
                <span className="text-[11px] text-gray-400 font-bold uppercase font-mono hidden sm:inline">Sort:</span>
                <select
                  value={sortOption}
                  onChange={(e) => setSortOption(e.target.value)}
                  className="bg-gray-50/50 border border-gray-150 rounded-xl px-2.5 py-1.5 text-xs font-semibold text-gray-700 focus:outline-none focus:ring-1 focus:ring-primary focus:bg-white"
                  title="Configure sort metric"
                  id="sort-select"
                >
                  <option value="best-selling">Best Selling Ratings</option>
                  <option value="price-low-high">Price: Low to High</option>
                  <option value="price-high-low">Price: High to Low</option>
                  <option value="newest">Newest Arrivals</option>
                </select>
              </div>
            </div>
          </div>

          {/* Products Grid list Render */}
          {filteredProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {filteredProducts.map((product) => (
                <motion.div
                  key={product.id}
                  layout
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <ProductCard product={product} />
                </motion.div>
              ))}
            </div>
          ) : (
            /* Blank empty states screen */
            <div className="bg-white border border-gray-100 rounded-3xl p-12 text-center flex flex-col items-center">
              <div className="bg-gray-50 p-4 rounded-full text-gray-400 mb-4 border border-gray-100">
                <XCircle size={36} />
              </div>
              <h3 className="font-sans font-extrabold text-lg text-gray-900">
                No matching accessories found
              </h3>
              <p className="text-xs text-gray-400 max-w-sm mt-1.5 leading-relaxed">
                We couldn't locate items under those combined filter limits. Try clearing filters or setting a wider budget space.
              </p>
              <button
                onClick={handleClearAllFilters}
                className="bg-primary hover:bg-primary-hover text-white text-xs font-bold py-2.5 px-6 rounded-full mt-5 shadow shadow-primary/20 transition-all cursor-pointer"
                id="clear-all-filters-state"
              >
                Reset All Filters
              </button>
            </div>
          )}
        </div>

      </div>

      {/* 3. MOBILE FILTER SCREEN PORT DRAWER */}
      <AnimatePresence>
        {isMobileFilterOpen && (
          <div className="fixed inset-0 z-50 md:hidden flex justify-end">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileFilterOpen(false)}
              className="absolute inset-0 bg-black"
            />

            {/* Panel box */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'tween', duration: 0.3 }}
              className="relative w-[290px] bg-white h-full z-10 p-6 flex flex-col justify-between overflow-y-auto"
            >
              <div>
                <div className="flex items-center justify-between pb-4 border-b border-gray-100 mb-5">
                  <h3 className="font-bold text-sm text-gray-900 uppercase">Filters drawer</h3>
                  <button
                    onClick={() => setIsMobileFilterOpen(false)}
                    className="p-1 border border-gray-100 rounded-full cursor-pointer"
                  >
                    <X size={18} />
                  </button>
                </div>

                {/* Categories inside Mobile */}
                <div className="mb-5 pb-4 border-b border-gray-100">
                  <span className="text-xs font-semibold text-gray-400 uppercase tracking-widest font-mono block mb-2">Category list</span>
                  <div className="flex flex-col gap-1 text-xs text-gray-600 font-bold">
                    <button
                      onClick={() => {
                        setCategoryFilter(null);
                        setIsMobileFilterOpen(false);
                      }}
                      className={`text-left p-2 rounded-lg ${!selectedCategory ? 'bg-primary-light text-primary' : ''}`}
                    >
                      All Departments
                    </button>
                    {categories.map((cat) => (
                      <button
                        key={cat.id}
                        onClick={() => {
                          setCategoryFilter(cat.id);
                          setIsMobileFilterOpen(false);
                        }}
                        className={`text-left p-2 rounded-lg ${selectedCategory === cat.id ? 'bg-primary-light text-primary' : ''}`}
                      >
                        {cat.name}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Brand selection inside mobile */}
                <div className="mb-5 pb-4 border-b border-gray-100">
                  <span className="text-xs font-semibold text-gray-400 uppercase tracking-widest font-mono block mb-2">Brands selection</span>
                  <div className="flex flex-col gap-2">
                    {brands.map((b) => (
                      <label key={b.id} className="flex items-center gap-2 text-xs font-medium text-gray-650 cursor-pointer select-none">
                        <input
                          type="checkbox"
                          checked={selectedBrands.includes(b.id)}
                          onChange={() => handleBrandToggle(b.id)}
                          className="accent-primary rounded w-4 h-4"
                        />
                        <span>{b.name}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Price sliding selector in mobile */}
                <div className="mb-5 pb-4 border-b border-gray-100">
                  <span className="text-xs font-semibold text-gray-400 uppercase tracking-widest font-mono block mb-2">Max price: ৳{maxPrice}</span>
                  <input
                    type="range"
                    min={500}
                    max={10000}
                    step={100}
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(parseInt(e.target.value))}
                    className="w-full accent-primary h-1 rounded"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-2 pt-6 border-t border-gray-100">
                <button
                  onClick={() => setIsMobileFilterOpen(false)}
                  className="bg-primary hover:bg-primary-hover text-white font-bold py-3 text-xs uppercase tracking-wide rounded-xl cursor-pointer"
                >
                  Apply Filter criteria
                </button>
                <button
                  onClick={() => {
                    handleClearAllFilters();
                    setIsMobileFilterOpen(false);
                  }}
                  className="border border-gray-150 text-gray-500 font-bold py-2.5 text-xs uppercase tracking-wide rounded-xl bg-gray-50/50 cursor-pointer"
                >
                  Clear All Filters
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
