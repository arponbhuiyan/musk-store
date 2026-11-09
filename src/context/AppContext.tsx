/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product, Category, Brand, Order, Review, Coupon, Banner, Blog, CartItem, OrderStatus, PaymentStatus } from '../types';
import {
  INITIAL_PRODUCTS,
  INITIAL_CATEGORIES,
  INITIAL_BRANDS,
  INITIAL_COUPONS,
  INITIAL_BANNERS,
  INITIAL_BLOGS,
  INITIAL_REVIEWS
} from '../data';
import { logoutGoogle } from '../services/googleDrive';

interface AppContextType {
  products: Product[];
  categories: Category[];
  brands: Brand[];
  orders: Order[];
  reviews: Review[];
  coupons: Coupon[];
  banners: Banner[];
  blogs: Blog[];
  
  cart: CartItem[];
  wishlist: string[];
  
  // Simulated Authentication Session
  userSession: {
    fullName: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    postalCode: string;
    loggedIn: boolean;
  };
  
  // Custom Router Simulation
  activeView: 'home' | 'shop' | 'product-details' | 'cart' | 'checkout' | 'dashboard' | 'admin' | 'blogs';
  selectedProductId: string | null;
  searchQuery: string;
  categoryFilter: string | null;
  brandFilter: string | null;
  
  // Cart Actions
  addToCart: (product: Product, quantity: number, color: string) => void;
  removeFromCart: (cartItemId: string) => void;
  updateCartQuantity: (cartItemId: string, q: number) => void;
  clearCart: () => void;
  
  // Wishlist Actions
  toggleWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;
  
  // Checkout & Coupon Actions
  activeCoupon: Coupon | null;
  applyCoupon: (code: string) => { success: boolean; message: string };
  removeCoupon: () => void;
  placeOrder: (shippingDetails: {
    fullName: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    postalCode: string;
    paymentMethod: 'bKash' | 'Nagad' | 'Rocket' | 'SSLCommerz' | 'Cash On Delivery';
    senderNumber?: string;
    transactionCode?: string;
  }) => Order;
  
  // CRM / Session Actions
  updateProfile: (profile: Partial<AppContextType['userSession']>) => void;
  loginUser: (details: { fullName: string; email: string; phone?: string }) => void;
  logoutUser: () => void;
  
  // Admin Operations
  adminAddProduct: (product: Omit<Product, 'id' | 'sku'>) => void;
  adminUpdateProduct: (product: Product) => void;
  adminDeleteProduct: (id: string) => void;
  adminUpdateOrderStatus: (orderId: string, status: OrderStatus) => void;
  adminUpdatePaymentStatus: (orderId: string, status: PaymentStatus) => void;
  adminAddCoupon: (coupon: Coupon) => void;
  adminDeleteCoupon: (code: string) => void;

  // WhatsApp Alert & Notification Actions
  ownerWhatsApp: string;
  setOwnerWhatsApp: (phone: string) => void;
  whatsAppNotificationsEnabled: boolean;
  setWhatsAppNotificationsEnabled: (enabled: boolean) => void;
  getWhatsAppOrderUrl: (order: Order, recipientPhone?: string) => string;
  getCustomerWhatsAppUrl: (order: Order) => string;
  
  // Navigation / Filter Actions
  setRoute: (view: 'home' | 'shop' | 'product-details' | 'cart' | 'checkout' | 'dashboard' | 'admin' | 'blogs', productId?: string | null) => void;
  setSearchQuery: (q: string) => void;
  setCategoryFilter: (cat: string | null) => void;
  setBrandFilter: (brand: string | null) => void;
  
  // Review Actions
  addReview: (productId: string, rating: number, comment: string) => void;

