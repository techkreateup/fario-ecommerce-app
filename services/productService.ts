import { EnhancedProduct } from '../constants';

export const productService = {
    /**
     * Get full product catalog from Supabase
     */
    async getAllProducts(): Promise<EnhancedProduct[]> {
        const { supabase } = await import('../lib/supabase');
        const { data, error } = await supabase
            .from('products')
            .select('*')
            .eq('isDeleted', false);

        if (error) {
            console.error("Catalog fetch error:", error);
            return [];
        }
        return data || [];
    },

    async getReviews(productId: string) {
        const { supabase } = await import('../lib/supabase');
        const { data, error } = await supabase
            .from('reviews')
            .select('*')
            .eq('product_id', productId)
            .order('created_at', { ascending: false });

        if (error) {
            console.error("Reviews fetch error:", error);
            return [];
        }
        return data || [];
    },

    async addReview(review: any) {
        const { supabase } = await import('../lib/supabase');
        return await supabase
            .from('reviews')
            .insert([review]);
    }
};
