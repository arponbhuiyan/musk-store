/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { ShieldCheck, Truck, RotateCcw, Award, CheckCircle2 } from 'lucide-react';

export const WhyChoose: React.FC = () => {
  const features = [
    {
      icon: <ShieldCheck size={32} className="text-primary" />,
      title: '100% Genuine Products',
      description: 'Direct procurement from authentic factory lines under strict quality audits. No fake replicas.'
    },
    {
      icon: <Truck size={32} className="text-primary" />,
      title: 'Super-Fast Delivery',
      description: 'Official Steadfast Courier partner with delivery within 3-4 days all over Bangladesh.'
    },
    {
      icon: <RotateCcw size={32} className="text-primary" />,
      title: 'Easy 7-Day Returns',
      description: 'Zero hassle refund policies. If you receive defects, call us. We process return pickup instantly.'
    },
    {
      icon: <Award size={32} className="text-primary" />,
      title: 'Official Warranty Support',
      description: 'We offer solid replacement guarantees and dedicated repairs via our official physical service labs.'
    }
  ];

  return (
    <section className="bg-gray-950 text-white py-16 md:py-20 border-t border-gray-900" id="why-choose-section">
      <div className="max-w-7xl mx-auto px-4">
        
        {/* Visual Title */}
        <div className="text-center max-w-2xl mx-auto mb-12 md:mb-16">
          <span className="text-[10px] text-primary font-bold uppercase tracking-widest block font-mono mb-2">
            The MUSK Assurance
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white font-sans">
            Why Technology Experts Choose MUSK
          </h2>
          <p className="text-gray-400 text-sm mt-3 leading-relaxed">
            We bridge the gap between heavy technical performance and breathtaking daily aesthetics. Our systems set new standards for local gadget e-commerce.
          </p>
        </div>

        {/* Feature Grid columns */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feat, index) => (
            <div
              key={index}
              className="bg-gray-900/40 border border-gray-800/60 p-6 md:p-8 rounded-3xl hover:border-primary/30 hover:bg-gray-900/60 transition-all group flex flex-col items-start"
            >
              <div className="bg-gray-800/50 p-4 rounded-2xl group-hover:bg-primary-light/10 transition-colors mb-5">
                {feat.icon}
              </div>
              <h3 className="font-sans font-bold text-lg text-white mb-2 tracking-tight group-hover:text-primary transition-colors">
                {feat.title}
              </h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                {feat.description}
              </p>
            </div>
          ))}
        </div>

        {/* Small client trust numbers strip */}
        <div className="mt-14 pt-10 border-t border-gray-900 grid grid-cols-2 lg:grid-cols-4 gap-6 text-center">
          <div>
            <span className="text-3xl sm:text-4xl font-extrabold text-primary block leading-none font-sans">
              25K+
            </span>
            <span className="text-gray-500 text-xs uppercase tracking-wider block mt-1.5 font-mono">
              Happy Smart Clients
            </span>
          </div>
          <div>
            <span className="text-3xl sm:text-4xl font-extrabold text-primary block leading-none font-sans">
              4.9/5
            </span>
            <span className="text-gray-500 text-xs uppercase tracking-wider block mt-1.5 font-mono">
              Google Store Rating
            </span>
          </div>
          <div>
            <span className="text-3xl sm:text-4xl font-extrabold text-primary block leading-none font-sans">
              100%
            </span>
            <span className="text-gray-500 text-xs uppercase tracking-wider block mt-1.5 font-mono">
              Secured Checkout Methods
            </span>
          </div>
          <div>
            <span className="text-3xl sm:text-4xl font-extrabold text-primary block leading-none font-sans">
              6 Hour
            </span>
            <span className="text-gray-500 text-xs uppercase tracking-wider block mt-1.5 font-mono">
              Dhaka Deliveries
            </span>
          </div>
        </div>

      </div>
    </section>
  );
};