  // Admin Authentication State (Strict 2-Gmail Policy)
  isAdmin: boolean;
  adminEmail: string | null;
  setAdminAuth: (isAuth: boolean, email?: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Load State from LocalStorage or Fallback
  const [products, setProducts] = useState<Product[]>(() => {
    try {
      const saved = localStorage.getItem('musk_products_v4');
      if (saved) return JSON.parse(saved);
      const oldSaved = localStorage.getItem('musk_products');
      if (oldSaved) {
        const parsed = JSON.parse(oldSaved) as Product[];
        const missing = INITIAL_PRODUCTS.filter(ip => !parsed.some(p => p.id === ip.id));
        const merged = [...missing, ...parsed];
        localStorage.setItem('musk_products_v4', JSON.stringify(merged));
        return merged;
      }
      return INITIAL_PRODUCTS;
    } catch (e) {
      return INITIAL_PRODUCTS;
    }
  });

  const [categories] = useState<Category[]>(INITIAL_CATEGORIES);
  const [brands] = useState<Brand[]>(INITIAL_BRANDS);
  const [banners] = useState<Banner[]>(INITIAL_BANNERS);
  const [blogs] = useState<Blog[]>(INITIAL_BLOGS);

  const [orders, setOrders] = useState<Order[]>(() => {
    try {
      const saved = localStorage.getItem('musk_orders');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });

  const [reviews, setReviews] = useState<Review[]>(() => {
    try {
      const saved = localStorage.getItem('musk_reviews');
      return saved ? JSON.parse(saved) : INITIAL_REVIEWS;
    } catch (e) {
      return INITIAL_REVIEWS;
    }
  });

  const [coupons, setCoupons] = useState<Coupon[]>(() => {
    try {
      const saved = localStorage.getItem('musk_coupons');
      return saved ? JSON.parse(saved) : INITIAL_COUPONS;
    } catch (e) {
      return INITIAL_COUPONS;
    }
  });

  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('musk_cart');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });

