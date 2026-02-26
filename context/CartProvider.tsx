
import React, { createContext, useContext, useState, useRef, ReactNode, useEffect } from 'react';
import { CartItem, Product, Order, Coupon } from '../types';
import { EnhancedProduct } from '../constants';
import { useToast } from './ToastContext';
import { logAction } from '../services/logService';
import { supabase } from '../lib/supabase';
import { useAuth } from './AuthContext';

interface CartContextType {
  products: EnhancedProduct[];
  cartItems: CartItem[];
  orders: Order[];
  isLeadPopupOpen: boolean;
  setIsLeadPopupOpen: (open: boolean) => void;
  hasSubscribed: boolean;
  setHasSubscribed: (sub: boolean) => void;
  addToCart: (product: Product, size: string, color?: string) => void;
  removeFromCart: (cartId: string) => void;
  updateQuantity: (cartId: string, quantity: number) => void;
  clearCart: () => void;
  placeOrder: (order: Order) => Promise<boolean>;
  cancelOrder: (orderId: string) => void;
  returnOrder: (orderId: string, reason: string) => void;
  updateOrderStatus: (orderId: string, status: Order['status']) => void;
  purgeOrder: (orderId: string) => void;
  archiveOrder: (orderId: string) => void;
  submitReview: (orderId: string, rating: number, comment: string) => void;
  // Save For Later
  savedItems: CartItem[];
  saveForLater: (cartId: string) => void;
  moveToCart: (cartId: string) => void;
  removeFromSaved: (cartId: string) => void;

  // Catalog Management (Shared between Admin and Client)
  updateProduct: (updatedProduct: EnhancedProduct) => void;
  deleteProduct: (productId: string) => void;
  addProduct: (newProduct: EnhancedProduct) => void;

  cartTotal: number;
  cartCount: number;

  // Coupon System
  coupon: Coupon | null;
  discountAmount: number;
  userCoupons: any[];
  fetchUserCoupons: () => Promise<void>;
  applyCoupon: (code: string) => Promise<boolean>;
  removeCoupon: () => void;

  // Returns System
  returns: ReturnRequest[];
  addReturn: (request: ReturnRequest) => void;

  // Wallet & Loyalty
  walletBalance: number;
  loyaltyPoints: number;
  refreshProfile: () => Promise<void>;
  checkStock: (productId: string) => Promise<number>;
  isLoading: boolean;
  refreshTrigger: number;
}

export interface ReturnRequest {
  id: string;
  orderId: string;
  items: string[]; // item IDs
  reason: string;
  method: 'refund' | 'exchange' | 'credit';
  status: 'Initiated' | 'Processing' | 'Completed' | 'Refunded';
  requestedAt: string;
  refundAmount: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const toast = useToast();
  const { user, session } = useAuth();

