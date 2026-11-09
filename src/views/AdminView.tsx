﻿/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { SEOHead } from '../components/SEOHead';
import { Product, OrderStatus, PaymentStatus, Coupon } from '../types';
import {
  LayoutDashboard,
  Boxes,
  PlusCircle,
  FileCheck2,
  Trash2,
  Edit,
  Tag,
  Flame,
  LineChart,
  Settings,
  Users,
  Image,
  Search,
  CheckCircle,
  AlertCircle,
  Undo2,
  BadgeCent,
  Save,
  Check,
  Lock,
  KeyRound,
  ShieldCheck,
  LogOut,
  RefreshCcw,
  Eye,
  Activity,
  MessageSquare,
  Phone,
  Zap,
  ExternalLink,
  Info,
  Bell,
  Volume2,
  HardDrive
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { playOrderChime } from '../components/LiveOrderNotificationBanner';
import { GoogleDriveManager, GoogleSignInButton } from '../components/GoogleDriveManager';
import { googleSignIn, logoutGoogle } from '../services/googleDrive';

export const AdminView: React.FC = () => {
  const {
    products,
    categories,
    brands,
    orders,
    coupons,
    banners,
    adminAddProduct,
    adminUpdateProduct,
    adminDeleteProduct,
    adminUpdateOrderStatus,
    adminUpdatePaymentStatus,
    adminAddCoupon,
    adminDeleteCoupon,
    setRoute,
    ownerWhatsApp,
    setOwnerWhatsApp,
    whatsAppNotificationsEnabled,
    setWhatsAppNotificationsEnabled,
    getWhatsAppOrderUrl,
    getCustomerWhatsAppUrl,
    isAdmin,
    adminEmail,
    setAdminAuth
  } = useApp();

  // Load the Bearer token issued by our secure admin login
  const getAuthToken = () => localStorage.getItem('musk_admin_token') || '';
  const fetchWithAuth = async (input: RequestInfo | URL, init?: RequestInit): Promise<Response> => {
    const token = getAuthToken();
    const headers: Record<string, string> = { 'Content-Type': 'application/json', ...(init?.headers as Record<string, string> || {}) };
    if (token) headers['Authorization'] = `Bearer ${token}`;
    return fetch(input, { ...init, headers });
  };

  const [adminEmail1Input, setAdminEmail1Input] = useState('');
  const [adminEmail2Input, setAdminEmail2Input] = useState('');
  const [adminCredentialsSaved, setAdminCredentialsSaved] = useState(false);
  const [isVerifyingLogin, setIsVerifyingLogin] = useState(false);
  const [newPasswordInput, setNewPasswordInput] = useState('');
  const [confirmPasswordInput, setConfirmPasswordInput] = useState('');
  const [currentPasswordInput, setCurrentPasswordInput] = useState('');
  const [passwordChangeFeedback, setPasswordChangeFeedback] = useState<{ success: boolean; message: string } | null>(null);

  const [activeTab, setActiveTab] = useState<'overview' | 'products' | 'orders' | 'coupons' | 'flash' | 'reports' | 'analytics' | 'drive'>('overview');
  const [whatsAppInput, setWhatsAppInput] = useState(ownerWhatsApp);
  const [callmebotKeyInput, setCallmebotKeyInput] = useState('');
  const [customWebhookInput, setCustomWebhookInput] = useState('');
  const [telegramTokenInput, setTelegramTokenInput] = useState('');
  const [telegramChatIdInput, setTelegramChatIdInput] = useState('');
  const [telegramChatId2Input, setTelegramChatId2Input] = useState('');
  const [whatsAppSaved, setWhatsAppSaved] = useState(false);
  const [isTestingAutoDispatch, setIsTestingAutoDispatch] = useState(false);
  const [testResult, setTestResult] = useState('');
  const [isTestingCallMeBot, setIsTestingCallMeBot] = useState(false);
  const [callmebotTestFeedback, setCallmebotTestFeedback] = useState<{ success: boolean; message: string } | null>(null);
  const [isTestingTelegram, setIsTestingTelegram] = useState(false);
  const [telegramTestFeedback, setTelegramTestFeedback] = useState<{ success: boolean; message: string } | null>(null);
  const [isDetectingTelegram, setIsDetectingTelegram] = useState(false);
  const [telegramDetectData, setTelegramDetectData] = useState<{
    botUsername?: string;
    botUrl?: string;
    needsStart?: boolean;
    senderName?: string;
    chatId?: string;
    chatId2?: string;
    senderName2?: string;
    chats?: { id: string; name: string; username?: string }[];
  } | null>(null);

  // Analytics States from backend endpoint
  interface VisitEntry {
    visitorId: string;
    path: string;
    referrer: string;
    userAgent: string;
    timestamp: string;
  }

  interface LoginEntry {
    adminId: string;
    status: string;
    userAgent: string;
    ip: string;
    timestamp: string;
  }

  interface OrderNotificationEntry {
    orderId: string;
    customerName: string;
    totalAmount: number;
    targetPhone: string;
    dispatchedVia: string;
    dispatchStatus: string;
    timestamp: string;
  }

  const [analyticsData, setAnalyticsData] = useState<{
    totalVisits: number;
    uniqueVisitorsCount: number;
    visits: VisitEntry[];
    adminLogins: LoginEntry[];
    orderNotifications?: OrderNotificationEntry[];
  } | null>(null);
  const [isStatsLoading, setIsStatsLoading] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // Admin Login Security States
  const [adminIdInput, setAdminIdInput] = useState('');
  const [adminPasswordInput, setAdminPasswordInput] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(() => {
    return localStorage.getItem('musk_admin_auth') === 'true';
  });

  // Fetch settings after we have a valid session token
  useEffect(() => {
    if (!getAuthToken()) return; // Wait until login provides a token
    fetchWithAuth('/api/notifications/settings')
      .then(res => res.json())
      .then(data => {
        if (data.adminGmail1) setAdminEmail1Input(data.adminGmail1);
        if (data.adminGmail2) setAdminEmail2Input(data.adminGmail2);
        if (data.ownerWhatsApp) {
          setWhatsAppInput(data.ownerWhatsApp);
          setOwnerWhatsApp(data.ownerWhatsApp);
        }
        if (data.callmebotApiKey && data.callmebotApiKey !== '********') setCallmebotKeyInput(data.callmebotApiKey);
        if (data.customWebhookUrl) setCustomWebhookInput(data.customWebhookUrl);
        if (data.telegramBotToken && data.telegramBotToken !== '********') setTelegramTokenInput(data.telegramBotToken);
        if (data.telegramChatId) setTelegramChatIdInput(data.telegramChatId);
        if (data.telegramChatId2) setTelegramChatId2Input(data.telegramChatId2);
      })
      .catch(err => console.warn('Failed to load initial settings', err));
  }, [isAdminLoggedIn]);

  useEffect(() => {
    if (!isAdminLoggedIn || !getAuthToken()) return;
    setIsStatsLoading(true);
    fetchWithAuth('/api/analytics/stats')
      .then(res => res.json())
      .then(data => {
        setAnalyticsData(data);
        setIsStatsLoading(false);
      })
      .catch(err => {
        console.error('Failed to load traffic stats', err);
        setIsStatsLoading(false);
      });

    fetchWithAuth('/api/notifications/settings')
      .then(res => res.json())
      .then(data => {
        if (data.adminGmail1) setAdminEmail1Input(data.adminGmail1);
        if (data.adminGmail2) setAdminEmail2Input(data.adminGmail2);
        if (data.ownerWhatsApp) {
          setWhatsAppInput(data.ownerWhatsApp);
          setOwnerWhatsApp(data.ownerWhatsApp);
        }
        if (data.callmebotApiKey && data.callmebotApiKey !== '********') setCallmebotKeyInput(data.callmebotApiKey);
        if (data.customWebhookUrl) setCustomWebhookInput(data.customWebhookUrl);
        if (data.telegramBotToken && data.telegramBotToken !== '********') setTelegramTokenInput(data.telegramBotToken);
        if (data.telegramChatId) setTelegramChatIdInput(data.telegramChatId);
        if (data.telegramChatId2) setTelegramChatId2Input(data.telegramChatId2);
      })
      .catch(err => console.warn('Failed to load notification settings', err));
  }, [isAdminLoggedIn, refreshTrigger, activeTab]);

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const inputEmail = adminIdInput.trim().toLowerCase();
    const pw = adminPasswordInput;

    setIsVerifyingLogin(true);
    try {
      const res = await fetch('/api/admin/verify-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: inputEmail, password: pw })
      });
      const data = await res.json();
      setIsVerifyingLogin(false);

      if (data.success) {
        // Persist server-issued Bearer token for subsequent protected API calls
        if (data.token) localStorage.setItem('musk_admin_token', data.token);
        setIsAdminLoggedIn(true);
        setAdminAuth(true, inputEmail);
        setLoginError('');
      } else {
        // Don't leak error details back to user — just show generic failure + rate-limit hint
        setLoginError(data.error || 'Login failed. Please check your email and password.');
        fetch('/api/analytics/track-login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ adminId: inputEmail || 'Unknown Email', status: 'Failed Client (Pre-server)' })
        }).catch(() => {});
      }
    } catch {
      setIsVerifyingLogin(false);
      setLoginError('Network error. Please ensure the server is running.');
    }
  };

  const handleAdminGoogleSignIn = async () => {
    setLoginError('');
    setIsVerifyingLogin(true);
    try {
      const result = await googleSignIn();
      setIsVerifyingLogin(false);
      const signedInEmail = result?.user?.email?.trim().toLowerCase() || '';
      const allowedEmails = [
        (adminEmail1Input || 'arponbhuiyan@gmail.com').trim().toLowerCase(),
        (adminEmail2Input || 'muskgadgets25@gmail.com').trim().toLowerCase(),
        'arponbhuiyan@gmail.com',
        'muskgadgets25@gmail.com'
      ].filter(Boolean);

      if (signedInEmail && allowedEmails.includes(signedInEmail)) {
        setIsAdminLoggedIn(true);
        setAdminAuth(true, signedInEmail);
        setLoginError('');
      } else {
        await logoutGoogle().catch(() => {});
        setLoginError(
          `অ্যাক্সেস অনুমোদিত নয়! শুধুমাত্র নির্ধারিত ২টি এডমিন জিমেইল (${adminEmail1Input || 'arponbhuiyan@gmail.com'} অথবা ${adminEmail2Input || 'muskgadgets25@gmail.com'}) দিয়ে প্রবেশ করা যাবে।`
        );
      }
    } catch (err: any) {
      setIsVerifyingLogin(false);
      setLoginError(err?.message || 'Google Sign-In cancelled or failed.');
    }
  };

  const handleAdminLogout = () => {
    // Clear server-issued session token
    localStorage.removeItem('musk_admin_token');
    fetch('/api/admin/logout', { method: 'POST' }).catch(() => {});

    logoutGoogle().catch(() => {});
    setIsAdminLoggedIn(false);
    setAdminAuth(false);
    setAdminIdInput('');
    setAdminPasswordInput('');
    setRoute('home');
  };

  // Search product filters inside admin table
  const [productSearch, setProductSearch] = useState('');

  // 1. ADD / EDIT PRODUCT FORM STATE
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Form Inputs
  const [name, setName] = useState('');
  const [categoryId, setCategoryId] = useState(categories[0]?.id || '');
  const [brandId, setBrandId] = useState(brands[0]?.id || '');
  const [regularPrice, setRegularPrice] = useState(1000);
  const [discountPrice, setDiscountPrice] = useState<number | undefined>(undefined);
  const [isFlashSale, setIsFlashSale] = useState(false);
  const [flashSalePrice, setFlashSalePrice] = useState<number | undefined>(undefined);
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [stock, setStock] = useState(20);
  const [colorsInput, setColorsInput] = useState('Stellar Black, Ceramic White');
  const [isBestSeller, setIsBestSeller] = useState(false);
  const [isNewArrival, setIsNewArrival] = useState(true);
  const [specsInput, setSpecsInput] = useState('Active Noise cancellation: Up to 35dB, Driver Unit: 11mm');

  // 2. COUPON FORM STATE
  const [couponCode, setCouponCode] = useState('');
  const [couponValue, setCouponValue] = useState(15);
  const [couponType, setCouponType] = useState<'percentage' | 'fixed'>('percentage');
  const [couponMinOrder, setCouponMinOrder] = useState(1000);
  const [couponDesc, setCouponDesc] = useState('');
  const [couponSuccess, setCouponSuccess] = useState(false);

  // Calculate high-level financial stats over live orders
  const stats = useMemo(() => {
    const totalSales = orders.reduce((sum, o) => o.paymentStatus === 'Paid' ? sum + o.totalAmount : sum, 0);
    const pendingOrdersCount = orders.filter((o) => o.orderStatus === 'Pending').length;
    const completedOrdersCount = orders.filter((o) => o.orderStatus === 'Delivered').length;
    const totalItemsInCatalog = products.length;

    return { totalSales, pendingOrdersCount, completedOrdersCount, totalItemsInCatalog };
  }, [orders, products]);

  // Handle Edit product trigger mapping
  const handleEditClick = (p: Product) => {
    setEditingProduct(p);
    setName(p.name);
    setCategoryId(p.categoryId);
    setBrandId(p.brandId);
    setRegularPrice(p.regularPrice);
    setDiscountPrice(p.discountPrice);
    setIsFlashSale(p.isFlashSale);
    setFlashSalePrice(p.flashSalePrice);
    setDescription(p.description);
    setImageUrl(p.images[0] || '');
    setStock(p.stock);
    setColorsInput(p.colors.join(', '));
    setIsBestSeller(p.isBestSeller);
    setIsNewArrival(p.isNewArrival);
    
    // Parse specs object to string key:val representation
    const specsString = Object.entries(p.specs)
      .map(([k, v]) => `${k}: ${v}`)
      .join(', ');
    setSpecsInput(specsString);

    setIsFormOpen(true);
  };

  // Open Form for Adding fresh item
  const handleOpenAddForm = () => {
    setEditingProduct(null);
    setName('');
    setRegularPrice(1500);
    setDiscountPrice(undefined);
    setIsFlashSale(false);
    setFlashSalePrice(undefined);
    setDescription('');
    setImageUrl('https://images.unsplash.com/photo-1590658268037-6bf12165a8df?q=80&w=600&auto=format&fit=crop');
    setStock(30);
    setColorsInput('Stellar Black, Gray Steel');
    setIsBestSeller(false);
    setIsNewArrival(true);
    setSpecsInput('Connectivity: Bluetooth v5.3, Battery Life: Up to 10 Hours');
    setIsFormOpen(true);
  };

  // Process Add/Update Product
  const handleProductFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !description || !imageUrl) return;

    // Parse colors array from comma-separated string
    const colors = colorsInput.split(',').map((c) => c.trim()).filter(Boolean);

    // Parse specifications map from key:value pairing
    const specs: Record<string, string> = {};
    specsInput.split(',').forEach((pairing) => {
      const parts = pairing.split(':');
      if (parts.length >= 2) {
        specs[parts[0].trim()] = parts.slice(1).join(':').trim();
      }
    });

    const categoryName = categories.find((c) => c.id === categoryId)?.name || 'Gadget';
    const brandName = brands.find((b) => b.id === brandId)?.name || 'MUSK';

    const productData: any = {
      name,
      categoryId,
      categoryName,
      brandId,
      brandName,
      regularPrice,
      discountPrice: discountPrice || undefined,
      isFlashSale,
      flashSalePrice: flashSalePrice || undefined,
      description,
      images: [imageUrl],
      stock,
      colors,
      isBestSeller,
      isNewArrival,
      specs,
      warranty: '1 Year Brand Replacement Warranty'
    };

    if (editingProduct) {
      adminUpdateProduct({
        ...editingProduct,
        ...productData
      });
    } else {
      adminAddProduct(productData);
    }

    setIsFormOpen(false);
    setEditingProduct(null);
  };

  // Handle Coupon additions
  const handleCouponFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponCode) return;

    const newCoupon: Coupon = {
      code: couponCode.toUpperCase().trim(),
      discountValue: couponValue,
      discountType: couponType,
      minOrderValue: couponMinOrder,
      description: couponDesc || `${couponType === 'percentage' ? couponValue + '%' : '৳' + couponValue} off on orders above ৳${couponMinOrder}`,
      active: true
    };

    adminAddCoupon(newCoupon);
    setCouponCode('');
    setCouponValue(15);
    setCouponMinOrder(1000);
    setCouponDesc('');
    setCouponSuccess(true);
    setTimeout(() => setCouponSuccess(false), 2000);
  };

  // Filter Catalog Products inside table based on search
  const filteredAdminProducts = useMemo(() => {
    if (!productSearch) return products;
    const q = productSearch.toLowerCase();
    return products.filter((p) => p.name.toLowerCase().includes(q) || p.brandName.toLowerCase().includes(q));
  }, [products, productSearch]);

  // Quick flash sale toggler in admin table
  const handleFlashToggler = (productId: string) => {
    const p = products.find((prod) => prod.id === productId);
    if (p) {
      adminUpdateProduct({
        ...p,
        isFlashSale: !p.isFlashSale,
        discountPrice: !p.isFlashSale ? Math.round(p.regularPrice * 0.8) : p.discountPrice // set quick 20% off if turned on
      });
    }
  };

  if (!isAdminLoggedIn) {
    const primaryGmail = adminEmail1Input || 'arponbhuiyan@gmail.com';
    const secondaryGmail = adminEmail2Input || 'muskgadgets25@gmail.com';

    return (
      <div className="max-w-7xl mx-auto px-4 py-8 md:py-16 flex flex-col items-center justify-center min-h-[60vh]" id="admin-login-barrier">
        <SEOHead
          title="Admin Security Lock - MUSK"
          description="Owner authentication portal."
        />
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-lg bg-white border border-gray-150 rounded-3xl p-6 sm:p-8 shadow-2xl text-center"
        >
          <div className="mx-auto w-16 h-16 bg-slate-900 text-white rounded-2xl flex items-center justify-center mb-4 shadow-lg border border-slate-800">
            <Lock size={28} className="text-cyan-400" />
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-cyan-50 border border-cyan-200 text-cyan-800 rounded-full text-[10.5px] font-mono font-bold uppercase tracking-wider mb-2.5">
            <ShieldCheck size={13} className="text-cyan-600" />
            Strict 2-Gmail Security Policy
          </div>

          <h2 className="text-2xl font-sans font-extrabold text-[#1F2937] tracking-tight mb-2">
            Owner Admin Portal
          </h2>
          <p className="text-xs text-gray-500 font-medium mb-6 leading-relaxed">
            এই এডমিন প্যানেলটি কেবল নির্ধারিত <strong>২টি অনুমোদিত জিমেইল অ্যাকাউন্টের</strong> জন্য উন্মুক্ত। সাধারণ ক্রেতাদের জন্য এই অপশনটি সম্পূর্ণ গোপন ও সুরক্ষিত।
          </p>

          {/* Quick-Select Authorized Gmail Chips */}
          <div className="mb-5 bg-gray-50 border border-gray-200 rounded-2xl p-3.5 text-left">
            <span className="block text-[10px] font-mono uppercase tracking-wider text-gray-400 font-bold mb-2">
              Select Authorized Admin Account:
            </span>
            <div className="flex flex-col sm:flex-row gap-2">
              <button
                type="button"
                onClick={() => {
                  setAdminIdInput(primaryGmail);
                  setLoginError('');
                }}
                className={`flex-1 text-left p-2.5 rounded-xl border text-xs font-mono transition-all cursor-pointer flex items-center justify-between ${
                  adminIdInput.toLowerCase() === primaryGmail.toLowerCase()
                    ? 'border-primary bg-primary-light/40 text-primary font-bold shadow-xs'
                    : 'border-gray-200 bg-white hover:border-gray-300 text-gray-700'
                }`}
              >
                <div className="truncate">
                  <span className="block text-[9px] uppercase font-bold text-gray-400">Primary Admin</span>
                  <span className="truncate block font-semibold">{primaryGmail}</span>
                </div>
                {adminIdInput.toLowerCase() === primaryGmail.toLowerCase() && (
                  <Check size={14} className="text-primary shrink-0 ml-1" />
                )}
              </button>

              <button
                type="button"
                onClick={() => {
                  setAdminIdInput(secondaryGmail);
                  setLoginError('');
                }}
                className={`flex-1 text-left p-2.5 rounded-xl border text-xs font-mono transition-all cursor-pointer flex items-center justify-between ${
                  adminIdInput.toLowerCase() === secondaryGmail.toLowerCase()
                    ? 'border-primary bg-primary-light/40 text-primary font-bold shadow-xs'
                    : 'border-gray-200 bg-white hover:border-gray-300 text-gray-700'
                }`}
              >
                <div className="truncate">
                  <span className="block text-[9px] uppercase font-bold text-gray-400">Secondary Admin</span>
                  <span className="truncate block font-semibold">{secondaryGmail}</span>
                </div>
                {adminIdInput.toLowerCase() === secondaryGmail.toLowerCase() && (
                  <Check size={14} className="text-primary shrink-0 ml-1" />
                )}
              </button>
            </div>
          </div>

          <form onSubmit={handleAdminLogin} className="space-y-4 text-left font-sans">
            <div>
              <label className="text-xs font-bold text-gray-700 block mb-1">
                Authorized Admin Gmail *
              </label>
              <input
                type="email"
                required
                value={adminIdInput}
                onChange={(e) => {
                  setAdminIdInput(e.target.value);
                  setLoginError('');
                }}
                placeholder="e.g. arponbhuiyan@gmail.com"
                className="w-full bg-gray-50 border border-gray-200 p-3 rounded-xl text-xs sm:text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-primary focus:bg-white text-left font-semibold font-mono"
              />
              <span className="block text-[10px] text-gray-400 mt-1 font-mono">
                Only {primaryGmail} or {secondaryGmail} are permitted.
              </span>
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="text-xs font-bold text-gray-700 block">Admin Secret Password *</label>
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-[10px] text-gray-450 hover:text-primary font-bold cursor-pointer transition-colors"
                >
                  {showPassword ? "Hide password" : "Show password"}
                </button>
              </div>
              <input
                type={showPassword ? "text" : "password"}
                required
                value={adminPasswordInput}
                onChange={(e) => {
                  setAdminPasswordInput(e.target.value);
                  setLoginError('');
                }}
                placeholder="••••••••"
                className="w-full bg-gray-50 border border-gray-200 p-3 rounded-xl text-xs sm:text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-primary focus:bg-white text-left font-semibold font-mono"
              />
            </div>

            {loginError && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-red-50 text-red-700 text-xs p-3.5 rounded-xl border border-red-200 font-bold leading-relaxed text-left"
              >
                {loginError}
              </motion.div>
            )}

            <button
              type="submit"
              disabled={isVerifyingLogin}
              className="w-full bg-[#1F2937] hover:bg-slate-900 text-white text-xs font-bold py-3.5 px-4 rounded-xl flex items-center justify-center gap-2 cursor-pointer transition-all border border-transparent shadow-sm disabled:opacity-50"
            >
              {isVerifyingLogin ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                  <span>Verifying Authorization...</span>
                </>
              ) : (
                <>
                  <KeyRound size={15} />
                  <span>Authenticate & Unlock Admin Panel</span>
                </>
              )}
            </button>

            <div className="relative py-2 flex items-center justify-center">
              <div className="border-t border-gray-200 w-full"></div>
              <span className="bg-white px-3 text-[10px] font-mono uppercase font-bold text-gray-400">OR</span>
              <div className="border-t border-gray-200 w-full"></div>
            </div>

            <div className="flex justify-center">
              <GoogleSignInButton
                onClick={handleAdminGoogleSignIn}
                disabled={isVerifyingLogin}
                label="Sign in with Google (Admin & Drive)"
              />
            </div>
          </form>

          {/* Secure credentials details hint */}
          <div className="mt-6 pt-5 border-t border-gray-100 flex flex-col gap-1 text-[11px] text-gray-400 font-semibold leading-relaxed">
            <p>🔒 <strong>Strict Protection:</strong> Admin notification popups and dashboard links are automatically hidden from all storefront customers.</p>
          </div>

          <button
            onClick={() => setRoute('home')}
            className="mt-6 text-xs text-gray-450 hover:text-primary font-bold transition-colors inline-flex items-center gap-1.5 cursor-pointer"
          >
            <Undo2 size={12} />
            Back to Live Storefront
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 md:py-12" id="admin-dashboard-root">
      <SEOHead
        title="Admin Control Unit - Secured Management"
        description="Configure product inventory stocks, verify sales metrics charts, dispatch customer order logs, and draft promotional campaigns."
      />

      {/* Corporate Admin Headers */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8 border-b border-gray-150 pb-5">
        <div>
          <div className="flex items-center gap-1.5 text-cyan-600 text-[11px] font-bold uppercase tracking-widest font-mono mb-1">
            <span className="w-2 h-2 bg-cyan-500 rounded-full animate-ping"></span>
            Secured Corporate Console
          </div>
          <h1 className="text-2.5xl sm:text-3.5xl font-extrabold text-gray-950 tracking-tight leading-none">
            MUSK Admin Panel
          </h1>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <div className="px-3 py-1.5 bg-emerald-50 border border-emerald-250 rounded-xl text-xs font-mono font-bold text-emerald-900 flex items-center gap-2 shadow-xs">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>Admin: <strong className="text-gray-900">{adminEmail || adminEmail1Input || 'arponbhuiyan@gmail.com'}</strong></span>
          </div>

          <button
            onClick={handleAdminLogout}
            className="flex items-center gap-1.5 text-xs text-red-500 hover:text-white hover:bg-red-500 border border-red-200 hover:border-red-500 font-bold transition-all bg-white py-2 px-3.5 rounded-xl cursor-pointer shadow-sm"
          >
            <LogOut size={14} />
            Logout
          </button>

          <button
            onClick={() => setRoute('home')}
            className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-primary font-bold transition-colors border border-gray-200 hover:border-primary/20 bg-white py-2 px-3.5 rounded-xl cursor-pointer"
          >
            <Undo2 size={14} />
            Storefront
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Drawer list tabs */}
        <aside className="lg:col-span-3 flex flex-row lg:flex-col gap-1 overflow-x-auto no-scrollbar bg-slate-900 text-white p-3 rounded-2xl shadow-lg lg:sticky lg:top-[120px]">
          <button
            onClick={() => setActiveTab('overview')}
            className={`w-full text-left py-3 px-4 rounded-xl text-xs sm:text-sm font-semibold flex items-center gap-2.5 whitespace-nowrap transition-all cursor-pointer ${
              activeTab === 'overview' ? 'bg-primary text-white font-bold' : 'hover:bg-slate-800 text-gray-400'
            }`}
          >
            <LayoutDashboard size={17} />
            Dashboard Overview
          </button>
          <button
            onClick={() => setActiveTab('products')}
            className={`w-full text-left py-3 px-4 rounded-xl text-xs sm:text-sm font-semibold flex items-center gap-2.5 whitespace-nowrap transition-all cursor-pointer ${
              activeTab === 'products' ? 'bg-primary text-white font-bold' : 'hover:bg-slate-800 text-gray-400'
            }`}
          >
            <Boxes size={17} />
            Products Catalog ({products.length})
          </button>
          <button
            onClick={() => setActiveTab('orders')}
            className={`w-full text-left py-3 px-4 rounded-xl text-xs sm:text-sm font-semibold flex items-center justify-between whitespace-nowrap transition-all cursor-pointer ${
              activeTab === 'orders' ? 'bg-primary text-white font-bold' : 'hover:bg-slate-800 text-gray-400'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <FileCheck2 size={17} />
              Live Orders Dispatch ({orders.length})
            </div>
            {stats.pendingOrdersCount > 0 && (
              <span className="bg-amber-400 text-slate-950 text-[10px] font-mono font-black px-2 py-0.5 rounded-full animate-bounce">
                {stats.pendingOrdersCount} New
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveTab('coupons')}
            className={`w-full text-left py-3 px-4 rounded-xl text-xs sm:text-sm font-semibold flex items-center gap-2.5 whitespace-nowrap transition-all cursor-pointer ${
              activeTab === 'coupons' ? 'bg-primary text-white font-bold' : 'hover:bg-slate-800 text-gray-400'
            }`}
          >
            <Tag size={17} />
            Campaign Vouchers ({coupons.length})
          </button>
          <button
            onClick={() => setActiveTab('flash')}
            className={`w-full text-left py-3 px-4 rounded-xl text-xs sm:text-sm font-semibold flex items-center gap-2.5 whitespace-nowrap transition-all cursor-pointer ${
              activeTab === 'flash' ? 'bg-primary text-white font-bold' : 'hover:bg-slate-800 text-gray-400'
            }`}
          >
            <Flame size={17} />
            Flash Sale Setup
          </button>
          <button
            onClick={() => setActiveTab('reports')}
            className={`w-full text-left py-3 px-4 rounded-xl text-xs sm:text-sm font-semibold flex items-center gap-2.5 whitespace-nowrap transition-all cursor-pointer ${
              activeTab === 'reports' ? 'bg-primary text-white font-bold' : 'hover:bg-slate-800 text-gray-400'
            }`}
          >
            <LineChart size={17} />
            Visual Sales Charts
          </button>
          <button
            onClick={() => setActiveTab('analytics')}
            className={`w-full text-left py-3 px-4 rounded-xl text-xs sm:text-sm font-semibold flex items-center gap-2.5 whitespace-nowrap transition-all cursor-pointer ${
              activeTab === 'analytics' ? 'bg-primary text-white font-bold' : 'hover:bg-slate-800 text-gray-400'
            }`}
          >
            <Users size={17} />
            Traffic & Admin Logs
          </button>

          <button
            onClick={() => setActiveTab('drive')}
            className={`w-full text-left py-3 px-4 rounded-xl text-xs sm:text-sm font-semibold flex items-center gap-2.5 whitespace-nowrap transition-all cursor-pointer ${
              activeTab === 'drive' ? 'bg-blue-600 text-white font-bold' : 'hover:bg-slate-800 text-cyan-300'
            }`}
          >
            <HardDrive size={17} />
            Google Drive Cloud
          </button>

          <button
            onClick={handleAdminLogout}
            className="w-full text-left py-3 px-4 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2.5 whitespace-nowrap transition-all cursor-pointer text-red-400 hover:bg-red-500/20 hover:text-red-300 lg:mt-2 lg:border-t lg:border-slate-800"
          >
            <LogOut size={17} />
            Logout Admin
          </button>
        </aside>

        {/* Right Dashboard Master sheets */}
        <main className="lg:col-span-9 bg-white border border-gray-100 rounded-3xl p-6 sm:p-8 shadow-sm min-h-[450px]">
          
          {/* TAB 1: DASHBOARD OVERVIEW STATS */}
          {activeTab === 'overview' && (
            <div>
              <h2 className="text-xl font-extrabold text-gray-950 mb-6 pb-2.5 border-b border-gray-100 flex items-center gap-2">
                <LayoutDashboard size={20} className="text-primary" />
                Live Hub Overview Metrics
              </h2>

              {/* Stats bento widgets */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
                <div className="bg-gradient-to-br from-violet-50 to-white border border-violet-100 p-5 rounded-2xl">
                  <span className="text-[10px] text-violet-600 font-extrabold uppercase font-mono tracking-wider block mb-1">TOTAL EARNINGS</span>
                  <span className="text-2xl font-black text-violet-950 font-mono">৳{stats.totalSales.toLocaleString()}</span>
                  <span className="block text-[10px] text-gray-400 mt-1">From paid invoices inside BD</span>
                </div>
                <div className="bg-gradient-to-br from-sky-50 to-white border border-sky-100 p-5 rounded-2xl">
                  <span className="text-[10px] text-sky-600 font-extrabold uppercase font-mono tracking-wider block mb-1">PENDING EXPEDITIONS</span>
                  <span className="text-2xl font-black text-sky-950 font-mono">{stats.pendingOrdersCount}</span>
                  <span className="block text-[10px] text-gray-400 mt-1">Awaiting packaging audits</span>
                </div>
                <div className="bg-gradient-to-br from-emerald-50 to-white border border-emerald-100 p-5 rounded-2xl">
                  <span className="text-[10px] text-emerald-600 font-extrabold uppercase font-mono tracking-wider block mb-1">COMPLETED DISPATCHES</span>
                  <span className="text-2xl font-black text-emerald-950 font-mono">{stats.completedOrdersCount}</span>
                  <span className="block text-[10px] text-gray-400 mt-1">Delivered safe to clients</span>
                </div>
                <div className="bg-gradient-to-br from-amber-50 to-white border border-amber-100 p-5 rounded-2xl">
                  <span className="text-[10px] text-amber-600 font-extrabold uppercase font-mono tracking-wider block mb-1">CATALOG STOCK LISTS</span>
                  <span className="text-2xl font-black text-amber-950 font-mono">{stats.totalItemsInCatalog}</span>
                  <span className="block text-[10px] text-gray-400 mt-1">Active items inside categories</span>
                </div>
              </div>

              {/* Quick instructions alerts */}
              <div className="bg-gray-50 border border-gray-150 p-5 rounded-2xl text-xs text-gray-650 leading-relaxed flex items-start gap-3 mb-6">
                <AlertCircle size={18} className="text-cyan-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-gray-950 mb-1">Corporate Inventory & Ordering Policy</h4>
                  <p className="mb-2">Admin controls operate over live React State synchronized into <strong>LocalStorage</strong>. Adding products, updating order status pipelines, and deleting coupon keys updates browser caches immediately.</p>
                  <p>In a production system connected to SQLite or Cloud SQL, these methods write directly to PostgreSQL. We set realistic data structures including specs dictionary maps, color options palette lists, and item stocks.</p>
                </div>
              </div>

              {/* STRICT 2-GMAIL ADMIN ACCESS MANAGEMENT */}
              <div className="bg-gradient-to-br from-slate-900 via-slate-950 to-cyan-950 text-white border border-slate-800 rounded-3xl p-6 shadow-xl mb-8">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/10 mb-5">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-cyan-500 text-slate-950 flex items-center justify-center shadow-lg font-mono font-bold">
                      <ShieldCheck size={22} />
                    </div>
                    <div>
                      <h3 className="font-sans font-extrabold text-white text-base flex items-center gap-2">
                        Admin Access Control (Strict 2-Gmail Policy)
                        <span className="bg-cyan-500/20 text-cyan-300 text-[10px] font-mono font-bold px-2 py-0.5 rounded-full border border-cyan-500/30">
                          2 GMAIL ACCOUNTS ONLY
                        </span>
                      </h3>
                      <p className="text-xs text-gray-400 font-semibold">
                        Configure the exact two administrator Gmail accounts permitted to log into this Admin Panel. Regular customer accounts and popups are completely locked out.
                      </p>
                    </div>
                  </div>

                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-mono font-bold bg-cyan-950 text-cyan-300 border border-cyan-800">
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse"></span>
                    Protected
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
                  {/* Primary Admin Gmail */}
                  <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
                    <div className="flex justify-between items-center mb-1">
                      <label className="text-xs font-bold text-cyan-400 block font-mono">
                        👤 Primary Admin Gmail (Owner) *
                      </label>
                      <span className="text-[9px] bg-cyan-500/20 text-cyan-300 px-2 py-0.5 rounded-full font-mono font-bold">
                        Slot 1
                      </span>
                    </div>
                    <input
                      type="email"
                      value={adminEmail1Input}
                      onChange={(e) => {
                        setAdminEmail1Input(e.target.value);
                        setAdminCredentialsSaved(false);
                      }}
                      placeholder="arponbhuiyan@gmail.com"
                      className="w-full px-3 py-2.5 bg-slate-900 border border-white/15 rounded-xl text-xs font-mono font-bold text-white placeholder-gray-500 focus:outline-none focus:border-cyan-400"
                    />
                    <span className="text-[10px] text-gray-400 mt-1 block">
                      Default: <strong className="text-gray-300">arponbhuiyan@gmail.com</strong>
                    </span>
                  </div>

                  {/* Secondary Admin Gmail */}
                  <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
                    <div className="flex justify-between items-center mb-1">
                      <label className="text-xs font-bold text-cyan-400 block font-mono">
                        👥 Secondary Admin Gmail (2nd Device / Partner) *
                      </label>
                      <span className="text-[9px] bg-cyan-500/20 text-cyan-300 px-2 py-0.5 rounded-full font-mono font-bold">
                        Slot 2
                      </span>
                    </div>
                    <input
                      type="email"
                      value={adminEmail2Input}
                      onChange={(e) => {
                        setAdminEmail2Input(e.target.value);
                        setAdminCredentialsSaved(false);
                      }}
                      placeholder="e.g. muskgadgets25@gmail.com"
                      className="w-full px-3 py-2.5 bg-slate-900 border border-white/15 rounded-xl text-xs font-mono font-bold text-white placeholder-gray-500 focus:outline-none focus:border-cyan-400"
                    />
                    <span className="text-[10px] text-gray-400 mt-1 block">
                      Permits your second device or trusted partner to log into Admin.
                    </span>
                  </div>
                </div>

                {/* Save Gmail Whitelist (no plaintext password ever sent) */}
                <div className="bg-white/5 border border-white/10 rounded-2xl p-4 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
                  <div className="flex-1">
                    <div className="text-xs font-bold text-gray-300 font-mono">
                      🔒 Gmail Whitelist
                    </div>
                    <div className="text-[11px] text-gray-400 mt-1 leading-relaxed">
                      Only these two email addresses can log into the Admin Panel.
                      Password is managed via the "Change Admin Password" section below.
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      fetchWithAuth('/api/notifications/settings', {
                        method: 'POST',
                        body: JSON.stringify({
                          adminGmail1: adminEmail1Input.trim().toLowerCase(),
                          adminGmail2: adminEmail2Input.trim().toLowerCase(),
                        }),
                      })
                        .then(res => res.json())
                        .then(data => {
                          if (data.success) {
                            setAdminCredentialsSaved(true);
                            setTimeout(() => setAdminCredentialsSaved(false), 3000);
                          } else {
                            alert('Failed to save: ' + (data.error || 'Unknown error'));
                          }
                        })
                        .catch(err => console.error('Failed to save admin credentials', err));
                    }}
                    className="bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-mono text-xs font-bold py-3 px-6 rounded-xl flex items-center justify-center gap-2 cursor-pointer transition-all shadow-md self-end sm:self-center"
                  >
                    {adminCredentialsSaved ? (
                      <>
                        <Check size={15} />
                        <span>Gmail Whitelist Saved!</span>
                      </>
                    ) : (
                      <>
                        <Save size={15} />
                        <span>Save Whitelist</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Dedicated Password Change (authenticated, bcrypt on server) */}
                <div className="bg-white/5 border border-white/10 rounded-2xl p-4 mt-3">
                  <div className="text-xs font-bold text-cyan-300 font-mono mb-3">🔑 Change Admin Password (Server-side hashed)</div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                    <input
                      type="password"
                      value={currentPasswordInput}
                      onChange={(e) => setCurrentPasswordInput(e.target.value)}
                      placeholder="Current password"
                      className="w-full px-3 py-2 bg-slate-900 border border-white/15 rounded-xl text-xs font-mono font-bold text-white placeholder-gray-500 focus:outline-none focus:border-cyan-400"
                    />
                    <input
                      type="password"
                      value={newPasswordInput}
                      onChange={(e) => setNewPasswordInput(e.target.value)}
                      placeholder="New password (8+ chars)"
                      className="w-full px-3 py-2 bg-slate-900 border border-white/15 rounded-xl text-xs font-mono font-bold text-white placeholder-gray-500 focus:outline-none focus:border-cyan-400"
                    />
                    <input
                      type="password"
                      value={confirmPasswordInput}
                      onChange={(e) => setConfirmPasswordInput(e.target.value)}
                      placeholder="Confirm new password"
                      className="w-full px-3 py-2 bg-slate-900 border border-white/15 rounded-xl text-xs font-mono font-bold text-white placeholder-gray-500 focus:outline-none focus:border-cyan-400"
                    />
                  </div>
                  <div className="mt-3 flex items-center gap-3">
                    <button
                      onClick={async () => {
                        if (!currentPasswordInput || !newPasswordInput) {
                          setPasswordChangeFeedback({ success: false, message: 'All fields required.' });
                          return;
                        }
                        if (newPasswordInput !== confirmPasswordInput) {
                          setPasswordChangeFeedback({ success: false, message: 'Passwords do not match.' });
                          return;
                        }
                        if (newPasswordInput.length < 8) {
                          setPasswordChangeFeedback({ success: false, message: 'New password must be 8+ characters.' });
                          return;
                        }
                        try {
                          const res = await fetchWithAuth('/api/admin/change-password', {
                            method: 'POST',
                            body: JSON.stringify({ currentPassword: currentPasswordInput, newPassword: newPasswordInput }),
                          });
                          const data = await res.json();
                          if (data.success) {
                            setPasswordChangeFeedback({ success: true, message: 'Password changed successfully.' });
                            setCurrentPasswordInput('');
                            setNewPasswordInput('');
                            setConfirmPasswordInput('');
                          } else {
                            setPasswordChangeFeedback({ success: false, message: data.error || 'Failed.' });
                          }
                        } catch {
                          setPasswordChangeFeedback({ success: false, message: 'Network error.' });
                        }
                        setTimeout(() => setPasswordChangeFeedback(null), 4000);
                      }}
                      className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-mono text-xs font-bold py-2.5 px-5 rounded-xl flex items-center justify-center gap-2 cursor-pointer transition-all"
                    >
                      <KeyRound size={14} />
                      <span>Change Password</span>
                    </button>
                    {passwordChangeFeedback && (
                      <span className={`text-xs font-mono font-bold ${passwordChangeFeedback.success ? 'text-emerald-400' : 'text-red-400'}`}>
                        {passwordChangeFeedback.message}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* WHATSAPP ORDER NOTIFICATIONS CENTER */}
              <div className="bg-gradient-to-br from-emerald-50 via-white to-green-50/40 border border-emerald-200 rounded-3xl p-6 shadow-sm">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-emerald-100 mb-5">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-[#25D366] text-white flex items-center justify-center shadow-sm">
                      <MessageSquare size={20} className="fill-current" />
                    </div>
                    <div>
                      <h3 className="font-sans font-extrabold text-gray-900 text-base flex items-center gap-2">
                        Automated WhatsApp Order Notification Engine
                        <span className="bg-emerald-100 text-emerald-800 text-[10px] font-mono font-bold px-2 py-0.5 rounded-full border border-emerald-300">
                          100% Background Automated
                        </span>
                      </h3>
                      <p className="text-xs text-gray-500 font-semibold">
                        Whenever someone places an order, the website automatically notifies you in the background. Customers do not see any prompt.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-mono font-bold bg-emerald-100 text-emerald-800 border border-emerald-250">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                      Silent Customer Checkout
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                  {/* Phone & CallMeBot Setup */}
                  <div className="lg:col-span-7 space-y-4">
                    <div>
                      <label className="text-xs font-bold text-gray-700 block mb-1">
                        Store Owner WhatsApp Alert Number *
                      </label>
                      <div className="flex gap-2">
                        <div className="relative flex-1">
                          <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 font-mono text-xs font-bold">
                            +
                          </span>
                          <input
                            type="text"
                            value={whatsAppInput}
                            onChange={(e) => {
                              setWhatsAppInput(e.target.value);
                              setWhatsAppSaved(false);
                            }}
                            placeholder="8801316752761"
                            className="w-full pl-7 pr-3 py-2.5 bg-white border border-gray-300 rounded-xl text-xs font-mono font-bold text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-emerald-500 text-left"
                          />
                        </div>
                      </div>
                      <span className="block text-[10px] text-gray-400 mt-1 font-medium">
                        International format without + (e.g. <strong className="text-gray-600 font-mono">8801316752761</strong>).
                      </span>
                    </div>

                    {/* CALLMEBOT SETUP BOX */}
                    <div className="bg-emerald-50/70 border border-emerald-250 rounded-2xl p-4">
                      <div className="flex justify-between items-center mb-2">
                        <label className="text-xs font-bold text-gray-900 flex items-center gap-1.5">
                          <MessageSquare size={14} className="text-emerald-600" />
                          CallMeBot Free WhatsApp Direct Gateway
                        </label>
                        <span className="text-[10px] bg-emerald-200/70 text-emerald-900 font-mono font-bold px-2 py-0.5 rounded-full">
                          100% Free
                        </span>
                      </div>

                      {/* 3 Step Visual Guide */}
                      <div className="bg-white/80 border border-emerald-100 rounded-xl p-3 mb-3 text-[11px] text-gray-700 space-y-2">
                        <div className="font-bold text-gray-900 flex items-center gap-1 text-[11.5px]">
                          <Info size={13} className="text-emerald-700 shrink-0" />
                          How to activate CallMeBot WhatsApp (Try any active bot link below):
                        </div>
                        <ol className="list-decimal list-inside space-y-2 pl-1 leading-relaxed">
                          <li>
                            Open WhatsApp from your phone (<strong>+{whatsAppInput || '8801316752761'}</strong>) and message one of CallMeBot's active bots:
                            <div className="flex flex-wrap gap-2 mt-1.5 font-bold">
                              <a
                                href="https://wa.me/34684770005?text=I%20allow%20callmebot%20to%20send%20me%20messages"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="bg-emerald-600 hover:bg-emerald-700 text-white text-[10px] px-2.5 py-1 rounded-lg inline-flex items-center gap-1 no-underline"
                              >
                                Bot 1 (+34 684 770 005) <ExternalLink size={10} />
                              </a>
                              <a
                                href="https://wa.me/34623786449?text=I%20allow%20callmebot%20to%20send%20me%20messages"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="bg-emerald-600 hover:bg-emerald-700 text-white text-[10px] px-2.5 py-1 rounded-lg inline-flex items-center gap-1 no-underline"
                              >
                                Bot 2 (+34 623 78 64 49) <ExternalLink size={10} />
                              </a>
                              <a
                                href="https://wa.me/34644872157?text=I%20allow%20callmebot%20to%20send%20me%20messages"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="bg-emerald-600 hover:bg-emerald-700 text-white text-[10px] px-2.5 py-1 rounded-lg inline-flex items-center gap-1 no-underline"
                              >
                                Bot 3 (+34 644 87 21 57) <ExternalLink size={10} />
                              </a>
                            </div>
                            <span className="block text-[10px] text-amber-700 mt-1 font-semibold">
                              💡 Note: If WhatsApp says "number isn't in WhatsApp", Meta recently changed that bot number. Try Bot 2 or Bot 3, or use <strong>Telegram Alert</strong> below (which is official and never gets blocked)!
                            </span>
                          </li>
                          <li>
                            Send the message text: <span className="bg-emerald-100 px-1.5 py-0.5 rounded font-mono font-bold text-emerald-900 select-all">I allow callmebot to send me messages</span>
                          </li>
                          <li>
                            CallMeBot will reply in WhatsApp with: <em>"CallMeBot API Activated. Your API Key is: [number]"</em> (e.g. <span className="font-mono font-bold text-gray-900">748291</span>).
                          </li>
                          <li>
                            Copy that <strong>numeric code</strong> and paste it in the box below!
                          </li>
                        </ol>
                      </div>

                      <label className="text-xs font-bold text-gray-700 block mb-1">
                        CallMeBot Numeric API Key:
                      </label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={callmebotKeyInput}
                          onChange={(e) => {
                            setCallmebotKeyInput(e.target.value);
                            setWhatsAppSaved(false);
                            setCallmebotTestFeedback(null);
                          }}
                          placeholder="e.g. 748291"
                          className="flex-1 p-2.5 bg-white border border-gray-300 rounded-xl text-xs font-mono font-semibold text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-emerald-500 text-left"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            setIsTestingCallMeBot(true);
                            setCallmebotTestFeedback(null);
                            fetchWithAuth('/api/notifications/test-callmebot', {
                              method: 'POST',
                              headers: { 'Content-Type': 'application/json' },
                              body: JSON.stringify({
                                phone: whatsAppInput.trim(),
                                apikey: callmebotKeyInput.trim()
                              })
                            })
                              .then(res => res.json())
                              .then(data => {
                                setIsTestingCallMeBot(false);
                                setCallmebotTestFeedback({
                                  success: Boolean(data.success),
                                  message: data.success ? (data.message || '✅ Test message sent to WhatsApp!') : (data.error || data.message || 'CallMeBot returned an error.')
                                });
                              })
                              .catch(() => {
                                setIsTestingCallMeBot(false);
                                setCallmebotTestFeedback({
                                  success: false,
                                  message: 'Connection failed. Please check network.'
                                });
                              });
                          }}
                          disabled={isTestingCallMeBot || !callmebotKeyInput.trim()}
                          className="bg-emerald-700 hover:bg-emerald-800 disabled:opacity-50 text-white font-mono text-xs font-bold px-3 py-2 rounded-xl flex items-center gap-1.5 transition-all cursor-pointer whitespace-nowrap"
                        >
                          {isTestingCallMeBot ? (
                            <>
                              <span className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                              <span>Pinging...</span>
                            </>
                          ) : (
                            <>
                              <Zap size={13} />
                              <span>Test API Key</span>
                            </>
                          )}
                        </button>
                      </div>

                      {/* Warning if user typed the activation phrase */}
                      {(callmebotKeyInput.toLowerCase().includes('allow') || callmebotKeyInput.toLowerCase().includes('callmebot') || callmebotKeyInput.includes(' ')) && (
                        <div className="mt-2.5 p-3 bg-amber-50 border border-amber-300 rounded-xl text-xs text-amber-900 leading-relaxed font-semibold">
                          <div className="flex items-center gap-1.5 font-bold text-amber-950 mb-1">
                            <AlertCircle size={15} className="text-amber-600 shrink-0" />
                            Notice: You typed the activation request phrase, not your API Key!
                          </div>
                          <p className="text-[11px] text-amber-800">
                            1. Send <em>"I allow callmebot to send me messages"</em> to the CallMeBot bot on WhatsApp from your phone (<strong>+{whatsAppInput || '8801316752761'}</strong>).<br />
                            2. The bot will reply with a number (e.g. <strong>748291</strong>).<br />
                            3. Enter that numeric code here instead of the phrase!
                          </p>
                        </div>
                      )}

                      {callmebotTestFeedback && (
                        <div className={`mt-2 p-2.5 rounded-xl text-xs font-mono font-bold leading-relaxed ${callmebotTestFeedback.success ? 'bg-emerald-100 text-emerald-900 border border-emerald-300' : 'bg-red-50 text-red-800 border border-red-200'}`}>
                          {callmebotTestFeedback.message}
                        </div>
                      )}
                    </div>

                    {/* TELEGRAM BOT NOTIFICATION (RECOMMENDED: 100% RELIABLE & FREE FOREVER) */}
                    <div className="bg-sky-50/80 border border-sky-200 rounded-2xl p-4 shadow-xs">
                      <div className="flex justify-between items-center mb-1">
                        <label className="text-xs font-bold text-sky-950 flex items-center gap-1.5">
                          <Zap size={14} className="text-sky-600" />
                          Telegram Instant Push Alerts (100% Reliable & Free Forever)
                        </label>
                        <span className="text-[10px] bg-sky-200 text-sky-900 font-mono font-bold px-2 py-0.5 rounded-full">
                          Recommended
                        </span>
                      </div>
                      <p className="text-[11px] text-sky-900 mb-3 leading-relaxed font-medium">
                        Telegram has an official free bot platform that never gets banned by WhatsApp/Meta. You will receive instant order alerts with sound and vibration on your phone as soon as an order is placed:
                      </p>

                      {/* Step-by-step instructions */}
                      <div className="bg-white/95 border border-sky-200 rounded-xl p-3 mb-3 text-[11px] text-gray-700 space-y-2">
                        <div className="font-bold text-sky-950 flex items-center gap-1.5 border-b border-sky-100 pb-1.5">
                          <Info size={13} className="text-sky-600" />
                          How to Set Up in 1 Minute:
                        </div>
                        <ol className="list-decimal list-inside space-y-1.5 text-[11px] text-gray-700">
                          <li>
                            Open Telegram and search for <strong className="font-mono text-sky-700">@BotFather</strong> (or click{' '}
                            <a href="https://t.me/BotFather" target="_blank" rel="noopener noreferrer" className="text-sky-600 underline font-bold inline-flex items-center gap-0.5">
                              t.me/BotFather <ExternalLink size={10} />
                            </a>
                            ). Send <code>/newbot</code>, give it any name & username ending in <code>bot</code>, and copy your <strong>HTTP API Token</strong>.
                          </li>
                          <li>
                            <strong>Crucial Step:</strong> Open your newly created bot in Telegram and tap <strong>START</strong>! (Telegram bots cannot message you until you tap START).
                          </li>
                          <li>
                            Paste your Bot Token below and click <strong>Auto-Detect My Chat ID</strong>!
                          </li>
                        </ol>
                      </div>

                      {/* Chat Not Found Explanation Banner */}
                      <div className="bg-amber-50 border border-amber-200 rounded-xl p-2.5 mb-3 text-[11px] text-amber-900">
                        <span className="font-bold">Seeing &ldquo;Chat not found&rdquo;?</span> Telegram gives this error if you haven&rsquo;t pressed <strong>START</strong> on your bot yet, or if you entered your @username instead of your numeric Chat ID. Press Start on your bot, then click <strong>Auto-Detect My Chat ID</strong> below!
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-3">
                        <div>
                          <label className="text-[10.5px] font-bold text-gray-700 block mb-1">
                            1. Telegram Bot Token:
                          </label>
                          <input
                            type="text"
                            value={telegramTokenInput}
                            onChange={(e) => {
                              setTelegramTokenInput(e.target.value);
                              setWhatsAppSaved(false);
                            }}
                            placeholder="e.g. 8832587077:AA..."
                            className="w-full p-2.5 bg-white border border-gray-300 rounded-xl text-xs font-mono text-gray-900 placeholder-gray-400 focus:outline-sky-500"
                          />
                        </div>
                        <div>
                          <div className="flex justify-between items-center mb-1">
                            <label className="text-[10.5px] font-bold text-gray-700 block">
                              📱 Device 1 Chat ID (Primary):
                            </label>
                            <span className="text-[10px] text-gray-400 font-mono">Numbers only</span>
                          </div>
                          <input
                            type="text"
                            value={telegramChatIdInput}
                            onChange={(e) => {
                              setTelegramChatIdInput(e.target.value);
                              setWhatsAppSaved(false);
                            }}
                            placeholder="e.g. 8031044370"
                            className="w-full p-2.5 bg-white border border-gray-300 rounded-xl text-xs font-mono text-gray-900 placeholder-gray-400 focus:outline-sky-500"
                          />
                        </div>
                        <div>
                          <div className="flex justify-between items-center mb-1">
                            <label className="text-[10.5px] font-bold text-sky-900 block flex items-center gap-1">
                              📱 Device 2 Chat ID (2nd Phone):
                            </label>
                            <span className="text-[10px] text-sky-600 font-mono font-bold">Simultaneous</span>
                          </div>
                          <input
                            type="text"
                            value={telegramChatId2Input}
                            onChange={(e) => {
                              setTelegramChatId2Input(e.target.value);
                              setWhatsAppSaved(false);
                            }}
                            placeholder="e.g. 2nd phone ID"
                            className="w-full p-2.5 bg-white border border-sky-300 rounded-xl text-xs font-mono text-gray-900 placeholder-gray-400 focus:outline-sky-500"
                          />
                        </div>
                      </div>

                      <div className="p-2.5 bg-white/70 border border-sky-200 rounded-xl mb-3 text-[11px] text-sky-900 flex items-center justify-between gap-2">
                        <span>💡 <strong>Dual-Phone Dispatch:</strong> When an order is placed, both Device 1 and Device 2 receive the alert at the exact same moment with sound!</span>
                      </div>

                      {/* Warning if Chat ID contains letters or @ */}
                      {Boolean((telegramChatIdInput && (telegramChatIdInput.startsWith('@') || /[a-zA-Z]/.test(telegramChatIdInput))) ||
                               (telegramChatId2Input && (telegramChatId2Input.startsWith('@') || /[a-zA-Z]/.test(telegramChatId2Input)))) && (
                        <div className="mb-3 p-2.5 bg-red-50 border border-red-200 rounded-xl text-[11px] text-red-800 font-medium">
                          ⚠️ Chat IDs must be numbers only (e.g. <code>8031044370</code>), not @usernames.
                        </div>
                      )}

                      {/* Detected chats selector */}
                      {telegramDetectData?.chats && telegramDetectData.chats.length > 0 && (
                        <div className="mb-3 p-3 bg-white border border-sky-200 rounded-xl text-xs space-y-2">
                          <p className="font-bold text-gray-900 text-[11px]">
                            Detected Users who tapped START on your bot:
                          </p>
                          <div className="flex flex-wrap gap-2">
                            {telegramDetectData.chats.map((c) => (
                              <div key={c.id} className="p-2 bg-sky-50 border border-sky-200 rounded-lg flex items-center gap-2 text-[11px]">
                                <div>
                                  <span className="font-bold text-sky-950">{c.name}</span>
                                  <span className="font-mono text-gray-500 ml-1">({c.id})</span>
                                </div>
                                <button
                                  type="button"
                                  onClick={() => {
                                    setTelegramChatIdInput(c.id);
                                    setWhatsAppSaved(false);
                                  }}
                                  className="px-2 py-0.5 bg-sky-600 text-white rounded text-[10px] font-bold hover:bg-sky-700 cursor-pointer"
                                >
                                  Use for Device 1
                                </button>
                                <button
                                  type="button"
                                  onClick={() => {
                                    setTelegramChatId2Input(c.id);
                                    setWhatsAppSaved(false);
                                  }}
                                  className="px-2 py-0.5 bg-emerald-600 text-white rounded text-[10px] font-bold hover:bg-emerald-700 cursor-pointer"
                                >
                                  Use for Device 2
                                </button>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Auto-detect and Start Helper */}
                      {telegramDetectData?.needsStart && telegramDetectData?.botUrl && (
                        <div className="mb-3 p-3 bg-sky-100/80 border border-sky-300 rounded-xl text-xs text-sky-950 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                          <div>
                            <p className="font-bold">Bot @{telegramDetectData.botUsername} found!</p>
                            <p className="text-[11px] text-sky-800">Have your second phone open the bot in Telegram and tap START.</p>
                          </div>
                          <a
                            href={telegramDetectData.botUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs px-3 py-1.5 rounded-lg flex items-center gap-1.5 shrink-0 transition-colors shadow-xs"
                          >
                            <span>Open @{telegramDetectData.botUsername} & Tap START</span>
                            <ExternalLink size={12} />
                          </a>
                        </div>
                      )}

                      <div className="flex flex-wrap items-center gap-2">
                        {/* Auto-Detect Button */}
                        <button
                          type="button"
                          onClick={() => {
                            const token = telegramTokenInput.trim();
                            if (!token) {
                              setTelegramTestFeedback({
                                success: false,
                                message: 'Please enter your Telegram Bot Token from @BotFather first.'
                              });
                              return;
                            }
                            setIsDetectingTelegram(true);
                            setTelegramTestFeedback(null);
                            fetchWithAuth('/api/notifications/telegram-detect-chat', {
                              method: 'POST',
                              headers: { 'Content-Type': 'application/json' },
                              body: JSON.stringify({ token })
                            })
                              .then(res => res.json())
                              .then(data => {
                                setIsDetectingTelegram(false);
                                if (data.success && data.chats && data.chats.length > 0) {
                                  setTelegramDetectData(data);
                                  if (!telegramChatIdInput && data.chats[0]) {
                                    setTelegramChatIdInput(data.chats[0].id);
                                  }
                                  if (!telegramChatId2Input && data.chats[1]) {
                                    setTelegramChatId2Input(data.chats[1].id);
                                  }
                                  setTelegramTestFeedback({
                                    success: true,
                                    message: `✅ Found ${data.chats.length} active device(s)! Assign them using the buttons above.`
                                  });
                                } else {
                                  setTelegramDetectData(data);
                                  setTelegramTestFeedback({
                                    success: false,
                                    message: data.error || 'Could not find chat. Have both phones tap START in the bot, then try again!'
                                  });
                                }
                              })
                              .catch(() => {
                                setIsDetectingTelegram(false);
                                setTelegramTestFeedback({
                                  success: false,
                                  message: 'Connection failed when checking Telegram.'
                                });
                              });
                          }}
                          disabled={isDetectingTelegram || !telegramTokenInput.trim()}
                          className="bg-sky-100 hover:bg-sky-200 text-sky-900 border border-sky-300 disabled:opacity-50 font-mono text-xs font-bold px-3 py-1.5 rounded-xl flex items-center gap-1.5 transition-all cursor-pointer whitespace-nowrap"
                        >
                          <Zap size={13} className="text-sky-600" />
                          {isDetectingTelegram ? <span>Checking Telegram...</span> : <span>⚡ Auto-Detect Devices</span>}
                        </button>

                        {/* Test Telegram Connection Button (Tests both devices) */}
                        <button
                          type="button"
                          onClick={() => {
                            setIsTestingTelegram(true);
                            setTelegramTestFeedback(null);
                            fetchWithAuth('/api/notifications/test-telegram', {
                              method: 'POST',
                              headers: { 'Content-Type': 'application/json' },
                              body: JSON.stringify({
                                token: telegramTokenInput.trim(),
                                chatId: telegramChatIdInput.trim(),
                                chatId2: telegramChatId2Input.trim()
                              })
                            })
                              .then(res => res.json())
                              .then(data => {
                                setIsTestingTelegram(false);
                                setTelegramTestFeedback({
                                  success: Boolean(data.success),
                                  message: data.message || (data.success ? '✅ Alert sent!' : (data.error || 'Failed to send alert.'))
                                });
                              })
                              .catch(() => {
                                setIsTestingTelegram(false);
                                setTelegramTestFeedback({
                                  success: false,
                                  message: 'Connection failed to Telegram.'
                                });
                              });
                          }}
                          disabled={isTestingTelegram || !telegramTokenInput.trim() || (!telegramChatIdInput.trim() && !telegramChatId2Input.trim())}
                          className="bg-sky-600 hover:bg-sky-700 disabled:opacity-50 text-white font-mono text-xs font-bold px-3 py-1.5 rounded-xl flex items-center gap-1.5 transition-all cursor-pointer whitespace-nowrap"
                        >
                          {isTestingTelegram ? <span>Sending Alert to Both Devices...</span> : <span>Test Alert on Both Devices</span>}
                        </button>
                      </div>

                      {telegramTestFeedback && (
                        <div className={`mt-2.5 p-2.5 rounded-xl text-xs font-mono font-bold leading-relaxed whitespace-pre-line ${telegramTestFeedback.success ? 'bg-emerald-100 text-emerald-900 border border-emerald-300' : 'bg-red-50 text-red-800 border border-red-200'}`}>
                          {telegramTestFeedback.message}
                        </div>
                      )}
                    </div>

                    {/* SAVE BUTTON */}
                    <button
                      onClick={() => {
                        const cleaned = whatsAppInput.trim();
                        setOwnerWhatsApp(cleaned);
                        fetchWithAuth('/api/notifications/settings', {
                          method: 'POST',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify({
                            ownerWhatsApp: cleaned,
                            callmebotApiKey: callmebotKeyInput.trim(),
                            customWebhookUrl: customWebhookInput.trim(),
                            telegramBotToken: telegramTokenInput.trim(),
                            telegramChatId: telegramChatIdInput.trim(),
                            telegramChatId2: telegramChatId2Input.trim(),
                            adminGmail1: adminEmail1Input.trim().toLowerCase() || undefined,
                            adminGmail2: adminEmail2Input.trim().toLowerCase() || undefined,
                          })
                        })
                          .then(res => res.json())
                          .then(() => {
                            setWhatsAppSaved(true);
                            setTimeout(() => setWhatsAppSaved(false), 2500);
                          })
                          .catch(err => console.error('Error saving settings', err));
                      }}
                      className="bg-emerald-600 hover:bg-emerald-700 text-white font-mono text-xs font-bold py-2.5 px-6 rounded-xl cursor-pointer flex items-center gap-1.5 transition-all shadow-xs"
                    >
                      {whatsAppSaved ? (
                        <>
                          <Check size={14} />
                          Settings Saved!
                        </>
                      ) : (
                        <>
                          <Save size={14} />
                          Save Notification Settings
                        </>
                      )}
                    </button>
                  </div>

                  {/* Actions & Live Dispatch Test */}
                  <div className="lg:col-span-5 bg-white border border-emerald-150 rounded-2xl p-4.5 flex flex-col justify-between">
                    <div>
                      <h4 className="font-extrabold text-xs text-gray-900 uppercase tracking-wide mb-2 flex items-center gap-1.5">
                        <Activity size={14} className="text-emerald-600" />
                        Live Storefront Alert Testing
                      </h4>
                      <p className="text-[11px] text-gray-500 mb-4 leading-relaxed font-semibold">
                        Simulate a new customer order and verify that the website backend dispatches automated alerts and rings your storefront doorbell.
                      </p>

                      <div className="space-y-2 mb-3">
                        <button
                          onClick={() => {
                            playOrderChime();
                          }}
                          type="button"
                          className="w-full bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border border-emerald-250 font-mono text-xs font-bold py-2 px-3 rounded-xl flex items-center justify-center gap-2 cursor-pointer transition-all"
                        >
                          <Bell size={14} className="text-emerald-600 animate-bounce" />
                          <span>Test Storefront Doorbell Sound (Chime)</span>
                        </button>

                        <button
                          onClick={() => {
                            setIsTestingAutoDispatch(true);
                            setTestResult('');
                            const sampleOrder = {
                              id: `TEST-${Math.floor(1000 + Math.random() * 9000)}`,
                              trackingNumber: `TRK${Math.floor(10000000 + Math.random() * 90000000)}`,
                              fullName: 'Arpon Bhuiyan (Test Buyer)',
                              phone: '+880 1712-345678',
                              address: 'House 12, Road 4, Sector 3, Uttara',
                              city: 'Dhaka',
                              postalCode: '1230',
                              paymentMethod: 'bKash',
                              senderNumber: '01816505013',
                              transactionCode: 'TEST99XF7A',
                              items: [
                                {
                                  productId: 'p1',
                                  productName: 'Havit H655BT Hybrid ANC Headphone',
                                  productImage: '',
                                  price: 3450,
                                  quantity: 1,
                                  selectedColor: 'Matte Black'
                                }
                              ],
                              subtotal: 3450,
                              deliveryCharge: 0,
                              discountAmount: 0,
                              totalAmount: 3450,
                              createdAt: new Date().toISOString()
                            };

                            fetch('/api/notifications/whatsapp-order', {
                              method: 'POST',
                              headers: { 'Content-Type': 'application/json' },
                              body: JSON.stringify({ order: sampleOrder })
                            })
                              .then(res => res.json())
                              .then(data => {
                                setIsTestingAutoDispatch(false);
                                setTestResult(data.dispatchStatus ? `Status: ${data.dispatchStatus} (${data.dispatchedVia || 'Backend'})` : '✅ Order registered!');
                                setRefreshTrigger(prev => prev + 1);
                                playOrderChime();
                              })
                              .catch(() => {
                                setIsTestingAutoDispatch(false);
                                setTestResult('Dispatched to backend log');
                              });
                          }}
                          disabled={isTestingAutoDispatch}
                          className="w-full bg-slate-900 hover:bg-slate-950 text-white font-mono text-xs font-bold py-2.5 px-4 rounded-xl flex items-center justify-center gap-2 cursor-pointer transition-all disabled:opacity-50"
                        >
                          {isTestingAutoDispatch ? (
                            <>
                              <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                              <span>Dispatching Auto Alert...</span>
                            </>
                          ) : (
                            <>
                              <Zap size={14} className="text-amber-400" />
                              <span>Trigger Background Test Order</span>
                            </>
                          )}
                        </button>
                      </div>

                      {testResult && (
                        <div className="mt-2.5 p-2 bg-emerald-50 border border-emerald-200 rounded-lg text-[11px] font-mono font-bold text-emerald-800 text-center animate-fade-in">
                          {testResult}
                        </div>
                      )}
                    </div>

                    <div className="pt-4 border-t border-gray-100 mt-4 space-y-2">
                      <a
                        href={`https://wa.me/${whatsAppInput.replace(/\D/g, '')}?text=${encodeURIComponent(
                          '🛍️ *TEST NOTIFICATION - THE MUSK*\n\nYour WhatsApp automated order notification system is connected and working perfectly!\n\nWebsite: THE MUSK Official Gadget Hub'
                        )}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full bg-[#25D366] hover:bg-[#20bd5a] text-white font-extrabold text-xs py-2 px-3 rounded-xl flex items-center justify-center gap-1.5 transition-all no-underline cursor-pointer"
                      >
                        <MessageSquare size={13} className="fill-current" />
                        <span>Open WhatsApp on this Device</span>
                      </a>
                    </div>
                  </div>
                </div>

                {/* RECENT AUTOMATED ORDER NOTIFICATIONS AUDIT TABLE */}
                {analyticsData?.orderNotifications && analyticsData.orderNotifications.length > 0 && (
                  <div className="mt-6 pt-5 border-t border-emerald-150">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-extrabold text-xs text-gray-900 uppercase tracking-wide flex items-center gap-1.5">
                        <Activity size={14} className="text-emerald-600" />
                        Recent Automated Dispatch Activity ({analyticsData.orderNotifications.length})
                      </h4>
                      <span className="text-[10px] text-gray-400 font-mono">Live Sync</span>
                    </div>

                    <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white">
                      <table className="w-full text-left border-collapse text-xs">
                        <thead>
                          <tr className="bg-gray-50 border-b border-gray-200 text-gray-500 font-mono text-[10px] uppercase">
                            <th className="p-2.5">Time</th>
                            <th className="p-2.5">Order ID</th>
                            <th className="p-2.5">Customer</th>
                            <th className="p-2.5">Target Phone</th>
                            <th className="p-2.5">Dispatched Via</th>
                            <th className="p-2.5">Status</th>
                            <th className="p-2.5 text-right">Quick Action</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 font-mono text-[11px]">
                          {analyticsData.orderNotifications.slice(0, 10).map((notif, idx) => (
                            <tr key={idx} className="hover:bg-gray-50/60">
                              <td className="p-2.5 text-gray-400 text-[10px]">
                                {new Date(notif.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                              </td>
                              <td className="p-2.5 font-bold text-gray-900">{notif.orderId}</td>
                              <td className="p-2.5 font-sans font-semibold text-gray-800">{notif.customerName}</td>
                              <td className="p-2.5 text-gray-600">+{notif.targetPhone}</td>
                              <td className="p-2.5 text-emerald-800 font-bold">{notif.dispatchedVia}</td>
                              <td className="p-2.5">
                                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${notif.dispatchStatus.includes('Delivered') ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' : notif.dispatchStatus.includes('Error') || notif.dispatchStatus.includes('Failed') ? 'bg-rose-100 text-rose-800 border border-rose-300' : 'bg-gray-100 text-gray-700'}`}>
                                  {notif.dispatchStatus}
                                </span>
                              </td>
                              <td className="p-2.5 text-right">
                                <a
                                  href={`https://wa.me/${notif.targetPhone}?text=${encodeURIComponent(
                                    `🛍️ Order #${notif.orderId} for ${notif.customerName} (৳${notif.totalAmount?.toLocaleString() || 0})`
                                  )}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center gap-1 bg-[#25D366] text-white px-2 py-1 rounded-lg text-[10px] font-bold hover:bg-[#20bd5a] no-underline"
                                >
                                  <MessageSquare size={10} className="fill-current" />
                                  <span>WhatsApp</span>
                                </a>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 2: PRODUCT CATALOG MANAGER (Detailed Add/Update tables) */}
          {activeTab === 'products' && (
            <div>
              <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-4 mb-6 pb-2.5 border-b border-gray-100">
                <h2 className="text-xl font-extrabold text-gray-950 flex items-center gap-2">
                  <Boxes size={20} className="text-primary" />
                  Product Inventory Editor ({filteredAdminProducts.length})
                </h2>
                <button
                  onClick={handleOpenAddForm}
                  className="bg-primary hover:bg-primary-hover text-white text-xs font-bold py-2 px-4 rounded-xl flex items-center gap-1.5 cursor-pointer self-start sm:self-auto"
                >
                  <PlusCircle size={14} />
                  Add Fresh Gadget
                </button>
              </div>

              {/* Search catalog query bar */}
              <div className="relative mb-5" id="admin-search-tab">
                <input
                  type="text"
                  placeholder="Filter inventory by name, brand, or coding sku..."
                  value={productSearch}
                  onChange={(e) => setProductSearch(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-150 pl-10 pr-4 py-2 text-xs rounded-xl focus:outline-none focus:ring-1 focus:ring-primary focus:bg-white text-left"
                />
                <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
              </div>

              {/* PRODUCTS LIST TABLE */}
              <div className="border border-gray-150 rounded-2xl overflow-hidden shadow-sm overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-150 font-mono font-bold text-gray-500 uppercase tracking-widest text-[10px]">
                      <th className="p-3">Item Details</th>
                      <th className="p-3">Category</th>
                      <th className="p-3">Retail Price</th>
                      <th className="p-3">Stock Units</th>
                      <th className="p-3">Attributes</th>
                      <th className="p-3 text-right">Settings</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {filteredAdminProducts.map((p) => (
                      <tr key={p.id} className="hover:bg-gray-50/50 transition-colors">
                        <td className="p-3">
                          <div className="flex items-center gap-2.5">
                            <img src={p.images[0]} alt="" className="w-9 h-9 object-cover rounded-lg border border-gray-150 referrerPolicy='no-referrer'" referrerPolicy="no-referrer" />
                            <div>
                              <span className="font-extrabold text-gray-950 block leading-tight">{p.name}</span>
                              <span className="text-[10px] text-gray-400 mt-0.5 block font-mono font-bold leading-none">{p.sku} (Brand: {p.brandName})</span>
                            </div>
                          </div>
                        </td>
                        <td className="p-3">
                          <span className="inline-block bg-sky-50 text-sky-700 py-0.5 px-2.5 rounded-full border border-sky-100 font-semibold">{p.categoryName}</span>
                        </td>
                        <td className="p-3 font-mono font-bold text-gray-900">
                          {p.discountPrice ? (
                            <div className="flex flex-col">
                              <span className="text-primary font-extrabold">৳{p.discountPrice}</span>
                              <span className="text-gray-400 line-through text-[10px]">৳{p.regularPrice}</span>
                            </div>
                          ) : (
                            <span>৳{p.regularPrice}</span>
                          )}
                        </td>
                        <td className="p-3">
                          <span className={`font-mono font-black ${p.stock <= 5 ? 'text-red-500' : 'text-gray-700'}`}>{p.stock} units</span>
                        </td>
                        <td className="p-3">
                          <div className="flex flex-wrap gap-1">
                            {p.isFlashSale && <span className="bg-rose-50 text-rose-600 text-[9px] font-bold py-0.5 px-2 rounded-full border border-rose-100">Flash Sales</span>}
                            {p.isBestSeller && <span className="bg-amber-50 text-amber-600 text-[9px] font-bold py-0.5 px-2 rounded-full border border-amber-100">Best</span>}
                          </div>
                        </td>
                        <td className="p-3 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => handleEditClick(p)}
                              className="p-1.5 hover:text-cyan-600 hover:bg-cyan-50 rounded-lg border border-transparent hover:border-cyan-100 transition-all cursor-pointer"
                              title="Edit config parameters"
                              id={`edit-p-${p.id}`}
                            >
                              <Edit size={14} />
                            </button>
                            <button
                              onClick={() => adminDeleteProduct(p.id)}
                              className="p-1.5 hover:text-red-500 hover:bg-red-50 rounded-lg border border-transparent hover:border-red-100 transition-all cursor-pointer"
                              title="Delete Item"
                              id={`delete-p-${p.id}`}
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* MASTER ADD / EDIT MODAL DRAWER OVERLAY */}
              <AnimatePresence>
                {isFormOpen && (
                  <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    {/* Backdrop */}
                    <div onClick={() => setIsFormOpen(false)} className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm" />

                    {/* Form body */}
                    <motion.div
                      initial={{ scale: 0.95, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0.95, opacity: 0 }}
                      className="bg-white rounded-3xl overflow-hidden shadow-2xl border border-gray-100 relative z-10 w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 scrollbar-thin"
                    >
                      <h3 className="font-sans font-extrabold text-gray-950 text-lg mb-5 pb-2.5 border-b border-gray-100 flex items-center gap-1.5">
                        <PlusCircle size={20} className="text-primary" />
                        {editingProduct ? `Edit configuration: ${editingProduct.name}` : 'Introduce Fresh Gadget Item'}
                      </h3>

                      <form onSubmit={handleProductFormSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                        {/* Name input */}
                        <div className="sm:col-span-2">
                          <label className="text-xs font-bold text-gray-600 block mb-1">Product Market Name *</label>
                          <input
                            type="text"
                            required
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="e.g. MUSK Carbon Sonic Headphones 2"
                            className="w-full bg-gray-50 border border-gray-250 p-2.5 rounded-xl text-xs text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-primary focus:bg-white text-left"
                          />
                        </div>

                        {/* Category selection */}
                        <div>
                          <label className="text-xs font-bold text-gray-600 block mb-1">Inventory Category *</label>
                          <select
                            value={categoryId}
                            onChange={(e) => setCategoryId(e.target.value)}
                            className="w-full bg-gray-50 border border-gray-250 p-2.5 rounded-xl text-xs text-gray-800 focus:outline-none focus:ring-1 focus:ring-primary focus:bg-white"
                            title="inventory categorisation"
                          >
                            {categories.map((c) => (
                              <option key={c.id} value={c.id}>{c.name}</option>
                            ))}
                          </select>
                        </div>

                        {/* Brand selection */}
                        <div>
                          <label className="text-xs font-bold text-gray-600 block mb-1">Brand Mapping *</label>
                          <select
                            value={brandId}
                            onChange={(e) => setBrandId(e.target.value)}
                            className="w-full bg-gray-50 border border-gray-250 p-2.5 rounded-xl text-xs text-gray-800 focus:outline-none focus:ring-1 focus:ring-primary focus:bg-white"
                            title="brand categorisation"
                          >
                            {brands.map((b) => (
                              <option key={b.id} value={b.id}>{b.name}</option>
                            ))}
                          </select>
                        </div>

                        {/* Regular & Discount Pricing */}
                        <div>
                          <label className="text-xs font-bold text-gray-600 block mb-1">Regular Price retail (৳) *</label>
                          <input
                            type="number"
                            required
                            min={0}
                            value={regularPrice}
                            onChange={(e) => setRegularPrice(parseInt(e.target.value))}
                            className="w-full bg-gray-50 border border-gray-250 p-2.5 rounded-xl text-xs font-mono font-bold text-gray-800 focus:outline-none focus:ring-1 focus:ring-primary focus:bg-white text-left"
                          />
                        </div>
                        <div>
                          <label className="text-xs font-bold text-gray-650 block mb-1">Promo Sale Discount Price (৳) (Optional)</label>
                          <input
                            type="number"
                            min={0}
                            value={discountPrice || ''}
                            onChange={(e) => setDiscountPrice(e.target.value ? parseInt(e.target.value) : undefined)}
                            placeholder="Leave blanks for no discount"
                            className="w-full bg-gray-50 border border-gray-250 p-2.5 rounded-xl text-xs font-mono text-gray-805 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-primary focus:bg-white text-left"
                          />
                        </div>

                        {/* Image URL */}
                        <div className="sm:col-span-2">
                          <label className="text-xs font-bold text-gray-600 block mb-1">Product Cover Image URL *</label>
                          <input
                            type="text"
                            required
                            value={imageUrl}
                            onChange={(e) => setImageUrl(e.target.value)}
                            placeholder="Enter image link (e.g. Unsplash URL)"
                            className="w-full bg-gray-50 border border-gray-250 p-2.5 rounded-xl text-xs text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-primary focus:bg-white text-left"
                          />
                        </div>

                        {/* Colors Palette & stock numbers */}
                        <div>
                          <label className="text-xs font-bold text-gray-600 block mb-1">Supported Colors (comma split)</label>
                          <input
                            type="text"
                            value={colorsInput}
                            onChange={(e) => setColorsInput(e.target.value)}
                            placeholder="e.g. Ash Rose, Midnight Slate"
                            className="w-full bg-gray-50 border border-gray-250 p-2.5 rounded-xl text-xs text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-primary focus:bg-white text-left"
                          />
                        </div>
                        <div>
                          <label className="text-xs font-bold text-gray-655 block mb-1">Available Stock Units *</label>
                          <input
                            type="number"
                            required
                            min={0}
                            value={stock}
                            onChange={(e) => setStock(parseInt(e.target.value))}
                            className="w-full bg-gray-50 border border-gray-250 p-2.5 rounded-xl text-xs font-mono font-bold text-gray-800 focus:outline-none focus:ring-1 focus:ring-primary focus:bg-white text-left"
                          />
                        </div>

                        {/* Attribute Toggles checkboxes */}
                        <div className="flex items-center gap-4 py-2 sm:col-span-2">
                          <label className="flex items-center gap-1.5 cursor-pointer select-none">
                            <input
                              type="checkbox"
                              checked={isBestSeller}
                              onChange={() => setIsBestSeller(!isBestSeller)}
                              className="accent-primary rounded"
                            />
                            <span>Push as Best Seller</span>
                          </label>
                          <label className="flex items-center gap-1.5 cursor-pointer select-none">
                            <input
                              type="checkbox"
                              checked={isNewArrival}
                              onChange={() => setIsNewArrival(!isNewArrival)}
                              className="accent-primary rounded"
                            />
                            <span>Tag as New Arrival</span>
                          </label>
                          <label className="flex items-center gap-1.5 cursor-pointer select-none">
                            <input
                              type="checkbox"
                              checked={isFlashSale}
                              onChange={() => setIsFlashSale(!isFlashSale)}
                              className="accent-primary rounded"
                            />
                            <span>Active Flash Sale deal</span>
                          </label>
                        </div>

                        {/* Specifications multi input as key:val comma split */}
                        <div className="sm:col-span-2">
                          <label className="text-xs font-bold text-gray-600 block mb-1">Key Technical Specs (Format: Label: Value, Label: Value)</label>
                          <input
                            type="text"
                            value={specsInput}
                            onChange={(e) => setSpecsInput(e.target.value)}
                            placeholder="e.g. Playtime: 40 Hours, Waterproof: IPX5, Driver: 12mm"
                            className="w-full bg-gray-50 border border-gray-250 p-2.5 rounded-xl text-xs text-gray-850 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-primary focus:bg-white text-left"
                          />
                        </div>

                        {/* Description textarea */}
                        <div className="sm:col-span-2">
                          <label className="text-xs font-bold text-gray-600 block mb-1">Detailed Description Overview *</label>
                          <textarea
                            required
                            rows={3}
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Write comprehensive product copywriting metrics..."
                            className="w-full bg-gray-50 border border-gray-250 p-2.5 rounded-xl text-xs text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-primary focus:bg-white text-left"
                          />
                        </div>

                        {/* Form buttons submit */}
                        <div className="sm:col-span-2 pt-4 border-t border-gray-100 flex justify-end gap-3.5">
                          <button
                            type="button"
                            onClick={() => setIsFormOpen(false)}
                            className="border border-gray-250 hover:bg-gray-50 text-gray-500 font-bold py-2 px-4 rounded-xl cursor-pointer"
                          >
                            Cancel
                          </button>
                          <button
                            type="submit"
                            className="bg-primary hover:bg-primary-hover text-white font-mono font-bold py-2 px-6 rounded-xl cursor-pointer flex items-center gap-1.5"
                          >
                            <Save size={13} />
                            Save Configuration File
                          </button>
                        </div>

                      </form>
                    </motion.div>
                  </div>
                )}
              </AnimatePresence>
            </div>
          )}

          {/* TAB 3: DISPATCH ORDERS CONTROLLER (Direct status dropdown updates) */}
          {activeTab === 'orders' && (
            <div>
              <h2 className="text-xl font-extrabold text-gray-950 mb-6 pb-2.5 border-b border-gray-100 flex items-center gap-2">
                <FileCheck2 size={20} className="text-primary" />
                Live Order Expeditions Dispatcher ({orders.length})
              </h2>

              {orders.length > 0 ? (
                <div className="border border-gray-150 rounded-2xl overflow-hidden shadow-sm overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="bg-gray-50 border-b border-gray-150 font-mono font-bold text-gray-500 uppercase tracking-widest text-[10px]">
                        <th className="p-3">Order Details</th>
                        <th className="p-3">Customer contact</th>
                        <th className="p-3">Cash Total BDT</th>
                        <th className="p-3">Gateway & Status</th>
                        <th className="p-3">Expedition Track Stage</th>
                        <th className="p-3 text-right">Actions Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {orders.map((o) => (
                        <tr key={o.id} className="hover:bg-gray-50/40 transition-colors">
                          <td className="p-3">
                            <span className="font-mono font-extrabold text-gray-900 block">{o.id}</span>
                            <span className="text-[10px] text-gray-400 block mt-0.5">{new Date(o.createdAt).toLocaleString()}</span>
                          </td>
                          <td className="p-3">
                            <span className="font-bold text-gray-900 block leading-tight">{o.fullName}</span>
                            <span className="text-[10px] text-gray-500 font-mono block mt-0.5 leading-none">{o.phone} • {o.city}</span>
                          </td>
                          <td className="p-3 font-mono font-extrabold text-gray-900">
                            ৳{o.totalAmount.toLocaleString()}
                          </td>
                          {/* Payment status choices */}
                          <td className="p-3">
                            <span className="font-mono font-bold uppercase block text-[9px] text-indigo-700">{o.paymentMethod}</span>
                            {o.senderNumber && (
                              <span className="block text-[10px] text-gray-500 font-mono font-medium leading-none mt-1">
                                Sender: {o.senderNumber}
                              </span>
                            )}
                            {o.transactionCode && (
                              <span className="block text-[10px] text-emerald-600 font-mono font-bold leading-none mt-1">
                                TxID: {o.transactionCode}
                              </span>
                            )}
                            <select
                              value={o.paymentStatus}
                              onChange={(e) => adminUpdatePaymentStatus(o.id, e.target.value as PaymentStatus)}
                              className="mt-0.5 border border-gray-200 rounded px-1.5 py-0.5 bg-gray-50 font-mono text-[10px]"
                              title="update payment gateway status"
                            >
                              <option value="Unpaid">Unpaid</option>
                              <option value="Paid">Paid</option>
                              <option value="Refunded">Refunded</option>
                            </select>
                          </td>
                          {/* Order processing status selectors choices */}
                          <td className="p-3">
                            <select
                              value={o.orderStatus}
                              onChange={(e) => adminUpdateOrderStatus(o.id, e.target.value as OrderStatus)}
                              className="border border-gray-200 rounded px-1.5 py-1 bg-gray-50 font-bold font-mono text-[10.5px] text-primary"
                              title="dispatch logistics status"
                            >
                              <option value="Pending">Pending Audit</option>
                              <option value="Processing">Processing Packaging</option>
                              <option value="Shipped">Shipped Courier</option>
                              <option value="Delivered">Delivered Safe</option>
                              <option value="Cancelled">Cancelled</option>
                            </select>
                          </td>
                          {/* Inline tracking helper & WhatsApp actions */}
                          <td className="p-3 text-right text-[10px] font-mono">
                            <span className="block font-bold text-gray-400 uppercase leading-none">TRACK REF:</span>
                            <span className="text-primary font-bold block mt-0.5 mb-2">{o.trackingNumber}</span>

                            <div className="flex items-center justify-end gap-1.5 font-sans">
                              {/* Direct WhatsApp to Customer */}
                              <a
                                href={getCustomerWhatsAppUrl(o)}
                                target="_blank"
                                rel="noopener noreferrer"
                                title={`WhatsApp message to ${o.fullName} (${o.phone})`}
                                className="bg-[#25D366]/10 hover:bg-[#25D366] text-[#128C7E] hover:text-white border border-[#25D366]/30 px-2 py-1 rounded-lg text-[9px] font-bold flex items-center gap-1 transition-all no-underline cursor-pointer"
                              >
                                <MessageSquare size={10} className="fill-current" />
                                <span>Message Buyer</span>
                              </a>

                              {/* Forward to Owner WhatsApp */}
                              <a
                                href={getWhatsAppOrderUrl(o)}
                                target="_blank"
                                rel="noopener noreferrer"
                                title="Forward this order alert to Owner WhatsApp"
                                className="bg-slate-100 hover:bg-slate-800 text-slate-700 hover:text-white border border-slate-200 px-2 py-1 rounded-lg text-[9px] font-bold flex items-center gap-1 transition-all no-underline cursor-pointer"
                              >
                                <Phone size={10} />
                                <span>Owner Alert</span>
                              </a>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="py-12 bg-gray-50 rounded-2xl border border-gray-150 border-dashed text-center text-xs text-gray-450 italic">Currently no client purchase files processed on database caches. Make purchases to populate.</div>
              )}
            </div>
          )}

          {/* TAB 4: COUPONS & DISCOUNT LAUNCHER */}
          {activeTab === 'coupons' && (
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
              
              {/* Form column */}
              <div className="md:col-span-5 bg-gray-50/50 p-5 rounded-2xl border border-gray-150 h-fit text-xs">
                <span className="text-[10px] text-primary-hover font-bold font-mono tracking-widest uppercase block mb-1">Coupon Vibe codes</span>
                <h3 className="font-sans font-extrabold text-gray-905 text-sm uppercase block mb-4">Create Promo Voucher</h3>

                <form onSubmit={handleCouponFormSubmit} className="flex flex-col gap-3">
                  <div>
                    <label className="text-xs font-semibold text-gray-600 block mb-1">Coupon Key Code *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. SUMMER26"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                      className="w-full bg-white border border-gray-250 p-2.5 rounded-xl uppercase font-mono font-black placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-primary text-left text-xs"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3 pb-1">
                    <div>
                      <label className="text-xs font-semibold text-gray-650 block mb-1">Discount Type *</label>
                      <select
                        value={couponType}
                        onChange={(e) => setCouponType(e.target.value as any)}
                        className="w-full bg-white border border-gray-250 p-2.5 rounded-xl focus:outline-none focus:ring-1 focus:ring-primary text-xs"
                      >
                        <option value="percentage">Percentage (%)</option>
                        <option value="fixed">Fixed Flat Cash (৳)</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-gray-600 block mb-1">Voucher savings value *</label>
                      <input
                        type="number"
                        required
                        min={1}
                        value={couponValue}
                        onChange={(e) => setCouponValue(parseInt(e.target.value))}
                        className="w-full bg-white border border-gray-250 p-2.5 rounded-xl text-xs font-mono font-bold focus:outline-none focus:ring-1 focus:ring-primary text-left text-xs"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-gray-600 block mb-1">Min subtotal required (৳) *</label>
                    <input
                      type="number"
                      required
                      min={0}
                      value={couponMinOrder}
                      onChange={(e) => setCouponMinOrder(parseInt(e.target.value))}
                      className="w-full bg-white border border-gray-250 p-2.5 rounded-xl text-xs font-mono font-bold focus:outline-none focus:ring-1 focus:ring-primary text-left text-xs"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-gray-600 block mb-1">Brief Description (Optional)</label>
                    <input
                      type="text"
                      placeholder="e.g. 15% off above ৳1,000"
                      value={couponDesc}
                      onChange={(e) => setCouponDesc(e.target.value)}
                      className="w-full bg-white border border-gray-250 p-2.5 rounded-xl placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-primary text-left text-xs"
                    />
                  </div>

                  <button
                    type="submit"
                    className="bg-primary hover:bg-primary-hover text-white font-mono font-bold py-2 px-4 rounded-xl cursor-pointer text-center uppercase tracking-wide block w-full mt-4"
                  >
                    Launch Voucher Key
                  </button>
                </form>

                {couponSuccess && (
                  <div className="mt-3 bg-emerald-50 text-emerald-600 border border-emerald-100 p-2 rounded-xl text-[10.5px] font-bold text-center flex items-center justify-center gap-1">
                    <Check size={14} /> Registered! Voucher key active inside caches.
                  </div>
                )}
              </div>

              {/* Table details list column */}
              <div className="md:col-span-7">
                <h3 className="font-sans font-extrabold text-gray-900 text-sm uppercase block mb-4 flex items-center gap-1.5 font-mono">
                  <BadgeCent size={18} className="text-primary" />
                  Active Promotion Vouchers ({coupons.length})
                </h3>

                <div className="border border-gray-150 rounded-xl overflow-hidden shadow-xs overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="bg-gray-50 border-b border-gray-150 font-mono font-bold text-gray-500 uppercase tracking-widest text-[9.5px]">
                        <th className="p-3">Voucher Key</th>
                        <th className="p-3">Discount Benefits</th>
                        <th className="p-3">Min shopping bill</th>
                        <th className="p-3 text-right">Delete Settings</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {coupons.map((c) => (
                        <tr key={c.code} className="hover:bg-gray-50/50 transition-colors">
                          <td className="p-3">
                            <span className="font-mono font-black text-gray-900 bg-gray-100 border border-gray-200 rounded py-0.5 px-2 select-all uppercase">{c.code}</span>
                          </td>
                          <td className="p-3 font-semibold text-gray-700 text-[11px]">
                            {c.description}
                          </td>
                          <td className="p-3 font-mono text-gray-505">
                            ৳{c.minOrderValue.toLocaleString()}
                          </td>
                          <td className="p-3 text-right">
                            <button
                              onClick={() => adminDeleteCoupon(c.code)}
                              className="p-1 hover:text-red-500 hover:bg-red-50 border border-transparent hover:border-red-100 rounded cursor-pointer"
                              title="Delete Voucher"
                              id={`delete-c-${c.code}`}
                            >
                              <Trash2 size={13} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>
          )}

          {/* TAB 5: FLASH CAMPAIGN CONFIGURATOR (isFlashSale live triggers) */}
          {activeTab === 'flash' && (
            <div>
              <h2 className="text-xl font-extrabold text-gray-950 mb-4 pb-2 border-b border-gray-100 flex items-center gap-1.5">
                <Flame size={20} className="text-rose-600" />
                Active Flash sale campaign setup lists
              </h2>
              <p className="text-xs text-gray-400 mb-6 font-semibold">Toggle any product checkbox immediately to add or exclude the item from the home timer campaign.</p>

              <div className="border border-gray-150 rounded-2xl overflow-hidden shadow-sm overflow-x-auto text-xs">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-150 font-mono font-bold text-gray-500 uppercase tracking-widest text-[10px]">
                      <th className="p-3">Product Name</th>
                      <th className="p-3">Retail Price</th>
                      <th className="p-3">Campaign Toggles</th>
                      <th className="p-3 text-right">Status indicators</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {products.map((p) => (
                      <tr key={p.id}>
                        <td className="p-3">
                          <div className="flex items-center gap-2.5">
                            <img src={p.images[0]} alt="" className="w-8 h-8 object-cover rounded border border-gray-150 referrerPolicy='no-referrer'" referrerPolicy="no-referrer" />
                            <span className="font-extrabold text-gray-900 leading-tight">{p.name}</span>
                          </div>
                        </td>
                        <td className="p-3 font-mono font-bold">৳{p.regularPrice}</td>
                        <td className="p-3">
                          <label className="flex items-center gap-2 cursor-pointer select-none font-bold text-gray-700">
                            <input
                              type="checkbox"
                              checked={p.isFlashSale}
                              onChange={() => handleFlashToggler(p.id)}
                              className="accent-rose-500 rounded"
                            />
                            <span>Flash sale Campaign active</span>
                          </label>
                        </td>
                        {/* indicator labels */}
                        <td className="p-3 text-right">
                          {p.isFlashSale ? (
                            <span className="bg-rose-50 text-rose-600 font-mono font-bold text-[9px] uppercase border border-rose-200 rounded py-0.5 px-2 animate-pulse">● Live Deal</span>
                          ) : (
                            <span className="text-gray-405 font-mono text-[9px]">Inactive</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 6: VISUAL SALES REPORTS AND CHARTS */}
          {activeTab === 'reports' && (
            <div>
              <h2 className="text-xl font-extrabold text-gray-950 mb-6 pb-2.5 border-b border-gray-100 flex items-center gap-2">
                <LineChart size={20} className="text-primary" />
                Dynamic Revenue Performance Reports
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 text-xs font-semibold text-gray-500">
                {/* Visual Bar chart widget representing months sales */}
                <div className="border border-gray-200 rounded-2xl p-5 shadow-xs">
                  <h3 className="font-sans font-extrabold text-gray-900 text-sm uppercase block tracking-wider mb-4 font-mono">Monthly Revenues (৳ Thousands BDT)</h3>
                  {/* Styled bars representing Sales charts */}
                  <div className="flex flex-col gap-3 mt-4">
                    <div className="flex items-center gap-3">
                      <span className="w-12 text-gray-400 font-bold font-mono">JAN:</span>
                      <div className="flex-1 bg-gray-100 h-5.5 rounded-lg overflow-hidden relative">
                        <div className="bg-primary h-full rounded-lg transition-all" style={{ width: '45%' }} />
                        <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[9px] text-gray-800 font-black font-mono">৳125K</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="w-12 text-gray-400 font-bold font-mono">FEB:</span>
                      <div className="flex-1 bg-gray-100 h-5.5 rounded-lg overflow-hidden relative">
                        <div className="bg-primary h-full rounded-lg" style={{ width: '65%' }} />
                        <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[9px] text-gray-825 font-black font-mono">৳185K</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="w-12 text-gray-400 font-bold font-mono">MAR:</span>
                      <div className="flex-1 bg-gray-100 h-5.5 rounded-lg overflow-hidden relative">
                        <div className="bg-primary h-full rounded-lg" style={{ width: '85%' }} />
                        <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[9px] text-gray-850 font-black font-mono">৳250K</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="w-12 text-gray-400 font-bold font-mono">APR:</span>
                      <div className="flex-1 bg-gray-100 h-5.5 rounded-lg overflow-hidden relative">
                        <div className="bg-primary h-full rounded-lg" style={{ width: '70%' }} />
                        <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[9px] text-gray-850 font-black font-mono">৳210K</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="w-12 text-gray-400 font-bold font-mono">MAY:</span>
                      <div className="flex-1 bg-gray-100 h-5.5 rounded-lg overflow-hidden relative">
                        <div className="bg-primary h-full rounded-lg" style={{ width: '95%' }} />
                        <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[9px] text-white font-black font-mono">৳320K</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Sales distribution across category columns */}
                <div className="border border-gray-200 rounded-2xl p-5 shadow-xs">
                  <h3 className="font-sans font-extrabold text-gray-900 text-sm uppercase block tracking-wider mb-4 font-mono">Popular Categories Shares</h3>
                  <div className="flex flex-col gap-3 mt-4">
                    <div className="flex justify-between text-[11px] font-bold text-gray-700 label mb-1 border-b border-gray-50 pb-1">
                      <span>CATEGORIES:</span>
                      <span>SHARES (%)</span>
                    </div>
                    {categories.slice(0, 5).map((c, i) => {
                      const shareVal = [35, 25, 20, 15, 5][i] || 10;
                      return (
                        <div key={c.id} className="flex justify-between items-center text-xs">
                          <span className="text-gray-400 font-bold uppercase font-mono">{c.name}</span>
                          <span className="font-bold text-gray-950 font-mono tracking-wide">{shareVal}%</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 7: VISITOR TRAFFIC & ADMIN SECURITY AUDIT LOGS */}
          {activeTab === 'analytics' && (
            <div>
              <div className="flex justify-between items-center mb-6 pb-2.5 border-b border-gray-100">
                <h2 className="text-xl font-extrabold text-gray-950 flex items-center gap-2">
                  <Activity size={20} className="text-red-500 animate-pulse" />
                  Traffic Performance & Security Auditing
                </h2>
                <button
                  onClick={() => setRefreshTrigger(prev => prev + 1)}
                  disabled={isStatsLoading}
                  className="flex items-center gap-1.5 text-xs text-gray-600 hover:text-primary font-bold border border-gray-200 bg-white py-1.5 px-3 rounded-lg cursor-pointer transition-all disabled:opacity-50"
                >
                  <RefreshCcw size={13} className={isStatsLoading ? "animate-spin text-primary" : ""} />
                  Refresh Logs
                </button>
              </div>

              {/* Overview Analytics counters */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-8">
                <div className="bg-gradient-to-br from-indigo-50 to-white border border-indigo-150 p-5 rounded-2xl shadow-sm">
                  <span className="text-[10px] text-indigo-600 font-extrabold uppercase font-mono tracking-wider block mb-1">TOTAL PAGES LOADS</span>
                  <span className="text-2xl font-black text-indigo-950 font-mono">
                    {analyticsData ? analyticsData.totalVisits.toLocaleString() : "..."}
                  </span>
                  <span className="block text-[10px] text-gray-400 mt-1">Sum of all navigation transitions</span>
                </div>

                <div className="bg-gradient-to-br from-cyan-50 to-white border border-cyan-155 p-5 rounded-2xl shadow-sm">
                  <span className="text-[10px] text-cyan-700 font-extrabold uppercase font-mono tracking-wider block mb-1">UNIQUE DEVICELINES</span>
                  <span className="text-2xl font-black text-cyan-950 font-mono">
                    {analyticsData ? analyticsData.uniqueVisitorsCount.toLocaleString() : "..."}
                  </span>
                  <span className="block text-[10px] text-gray-400 mt-1">Unique visitor device fingerprints</span>
                </div>

                <div className="bg-gradient-to-br from-rose-50 to-white border border-rose-150 p-5 rounded-2xl shadow-sm">
                  <span className="text-[10px] text-rose-600 font-extrabold uppercase font-mono tracking-wider block mb-1">SECURE CONSOLE ACCESSED</span>
                  <span className="text-2xl font-black text-rose-950 font-mono">
                    {analyticsData && analyticsData.adminLogins ? analyticsData.adminLogins.filter(l => l.status === 'Success').length : 0}
                  </span>
                  <span className="block text-[10px] text-gray-400 mt-1">Successful owner verifications logged</span>
                </div>
              </div>

              {/* Two-Column Log stream layout */}
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                {/* Left side: Admin secure portal logs */}
                <div className="border border-gray-150 rounded-2xl p-5 shadow-xs bg-slate-50/50">
                  <div className="flex items-center gap-2 mb-4 border-b border-gray-200 pb-2.5">
                    <Lock size={15} className="text-rose-500" />
                    <h3 className="font-sans font-extrabold text-gray-950 text-xs sm:text-sm uppercase tracking-wide">
                      Admin Security Portal Access History
                    </h3>
                  </div>

                  <div className="space-y-3.5 max-h-[350px] overflow-y-auto pr-1 no-scrollbar">
                    {(!analyticsData || !analyticsData.adminLogins || analyticsData.adminLogins.length === 0) ? (
                      <p className="text-xs text-gray-400 italic font-semibold text-center py-6">No admin session logs reported yet.</p>
                    ) : (
                      analyticsData.adminLogins.map((lg, i) => (
                        <div key={i} className="bg-white border border-gray-150 rounded-xl p-3 shadow-xs text-xs">
                          <div className="flex justify-between items-start gap-1 pb-1.5 mb-1.5 border-b border-slate-100 col-span-2">
                            <div>
                              <span className="font-extrabold text-gray-800">ID used: </span>
                              <span className="font-mono text-emerald-805 font-bold bg-emerald-50 px-1.5 py-0.5 rounded text-[10px]">
                                {lg.adminId}
                              </span>
                            </div>
                            <span className={`font-mono text-[9px] font-black uppercase px-2 py-0.5 rounded-full ${
                              lg.status === 'Success' 
                                ? 'bg-emerald-100 text-emerald-800 border border-emerald-250' 
                                : lg.status === 'Logged Out'
                                ? 'bg-gray-100 text-gray-650 border border-gray-200'
                                : 'bg-rose-100 text-rose-750 border border-rose-250'
                            }`}>
                              {lg.status}
                            </span>
                          </div>

                          <div className="grid grid-cols-2 gap-2 text-[10px] text-gray-450 font-semibold leading-relaxed">
                            <div>
                              <p>🕒 {new Date(lg.timestamp).toLocaleString()}</p>
                              <p>🌐 IP: <span className="font-mono text-gray-750 bg-slate-50 px-1 rounded">{lg.ip || "127.0.0.1"}</span></p>
                            </div>
                            <div className="text-right truncate max-w-full">
                              <p title={lg.userAgent}>📱 Device: {lg.userAgent.includes("Windows") ? "Windows Desktop" : lg.userAgent.includes("iPhone") ? "iOS Mobile" : lg.userAgent.includes("Android") ? "Android Mobile" : lg.userAgent.includes("Macintosh") ? "Mac OS" : "Client Terminal"}</p>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                {/* Right side: Visitor logs stream */}
                <div className="border border-gray-150 rounded-2xl p-5 shadow-xs">
                  <div className="flex items-center gap-2 mb-4 border-b border-gray-200 pb-2.5">
                    <Eye size={15} className="text-cyan-600" />
                    <h3 className="font-sans font-extrabold text-gray-950 text-xs sm:text-sm uppercase tracking-wide">
                      Real-time Website Traffic Stream
                    </h3>
                  </div>

                  <div className="space-y-3 max-h-[350px] overflow-y-auto pr-1 no-scrollbar">
                    {(!analyticsData || !analyticsData.visits || analyticsData.visits.length === 0) ? (
                      <p className="text-xs text-gray-400 italic font-semibold text-center py-6">Waiting for active client loads...</p>
                    ) : (
                      analyticsData.visits.map((vs, i) => (
                        <div key={i} className="flex justify-between items-start gap-4 p-2.5 hover:bg-slate-50 rounded-lg transition-colors text-xs border-b border-gray-100 last:border-0">
                          <div>
                            <div className="flex items-center gap-1.5 mb-1">
                              <span className="w-1.5 h-1.5 rounded-full bg-cyan-500 animate-ping" />
                              <span className="font-mono font-bold text-gray-800 text-[10px] bg-slate-100 px-1.5 py-0.5 rounded">
                                {vs.visitorId.slice(0, 10)}...
                              </span>
                              <span className="text-[10px] text-primary font-bold bg-primary-light px-1.5 rounded">
                                {vs.path}
                              </span>
                            </div>
                            <p className="text-[9px] text-gray-400 font-bold">
                              🔗 Ref: {vs.referrer || "Direct Store View"}
                            </p>
                          </div>
                          <div className="text-right shrink-0">
                            <span className="text-[9.5px] text-gray-450 font-bold block">
                              {new Date(vs.timestamp).toLocaleTimeString()}
                            </span>
                            <span className="text-[8.5px] text-gray-400 font-semibold block">
                              {vs.userAgent.includes("Windows") ? "PC Client" : vs.userAgent.includes("Mobile") ? "Mobile Client" : "Web Client"}
                            </span>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 8: GOOGLE DRIVE CLOUD WORKSPACE */}
          {activeTab === 'drive' && (
            <GoogleDriveManager mode="admin" />
          )}

        </main>
      </div>
    </div>
  );
};
