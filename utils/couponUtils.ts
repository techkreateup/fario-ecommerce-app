import { supabase } from '../lib/supabase'

interface ValidateCouponResult {
    valid: boolean
    message: string
    discount?: number
    coupon?: any
}

export async function validateCoupon(
    code: string,
    subtotal: number
): Promise<ValidateCouponResult> {
    try {
        // Fetch coupon from database via Stealth RPC (adblock bypass)
        const { data, error } = await supabase
            .rpc('verify_promo_access', { lookup_code: code.toUpperCase().trim() });

        if (error) throw error;

        // RPC returns an array, so we check the first item
        const coupon = data && data.length > 0 ? data[0] : null;

        if (!coupon) {
            return { valid: false, message: 'Invalid or expired promo code' }
        }

        // Check if expired
        if (coupon.validuntil && new Date(coupon.validuntil) < new Date()) {
            return { valid: false, message: 'Coupon has expired' }
        }

        // Check usage limit
        if (coupon.usagelimit && coupon.usedcount >= coupon.usagelimit) {
            return { valid: false, message: 'Coupon usage limit reached' }
        }

        // Check minimum order value
        if (subtotal < coupon.minordervalue) {
            return {
                valid: false,
                message: `Minimum order value for this coupon is ₹${coupon.minordervalue}`
            }
        }

        // Calculate discount
        let discount = 0
        if (coupon.discounttype === 'percentage') {
            discount = (subtotal * coupon.discountvalue) / 100
            if (coupon.maxdiscount && discount > coupon.maxdiscount) {
                discount = coupon.maxdiscount
            }
        } else {
            discount = coupon.discountvalue
        }

        // Ensure discount doesn't exceed subtotal
        if (discount > subtotal) {
            discount = subtotal;
        }

        return {
            valid: true,
            message: `Coupon applied! You saved ₹${discount.toFixed(2)}`,
            discount: discount,
            coupon: coupon
        }
    } catch (err: any) {
        console.error('Coupon validation error:', err);
        return { valid: false, message: 'Error validating coupon' }
    }
}

export async function incrementCouponUsage(couponId: string) {
    try {
        await supabase.rpc('increment_coupon_usage', { coupon_id: couponId })
    } catch (err) {
        console.error('Error incrementing coupon usage:', err)
    }
}