  // Shared Catalog State
  const [products, setProducts] = useState<EnhancedProduct[]>([]);
  const productsRef = useRef<EnhancedProduct[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // Keep ref in sync for realtime callbacks
  useEffect(() => { productsRef.current = products; }, [products]);

  // Restored State Variables
  const [savedItems, setSavedItems] = useState<CartItem[]>([]);
  const [returns] = useState<ReturnRequest[]>([]);
  const [isLeadPopupOpen, setIsLeadPopupOpen] = useState(false);
  const [hasSubscribed, setHasSubscribed] = useState(false);
  const [walletBalance] = useState(0);
  const [loyaltyPoints] = useState(0);
  const [coupon, setCoupon] = useState<Coupon | null>(null);
  const [userCoupons, setUserCoupons] = useState<any[]>([]);

  // Real-time Catalog Sync
  useEffect(() => {
    let channel: ReturnType<typeof supabase.channel>;

    const syncCatalog = async () => {
      console.log('🚀 CATALOG SYNC STARTING...');
      setIsLoading(true);

      try {
        console.log('📡 Fetching from Supabase via REST API...');

        // Direct REST API call - bypasses supabase-js client which hangs in browser
        const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || 'https://csyiiksxpmbehiiovlbg.supabase.co';
        const SUPABASE_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_0JGcI8H61I9z_i3ojVomXw_CM9v3Lgw';

        const controller = new AbortController();
        const fetchTimeout = setTimeout(() => controller.abort(), 15000); // Reduce to 15s

        const response = await fetch(
          `${SUPABASE_URL}/rest/v1/products?isdeleted=eq.false&select=*`,
          {
            headers: {
              'apikey': SUPABASE_KEY,
              'Authorization': `Bearer ${SUPABASE_KEY}`,
              'Content-Type': 'application/json',
              'Prefer': 'return=representation'
            },
            signal: controller.signal
          }
        );

        clearTimeout(fetchTimeout);

        if (!response.ok) {
          console.error(`Failed to fetch catalog: ${response.status}`);
          setIsLoading(false);
          return;
        }

        const data = await response.json();
        console.log('✅ Catalog Data Received:', data.length, 'products');

        // Robust Image URL Sanitizer
        const mapped = data.map((p: Record<string, any>) => {
          let sanitizedImage = p.image || '';

          // 1. Check for legacy drive.google.com link
          if (sanitizedImage.includes('drive.google.com/uc?')) {
            const urlParams = new URLSearchParams(sanitizedImage.split('?')[1]);
            const fileId = urlParams.get('id');
            if (fileId) {
              sanitizedImage = `https://lh3.googleusercontent.com/d/${fileId}`;
            }
          }

          // 2. Check for double-prefixed LH3 link
          if (sanitizedImage.includes('lh3.googleusercontent.com/d/')) {
            const parts = sanitizedImage.split('lh3.googleusercontent.com/d/');
            const cleanId = parts[parts.length - 1];
            if (cleanId && cleanId.length > 20) {
              sanitizedImage = `https://lh3.googleusercontent.com/d/${cleanId}`;
            }
          }

          return {
            ...p,
            id: p.id,
            name: p.name,
            tagline: p.tagline,
            description: p.description,
            price: Number(p.price),
            originalPrice: p.originalprice ? Number(p.originalprice) : undefined, // Fix casing
            image: sanitizedImage,
            category: p.category,
            gender: p.gender,
            rating: Number(p.rating),
            reviewsCount: Number(p.reviewscount || 0),
            inStock: Boolean(p.instock),
            stockQuantity: Number(p.stockquantity || 0),
            colors: Array.isArray(p.colors) ? p.colors : (typeof p.colors === 'string' ? JSON.parse(p.colors) : []),
            sizes: Array.isArray(p.sizes) ? p.sizes : (typeof p.sizes === 'string' ? JSON.parse(p.sizes) : []),
            features: Array.isArray(p.features) ? p.features : (typeof p.features === 'string' ? JSON.parse(p.features) : []),
            gallery: Array.isArray(p.gallery) ? p.gallery : (typeof p.gallery === 'string' ? JSON.parse(p.gallery) : []),
          };
        });

        setProducts(mapped);
      } catch (err: unknown) {
        console.error('💥 CATALOG SYNC ERROR:', err instanceof Error ? err.message : String(err));
        setProducts([]);
        // Fallback to empty to allow app to load
      } finally {
        console.log('🏁 CATALOG SYNC FINISHED');
        setIsLoading(false);
      }

      // 2. Setup Realtime for Products
      channel = supabase
        .channel('catalog-changes')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'products' }, (payload: { eventType: string, new: Record<string, any>, old: Record<string, any> }) => {
          console.log('⚡ Catalog Update:', payload.eventType);
          if (payload.eventType === 'INSERT') {
            const mapped = {
              ...payload.new,
              isDeleted: payload.new.isdeleted,
              stockQuantity: payload.new.stockquantity,
              originalPrice: payload.new.originalprice
            } as EnhancedProduct;
            setProducts(prev => [mapped, ...prev]);
          } else if (payload.eventType === 'UPDATE') {
            const mapped = {
              ...payload.new,
              isDeleted: payload.new.isdeleted,
              stockQuantity: payload.new.stockquantity,
              originalPrice: payload.new.originalprice
            } as EnhancedProduct;
            setProducts(prev => prev.map(p => p.id === mapped.id ? mapped : p));
          } else if (payload.eventType === 'DELETE') {
            setProducts(prev => prev.filter(p => p.id !== payload.old.id));
          }
        })
        .subscribe();
    };

    if (typeof window !== 'undefined' && typeof document !== 'undefined') {
      syncCatalog();
    }

    return () => {
      if (channel) channel.unsubscribe();
    };
  }, []);

  // No LocalStorage initialization - volatile memory for guests
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);

  // 1. Sync Cart (Supabase for Users, LocalStorage for Guests)
  useEffect(() => {
    let mounted = true;

    const fetchCart = async () => {
      // GUEST: In-memory only (no localStorage), requires login for persistence
      if (!user) {
        return;
      }

      // AUTH LOGIC
      try {
        const { data, error } = await supabase
          .from('cart_items')
          .select('*')
          .eq('user_id', user.id);

        if (error) throw error;


        if (data && mounted) {
          const mappedItems = data.map(dbItem => {
            const product = products.find(p => p.id === dbItem.product_id);
            if (!product) return null;

            return {
              ...product,
              cartId: `${dbItem.product_id}-${dbItem.size}-${dbItem.color}`,
              selectedSize: dbItem.size,
              selectedColor: dbItem.color,
              quantity: dbItem.quantity
            };
          }).filter(Boolean) as CartItem[];

          setCartItems(mappedItems);
        }
      } catch (err) {
        console.error('Failed to fetch cart:', err);
      }
    };

    fetchCart();

    return () => { mounted = false; };
  }, [user, products, refreshTrigger]);


  // 3. Sync Orders from Supabase (uses own auth listener to avoid race condition)
  useEffect(() => {
    const fetchOrders = async (userId: string) => {
      console.log('📦 FETCHING ORDERS for user:', userId);
      try {
        const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || 'https://csyiiksxpmbehiiovlbg.supabase.co';
        const SUPABASE_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

        // Extract auth token from localStorage directly (avoid getSession() hang)
        let authToken = '';
        try {
          const storageKey = Object.keys(localStorage).find(k => k.startsWith('sb-') && k.endsWith('-auth-token'));
          if (storageKey) {
            const stored = JSON.parse(localStorage.getItem(storageKey) || '{}');
            authToken = stored?.access_token || '';
          }
        } catch { /* fallback to anon key */ }

        const response = await fetch(
          `${SUPABASE_URL}/rest/v1/orders?user_id=eq.${userId}&select=*&order=createdat.desc`,
          {
            headers: {
              'apikey': SUPABASE_KEY,
              'Authorization': `Bearer ${authToken || SUPABASE_KEY}`,
              'Content-Type': 'application/json'
            }
          }
        );

        if (!response.ok) {
          console.error('❌ Failed to fetch orders:', response.status, await response.text());
          return;
        }

        const data = await response.json();
        console.log('✅ Orders fetched:', data.length);

        const mapped: Order[] = data.map((o: Record<string, any>) => ({
          id: o.id,
          date: o.createdat ? new Date(o.createdat).toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' }) : 'N/A',
          createdat: o.createdat,
          total: Number(o.total),
          status: o.status || 'Processing',
          items: Array.isArray(o.items) ? o.items : (typeof o.items === 'string' ? JSON.parse(o.items) : []),
          shippingAddress: o.shippingaddress,
          paymentMethod: o.paymentmethod,
          isArchived: o.isarchived || false,
          user_id: o.user_id,
          useremail: o.useremail,
          timeline: o.timeline || [],
          returns_info: o.returns_info
        }));

        setOrders(mapped);
      } catch (err) {
        console.error('❌ Order sync error:', err);
      }
    };

    // If user is already available, fetch immediately
    if (user?.id) {
      fetchOrders(user.id);
    }

    // Also listen for auth changes so we catch late SIGNED_IN events
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (session?.user?.id && (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED' || event === 'INITIAL_SESSION')) {
        fetchOrders(session.user.id);
      } else if (event === 'SIGNED_OUT') {
        setOrders([]);
      }
    });

    return () => subscription.unsubscribe();
  }, [refreshTrigger]);

  // ============================================================================
  // 4. REALTIME SUBSCRIPTIONS (Orders, Cart, Saved Items)
  // ============================================================================
  useEffect(() => {
    if (!user?.id) return;

    const userId = user.id;
    console.log('🔴 REALTIME: Setting up live subscriptions for user:', userId);

    // --- A. ORDERS Realtime ---
    const ordersChannel = supabase
      .channel(`orders-${userId}`)
      .on('postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'orders', filter: `user_id=eq.${userId}` },
        (payload: { new: Record<string, any> }) => {
          console.log('⚡ RT ORDER INSERT:', payload.new.id);
          const o = payload.new;
          const mapped: Order = {
            id: o.id,
            date: o.createdat ? new Date(o.createdat).toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' }) : 'N/A',
            createdat: o.createdat,
            total: Number(o.total),
            status: o.status || 'Processing',
            items: Array.isArray(o.items) ? o.items : (typeof o.items === 'string' ? JSON.parse(o.items) : []),
            shippingAddress: o.shippingaddress,
            paymentMethod: o.paymentmethod,
            isArchived: o.isarchived || false,
            user_id: o.user_id,
            useremail: o.useremail,
            timeline: o.timeline || [],
            returns_info: o.returns_info
          };
          setOrders(prev => [mapped, ...prev]);
        })
      .on('postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'orders', filter: `user_id=eq.${userId}` },
        (payload: { new: Record<string, any> }) => {
          console.log('⚡ RT ORDER UPDATE:', payload.new.id, '→', payload.new.status);
          const o = payload.new;
          setOrders(prev => prev.map(order =>
            order.id === o.id ? {
              ...order,
              status: o.status || order.status,
              isArchived: o.isarchived ?? order.isArchived,
              timeline: o.timeline || order.timeline,
              returns_info: o.returns_info || order.returns_info
            } : order
          ));
        })
      .on('postgres_changes',
        { event: 'DELETE', schema: 'public', table: 'orders', filter: `user_id=eq.${userId}` },
        (payload: { old: Record<string, any> }) => {
          console.log('⚡ RT ORDER DELETE:', payload.old.id);
          setOrders(prev => prev.filter(o => o.id !== payload.old.id));
        })
      .subscribe();

    // --- B. CART_ITEMS Realtime ---
    const cartChannel = supabase
      .channel(`cart-${userId}`)
      .on('postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'cart_items', filter: `user_id=eq.${userId}` },
        (payload: { new: Record<string, any> }) => {
          console.log('⚡ RT CART INSERT:', payload.new.product_id);
          const dbItem = payload.new;
          const product = productsRef.current.find(p => p.id === dbItem.product_id);
          if (product) {
            const newItem: CartItem = {
              ...product,
              cartId: `${dbItem.product_id}-${dbItem.size}-${dbItem.color}`,
              selectedSize: dbItem.size,
              selectedColor: dbItem.color,
              quantity: dbItem.quantity
            };
            setCartItems(prev => {
              if (prev.some(i => i.cartId === newItem.cartId)) return prev;
              return [...prev, newItem];
            });
          }
        })
      .on('postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'cart_items', filter: `user_id=eq.${userId}` },
        (payload: { new: Record<string, any> }) => {
          console.log('⚡ RT CART UPDATE:', payload.new.product_id);
          const dbItem = payload.new;
          const cartId = `${dbItem.product_id}-${dbItem.size}-${dbItem.color}`;
          setCartItems(prev => prev.map(item =>
            item.cartId === cartId ? { ...item, quantity: dbItem.quantity } : item
          ));
        })
      .on('postgres_changes',
        { event: 'DELETE', schema: 'public', table: 'cart_items', filter: `user_id=eq.${userId}` },
        (payload: { old: Record<string, any> }) => {
          console.log('⚡ RT CART DELETE:', payload.old.product_id);
          const dbItem = payload.old;
          const cartId = `${dbItem.product_id}-${dbItem.size}-${dbItem.color}`;
          setCartItems(prev => prev.filter(item => item.cartId !== cartId));
        })
      .subscribe();

    // --- C. SAVED_ITEMS (Wishlist) Realtime ---
    const savedChannel = supabase
      .channel(`saved-${userId}`)
      .on('postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'saved_items', filter: `user_id=eq.${userId}` },
        (payload: { new: Record<string, any> }) => {
          console.log('⚡ RT SAVED INSERT:', payload.new.productid);
          const item = payload.new;
          const productData = item.productdata || {};
          setSavedItems(prev => {
            if (prev.some(i => i.id === item.productid)) return prev;
            return [...prev, { ...productData, id: item.productid }];
          });
        })
      .on('postgres_changes',
        { event: 'DELETE', schema: 'public', table: 'saved_items', filter: `user_id=eq.${userId}` },
        (payload: { old: Record<string, any> }) => {
          console.log('⚡ RT SAVED DELETE:', payload.old.productid);
          setSavedItems(prev => prev.filter(i => i.id !== payload.old.productid));
        })
      .subscribe();

    return () => {
      console.log('🔴 REALTIME: Cleaning up subscriptions');
      ordersChannel.unsubscribe();
      cartChannel.unsubscribe();
      savedChannel.unsubscribe();
    };
  }, [user?.id]);

  // 5. Actions with DB Sync
  const clearCart = async () => {
    setCartItems([]);
    if (user) {
      await supabase.from('cart_items').delete().eq('user_id', user.id);
    }
  };

  const addToCart = async (product: Product, size: string, color?: string) => {
    const cartId = `${product.id}-${size}-${color || 'default'}`;
    const existing = cartItems.find(item => item.cartId === cartId);

    // 1. Optimistic Update
    if (existing) {
      setCartItems(prev => prev.map(item =>
        item.cartId === cartId ? { ...item, quantity: item.quantity + 1 } : item
      ));
      toast.success(`Updated quantity for ${product.name}`);
    } else {
      setCartItems(prev => [...prev, {
        ...product,
        selectedSize: size,
        selectedColor: color,
        quantity: 1,
        cartId,
        sizes: product.sizes || [],
        colors: product.colors || []
      }]);
      toast.success(`${product.name} added to cart!`);
    }

    // 2. DB Sync (if logged in)
    if (user) {
      if (existing) {
        await supabase.from('cart_items').update({ quantity: existing.quantity + 1 })
          .eq('user_id', user.id)
          .eq('product_id', product.id)
          .eq('size', size)
          .eq('color', color || (product.colors?.[0] || 'Default'));
      } else {
        await supabase.from('cart_items').insert({
          user_id: user.id,
          product_id: product.id,
          quantity: 1,
          size: size,
          color: color || (product.colors?.[0] || 'Default')
        });
      }
    }
  };

  const removeFromCart = async (cartId: string) => {
    const item = cartItems.find(i => i.cartId === cartId);
    if (!item) return;

    setCartItems(prev => prev.filter(i => i.cartId !== cartId));
    toast.info(`${item.name} removed from cart`);

    if (user) {
      await supabase.from('cart_items').delete()
        .eq('user_id', user.id)
        .eq('product_id', item.id)
        .eq('size', item.selectedSize)
        .eq('color', item.selectedColor || (item.colors?.[0] || 'Default'));
    }
  };

  const updateQuantity = async (cartId: string, quantity: number) => {
    if (quantity < 1) {
      removeFromCart(cartId);
      return;
    }

    const item = cartItems.find(i => i.cartId === cartId);
    if (!item) return;

    setCartItems(prev => prev.map(i =>
      i.cartId === cartId ? { ...i, quantity } : i
    ));

    if (user) {
      await supabase.from('cart_items').update({ quantity })
        .eq('user_id', user.id)
        .eq('product_id', item.id)
        .eq('size', item.selectedSize)
        .eq('color', item.selectedColor || (item.colors?.[0] || 'Default'));
    }
  };

  // Saved items - keeping existing DB logic but ensuring no local storage fallback
  const saveForLater = async (cartId: string) => {
    if (!user) {
      toast.error('Please login to save items');
      return;
    }

    const itemToSave = cartItems.find(item => item.cartId === cartId);
    if (itemToSave) {
      // Optimistic Update
      setCartItems(prev => prev.filter(item => item.cartId !== cartId));

      // Remove from Cart DB
      await supabase.from('cart_items').delete()
        .eq('user_id', user.id)
        .eq('product_id', itemToSave.id)
        .eq('size', itemToSave.selectedSize);

      // Add to Saved DB
      const { error } = await supabase.from('saved_items').insert([{
        user_id: user.id,
        useremail: user.email,
        productid: itemToSave.id,
        productdata: itemToSave
      }]);

      if (error) {
        toast.error("Failed to save item");
      } else {
        toast.info(`${itemToSave.name} saved for later`);
      }
    }
  };

  const moveToCart = async (productId: string) => {
    if (!user) return;

    const itemToMove = savedItems.find(item => item.id === productId);

    if (itemToMove) {
      // Add to Cart Logic (calling internal function to handle DB insert)
      await addToCart(itemToMove, itemToMove.sizes?.[0] || 'OS', itemToMove.colors?.[0] || 'Default');

      // Remove from Saved (DB)
      await supabase.from('saved_items').delete().eq('user_id', user.id).eq('productid', productId);
    }
  };

  const removeFromSaved = async (productId: string) => {
    if (!user) return;

    const { error } = await supabase.from('saved_items').delete().eq('user_id', user.id).eq('productid', productId);
    if (!error) {
      setSavedItems(prev => prev.filter(item => item.id !== productId));
      toast.info("Item removed from wishlist");
    }
  };


  const placeOrder = async (newOrder: Order): Promise<boolean> => {
    try {
      console.log('🔵 PLACE ORDER START:', { orderId: newOrder.id });

      // Get credentials from env
      const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || 'https://csyiiksxpmbehiiovlbg.supabase.co';
      const SUPABASE_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

      // Get user from AuthContext
      if (!user || !user.id) {
        console.error('❌ No user found in AuthContext');
        toast.error('Please log in to place an order');
        return false;
      }

      const userId = user.id;
      console.log('👤 User from AuthContext:', { userId, email: user.email });

      const addressString = typeof newOrder.shippingAddress === 'string'
        ? newOrder.shippingAddress
        : newOrder.shippingAddress
          ? `${newOrder.shippingAddress.fullName || (newOrder.shippingAddress as any).name}, ${newOrder.shippingAddress.street}, ${newOrder.shippingAddress.city}, ${newOrder.shippingAddress.state} ${newOrder.shippingAddress.zipCode || (newOrder.shippingAddress as any).zip}`
          : 'Default Address';

      console.log('📦 CALLING RPC VIA REST API:', {
        userId,
        itemCount: newOrder.items.length,
        total: newOrder.total
      });

      // Direct REST API call to RPC function (bypasses broken auth client)
      const controller = new AbortController();
      const fetchTimeout = setTimeout(() => controller.abort(), 30000);

      // 🔐 SECURE: Use session directly from AuthContext
      const authToken = session?.access_token || '';

      if (!authToken) {
        console.warn("⚠️ No valid session found, falling back to Anon Key (Less Secure)");
      }

      const response = await fetch(
        `${SUPABASE_URL}/rest/v1/rpc/place_order_with_stock`,
        {
          method: 'POST',
          headers: {
            'apikey': SUPABASE_KEY,
            'Authorization': authToken ? `Bearer ${authToken}` : `Bearer ${SUPABASE_KEY}`,
            'Content-Type': 'application/json',
            'Prefer': 'return=representation'
          },
          body: JSON.stringify({
            p_items: newOrder.items,
            p_total: newOrder.total,
            p_shipping_address: addressString,
            p_payment_method: newOrder.paymentMethod
          }),
          signal: controller.signal
        }
      );

      clearTimeout(fetchTimeout);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ RPC REST call failed:', { status: response.status, error: errorText });

        if (errorText.includes('Insufficient stock')) {
          toast.error('Sorry, one or more items are out of stock!');
        } else if (errorText.includes('Insufficient wallet')) {
          toast.error('Insufficient wallet balance!');
        } else {
          toast.error(`Order failed: ${errorText || response.statusText}`);
        }
        return false;
      }

      const orderResult = await response.json();
      console.log('✅ ORDER SUCCESS:', orderResult);

      // If a user coupon was applied, mark it as used by removing it from metadata
      if (coupon && (coupon as any).id && user) {
        try {
          const existingCoupons = user.user_metadata?.spin_coupons || [];
          const updatedCoupons = existingCoupons.filter((c: any) => c.id !== (coupon as any).id);

          await fetch(`${SUPABASE_URL}/auth/v1/user`, {
            method: 'PUT',
            headers: {
              'apikey': SUPABASE_KEY,
              'Authorization': `Bearer ${session?.access_token || SUPABASE_KEY}`,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ data: { spin_coupons: updatedCoupons } })
          });
          // Refresh local coupons state via metadata
          setUserCoupons(updatedCoupons);
        } catch (e) {
          console.error("Failed to mark coupon as used in metadata", e);
        }
      }

      toast.success('Order placed successfully!');
      clearCart();
      setCoupon(null);
      setRefreshTrigger(prev => prev + 1);
      return true;
    } catch (err: unknown) {
      console.error("❌ Order blocked due to error:", err);
      toast.error(`System error: ${err instanceof Error ? err.message : 'Connection failed'}`);
      return false;
    }
  };


  const checkStock = async (productId: string): Promise<number> => {
    try {
      const { supabase } = await import('../lib/supabase');
      const { data, error } = await supabase
        .from('products')
        .select('stockQuantity')
        .eq('id', productId)
        .single();
      if (error || !data) return 0;
      return data.stockQuantity;
    } catch (err) {
      return 0;
    }
  };

  const subTotal = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);

  // Calculate discount
  let discountAmount = 0;
  if (coupon) {
    if (coupon.discount_type === 'percentage') {
      discountAmount = (subTotal * coupon.value) / 100;
    } else {
      discountAmount = coupon.value;
    }
  }
  // Ensure discount doesn't exceed total
  discountAmount = Math.min(discountAmount, subTotal);

  const cartTotal = subTotal - discountAmount;
  const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  const fetchUserCoupons = async () => {
    if (!user || !session?.access_token) return;
    try {
      const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
      const SUPABASE_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

      const response = await fetch(`${SUPABASE_URL}/auth/v1/user`, {
        method: 'GET',
        headers: {
          'apikey': SUPABASE_KEY,
          'Authorization': `Bearer ${session.access_token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        const coupons = data?.user_metadata?.spin_coupons || [];
        setUserCoupons(coupons);
      } else {
        // Fallback to local user state if API fails
        const coupons = user.user_metadata?.spin_coupons || [];
        setUserCoupons(coupons);
      }
    } catch (err) {
      console.error("Failed to fetch fresh user coupons", err);
      // Fallback
      setUserCoupons(user.user_metadata?.spin_coupons || []);
    }
  };

  useEffect(() => {
    if (user) {
      fetchUserCoupons();
    } else {
      setUserCoupons([]);
    }
  }, [user, session]);

  const applyCoupon = async (code: string): Promise<boolean> => {
    try {
      if (!user) {
        toast.error("Please login to apply coupons");
        return false;
      }

      // REST API call to avoid supabase-js client hanging
      const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || 'https://csyiiksxpmbehiiovlbg.supabase.co';
      const SUPABASE_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

      const response = await fetch(
        `${SUPABASE_URL}/rest/v1/coupons?code=eq.${code.toUpperCase()}&is_active=eq.true&select=*&limit=1`,
        {
          method: 'GET',
          headers: {
            'apikey': SUPABASE_KEY,
            'Authorization': `Bearer ${SUPABASE_KEY}`,
            'Content-Type': 'application/json',
            'Prefer': 'return=representation'
          }
        }
      );

      if (!response.ok) {
        console.error('Coupon fetch failed');
        toast.error("Failed to validate coupon");
        return false;
      }

      const data = await response.json();

      let couponData;
      let isUserCoupon = false;

      // Check global coupons first
      if (data && data.length > 0) {
        couponData = data[0];
      } else {
        // Fallback: Check user_metadata (Spin Wheel rewards)
        const userCouponsList = user.user_metadata?.spin_coupons || [];
        const found = userCouponsList.find((c: any) => c.coupon_code.toUpperCase() === code.toUpperCase());
        if (found) {
          couponData = found;
          isUserCoupon = true;
        }
      }

      if (!couponData) {
        toast.error("Invalid or expired coupon code");
        return false;
      }

      if (!isUserCoupon) {
        // Check requirements for global coupons
        if (subTotal < couponData.min_order_value) {
          toast.error(`Minimum order value of ₹${couponData.min_order_value} required`);
          return false;
        }

        // Check usage limit
        if (couponData.usage_limit > 0 && couponData.used_count >= couponData.usage_limit) {
          toast.error("Coupon usage limit reached");
          return false;
        }
      } else {
        // Check requirements for user coupons (Freebies might require a min order)
        if (couponData.discount_type === 'freebie' && subTotal < 500) {
          toast.error("Free bag applies on orders over ₹500");
          return false;
        }
      }

      setCoupon({
        id: couponData.id,
        code: couponData.code || couponData.coupon_code,
        discount_type: couponData.discount_type,
        value: couponData.value || couponData.discount_value,
        min_order_value: couponData.min_order_value || 0
      });

      toast.success(`${isUserCoupon ? 'Reward' : 'Coupon'} applied successfully!`);
      return true;

    } catch (err) {
      console.error(err);
      toast.error("Failed to apply coupon");
      return false;
    }
  };

  const removeCoupon = () => {
    setCoupon(null);
    toast.info("Coupon removed");
  };

  return (
    <CartContext.Provider value={{
      products,
      cartItems,
      orders,
      isLeadPopupOpen,
      setIsLeadPopupOpen,
      hasSubscribed,
      setHasSubscribed,
      isLoading,
      refreshTrigger,
      userCoupons,
      fetchUserCoupons,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      placeOrder,
      checkStock,
      cancelOrder: (id) => setOrders(prev => prev.map(o => o.id === id ? { ...o, status: 'Cancelled' } : o)),
      returnOrder: (id) => setOrders(prev => prev.map(o => o.id === id ? { ...o, status: 'Return Requested' } : o)),
      updateOrderStatus: (id, status) => setOrders(prev => prev.map(o => o.id === id ? { ...o, status } : o)),
      purgeOrder: (id) => setOrders(prev => prev.filter(o => o.id !== id)),
      archiveOrder: (id) => setOrders(prev => prev.map(o => o.id === id ? { ...o, isArchived: true } : o)),

      cartTotal,
      cartCount,
      coupon,
      discountAmount,
      applyCoupon,
      removeCoupon,
      savedItems,
      saveForLater,
      moveToCart,
      removeFromSaved,
      returns,
      addReturn: async (req) => {
        try {
          if (!user) {
            toast.error("Please login to request a return");
            return;
          }

          const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || 'https://csyiiksxpmbehiiovlbg.supabase.co';
          const SUPABASE_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

          let authToken = '';
          try {
            const { data: { session } } = await import('../lib/supabase').then(m => m.supabase.auth.getSession());
            authToken = session?.access_token || '';
          } catch { }

          const response = await fetch(`${SUPABASE_URL}/rest/v1/returns`, {
            method: 'POST',
            headers: {
              'apikey': SUPABASE_KEY,
              'Authorization': `Bearer ${authToken || SUPABASE_KEY}`,
              'Content-Type': 'application/json',
              'Prefer': 'return=representation'
            },
            body: JSON.stringify({
              id: req.id,
              user_id: user.id,
              order_id: req.orderId,
              items: req.items,
              reason: req.reason,
              method: req.method,
              status: 'Pending',
              refund_amount: req.refundAmount,
              created_at: new Date().toISOString()
            })
          });

          if (!response.ok) throw new Error(await response.text());

          toast.success('Return request submitted successfully');
        } catch (e: unknown) {
          console.error('Return request failed:', e);
          toast.error(`Failed to submit return: ${e instanceof Error ? e.message : String(e)}`);
        }
      },
      submitReview: async (orderId, rating, comment) => {
        try {
          if (!user) {
            toast.error("Login to submit reviews");
            return;
          }

          const order = orders.find(o => o.id === orderId);
          if (!order) throw new Error("Order not found");

          // REST API to avoid supabase-js client issues
          const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || 'https://csyiiksxpmbehiiovlbg.supabase.co';
          const SUPABASE_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

          let authToken = '';
          try {
            const { data: { session } } = await import('../lib/supabase').then(m => m.supabase.auth.getSession());
            authToken = session?.access_token || '';
          } catch { }

          // 1. Insert Review
          const reviewData = {
            order_id: orderId,
            user_id: user.id,
            product_id: order.items[0]?.id,
            rating,
            comment,
            user_name: user.user_metadata?.name || 'Anonymous',
            created_at: new Date().toISOString()
          };

          const response = await fetch(`${SUPABASE_URL}/rest/v1/reviews`, {
            method: 'POST',
            headers: {
              'apikey': SUPABASE_KEY,
              'Authorization': `Bearer ${authToken || SUPABASE_KEY}`,
              'Content-Type': 'application/json',
              'Prefer': 'return=representation'
            },
            body: JSON.stringify(reviewData)
          });

          if (!response.ok) throw new Error(await response.text());

          // 2. Update Order Status (Optional, logging error if fails but not blocking)
          try {
            await fetch(`${SUPABASE_URL}/rest/v1/orders?id=eq.${orderId}`, {
              method: 'PATCH',
              headers: {
                'apikey': SUPABASE_KEY,
                'Authorization': `Bearer ${authToken || SUPABASE_KEY}`,
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({ rating, review_text: comment })
            });
          } catch (e) { console.warn("Failed to update order with review", e); }

          toast.success('Review submitted! Thank you.');
        } catch (e: unknown) {
          console.error('Review failed:', e);
          toast.error('Failed to submit review');
        }
      },
      walletBalance,
      loyaltyPoints,
      refreshProfile: async () => { }, // Handled by realtime sync
      updateProduct: async (p) => {
        try {
          const { supabase } = await import('../lib/supabase');
          // Map to DB columns
          const dbData = {
            name: p.name,
            tagline: p.tagline,
            category: p.category,
            price: p.price,
            originalprice: p.originalPrice,
            image: p.image,
            description: p.description,
            features: p.features,
            colors: p.colors,
            sizes: p.sizes,
            instock: p.inStock,
            rating: p.rating,
            stockquantity: p.stockQuantity,
            gender: p.gender,
            isdeleted: p.isDeleted
          };
          const { error } = await supabase.from('products').update(dbData).eq('id', p.id);
          if (error) throw error;
          toast.success('Product updated');
          logAction('product_updated', { productId: p.id, name: p.name });
        } catch (e) {
          console.error(e);
          toast.error('Failed to update product');
        }
      },
      deleteProduct: async (id) => {
        try {
          const { supabase } = await import('../lib/supabase');
          // Soft delete
          const { error } = await supabase.from('products').update({ isdeleted: true }).eq('id', id);
          if (error) throw error;
          toast.success('Product removed');
          logAction('product_deleted', { productId: id });
        } catch (e) {
          console.error(e);
          toast.error('Failed to remove product');
        }
      },
      addProduct: async (p) => {
        try {
          const { supabase } = await import('../lib/supabase');
          // Map to DB columns
          const dbData = {
            id: p.id,
            name: p.name,
            tagline: p.tagline,
            category: p.category,
            price: p.price,
            originalprice: p.originalPrice,
            image: p.image,
            description: p.description,
            features: p.features,
            colors: p.colors,
            sizes: p.sizes,
            instock: p.inStock,
            rating: p.rating,
            stockquantity: p.stockQuantity,
            gender: p.gender,
            isdeleted: false
          };
          const { error } = await supabase.from('products').insert([dbData]);
          if (error) throw error;
          toast.success('Product added to catalog');
          logAction('product_added', { productId: p.id, name: p.name });
        } catch (e) {
          console.error(e);
          toast.error('Failed to add product');
        }
      }
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within a CartProvider');
  return context;
};
