
import React, { useState, useEffect } from 'react';
import {
    Search, Star, Filter, MessageSquare,
    Trash2, CheckCircle2, XCircle, Loader2,
    Eye, ExternalLink, Tag
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useToast } from '../context/ToastContext';

interface Review {
    id: string;
    product_id: string;
    user_name: string;
    rating: number;
    title: string;
    comment: string;
    is_verified_purchase: boolean;
    created_at: string;
    product?: {
        name: string;
        image: string;
    }
}

const AdminReviews: React.FC = () => {
    const [reviews, setReviews] = useState<Review[]>([]);
    const [loading, setLoading] = useState(true);
    const [filterRating, setFilterRating] = useState<number | null>(null);
    const toast = useToast();

    useEffect(() => {
        fetchReviews();
    }, []);

    const fetchReviews = async () => {
        try {
            setLoading(true);
            const { supabase } = await import('../lib/supabase');

            // Join with products to get name/image is tricky in Supabase basic client
            // We'll fetch reviews first, then products manually if needed or uses a view
            // For now, simple fetch
            const { data, error } = await supabase
                .from('reviews')
                .select(`
                    *,
                    product:products(name, image)
                `)
                .order('created_at', { ascending: false });

            if (error) throw error;
            setReviews(data || []);
        } catch (err) {
            console.error('Fetch reviews error:', err);
            // toast.error('Failed to load reviews');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Delete this review permanently?')) return;

        try {
            const { supabase } = await import('../lib/supabase');
            const { error } = await supabase.from('reviews').delete().eq('id', id);

            if (error) throw error;

            toast.success('Review deleted');
            setReviews(prev => prev.filter(r => r.id !== id));
        } catch (err) {
            toast.error('Failed to delete review');
        }
    };

    const filteredReviews = filterRating
        ? reviews.filter(r => Math.round(r.rating) === filterRating)
        : reviews;

    return (
        <div className="space-y-8 pb-24 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="admin-h1">Reviews & Ratings</h1>
                    <p className="admin-subtitle">Monitor and manage customer feedback.</p>
                </div>
                <div className="flex gap-2">
                    {[5, 4, 3, 2, 1].map(star => (
                        <button
                            key={star}
                            onClick={() => setFilterRating(filterRating === star ? null : star)}
                            className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wider border flex items-center gap-1 transition-all ${filterRating === star
                                ? 'bg-yellow-400 text-black border-yellow-400'
                                : 'bg-white text-gray-400 border-gray-200 hover:border-yellow-400'
                                }`}
                        >
                            {star} <Star size={10} className="fill-current" />
                        </button>
                    ))}
                </div>
            </div>

            {/* List */}
            <div className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 overflow-hidden min-h-[400px]">
                {loading ? (
                    <div className="flex items-center justify-center h-[400px]">
                        <Loader2 className="w-8 h-8 animate-spin text-fario-purple" />
                    </div>
                ) : filteredReviews.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-[400px] text-gray-400">
                        <MessageSquare size={48} className="mb-4 opacity-20" />
                        <p className="font-bold">No reviews found</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 divide-y divide-gray-50">
                        {filteredReviews.map((review) => (
                            <div key={review.id} className="p-6 md:p-8 hover:bg-gray-50/50 transition-colors group">
                                <div className="flex flex-col md:flex-row gap-6">
                                    {/* Product Thumb */}
                                    <div className="w-16 h-16 bg-gray-100 rounded-xl overflow-hidden shrink-0 border border-gray-200">
                                        {review.product?.image ? (
                                            <img src={review.product.image} className="w-full h-full object-contain mix-blend-multiply" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-gray-300"><Tag size={20} /></div>
                                        )}
                                    </div>

                                    <div className="flex-1">
                                        <div className="flex justify-between items-start mb-2">
                                            <div>
                                                <h3 className="font-bold text-slate-900 text-sm mb-1">{review.title}</h3>
                                                <div className="flex items-center gap-2 text-[10px] text-gray-500 font-bold uppercase tracking-wide">
                                                    <span className="flex text-yellow-400">
                                                        {[...Array(5)].map((_, i) => (
                                                            <Star key={i} size={10} className={i < review.rating ? "fill-current" : "text-gray-200 fill-gray-200"} />
                                                        ))}
                                                    </span>
                                                    <span>• {review.user_name}</span>
                                                    <span>• {new Date(review.created_at).toLocaleDateString()}</span>
                                                </div>
                                            </div>
                                            <button
                                                onClick={() => handleDelete(review.id)}
                                                className="p-2 text-gray-300 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                        <p className="text-sm text-gray-600 leading-relaxed max-w-3xl">
                                            "{review.comment}"
                                        </p>
                                        {review.product && (
                                            <div className="mt-3 flex items-center gap-2 text-[10px] font-bold text-fario-purple uppercase tracking-wider">
                                                <span>Product: {review.product.name}</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminReviews;
