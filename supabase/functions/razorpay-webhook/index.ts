// @ts-nocheck
// supabase/functions/razorpay-webhook/index.ts

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { crypto } from 'https://deno.land/std@0.168.0/crypto/mod.ts';

serve(async (req) => {
    try {
        const signature = req.headers.get('x-razorpay-signature');
        const body = await req.text();

        // Verify signature
        const secret = Deno.env.get('RAZORPAY_WEBHOOK_SECRET')!;
        const expectedSignature = await crypto.subtle.sign(
            'HMAC',
            await crypto.subtle.importKey(
                'raw',
                new TextEncoder().encode(secret),
                { name: 'HMAC', hash: 'SHA-256' },
                false,
                ['sign']
            ),
            new TextEncoder().encode(body)
        );

        const isValid = signature === Array.from(new Uint8Array(expectedSignature))
            .map(b => b.toString(16).padStart(2, '0'))
            .join('');

        if (!isValid) {
            return new Response('Invalid signature', { status: 401 });
        }

        const event = JSON.parse(body);

        // Handle payment success
        if (event.event === 'payment.captured') {
            const supabase = createClient(
                Deno.env.get('SUPABASE_URL')!,
                Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
            );

            await supabase
                .from('orders')
                .update({
                    payment_status: 'completed',
                    razorpay_payment_id: event.payload.payment.entity.id,
                })
                .eq('razorpay_order_id', event.payload.payment.entity.order_id);
        }

        return new Response(JSON.stringify({ received: true }), {
            headers: { 'Content-Type': 'application/json' },
        });
    } catch (error: any) {
        return new Response(JSON.stringify({ error: error.message }), {
            status: 500,
        });
    }
});
