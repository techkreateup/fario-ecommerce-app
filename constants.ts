
import { NavItem, Product, FeaturePoint, InfographicStep, Order } from './types';

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
    // Using robust remote fallback images to prevent broken galleries
    shoe1: "https://lh3.googleusercontent.com/d/1tEuedCwZYRWL-aYCOXY46bXCBcnyVuU-",
    shoe2: "https://lh3.googleusercontent.com/d/1pc6UNVFR889igs7LbnQml_DpWpVd5AP2",
    schoolShoe: "https://lh3.googleusercontent.com/d/19UKGRbcIZHffq1xs56MekmVpgF90H2kr",
    bag1: "https://lh3.googleusercontent.com/d/1JAkZKl652biLyzUdO5X05Y4s7a1AsqPU",
    socks1: "https://lh3.googleusercontent.com/d/1BB5uMVdb66bRJLUgle-vUkLaKyK1gC-i",
    tags: "https://lh3.googleusercontent.com/d/1P2Rdo8iTmbVCLJ7bKG8SRiYdjoiEl5TZ",
    kidsVelcro: "https://lh3.googleusercontent.com/d/1fm0yzmL6IQktGcvEZ34X3hF3YaVqcYoC",
    extra: "https://lh3.googleusercontent.com/d/1tEuedCwZYRWL-aYCOXY46bXCBcnyVuU-",
  }
};

export const NAV_ITEMS: NavItem[] = [
  { label: 'Home', path: '/', icon: 'home' },
  { label: 'Products', path: '/products', icon: 'shopping-bag' },
  { label: 'About', path: '/story', icon: 'info' },
  { label: 'Contact', path: '/contact', icon: 'mail' },
];

export const PRODUCTS: EnhancedProduct[] = [];

export const SHOE_HOTSPOTS: FeaturePoint[] = [];

export const INFOGRAPHIC_STEPS: InfographicStep[] = [];

export const MOCK_ORDERS: Order[] = [];
