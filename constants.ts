
import { NavItem, Product, FeaturePoint, InfographicStep, Order, Review } from './types';

export const GOOGLE_CLIENT_ID = "202334296408-h9doaqongegl5g3help29f84co4oehpd.apps.googleusercontent.com";

export interface EnhancedProduct extends Product {
  colors: string[];
  sizes: string[];
  inStock: boolean;
  rating: number;
  tagline: string;
  stockQuantity: number;
  gallery?: string[];
  video?: string | null;
  isDeleted?: boolean;
  // New Amazon-Style Fields
  reviewsCount?: number;
  monthlySales?: string;
  deliveryInfo?: string;
  eliteStatus?: string;
  discountLabel?: string;
  stockStatusLabel?: string;
  seller?: string;
}

/**
 * GOOGLE DRIVE IMAGE HELPER
 * Licensed Images Folder: https://drive.google.com/drive/folders/1CBmbMUL73PpefwH3Umw3ZCOOoTrKgER0
 * 
 * IMPORTANT: For images to load reliably:
 * 1. Images must be publicly shared (Anyone with the link can view)
 * 2. Using uc?export=view format for better CORS compatibility
 */
export const drive = (idOrUrl: string): string => {
  if (!idOrUrl) return '';
  if (idOrUrl.includes('/folders/')) return '';

  // 1. If it's already an LH3 link, check for double prefixing
  if (idOrUrl.includes('lh3.googleusercontent.com/d/')) {
    const parts = idOrUrl.split('lh3.googleusercontent.com/d/');
    const cleanId = parts[parts.length - 1];
    if (cleanId && cleanId.length > 20) {
      return `https://lh3.googleusercontent.com/d/${cleanId}`;
    }
    return idOrUrl;
  }

  // 2. If it's a legacy drive link, extract the ID
  if (idOrUrl.includes('drive.google.com/uc?')) {
    const urlParams = new URLSearchParams(idOrUrl.split('?')[1]);
    const fileId = urlParams.get('id');
    if (fileId) return `https://lh3.googleusercontent.com/d/${fileId}`;
    return idOrUrl;
  }

  // 3. Extract file ID from various other Google Drive URL formats
  const match = idOrUrl.match(/\/d\/([-\w]{25,})/) || idOrUrl.match(/id=([-\w]{25,})/);
  const id = match ? match[1] : (idOrUrl.length > 25 && !idOrUrl.includes('http') ? idOrUrl : null);

  if (!id) return idOrUrl;

  return `https://lh3.googleusercontent.com/d/${id}`;
};

export const driveVideo = (idOrUrl: string): string => {
  if (!idOrUrl) return '';
  const match = idOrUrl.match(/\/d\/([-\w]{25,})/) || idOrUrl.match(/id=([-\w]{25,})/);
  const id = match ? match[1] : (idOrUrl.length > 25 ? idOrUrl : null);
  if (id) return `https://drive.google.com/uc?export=download&id=${id}`;
  return idOrUrl;
};

// Helper to handle base path for images in GitHub Pages
const getAssetPath = (path: string) => {
  if (path.startsWith('http')) return path;

  const base = (import.meta as any).env.BASE_URL || '/';

  // Clean the path to not have leading slash
  const cleanPath = path.startsWith('/') ? path.slice(1) : path;

  // Always use BASE_URL (works for both dev and production)
  const cleanBase = base.endsWith('/') ? base : `${base}/`;
  return `${cleanBase}${cleanPath}`;
};

export const ASSETS = {
  // Official Licensed Logo: F=White, BG=Purple Circle
  logo: getAssetPath("fario-logo.png"),
  // Using LOCAL images for 100% reliability - no Google Drive issues!
  heroShoe: "https://lh3.googleusercontent.com/d/1tEuedCwZYRWL-aYCOXY46bXCBcnyVuU-",
  brandVideo: "https://drive.google.com/uc?export=download&id=1fuEGW4xFcdZUiKTrfRNEovuefrB0xqWx",
  products: {
    // All images now stored locally in /public folder
    shoe1: getAssetPath("shoe-velcro-2.png"),
    shoe2: getAssetPath("shoe-lifestyle.jpg"),
    schoolShoe: getAssetPath("shoe-lifestyle.jpg"),
    bag1: getAssetPath("shoe-lifestyle.jpg"), // Reusing until you provide bag image
    socks1: getAssetPath("shoe-lifestyle.jpg"), // Reusing until you provide socks image
    tags: getAssetPath("shoe-edustep.jpg"),
    kidsVelcro: getAssetPath("shoe-velcro-1.jpg"),
    extra: getAssetPath("shoe-edustep.jpg"),
  }
};

export const NAV_ITEMS: NavItem[] = [
  { label: 'Home', path: '/' },
  { label: 'Products', path: '/products' },
  { label: 'About', path: '/story' },
  { label: 'Contact', path: '/contact' },
];

export const PRODUCTS: EnhancedProduct[] = [];

export const SHOE_HOTSPOTS: FeaturePoint[] = [];

export const INFOGRAPHIC_STEPS: InfographicStep[] = [];

export const MOCK_ORDERS: Order[] = [];
