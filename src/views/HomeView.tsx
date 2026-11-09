/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { useApp } from '../context/AppContext';
import { HeroSlider } from '../components/HeroSlider';
import { Categories } from '../components/Categories';
import { FlashSale } from '../components/FlashSale';
import { BestSellers } from '../components/BestSellers';
import { WhyChoose } from '../components/WhyChoose';
import { Quote, Sparkles, MessageCircleCode } from 'lucide-react';
import { SEOHead } from '../components/SEOHead';

export const HomeView: React.FC = () => {
  const { setRoute, setCategoryFilter } = useApp();

  // Fine, we can add a beautiful interactive Client Review/Stories grid here
  const reviews = [
    {
      name: 'Adil Chowdhury',
      city: 'Dhanmondi, Dhaka',
      comment: 'Ordered the AirAura X7 ANC Earbuds yesterday, and they arrived within 5 hours! The hybrid ANC has changed my work commute. Extremely minimal design and super fast load times.',
      rating: 5,
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=150&auto=format&fit=crop'
    },
    {
      name: 'Dr. Sabrina Yesmin',
      city: 'Uttara, Dhaka',
      comment: 'The ChronoElite Smartwatch Retina display is easily legible even under direct midday sun. Health measurements are SPOT ON compared to medical gear. MUSK offers superior accessories.',
      rating: 5,
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=150&auto=format&fit=crop'
    },
    {
      name: 'Rashedul Kabir',
      city: 'Chattogram',
      comment: 'I bought the FrostBreeze portable fan and carbon key holder. The fan has metal cooling cooling arrays that feel magical on hot days. Genuine packaging and premium tracking.',
      rating: 5,
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=150&auto=format&fit=crop'
    }
  ];

  return (
    <div className="flex flex-col min-h-screen">
      <SEOHead
        title="Premium Gadgets & Electronics Store"
        description="Discover MUSK - Your elite e-commerce partner for Active ANC earbuds, Retina smartwatches, premium LED stripe yards, and military carbon accessories. Designed for smartness."
      />
      
      {/* Premium Hero sliders */}
      <HeroSlider />

      {/* Categories grid */}
      <Categories />

      {/* Countdown Flash Campaigns */}
      <FlashSale />

      {/* Top 8 best sellers sliders */}
      <BestSellers />

      {/* Why choose MUSK assures */}
      <WhyChoose />

      {/* Customer feedback stories section */}
      <section className="py-16 bg-white border-b border-gray-100" id="testimonials-section">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center max-w-xl mx-auto mb-10 md:mb-12">
            <div className="flex items-center gap-1 bg-amber-50 text-amber-600 text-[10px] font-extrabold uppercase py-1 px-3 w-fit mx-auto rounded-full font-mono mb-2 border border-amber-100">
              <MessageCircleCode size={12} />
              <span>Authentic Community Feedback</span>
            </div>
            <h2 className="text-2.5xl sm:text-3.5xl font-extrabold tracking-tight text-gray-900 leading-none">
              Client Vibe reports
            </h2>
            <p className="text-gray-500 text-sm leading-relaxed mt-2.5">
              Real stories and review recommendations shared by premium tech product owners in Bangladesh.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {reviews.map((rev, index) => (
              <div
                key={index}
                className="bg-gray-50/50 p-6 sm:p-8 rounded-3xl border border-gray-100 flex flex-col justify-between"
              >
                <div>
                  <Quote size={28} className="text-primary/10 fill-primary/5" />
                  <p className="text-sm text-gray-600 leading-relaxed italic mt-4">
                    "{rev.comment}"
                  </p>
                </div>
                
                <div className="flex items-center gap-3 mt-6 border-t border-gray-100/60 pt-4">
                  <div className="w-11 h-11 rounded-full overflow-hidden border border-gray-250">
                    <img
                      src={rev.avatar}
                      alt={rev.name}
                      className="w-full h-full object-cover referrerPolicy='no-referrer'"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <div>
                    <h4 className="font-sans font-bold text-gray-900 text-sm leading-tight">
                      {rev.name}
                    </h4>
                    <span className="text-[10px] uppercase font-mono tracking-wider text-gray-400 block font-semibold mt-0.5">
                      {rev.city} (Verified Smart Owner)
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to action mid banner (limited time voucher claim) */}
      <section className="bg-primary py-12 text-white text-center relative overflow-hidden" id="cta-limited-voucher">
        {/* Dynamic decorative visual elements */}
        <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-white/5 rounded-full filter blur-xl pointer-events-none transform translate-y-[-50%] translate-x-[20%]" />
        <div className="absolute bottom-0 left-0 w-[200px] h-[200px] bg-black/10 rounded-full filter blur-lg pointer-events-none transform translate-y-[30%] translate-x-[-10%]" />

        <div className="max-w-4xl mx-auto px-4 z-10 relative flex flex-col items-center">
          <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-widest font-mono font-bold bg-white/15 px-3 py-1 rounded-full mb-3">
            <Sparkles size={11} className="fill-white" />
            Limited First Orders Campaign Only
          </div>
          <h2 className="text-2xl sm:text-3.5xl font-extrabold tracking-tight mb-2 font-sans text-white">
            Ready to Upgrade Your Living Ecosystem?
          </h2>
          <p className="text-primary-light text-sm max-w-lg leading-relaxed mb-6">
            Apply coupon code <span className="font-mono font-black text-white underline">SMARTMUSK</span> during checkout and immediately slash 15% off your premium carts.
          </p>
          <button
            onClick={() => {
              setCategoryFilter(null);
              setRoute('shop');
            }}
            className="bg-white hover:bg-gray-50 text-primary py-3 px-8 font-extrabold text-xs uppercase rounded-full shadow-lg tracking-wider cursor-pointer transform hover:-translate-y-0.5 transition-all"
            id="cta-shop-button"
          >
            Claim Deals and Browse Products
          </button>
        </div>
      </section>
    </div>
  );
};
