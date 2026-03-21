
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { EnhancedProduct } from '../constants';
import { useToast } from './ToastContext';
import { useAuth } from './AuthContext';
import { supabase } from '../lib/supabase';

interface WishlistContextType {
    wishlistItems: EnhancedProduct[];
    addToWishlist: (product: EnhancedProduct) => Promise<void>;
    removeFromWishlist: (productId: string) => Promise<void>;
    isInWishlist: (productId: string) => boolean;
    toggleWishlist: (product: EnhancedProduct) => Promise<void>;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export const WishlistProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [wishlistItems, setWishlistItems] = useState<EnhancedProduct[]>([]);
    const toast = useToast();
    const { user, session } = useAuth();

    // 1. Initial Load from LocalStorage
    useEffect(() => {
        const saved = localStorage.getItem('fario-wishlist');
        if (saved) {
            try {
                setWishlistItems(JSON.parse(saved));
            } catch (e) {
                console.error('Failed to parse wishlist from storage', e);
            }
        }
    }, []);

    // 2. Persist to LocalStorage whenever items change
    useEffect(() => {
        localStorage.setItem('fario-wishlist', JSON.stringify(wishlistItems));
    }, [wishlistItems]);

    const addToWishlist = async (product: EnhancedProduct) => {
        if (wishlistItems.some(item => item.id === product.id)) return;
        setWishlistItems(prev => [...prev, product]);
        toast.success(`${product.name} added to wishlist`);
    };

    const removeFromWishlist = async (productId: string) => {
        const itemToRemove = wishlistItems.find(item => item.id === productId);
        if (!itemToRemove) return;
        setWishlistItems(prev => prev.filter(item => item.id !== productId));
        toast.info(`${itemToRemove.name} removed from wishlist`);
    };

    const isInWishlist = (productId: string) => wishlistItems.some(item => item.id === productId);

    const toggleWishlist = async (product: EnhancedProduct) => {
        if (isInWishlist(product.id)) {
            await removeFromWishlist(product.id);
        } else {
            await addToWishlist(product);
        }
    };

    return (
        <WishlistContext.Provider value={{
            wishlistItems,
            addToWishlist,
            removeFromWishlist,
            isInWishlist,
            toggleWishlist
        }}>
            {children}
        </WishlistContext.Provider>
    );
};

export const useWishlist = () => {
    const context = useContext(WishlistContext);
    if (!context) throw new Error('useWishlist must be used within a WishlistProvider');
    return context;
};