  const [wishlist, setWishlist] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('musk_wishlist');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });

  const [userSession, setUserSession] = useState(() => {
    try {
      const saved = localStorage.getItem('musk_session');
      return saved ? JSON.parse(saved) : {
        fullName: 'Arpon Bhuiyan',
        email: 'arponbhuiyan@gmail.com',
        phone: '+880 1712-345678',
        address: 'House 12, Road 4, Sector 3, Uttara',
        city: 'Dhaka',
        postalCode: '1230',
        loggedIn: true
      };
    } catch (e) {
      return {
        fullName: 'Arpon Bhuiyan',
        email: 'arponbhuiyan@gmail.com',
        phone: '+880 1712-345678',
        address: 'House 12, Road 4, Sector 3, Uttara',
        city: 'Dhaka',
        postalCode: '1230',
        loggedIn: true
      };
    }
  });

  // Owner WhatsApp Configuration State
  const [ownerWhatsApp, setOwnerWhatsApp] = useState<string>(() => {
    try {
      return localStorage.getItem('musk_owner_whatsapp') || '8801316752761';
    } catch (e) {
      return '8801316752761';
    }
  });

  const [whatsAppNotificationsEnabled, setWhatsAppNotificationsEnabled] = useState<boolean>(() => {
    try {
      return localStorage.getItem('musk_whatsapp_notify') !== 'false';
    } catch (e) {
      return true;
    }
  });

  // Admin Authentication State (Strict 2-Gmail Policy)
  const [isAdmin, setIsAdmin] = useState<boolean>(() => {
    try {
      return localStorage.getItem('musk_admin_auth') === 'true';
    } catch (e) {
      return false;
    }
  });

  const [adminEmail, setAdminEmail] = useState<string | null>(() => {
    try {
      return localStorage.getItem('musk_admin_email') || null;
    } catch (e) {
      return null;
    }
  });

  const setAdminAuth = (isAuth: boolean, email?: string) => {
    setIsAdmin(isAuth);
    if (isAuth) {
      localStorage.setItem('musk_admin_auth', 'true');
      if (email) {
        setAdminEmail(email);
        localStorage.setItem('musk_admin_email', email);
      }
    } else {
      localStorage.removeItem('musk_admin_auth');
      localStorage.removeItem('musk_admin_email');
      setAdminEmail(null);
    }
  };

  // Sync WhatsApp settings
  useEffect(() => {
    localStorage.setItem('musk_owner_whatsapp', ownerWhatsApp);
  }, [ownerWhatsApp]);

  useEffect(() => {
    localStorage.setItem('musk_whatsapp_notify', String(whatsAppNotificationsEnabled));
  }, [whatsAppNotificationsEnabled]);

  // Clean phone number for WhatsApp URLs
  const formatWhatsAppNumber = (phoneStr: string) => {
    let cleaned = phoneStr.replace(/\D/g, '');
    if (cleaned.startsWith('01') && cleaned.length === 11) {
      cleaned = '88' + cleaned;
    }
    return cleaned;
  };

  const getWhatsAppOrderUrl = (order: Order, recipientPhone?: string) => {
    const targetPhone = formatWhatsAppNumber(recipientPhone || ownerWhatsApp);
    const itemsText = order.items
      .map((it, idx) => `${idx + 1}. *${it.productName}* (${it.selectedColor || 'Default'}) x${it.quantity} = ৳${(it.price * it.quantity).toLocaleString()}`)
      .join('\n');

    const paymentInfo = order.paymentMethod === 'Cash On Delivery'
      ? `💵 Payment: Cash On Delivery`
      : `💳 Payment: ${order.paymentMethod}\n📲 Sender: ${order.senderNumber || 'N/A'}\n🔖 TrxID: ${order.transactionCode || 'N/A'}`;

    const message = 
`🛍️ *NEW ORDER ALERT - THE MUSK*
━━━━━━━━━━━━━━━━━━
📦 *Order ID:* ${order.id}
🔢 *Tracking:* ${order.trackingNumber}
👤 *Customer:* ${order.fullName}
📞 *Phone:* ${order.phone}
📍 *Address:* ${order.address}, ${order.city} - ${order.postalCode}

🛒 *Items Ordered:*
${itemsText}

💰 *Subtotal:* ৳${order.subtotal.toLocaleString()}
${order.discountAmount > 0 ? `🎟️ *Discount:* -৳${order.discountAmount.toLocaleString()}\n` : ''}🚚 *Delivery Charge:* ৳${order.deliveryCharge.toLocaleString()}
🏷️ *Grand Total:* ৳${order.totalAmount.toLocaleString()}

${paymentInfo}
━━━━━━━━━━━━━━━━━━
⚡ *THE MUSK Official Store Dispatch*`;

    return `https://wa.me/${targetPhone}?text=${encodeURIComponent(message)}`;
  };

  const getCustomerWhatsAppUrl = (order: Order) => {
    const targetPhone = formatWhatsAppNumber(order.phone);
    const message = 
`Hello *${order.fullName}*! 👋
Thank you for ordering with *THE MUSK*.

📦 *Order ID:* ${order.id}
🔢 *Tracking Number:* ${order.trackingNumber}
💰 *Total Amount:* ৳${order.totalAmount.toLocaleString()} (${order.paymentMethod})
🚚 *Delivery To:* ${order.address}, ${order.city}

Your order has been registered and is currently being processed by our packaging team.
If you need any assistance, feel free to reply directly to this chat!

*THE MUSK - Technology For Smartness*
🌐 Facebook: https://www.facebook.com/themuskgadgets`;

    return `https://wa.me/${targetPhone}?text=${encodeURIComponent(message)}`;
  };

  // Routing State
  const [activeView, setActiveView] = useState<'home' | 'shop' | 'product-details' | 'cart' | 'checkout' | 'dashboard' | 'admin' | 'blogs'>('home');
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string | null>(null);
  const [brandFilter, setBrandFilter] = useState<string | null>(null);
  
  // Coupon applied in current sequence
  const [activeCoupon, setActiveCoupon] = useState<Coupon | null>(null);

  // Sync Storage
  useEffect(() => {
    localStorage.setItem('musk_products_v4', JSON.stringify(products));
    localStorage.setItem('musk_products', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('musk_orders', JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem('musk_reviews', JSON.stringify(reviews));
  }, [reviews]);

  useEffect(() => {
    localStorage.setItem('musk_coupons', JSON.stringify(coupons));
  }, [coupons]);

  useEffect(() => {
    localStorage.setItem('musk_cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('musk_wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  useEffect(() => {
    localStorage.setItem('musk_session', JSON.stringify(userSession));
  }, [userSession]);

  // View transition trigger scroll adjustments safely
  const setRoute = (view: typeof activeView, productId: string | null = null) => {
    setActiveView(view);
    setSelectedProductId(productId);
    window.scrollTo({ top: 0, behavior: 'instant' });
  };

  // Cart Management
  const addToCart = (product: Product, quantity: number, color: string) => {
    const cartItemId = `${product.id}-${color}`;
    setCart(prevCart => {
      const existingIdx = prevCart.findIndex(item => item.id === cartItemId);
      if (existingIdx > -1) {
        const nextCart = [...prevCart];
        nextCart[existingIdx].quantity += quantity;
        return nextCart;
      } else {
        return [...prevCart, { id: cartItemId, productId: product.id, product, quantity, selectedColor: color }];
      }
    });
  };

  const removeFromCart = (cartItemId: string) => {
    setCart(prevCart => prevCart.filter(item => item.id !== cartItemId));
  };

  const updateCartQuantity = (cartItemId: string, q: number) => {
    if (q <= 0) {
      removeFromCart(cartItemId);
      return;
    }
    setCart(prevCart => prevCart.map(item => item.id === cartItemId ? { ...item, quantity: q } : item));
  };

  const clearCart = () => {
    setCart([]);
    setActiveCoupon(null);
  };

  // Wishlist Functions
  const toggleWishlist = (productId: string) => {
    setWishlist(prev =>
      prev.includes(productId)
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
  };

  const isInWishlist = (productId: string) => wishlist.includes(productId);

  // Apply Discount Codes
  const applyCoupon = (code: string) => {
    const found = coupons.find(c => c.code.toUpperCase() === code.toUpperCase() && c.active);
    if (!found) {
      return { success: false, message: 'Invalid or expired coupon code.' };
    }
    
    // Check cart subtotal
    const subtotal = cart.reduce((sum, item) => {
      const price = item.product.discountPrice || item.product.regularPrice;
      return sum + (price * item.quantity);
    }, 0);

    if (subtotal < found.minOrderValue) {
      return { success: false, message: `Minimum order of ৳${found.minOrderValue} required for this coupon.` };
    }

    setActiveCoupon(found);
    return { success: true, message: `Coupon Applied: Enjoy savings of ${found.discountType === 'percentage' ? found.discountValue + '%' : '৳' + found.discountValue}!` };
  };

  const removeCoupon = () => {
    setActiveCoupon(null);
  };

  // Process Completed Order
  const placeOrder = (shippingDetails: {
    fullName: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    postalCode: string;
    paymentMethod: 'bKash' | 'Nagad' | 'Rocket' | 'SSLCommerz' | 'Cash On Delivery';
    senderNumber?: string;
    transactionCode?: string;
  }) => {
    const subtotal = cart.reduce((sum, item) => {
      const price = item.product.discountPrice || item.product.regularPrice;
      return sum + (price * item.quantity);
    }, 0);
    
    let discountAmount = 0;
    if (activeCoupon) {
      if (activeCoupon.discountType === 'percentage') {
        discountAmount = Math.round((subtotal * activeCoupon.discountValue) / 100);
      } else {
        discountAmount = activeCoupon.discountValue;
      }
    }

    const deliveryCharge = subtotal > 1500 ? 0 : 100;
    const totalAmount = (subtotal - discountAmount) + deliveryCharge;
    
    // Generate secure randomized order data
    const newOrderId = `MSK-${Math.floor(1000 + Math.random() * 9000)}-${Date.now().toString().slice(-4)}`;
    const trackingNumber = `TRK${Math.floor(10000000 + Math.random() * 90000000)}`;

    const newOrder: Order = {
      id: newOrderId,
      trackingNumber,
      ...shippingDetails,
      orderStatus: 'Pending',
      paymentStatus: shippingDetails.paymentMethod === 'Cash On Delivery' ? 'Unpaid' : 'Paid',
      items: cart.map(item => ({
        productId: item.productId,
        productName: item.product.name,
        productImage: item.product.images[0],
        price: item.product.discountPrice || item.product.regularPrice,
        quantity: item.quantity,
        selectedColor: item.selectedColor
      })),
      subtotal,
      deliveryCharge,
      discountAmount,
      totalAmount,
      couponCode: activeCoupon?.code,
      createdAt: new Date().toISOString()
    };

    // Update real product stocks based on purchases
    setProducts(prevProducts => {
      return prevProducts.map(p => {
        const boughtItem = cart.find(c => c.productId === p.id);
        if (boughtItem) {
          return { ...p, stock: Math.max(0, p.stock - boughtItem.quantity) };
        }
        return p;
      });
    });

    setOrders(prevOrders => [newOrder, ...prevOrders]);
    clearCart();

    // Automatically notify store backend to dispatch automated WhatsApp alert in background
    fetch('/api/notifications/whatsapp-order', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ order: newOrder })
    }).catch(err => console.warn('[Auto WhatsApp] Automated dispatch error:', err));

    return newOrder;
  };

  const updateProfile = (profile: Partial<typeof userSession>) => {
    setUserSession(prev => ({ ...prev, ...profile }));
  };

  const loginUser = (details: { fullName: string; email: string; phone?: string }) => {
    setUserSession(prev => ({
      ...prev,
      fullName: details.fullName.trim() || 'Smart Client',
      email: details.email.trim().toLowerCase(),
      phone: details.phone ? details.phone.trim() : prev.phone,
      loggedIn: true
    }));
  };

  const logoutUser = () => {
    setAdminAuth(false);
    logoutGoogle().catch(() => {});
    const loggedOutSession = {
      fullName: 'Guest Customer',
      email: '',
      phone: '',
      address: '',
      city: 'Dhaka',
      postalCode: '',
      loggedIn: false
    };
    setUserSession(loggedOutSession);
    localStorage.setItem('musk_session', JSON.stringify(loggedOutSession));
  };

  // Product Admin Features
  const adminAddProduct = (productInput: Omit<Product, 'id' | 'sku'>) => {
    const id = `prod-${Date.now()}`;
    const sku = `MSK-ADM-${Math.floor(100 + Math.random() * 900)}`;
    const slug = productInput.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const newProduct: Product = {
      id,
      sku,
      slug,
      ...productInput,
    };
    setProducts(prev => [newProduct, ...prev]);
  };

  const adminUpdateProduct = (updatedProduct: Product) => {
    setProducts(prev => prev.map(p => p.id === updatedProduct.id ? updatedProduct : p));
  };

  const adminDeleteProduct = (id: string) => {
    setProducts(prev => prev.filter(p => p.id !== id));
  };

  const adminUpdateOrderStatus = (orderId: string, status: OrderStatus) => {
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, orderStatus: status } : o));
  };

  const adminUpdatePaymentStatus = (orderId: string, status: PaymentStatus) => {
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, paymentStatus: status } : o));
  };

  const adminAddCoupon = (coupon: Coupon) => {
    setCoupons(prev => [coupon, ...prev]);
  };

  const adminDeleteCoupon = (code: string) => {
    setCoupons(prev => prev.filter(c => c.code !== code));
  };

  return (
    <AppContext.Provider value={{
      products, categories, brands, orders, reviews, coupons, banners, blogs, cart, wishlist, userSession,
      activeView, selectedProductId, searchQuery, categoryFilter, brandFilter, activeCoupon,
      addToCart, removeFromCart, updateCartQuantity, clearCart,
      toggleWishlist, isInWishlist, applyCoupon, removeCoupon, placeOrder, updateProfile, loginUser, logoutUser,
      adminAddProduct, adminUpdateProduct, adminDeleteProduct, adminUpdateOrderStatus, adminUpdatePaymentStatus,
      adminAddCoupon, adminDeleteCoupon,
      ownerWhatsApp, setOwnerWhatsApp, whatsAppNotificationsEnabled, setWhatsAppNotificationsEnabled,
      getWhatsAppOrderUrl, getCustomerWhatsAppUrl,
      isAdmin, adminEmail, setAdminAuth,
      setRoute, setSearchQuery, setCategoryFilter, setBrandFilter, addReview: (productId, rating, comment) => {
        const newReview: Review = {
          id: `rev-${Date.now()}`,
          productId,
          userName: userSession.fullName,
          userEmail: userSession.email,
          rating,
          comment,
          date: new Date().toISOString().split('T')[0],
          isVerified: true
        };
        setReviews(prev => [newReview, ...prev]);
      }
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
