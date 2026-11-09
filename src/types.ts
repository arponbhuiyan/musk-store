/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Product {
  id: string;
  name: string;
  slug: string;
  categoryId: string;
  categoryName: string;
  brandId: string;
  brandName: string;
  regularPrice: number;
  discountPrice?: number;
  isFlashSale: boolean;
  flashSalePrice?: number;
  rating: number;
  ratingCount: number;
  specs: Record<string, string>;
  description: string;
  images: string[];
  stock: number;
  colors: string[];
  isBestSeller: boolean;
  isNewArrival: boolean;
  sku: string;
  warranty: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  image: string;
  productCount: number;
}

export interface Brand {
  id: string;
  name: string;
  image?: string;
  slug: string;
}

export interface Review {
  id: string;
  productId: string;
  userName: string;
  userEmail: string;
  rating: number;
  comment: string;
  date: string;
  isVerified: boolean;
}

export interface OrderItem {
  productId: string;
  productName: string;
  productImage: string;
  price: number;
  quantity: number;
  selectedColor?: string;
}

export type OrderStatus = 'Pending' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';
export type PaymentStatus = 'Unpaid' | 'Paid' | 'Refunded';

export interface Order {
  id: string;
  trackingNumber: string;
  fullName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  postalCode: string;
  paymentMethod: 'bKash' | 'Nagad' | 'Rocket' | 'SSLCommerz' | 'Cash On Delivery';
  senderNumber?: string;
  transactionCode?: string;
  paymentStatus: PaymentStatus;
  orderStatus: OrderStatus;
  items: OrderItem[];
  subtotal: number;
  deliveryCharge: number;
  discountAmount: number;
  totalAmount: number;
  couponCode?: string;
  createdAt: string;
}

export interface Coupon {
  code: string;
  discountValue: number; // percentage or fixed
  discountType: 'percentage' | 'fixed';
  minOrderValue: number;
  description: string;
  active: boolean;
}

export interface Banner {
  id: string;
  title: string;
  subtitle: string;
  image: string;
  link: string;
  buttonText: string;
  badge?: string;
}

export interface Blog {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  image: string;
  author: string;
  date: string;
  readTime: string;
  tags: string[];
}

export interface CartItem {
  id: string; // productId + color
  productId: string;
  product: Product;
  quantity: number;
  selectedColor: string;
}

// Full app state / LocalDB state
export interface DBState {
  products: Product[];
  categories: Category[];
  brands: Brand[];
  orders: Order[];
  reviews: Review[];
  coupons: Coupon[];
  banners: Banner[];
  blogs: Blog[];
}
