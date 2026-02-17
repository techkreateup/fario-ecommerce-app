
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
    const { user } = useAuth();

    // 1. Fetch wishlist from Supabase when user logs in
    useEffect(() => {
        if (!user) {
            setWishlistItems([]);
            return;
        }

        const syncWishlist = async () => {
            try {
                const { data, error } = await supabase
                    .from('saved_items')
                    .select('productdata, productid')
                    .eq('user_id', user.id);

                if (error) throw error;

                if (data) {
                    setWishlistItems(data.map(item => ({
                        ...item.productdata,
                        id: item.productid
                    })));
                }
            } catch (err: any) {
                if (err.name !== 'AbortError') {
                    console.error('Wishlist sync error:', err);
                }
            }
        };

        syncWishlist();
    }, [user]);

    // 2. Realtime subscription for saved_items
    useEffect(() => {
        if (!user?.id) return;

        const channel = supabase
            .channel(`wishlist-rt-${user.id}`)
            .on('postgres_changes',
                { event: 'INSERT', schema: 'public', table: 'saved_items', filter: `user_id=eq.${user.id}` },
                (payload: any) => {
                    console.log('⚡ RT WISHLIST INSERT:', payload.new.productid);
                    const item = payload.new;
                    setWishlistItems(prev => {
                        if (prev.some(i => i.id === item.productid)) return prev;
                        return [...prev, { ...item.productdata, id: item.productid }];
                    });
                })
            .on('postgres_changes',
                { event: 'DELETE', schema: 'public', table: 'saved_items', filter: `user_id=eq.${user.id}` },
                (payload: any) => {
                    console.log('⚡ RT WISHLIST DELETE:', payload.old.productid);
                    setWishlistItems(prev => prev.filter(i => i.id !== payload.old.productid));
                })
            .subscribe();

        return () => { channel.unsubscribe(); };
    }, [user?.id]);

    const addToWishlist = async (product: EnhancedProduct) => {
        if (!user) {
            toast.error('Please login to save items');
            return;
        }

        if (wishlistItems.some(item => item.id === product.id)) return;
        setWishlistItems(prev => [...prev, product]);

        try {
            const { error } = await supabase.from('saved_items').insert([{
                user_id: user.id,
                productid: product.id,
                productdata: product
            }]);

            if (error) throw error;
            toast.success(`${product.name} added to wishlist`);
        } catch (err) {
            console.error('Wishlist add error:', err);
            setWishlistItems(prev => prev.filter(item => item.id !== product.id));
            toast.error('Failed to update wishlist');
        }
    };

    const removeFromWishlist = async (productId: string) => {
        if (!user) return;

        const itemToRemove = wishlistItems.find(item => item.id === productId);
        if (!itemToRemove) return;

        setWishlistItems(prev => prev.filter(item => item.id !== productId));

        try {
            const { error } = await supabase
                .from('saved_items')
                .delete()
                .eq('user_id', user.id)
                .eq('productid', productId);

            if (error) throw error;
            toast.info(`${itemToRemove.name} removed from wishlist`);
        } catch (err) {
            console.error('Wishlist remove error:', err);
            setWishlistItems(prev => [...prev, itemToRemove]);
            toast.error('Failed to update wishlist');
        }
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
