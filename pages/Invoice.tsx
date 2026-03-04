import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Order } from '../types';

const Invoice: React.FC = () => {
    const { orderId } = useParams<{ orderId: string }>();
    const navigate = useNavigate();
    const [order, setOrder] = useState<Order | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOrder = async () => {
            if (orderId) {
                try {
                    // Try fetching using Supabase JS client
                    const { data, error } = await supabase
                        .from('orders')
                        .select('*')
                        .eq('id', orderId)
                        .single();

                    if (error) {
                        console.error("Error fetching order via JS client:", error);
                        // Fallback to fetch API if JS client hangs or errors
                        const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
                        const SUPABASE_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;
                        const response = await fetch(`${SUPABASE_URL}/rest/v1/orders?id=eq.${orderId}&select=*`, {
                            headers: {
                                'apikey': SUPABASE_KEY,
                                'Authorization': `Bearer ${SUPABASE_KEY}`
                            }
                        });
                        const resData = await response.json();
                        if (resData && resData.length > 0) {
                            const r = resData[0];
                            setOrder({
                                id: r.id,
                                date: new Date(r.created_at).toLocaleDateString(),
                                total: r.total,
                                status: r.status,
                                items: r.items,
                                shippingAddress: r.shipping_address,
                                paymentMethod: r.payment_method,
                                paymentStatus: r.payment_status,
                                isArchived: r.is_archived
                            } as unknown as Order);
                        }
                    } else if (data) {
                        setOrder({
                            id: data.id,
                            date: new Date(data.created_at).toLocaleDateString(),
                            total: data.total,
                            status: data.status,
                            items: data.items,
                            shippingAddress: data.shipping_address,
                            paymentMethod: data.payment_method,
                            paymentStatus: data.payment_status,
                            isArchived: data.is_archived
                        } as unknown as Order);
                    }
                } catch (err) {
                    console.error("Failed to fetch order", err);
                }
            }
            setLoading(false);
            return Promise.resolve();
        };

        fetchOrder();
    }, [orderId]);

    // Automatically trigger print when order is loaded
    useEffect(() => {
        if (order) {
            const timer = setTimeout(() => {
                window.print();
            }, 500);
            return () => clearTimeout(timer);
        }
        return undefined;
    }, [order]);

    if (loading) {
        return <div className="min-h-screen flex items-center justify-center bg-gray-50 text-gray-400">Loading Invoice...</div>;
    }

    if (!order) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 text-gray-800">
                <h1 className="text-2xl font-black mb-4">Invoice Not Found</h1>
                <p className="text-gray-500 mb-6">We couldn't locate the requested order.</p>
                <button onClick={() => navigate(-1)} className="bg-fario-purple text-white px-6 py-2 rounded-lg font-bold">Go Back</button>
            </div>
        );
    }

    const subTotal = order.items.reduce((acc, item) => acc + (item.price * item.quantity), 0);
    // Determine exact discount/tax applied backwards from total if needed, or re-calculate
    // Realistically, the stored `total` might already include taxes and discounts.
    // However, since we dynamically added tax to Checkout without modifying the `orders` schema,
    // let's assume `subTotal` was stored as the item sum, and `total` was stored as `finalTotal`.
    // Wait; if `order.total` from DB doesn't include the newly added tax, we must re-calculate for display.
    // For a real app, `taxAmount` should be saved in DB. For now, since `total` in Checkout is what's passed 
    // to `placeOrder`, `order.total` INCLUDES the tax.

    // Let's reverse engineer discount if possible, or just calculate tax on subtotal.
    const approximateTax = Math.round(subTotal * 0.18);
    const deliveryFee = 0; // Assuming standard for invoice display
    const discount = (subTotal + approximateTax + deliveryFee) - order.total;

    const formatPrice = (p: number) => `Rs. ${p.toLocaleString('en-IN')}`;

    const address = typeof order.shippingAddress === 'string'
        ? JSON.parse(order.shippingAddress)
        : order.shippingAddress;

    return (
        <div className="bg-white text-black min-h-screen w-full max-w-4xl mx-auto p-8 print:p-0 print:m-0 font-sans">
            {/* Action Bar - Hidden in Print */}
            <div className="print:hidden mb-8 flex justify-between items-center bg-gray-50 p-4 rounded-xl border border-gray-200">
                <button onClick={() => navigate(-1)} className="text-gray-600 font-bold px-4 py-2 hover:bg-gray-200 rounded-lg">← Back</button>
                <div className="space-x-4">
                    <button onClick={() => window.print()} className="bg-fario-purple text-white px-6 py-2 rounded-lg font-bold">Print / Download PDF</button>
                </div>
            </div>

            {/* A4 Invoice Container */}
            <div className="bg-white w-[210mm] min-h-[297mm] mx-auto p-[20mm] print:w-auto print:min-h-auto print:p-0 print:overflow-hidden relative shadow-2xl print:shadow-none">

                {/* Header */}
                <div className="flex justify-between items-start border-b-2 border-fario-purple pb-6 mb-8">
                    <div>
                        <h1 className="text-4xl font-black italic tracking-tighter text-fario-purple">FARIO</h1>
                        <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mt-1">fario.in</p>
                    </div>
                    <div className="text-right">
                        <h2 className="text-2xl font-black uppercase tracking-widest text-gray-800">Tax Invoice</h2>
                        <p className="text-sm font-bold text-gray-500 mt-1">Original for Recipient</p>
                    </div>
                </div>

                {/* Info Blocks */}
                <div className="grid grid-cols-2 gap-12 mb-8">
                    <div>
                        <h3 className="text-xs font-black uppercase tracking-widest text-gray-400 mb-2">Sold By</h3>
                        <p className="font-bold text-gray-900">Fario Retail Pvt. Ltd.</p>
                        <p className="text-sm text-gray-600 mt-1">123 eCommerce Axis, Tech Hub</p>
                        <p className="text-sm text-gray-600">Bengaluru, Karnataka, 560100</p>
                        <p className="text-sm text-gray-600 mt-1 font-medium">GSTIN: 29AABCF1234D1Z5</p>
                    </div>
                    <div>
                        <h3 className="text-xs font-black uppercase tracking-widest text-gray-400 mb-2">Billing & Shipping Address</h3>
                        <p className="font-bold text-gray-900">{address?.fullName || 'Customer'}</p>
                        <p className="text-sm text-gray-600 mt-1">{address?.addressLine1 || address?.addressLine || 'Address Data Unavailable'}</p>
                        <p className="text-sm text-gray-600">{address?.addressLine2 || ''}</p>
                        <p className="text-sm text-gray-600">{address?.city}, {address?.state} {address?.pincode || address?.zipCode}</p>
                        <p className="text-sm text-gray-600 mt-1">Ph: {address?.phone || address?.mobile}</p>
                    </div>
                </div>

                {/* Order Details */}
                <div className="flex justify-between bg-gray-50 p-4 rounded-lg border border-gray-100 mb-8 text-sm">
                    <div>
                        <p className="text-gray-500 text-xs font-bold uppercase mb-1">Order Number</p>
                        <p className="font-bold font-mono text-gray-900">{order.id}</p>
                    </div>
                    <div>
                        <p className="text-gray-500 text-xs font-bold uppercase mb-1">Order Date</p>
                        <p className="font-bold text-gray-900">{order.date}</p>
                    </div>
                    <div>
                        <p className="text-gray-500 text-xs font-bold uppercase mb-1">Payment Method</p>
                        <p className="font-bold text-gray-900">{order.paymentMethod === 'COD' ? 'Cash on Delivery' : 'Prepaid (Card/UPI)'}</p>
                    </div>
                </div>

                {/* Items Table */}
                <table className="w-full text-left mb-8 border-collapse">
                    <thead>
                        <tr className="border-b-2 border-gray-200">
                            <th className="py-3 px-2 text-xs font-black text-gray-400 uppercase tracking-widest">Sl No.</th>
                            <th className="py-3 px-2 text-xs font-black text-gray-400 uppercase tracking-widest">Description</th>
                            <th className="py-3 px-2 text-right text-xs font-black text-gray-400 uppercase tracking-widest">Qty</th>
                            <th className="py-3 px-2 text-right text-xs font-black text-gray-400 uppercase tracking-widest">Gross Amt</th>
                            <th className="py-3 px-2 text-right text-xs font-black text-gray-400 uppercase tracking-widest">Tax (18%)</th>
                            <th className="py-3 px-2 text-right text-xs font-black text-gray-400 uppercase tracking-widest">Net Amt</th>
                        </tr>
                    </thead>
                    <tbody className="text-sm">
                        {order.items.map((item, idx) => {
                            const itemGross = item.price * item.quantity;
                            const itemTax = Math.round(itemGross * 0.18);
                            return (
                                <tr key={idx} className="border-b border-gray-100 last:border-0">
                                    <td className="py-4 px-2 text-gray-500 font-medium">{idx + 1}</td>
                                    <td className="py-4 px-2">
                                        <p className="font-bold text-gray-900">{item.name}</p>
                                        <p className="text-xs text-gray-500">Size: {item.selectedSize} | Color: {(item as any).selectedColor || 'N/A'}</p>
                                    </td>
                                    <td className="py-4 px-2 text-right font-medium text-gray-700">{item.quantity}</td>
                                    <td className="py-4 px-2 text-right font-medium text-gray-700">{formatPrice(itemGross)}</td>
                                    <td className="py-4 px-2 text-right font-medium text-gray-700">{formatPrice(itemTax)}</td>
                                    <td className="py-4 px-2 text-right font-bold text-gray-900">{formatPrice(itemGross + itemTax)}</td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>

                {/* Total Summary */}
                <div className="flex justify-start pt-4 border-t-2 border-gray-200">
                    <div className="w-72 space-y-3 ml-2">
                        <div className="flex justify-between text-sm text-gray-600">
                            <span>Subtotal</span>
                            <span>{formatPrice(subTotal)}</span>
                        </div>
                        <div className="flex justify-between text-sm text-gray-600">
                            <span>IGST (18%)</span>
                            <span>{formatPrice(approximateTax)}</span>
                        </div>
                        {discount > 0 && Math.abs(discount) > 1 && (
                            <div className="flex justify-between text-sm text-emerald-600 font-bold">
                                <span>Discounts</span>
                                <span>-{formatPrice(discount)}</span>
                            </div>
                        )}
                        <div className="flex justify-between text-lg font-black text-gray-900 pt-3 border-t border-dashed border-gray-300">
                            <span>Grand Total</span>
                            <span>{formatPrice(order.total)}</span>
                        </div>
                    </div>
                </div>

                {/* Footer Signature */}
                <div className="absolute bottom-[20mm] right-[20mm] text-right print:bottom-0 print:right-0">
                    <div className="w-32 h-12 bg-gray-100 mb-2 rounded border border-gray-300 flex items-center justify-center font-black italic text-gray-300 text-xl overflow-hidden relative">
                        {/* Stamp simulation */}
                        <div className="absolute text-emerald-600/20 text-4xl -rotate-12 border-2 border-emerald-600/20 rounded-lg px-2 shadow-sm">VERIFIED</div>
                    </div>
                    <p className="text-xs font-bold text-gray-800">Authorized Signatory</p>
                    <p className="text-[10px] text-gray-500 mt-1">Fario Retail Pvt. Ltd.</p>
                </div>

                {/* fine print */}
                <div className="absolute bottom-[20mm] left-[20mm] print:bottom-0 print:left-0 w-1/2 text-[9px] text-gray-400">
                    <p className="font-bold mb-1 uppercase tracking-wider text-gray-500">Terms & Conditions</p>
                    <p>1. Returns accepted within 14 days of delivery. Keep tags attached.</p>
                    <p>2. This is a computer generated invoice and does not require a physical signature.</p>
                    <p>3. Goods sold are subject to local jurisdiction.</p>
                </div>

            </div>
        </div>
    );
};

export default Invoice;
