/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { MessageSquare, Bell, X, ExternalLink, Volume2, VolumeX } from 'lucide-react';

// Synthesize pleasant storefront chime using Web Audio API (0 dependencies)
export function playOrderChime() {
  try {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();
    const now = ctx.currentTime;

    const playTone = (freq: number, startTime: number, duration: number, gainVal: number) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, startTime);
      gain.gain.setValueAtTime(gainVal, startTime);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + duration);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(startTime);
      osc.stop(startTime + duration);
    };

    // 3-note melodic doorbell: E5 -> G#5 -> B5
    playTone(659.25, now, 0.45, 0.25);
    playTone(830.61, now + 0.16, 0.55, 0.28);
    playTone(987.77, now + 0.32, 0.85, 0.35);
  } catch (err) {
    // Audio might require user interaction first
  }
}

interface OrderNotif {
  orderId: string;
  customerName: string;
  totalAmount: number;
  targetPhone: string;
  dispatchedVia: string;
  dispatchStatus: string;
  timestamp: string;
}

export const LiveOrderNotificationBanner: React.FC = () => {
  const { setRoute, ownerWhatsApp, isAdmin } = useApp();
  const [activeAlert, setActiveAlert] = useState<OrderNotif | null>(null);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const lastKnownOrderIdRef = useRef<string | null>(null);

  // Initialize with latest order ID so we only chime on FRESH arrivals (Admin only)
  useEffect(() => {
    if (!isAdmin) return;
    fetch('/api/notifications/latest')
      .then(res => res.json())
      .then(data => {
        if (data.latest) {
          lastKnownOrderIdRef.current = data.latest.orderId;
        }
      })
      .catch(() => {});
  }, [isAdmin]);

  // Poll for live incoming customer orders every 5 seconds (ONLY FOR ADMIN - NEVER CUSTOMER)
  useEffect(() => {
    if (!isAdmin) return;
    const interval = setInterval(() => {
      fetch('/api/notifications/latest')
        .then(res => res.json())
        .then(data => {
          const latest: OrderNotif | null = data.latest;
          if (latest && latest.orderId) {
            if (lastKnownOrderIdRef.current && latest.orderId !== lastKnownOrderIdRef.current) {
              // Fresh order placed!
              lastKnownOrderIdRef.current = latest.orderId;
              setActiveAlert(latest);

              if (soundEnabled) {
                playOrderChime();
              }

              // Also trigger HTML5 notification if granted
              if ('Notification' in window && Notification.permission === 'granted') {
                try {
                  new Notification(`🛍️ New Order: ${latest.orderId}`, {
                    body: `${latest.customerName} placed an order for ৳${latest.totalAmount.toLocaleString()}`,
                    icon: '/favicon.ico'
                  });
                } catch (e) {}
              }
            } else if (!lastKnownOrderIdRef.current) {
              lastKnownOrderIdRef.current = latest.orderId;
            }
          }
        })
        .catch(() => {});
    }, 4500);

    return () => clearInterval(interval);
  }, [isAdmin, soundEnabled]);

  // Request browser notification permission once on mount if user clicks
  const requestNotifyPermission = () => {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  };

  // NEVER SHOW POPUP TO CUSTOMERS
  if (!isAdmin || !activeAlert) return null;

  const targetPhone = activeAlert.targetPhone || ownerWhatsApp || '8801316752761';
  const whatsappUrl = `https://wa.me/${targetPhone.replace(/\D/g, '')}?text=${encodeURIComponent(
    `🛍️ *NEW ORDER ALERT - THE MUSK*\n\nOrder ID: ${activeAlert.orderId}\nCustomer: ${activeAlert.customerName}\nAmount: ৳${activeAlert.totalAmount?.toLocaleString() || 0}\nTime: ${new Date(activeAlert.timestamp).toLocaleTimeString()}`
  )}`;

  return (
    <div
      onClick={requestNotifyPermission}
      className="fixed bottom-6 right-6 z-50 max-w-sm w-full bg-slate-950 text-white rounded-3xl p-5 shadow-2xl border-2 border-emerald-500 animate-slide-up duration-300"
    >
      <div className="flex items-start justify-between gap-3 pb-3 border-b border-white/10 mb-3">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-2xl bg-emerald-500 text-slate-950 flex items-center justify-center shrink-0 shadow-lg shadow-emerald-500/30 animate-bounce">
            <Bell size={18} />
          </div>
          <div>
            <span className="text-[10px] font-mono font-black text-emerald-400 tracking-wider uppercase block">
              LIVE STOREFRONT ALERT
            </span>
            <h4 className="font-extrabold text-sm text-white">
              New Customer Order Placed!
            </h4>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setSoundEnabled(!soundEnabled);
            }}
            title={soundEnabled ? 'Mute alert sounds' : 'Enable alert sounds'}
            className="text-gray-400 hover:text-white p-1 rounded-lg"
          >
            {soundEnabled ? <Volume2 size={16} /> : <VolumeX size={16} />}
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setActiveAlert(null);
            }}
            className="text-gray-400 hover:text-white p-1 rounded-lg"
          >
            <X size={16} />
          </button>
        </div>
      </div>

      <div className="bg-white/5 rounded-2xl p-3 mb-3 border border-white/5 text-xs space-y-1 font-mono">
        <div className="flex justify-between">
          <span className="text-gray-400">Order ID:</span>
          <span className="font-bold text-white">{activeAlert.orderId}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-400">Customer:</span>
          <span className="font-bold text-emerald-300 font-sans">{activeAlert.customerName}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-400">Grand Total:</span>
          <span className="font-black text-white text-sm font-sans">৳{activeAlert.totalAmount?.toLocaleString() || 0}</span>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => setActiveAlert(null)}
          className="flex-1 bg-[#25D366] hover:bg-[#20bd5a] text-slate-950 font-black text-xs py-2.5 px-3 rounded-xl flex items-center justify-center gap-1.5 transition-all no-underline shadow-md"
        >
          <MessageSquare size={14} className="fill-current" />
          <span>Open on WhatsApp</span>
        </a>

        <button
          onClick={() => {
            setActiveAlert(null);
            setRoute('admin');
          }}
          className="bg-white/10 hover:bg-white/20 text-white font-bold text-xs py-2.5 px-3 rounded-xl transition-all flex items-center gap-1"
        >
          <span>View Order</span>
          <ExternalLink size={12} />
        </button>
      </div>
    </div>
  );
};
