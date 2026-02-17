import { supabase } from '../lib/supabase';

export type LogAction =
    | 'user_login'
    | 'user_logout'
    | 'user_signup'
    | 'order_placed'
    | 'order_status_changed'
    | 'payment_completed'
    | 'wallet_credit'
    | 'wallet_debit'
    | 'return_requested'
    | 'return_approved'
    | 'return_rejected'
    | 'return_refunded'
    | 'product_added'
    | 'product_updated'
    | 'product_deleted'
    | 'stock_updated'
    | 'review_posted'
    | 'review_deleted'
    | 'profile_updated'
    | 'address_added'
    | 'address_deleted'
    | 'wishlist_added'
    | 'wishlist_removed'
    | 'admin_action'
    | 'admin_login_success'
    | 'contact_inquiry';

/**
 * Logs a specific action to the Supabase 'logs' table.
 * Does not throw errors to ensure app flow is not interrupted by logging failures.
 */
export async function logAction(
    action: LogAction,
    details: Record<string, any> = {},
    userId?: string
) {
    try {
        const { data: { user } } = await supabase.auth.getUser();

        const { error } = await supabase.from('logs').insert({
            user_id: userId || user?.id,
            action,
            details,
            created_at: new Date().toISOString()
        });

        if (error) {
            console.warn(`[LogService] Supabase insert failed for action "${action}":`, error.message);
        }
    } catch (error) {
        console.warn(`[LogService] Failed to log action "${action}":`, error);
    }
}
