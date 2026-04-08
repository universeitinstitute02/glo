export interface Product {
  id: string;
  name: string;
  price: number;
  category: 'Bras' | 'Panties' | 'Nightwear' | 'Sets';
  images: string[];
  description: string;
  sizes: string[];
  colors: string[];
  sku: string;
  inStock: boolean;
}

export interface CartItem extends Product {
  quantity: number;
  selectedSize: string;
  selectedColor: string;
}

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  addresses: Address[];
  wishlist: string[]; // Product IDs
  role: 'admin' | 'customer';
}

export interface Order {
  id: string;
  userId: string;
  items: CartItem[];
  total: number;
  status: 'pending' | 'processing' | 'delivered' | 'canceled';
  shippingAddress: {
    fullName: string;
    phone: string;
    district: string;
    area: string;
    address: string;
  };
  paymentMethod: 'COD' | 'Online';
  createdAt: any; // Firestore Timestamp
}

export interface Coupon {
  id: string;
  code: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  expirationDate: string;
  usageLimit: number;
  usageCount: number;
  isActive: boolean;
}

export interface AdminSettings {
  siteName: string;
  taxRate: number;
  shippingFee: number;
  freeShippingThreshold: number;
  paymentMethods: string[];
}

export interface Address {
  id: string;
  fullName: string;
  phone: string;
  district: string;
  area: string;
  address: string;
  isDefault: boolean;
}

export interface Review {
  id: string;
  productId: string;
  userId: string;
  userName: string;
  rating: number;
  comment: string;
  createdAt: any; // Firestore Timestamp
}
