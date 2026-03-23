import React, { useState } from 'react';
import { HelpCircle, MessageCircle, ChevronDown, ChevronUp, Mail, Phone, ExternalLink } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const ProfileHelp: React.FC = () => {
    const [openFaq, setOpenFaq] = useState<number | null>(0);

    const toggleFaq = (index: number) => {
        setOpenFaq(prev => prev === index ? null : index);
    };

    const handleContact = (method: string) => {
        alert(`Opening ${method} support...`);
    };

    const faqs = [
        { q: "Where is my order?", a: "You can track your order in real-time from the 'Your Orders' tab. We provide live updates throughout the delivery journey." },
        { q: "How do I return an item?", a: "Returns are easy! Go to 'Your Orders', select the item you wish to return, and click 'Return Item'. A pickup agent will come to your doorstep." },
        { q: "Payment deducted but order failed?", a: "Don't worry. If money was deducted for a failed order, it is automatically refunded to your source account within 5-7 business days." },
        { q: "Can I change my delivery address?", a: "Yes, you can update your address before the order is 'Out for Delivery'. Go to Orders > Manage > Change Address." }
    ];

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="flex items-center justify-between pb-4 border-b border-gray-100">
                <div>
                    <h2 className="text-2xl font-black text-gray-900 tracking-tight flex items-center gap-2">
                        Help Center <HelpCircle className="text-fario-purple" size={24} strokeWidth={2.5} />
                    </h2>
                    <p className="text-sm text-gray-500 font-medium">24/7 Support for your orders</p>
                </div>
            </div>

            {/* Support Actions */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div onClick={() => handleContact('Live Chat')} className="bg-white p-6 rounded-xl border border-gray-200 text-center hover:border-fario-purple/30 group transition-all cursor-pointer hover:shadow-lg">
                    <div className="w-12 h-12 bg-purple-50 text-fario-purple rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                        <MessageCircle size={24} />
                    </div>
                    <h3 className="font-bold text-gray-900 mb-1">Live Chat</h3>
                    <p className="text-xs text-gray-500 mb-4">Connect with an agent instanty</p>
                    <span className="text-sm font-bold text-fario-purple hover:underline flex items-center justify-center gap-1">Start Chat <ExternalLink size={12} /></span>
                </div>
                <div onClick={() => handleContact('Email')} className="bg-white p-6 rounded-xl border border-gray-200 text-center hover:border-fario-purple/30 group transition-all cursor-pointer hover:shadow-lg">
                    <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                        <Mail size={24} />
                    </div>
                    <h3 className="font-bold text-gray-900 mb-1">Email Us</h3>
                    <p className="text-xs text-gray-500 mb-4">Get a response within 24hrs</p>
                    <span className="text-sm font-bold text-blue-600 hover:underline flex items-center justify-center gap-1">Write Email <ExternalLink size={12} /></span>
                </div>
                <div onClick={() => handleContact('Phone')} className="bg-white p-6 rounded-xl border border-gray-200 text-center hover:border-fario-purple/30 group transition-all cursor-pointer hover:shadow-lg">
                    <div className="w-12 h-12 bg-green-50 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                        <Phone size={24} />
                    </div>
                    <h3 className="font-bold text-gray-900 mb-1">Callback</h3>
                    <p className="text-xs text-gray-500 mb-4">Request a call from our team</p>
                    <span className="text-sm font-bold text-green-600 hover:underline flex items-center justify-center gap-1">Request Call <ExternalLink size={12} /></span>
                </div>
            </div>

            {/* FAQs */}
            <div>
                <h3 className="font-bold text-lg text-gray-900 mb-4">Frequently Asked Questions</h3>
                <div className="space-y-3">
                    {faqs.map((item, i) => (
                        <div key={i} className="bg-white border border-gray-200 rounded-xl overflow-hidden">
                            <button
                                onClick={() => toggleFaq(i)}
                                className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50 transition-colors"
                            >
                                <span className="font-bold text-gray-700 text-sm">{item.q}</span>
                                {openFaq === i ? <ChevronUp size={18} className="text-gray-900" /> : <ChevronDown size={18} className="text-gray-400" />}
                            </button>
                            <AnimatePresence>
                                {openFaq === i && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: "auto", opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        className="bg-gray-50 border-t border-gray-100"
                                    >
                                        <p className="p-4 text-sm text-gray-600 leading-relaxed font-medium">
                                            {item.a}
                                        </p>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};
