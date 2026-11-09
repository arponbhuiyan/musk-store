/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { LiveOrderNotificationBanner } from './components/LiveOrderNotificationBanner';

// Importing all high-fidelity views
import { HomeView } from './views/HomeView';
import { ShopView } from './views/ShopView';
import { ProductDetailView } from './views/ProductDetailView';
import { CartView } from './views/CartView';
import { CheckoutView } from './views/CheckoutView';
import { DashboardView } from './views/DashboardView';
import { AdminView } from './views/AdminView';

// Subcomponent router to switch screens inside the Header/Footer scaffolding
const AppContent: React.FC = () => {
  const { activeView, blogs } = useApp();

  React.useEffect(() => {
    // Persistent visitor identification
    let visitorId = localStorage.getItem("musk_visitor_fingerprint");
    if (!visitorId) {
      visitorId = "vis_" + Math.random().toString(36).substring(2, 15) + Date.now().toString(36);
      localStorage.setItem("musk_visitor_fingerprint", visitorId);
    }

    // Report active view page view to secure Express backend
    fetch("/api/analytics/track-visit", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        visitorId,
        path: `/${activeView}`,
        referrer: document.referrer || "",
        userAgent: navigator.userAgent || ""
      })
    }).catch((err) => console.warn("Analytics ping error:", err));
  }, [activeView]);

  const renderActiveView = () => {
    switch (activeView) {
      case 'home':
        return <HomeView />;
      case 'shop':
        return <ShopView />;
      case 'product-details':
        return <ProductDetailView />;
      case 'cart':
        return <CartView />;
      case 'checkout':
        return <CheckoutView />;
      case 'dashboard':
        return <DashboardView />;
      case 'admin':
        return <AdminView />;
      
      case 'blogs':
        /* Custom fully responsive high-design Blogs article index view */
        return (
          <div className="max-w-7xl mx-auto px-4 py-12" id="blog-catalog-view">
            <div className="text-center max-w-xl mx-auto mb-12">
              <span className="text-[10px] text-primary font-black uppercase tracking-widest font-mono bg-primary-light border-primary-light border py-1 px-3 rounded-full inline-block mb-3">
                MUSK Labs Journal
              </span>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-950 tracking-tight leading-none mb-3">
                Technology For Smartness
              </h1>
              <p className="text-xs sm:text-sm text-gray-500 leading-relaxed font-semibold">
                Explore deep dives on acoustic seal research, active ANC engineering loops, smart watch telemetry monitors, and next-generation fast charging standards.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {blogs.map((post) => (
                <article
                  key={post.id}
                  className="bg-white border border-gray-150 rounded-3xl overflow-hidden hover:border-gray-300 transition-all shadow-sm flex flex-col justify-between"
                >
                  <div>
                    <div className="aspect-[16/10] overflow-hidden bg-gray-55/40 relative">
                      <img
                        src={post.image}
                        alt={post.title}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-300 referrerPolicy='no-referrer'"
                        referrerPolicy="no-referrer"
                      />
                      <span className="absolute top-4 left-4 bg-gray-900 text-white text-[9px] font-bold font-mono tracking-wider uppercase py-0.5 px-2.5 rounded-full">
                        {post.category}
                      </span>
                    </div>

                    <div className="p-6">
                      <div className="text-[10.5px] font-bold text-gray-400 font-mono mb-2">
                        {post.date} • {post.readTime}
                      </div>
                      <h3 className="font-sans font-extrabold text-gray-900 text-lg hover:text-primary transition-colors cursor-pointer leading-tight mb-2.5">
                        {post.title}
                      </h3>
                      <p className="text-xs sm:text-sm text-gray-550 leading-relaxed max-w-md">
                        {post.summary}
                      </p>
                    </div>
                  </div>

                  <div className="px-6 pb-6 pt-4 border-t border-gray-50 flex items-center justify-between text-xs text-gray-400 font-bold font-mono">
                    <span>Written by: {post.author}</span>
                    <button className="text-primary hover:underline font-extrabold cursor-pointer">
                      Read Full Article →
                    </button>
                  </div>
                </article>
              ))}
            </div>
          </div>
        );

      default:
        return <HomeView />;
    }
  };

  // Corporate layout wrapper
  return (
    <div className="min-h-screen bg-white text-gray-900 flex flex-col justify-between SelectionBg selection:bg-[#F26722] selection:text-white" id="musk-application-frame">
      <div>
        {/* Professional ecommerce sticky header */}
        <Header />

        {/* Dynamic page context mounts */}
        <div className="pt-[110px] md:pt-[130px]" id="viewport-gate">
          {renderActiveView()}
        </div>
      </div>

      {/* Floating real-time order arrival sound and WhatsApp alert toast */}
      <LiveOrderNotificationBanner />

      {/* Corporate footer */}
      <Footer />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
