// Coupon validation — queries Supabase coupons table directly via fetch
// Admin creates coupons in admin/Coupons.tsx → stored in `coupons` table
// This file reads from that table in real-time

interface ValidateCouponResult {
    valid: boolean
    message: string
    discount?: number
    coupon?: any
}

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL as string;
const SUPABASE_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

export async function validateCoupon(
    code: string,
    subtotal: number
): Promise<ValidateCouponResult> {
    try {
        const cleanCode = code.toUpperCase().trim();

        // Direct REST query to content_manifests table (stealth view for coupons)
        const res = await fetch(
            `${SUPABASE_URL}/rest/v1/content_manifests?code=eq.${encodeURIComponent(cleanCode)}&isactive=eq.true&limit=1`,
            {
                headers: {
                    'apikey': SUPABASE_KEY,
                    'Authorization': `Bearer ${SUPABASE_KEY}`,
                    'Content-Type': 'application/json',
                }
            }
        );

        if (!res.ok) {
            throw new Error(`HTTP ${res.status}`);
        }

        const data = await res.json();
        const coupon = data && data.length > 0 ? data[0] : null;

        if (!coupon) {
            return { valid: false, message: 'Invalid or expired promo code' };
        }

        // Check if expired
        if (coupon.validuntil && new Date(coupon.validuntil) < new Date()) {
            return { valid: false, message: 'This coupon has expired' };
        }

        // Check usage limit
        if (coupon.usagelimit && coupon.usedcount >= coupon.usagelimit) {
            return { valid: false, message: 'Coupon usage limit reached' };
        }

        // Check minimum order value
        if (subtotal < (coupon.minordervalue || 0)) {
            return {
                valid: false,
                message: `Minimum order value for this coupon is Rs. ${coupon.minordervalue}`
            };
        }

        // Calculate discount
        let discount = 0;
        if (coupon.discounttype === 'percentage') {
            discount = (subtotal * coupon.discountvalue) / 100;
            if (coupon.maxdiscount && discount > coupon.maxdiscount) {
                discount = coupon.maxdiscount;
            }
        } else {
            discount = coupon.discountvalue;
        }

        // Ensure discount doesn't exceed subtotal
        if (discount > subtotal) discount = subtotal;
        discount = Math.round(discount);

        return {
            valid: true,
            message: `Coupon applied! You saved Rs. ${discount.toLocaleString('en-IN')}`,
            discount,
            coupon
        };
    } catch (err: any) {
        console.error('Coupon validation error:', err);
        return { valid: false, message: 'Error validating coupon. Try again.' };
    }
}

export async function incrementCouponUsage(couponId: string) {
    try {
        // Increment usedcount via PATCH
        await fetch(
            `${SUPABASE_URL}/rest/v1/content_manifests?id=eq.${couponId}`,
            {
                method: 'PATCH',
                headers: {
                    'apikey': SUPABASE_KEY,
                    'Authorization': `Bearer ${SUPABASE_KEY}`,
                    'Content-Type': 'application/json',
                    'Prefer': 'return=minimal'
                },
                body: JSON.stringify({ usedcount: undefined }) // use RPC below if available
            }
        );
        // Best effort — use Supabase RPC if PATCH doesn't auto-increment
        const { supabase } = await import('../lib/supabase');
        await supabase.rpc('increment_coupon_usage', { coupon_id: couponId });
    } catch (err) {
        console.error('Error incrementing coupon usage:', err);
    }
}
