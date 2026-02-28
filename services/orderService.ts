
import { supabase } from '../lib/supabase';

const getAuthHeaders = async () => {
    const SUPABASE_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNzeWlpa3N4cG1iZWhpaW92bGJnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzEwNTE1MDgsImV4cCI6MjA4NjYyNzUwOH0.A1i9vqFwd_BsMwtod_uFyR-yJhHGW2Vu7PmacxGT6m4';

    // Extract auth token from localStorage directly (getSession() hangs)
    let authToken = '';
    try {
        const storageKey = Object.keys(localStorage).find(k => k.startsWith('sb-') && k.endsWith('-auth-token'));
        if (storageKey) {
            const stored = JSON.parse(localStorage.getItem(storageKey) || '{}');
            authToken = stored?.access_token || '';
        }
    } catch { /* fallback to anon key */ }

    return {
        'apikey': SUPABASE_KEY,
        'Authorization': authToken ? `Bearer ${authToken}` : `Bearer ${SUPABASE_KEY}`,
        'Content-Type': 'application/json',
        'Prefer': 'return=representation'
    };
};

export const orderService = {
    /**
     * Get user's order history using RPC (bypasses RLS like place_order_with_stock)
     */
    async getMyOrders() {
        try {
            const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || 'https://csyiiksxpmbehiiovlbg.supabase.co';

            const headers = await getAuthHeaders();

            const response = await fetch(
                `${SUPABASE_URL}/rest/v1/rpc/get_my_orders`,
                {
                    method: 'POST',
                    headers,
                    body: JSON.stringify({}) // No params needed, auth.uid() used
                }
            );

            if (!response.ok) {
                console.error("❌ RPC orders fetch failed:", response.status);
                return [];
            }

            const data = await response.json();
            return data || [];
        } catch (error) {
            console.error("❌ Failed to fetch orders:", error);
            return [];
        }
    },

    /**
     * Get ALL orders from Supabase (Admin Only)
     */
    async getAllOrders() {
        // SDK uses auto-auth headers, so this is already safe if RLS is set up
        const { data, error } = await supabase
            .from('orders')
            .select('*')
            .order('createdat', { ascending: false });

        if (error) {
            console.error("❌ Supabase all orders fetch failed:", error);
            return [];
        }
        return data || [];
    },

    /**
     * Update order status with timeline logging (Admin Only)
     */
    async updateOrderStatus(orderId: string, status: string) {
        // SDK handles auth
        // 1. Fetch current order to get existing timeline
        const { data: order, error: fetchError } = await supabase
            .from('orders')
            .select('timeline')
            .eq('id', orderId)
            .single();

        if (fetchError) throw fetchError;

        // 2. Prepare new timeline event
        const newEvent = {
            status,
            time: new Date().toISOString(),
            message: this.getStatusMessage(status)
        };

        const updatedTimeline = [...(order.timeline || []), newEvent];

        // 3. Update status and timeline
        const { error: updateError } = await supabase
            .from('orders')
            .update({
                status: status as any,
                timeline: updatedTimeline,
                updatedat: new Date().toISOString()
            })
            .eq('id', orderId);

        if (updateError) throw updateError;
        return { success: true };
    },

    /**
     * Helper to generate human-friendly status messages
     */
    getStatusMessage(status: string): string {
        switch (status) {
            case 'Processing': return 'Order is being prepared for dispatch.';
            case 'Shipped': return 'Package has been handed over to our courier partner.';
            case 'Out for Delivery': return 'The driver is in your area and will arrive shortly.';
            case 'Delivered': return 'Package delivered successfully.';
            case 'Cancelled': return 'The order has been cancelled.';
            case 'Return Requested': return 'Return request received and under review.';
            case 'Returned': return 'Item has been successfully returned and processed.';
            default: return `Order status updated to ${status}.`;
        }
    },

    /**
     * Analytics: Fetch Revenue Trends
     */
    async getAnalyticsRevenue(days: number = 30) {
        const { data, error } = await supabase.rpc('get_admin_analytics_revenue', { days_limit: days });
        if (error) throw error;
        return data || [];
    },

    /**
     * Analytics: Fetch Top Selling Products
     */
    async getTopSellingProducts(count: number = 5) {
        const { data, error } = await supabase.rpc('get_top_selling_products', { limit_count: count });
        if (error) throw error;
        return data || [];
    },

    /**
     * Analytics: Fetch Category Performance
     */
    async getCategoryPerformance() {
        const { data, error } = await supabase.rpc('get_category_performance');
        if (error) throw error;
        return data || [];
    },


    /**
     * Analytics: Fetch Dashboard Summary Stats
     */
    async getDashboardStats() {
        const { data, error } = await supabase.rpc('get_admin_dashboard_stats');
        if (error) throw error;
        return data || { total_revenue: 0, total_orders: 0, total_customers: 0, revenue_trend: 0 };
    },

    /**
     * Archive Order - Hide from user view (set isarchived = true)
     */
    async archiveOrder(orderId: string) {
        try {
            const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || 'https://csyiiksxpmbehiiovlbg.supabase.co';
            const headers = await getAuthHeaders();

            const response = await fetch(
                `${SUPABASE_URL}/rest/v1/rpc/archive_order`,
                {
                    method: 'POST',
                    headers,
                    body: JSON.stringify({ p_order_id: orderId })
                }
            );

            if (!response.ok) {
                console.error("❌ Archive order RPC failed:", response.status);
                return { success: false };
            }

            const result = await response.json();
            return result;
        } catch (error) {
            console.error("❌ Failed to archive order:", error);
            return { success: false };
        }
    },

    /**
     * Add Review - Save rating and review text to order
     */
    async addReview(orderId: string, rating: number, reviewText: string) {
        try {
            const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || 'https://csyiiksxpmbehiiovlbg.supabase.co';
            const headers = await getAuthHeaders();

            const response = await fetch(
                `${SUPABASE_URL}/rest/v1/rpc/add_order_review`,
                {
                    method: 'POST',
                    headers,
                    body: JSON.stringify({
                        p_order_id: orderId,
                        p_rating: rating,
                        p_review_text: reviewText
                    })
                }
            );

            if (!response.ok) {
                console.error("❌ Add review RPC failed:", response.status);
                return { success: false };
            }

            const result = await response.json();
            return result;
        } catch (error) {
            console.error("❌ Failed to add review:", error);
            return { success: false };
        }
    },

    /**
     * Update Timeline - Add tracking event (Admin only)
     */
    async updateTimeline(orderId: string, status: string, message: string) {
        try {
            const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || 'https://csyiiksxpmbehiiovlbg.supabase.co';
            const headers = await getAuthHeaders();

            const response = await fetch(
                `${SUPABASE_URL}/rest/v1/rpc/update_order_timeline`,
                {
                    method: 'POST',
                    headers,
                    body: JSON.stringify({
                        p_order_id: orderId,
                        p_status: status,
                        p_message: message
                    })
                }
            );

            if (!response.ok) {
                console.error("❌ Update timeline RPC failed:", response.status);
                return { success: false };
            }

            const result = await response.json();
            return result;
        } catch (error) {
            console.error("❌ Failed to update timeline:", error);
            return { success: false };
        }
    },

    /**
     * Create Return Request - Save return request to database
     */
    async createReturn(orderId: string, _userId: string, _items: any[], reason: string, refundMethod: string = 'wallet') {
        try {
            const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || 'https://csyiiksxpmbehiiovlbg.supabase.co';
            const headers = await getAuthHeaders();

            const response = await fetch(
                `${SUPABASE_URL}/rest/v1/rpc/create_return_request`,
                {
                    method: 'POST',
                    headers: {
                        ...headers,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        p_order_id: orderId,
                        p_user_id: _userId,
                        p_items: _items,
                        p_reason: reason,
                        p_refund_method: refundMethod
                    })
                }
            );

            let result: any = { success: false };
            if (response.ok) {
                result = await response.json();
            }

            if (!response.ok || result.success === false) {
                console.error("❌ RPC create_return_request failed:", response.status, result);

                console.log("Attempting native insert fallback...");
                const returnId = `RET-${Date.now().toString().slice(-6)}`;
                const { error: fallbackError } = await supabase.from('returns').insert([{
                    id: returnId,
                    user_id: _userId,
                    orderid: orderId,
                    items: _items,
                    reason: reason,
                    method: refundMethod,
                    status: 'pending',
                    refund_amount: 0,
                    auto_decision: false
                }]);

                if (fallbackError) {
                    console.error("❌ Native fallback failed:", fallbackError);
                    return { success: false, message: fallbackError.message };
                }

                return { success: true, return_id: returnId };
            }

            return { success: true, return_id: typeof result.return_id === 'string' ? result.return_id : `RET-${Date.now().toString().slice(-6)}` };
        } catch (error) {
            console.error("❌ Failed to create return:", error);
            return { success: false };
        }
    }
};
