
export interface Product {
  id: string;
  name: string;
  category: 'Shoes' | 'School Shoes' | 'Bags' | 'Socks' | 'Tags' | 'Kids';
  price: number;
  originalPrice?: number;
  image: string;
  description: string;
  features: string[];
  gender: 'Male' | 'Female' | 'Unisex';
  sizes?: string[];
  colors?: string[];
  stockQuantity?: number;
  inStock?: boolean;
  rating?: number;
  reviewsCount?: number;
}

export interface NavItem {
  label: string;
  path: string;
  icon?: string;
}

export interface CartItem extends Product {
  cartId: string;
  selectedSize: string;
  selectedColor?: string;
  quantity: number;
}

export interface Address {
  id: string;
  fullName?: string;
  name?: string; // Add legacy support
  street: string;
  city: string;
  state: string;
  zipCode?: string;
  zip?: string; // Add legacy support
  phone: string;
  isDefault: boolean;
}

export interface OrderItem {
  id: string;
  name: string;
  image: string;
  quantity: number;
  price: number;
  selectedSize?: string;
}

export interface Order {
  id: string;
  date: string;
  createdat?: string; // Supabase raw field
  useremail?: string; // Supabase raw field
  total: number;
  status: 'Processing' | 'Shipped' | 'Out for Delivery' | 'Delivered' | 'Cancelled' | 'Return Requested' | 'Returned';
  items: OrderItem[];
  shippingAddress?: Address;
  shippingaddress?: string; // Supabase raw field (string)
  shippingMethod?: 'STANDARD' | 'EXPRESS';
  paymentMethod?: string;
  paymentId?: string;
  isArchived?: boolean;
  timeline?: any[];
  rating?: number;
  reviewText?: string;
  returns_info?: any; // New field from schema
  user_id?: string;   // New field from schema
}

export interface UserActivity {
  id: string;
  device: string;
  location: string;
  ip: string;
  time: string;
}

export interface UserProfile {
  name: string;
  email: string;
  phone: string;
  avatar: string;
  tier: 'Basic' | 'Elite' | 'Platinum';
  points: number;
  joinedDate: string;
  addresses: Address[];
}

// Added missing FeaturePoint interface for hotspots
export interface FeaturePoint {
  id: number;
  x: number;
  y: number;
  label: string;
  description: string;
}

// Added missing InfographicStep interface for engineering lab
export interface InfographicStep {
  title: string;
  description: string;
  iconPath: string;
}

// Added missing Review interface for customer feedback
export interface Review {
  id: string;
  userName: string;
  rating: number;
  date: string;
  comment: string;
  verified: boolean;
}

// Added missing ShoeCustomization interface for bespoke experience
export interface ShoeCustomization {
  baseColor: string;
  lacesColor: string;
  lacesType: 'Flat' | 'Round' | 'Reflective' | 'Speed';
  soleColor: string;
  soleType: 'EVA' | 'Rubber' | 'Grip-Tech' | 'Cloud';
  material: 'Mesh' | 'Leather' | 'Suede' | 'Knit';
  accentColor: string;
  idTag: string;
}

export interface Coupon {
  id?: string;
  code: string;
  discount_type: 'percentage' | 'fixed' | 'freebie';
  value: number;
  min_order_value: number;
}
