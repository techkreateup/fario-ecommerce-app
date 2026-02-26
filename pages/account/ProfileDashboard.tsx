import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    User, Package, CreditCard, Key, Heart, Settings, HelpCircle,
    LogOut, Bell, ShoppingCart, Search, Filter, MapPin,
    ChevronRight, Plus, Trash2, X, Menu, CheckCircle2,
    Truck, LayoutGrid, ShieldCheck, Mail, DollarSign,
    ArrowRight, Smartphone, Lock, Star, Sparkles, RefreshCw,
    MoreVertical, Edit2, AlertCircle, Copy, ExternalLink, Calendar, RotateCcw,
    Gift, Home, Briefcase
} from 'lucide-react';
import { useCart } from '../../context/CartProvider';
import { useToast } from '../../context/ToastContext';
import { useNavigate } from 'react-router-dom';
import { PRODUCTS, EnhancedProduct } from '../../constants';
// Reusing types if possible, but defining local interfaces for dashboard specifics
import { Skeleton } from '../../components/ui/Skeleton';
import { Order, Product } from '../../types';

// --- MOCKS & CONSTANTS ---

const USER_PROFILE = {
    name: 'Akash Sundar',
    email: 'akash.sundar@fario.com',
    phone: '+91 98765 43210',
    tier: 'Platinum',
    avatar: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=200&h=200&fit=crop',
    memberSince: '2023'
};

const STATS = [
    { label: 'Total Orders', value: '42', icon: Package, color: 'bg-blue-100 text-blue-600' },
    { label: 'Returns', value: '2', icon: RotateCcw, color: 'bg-orange-100 text-orange-600' },
    { label: 'Savings', value: 'Rs. 12k', icon: DollarSign, color: 'bg-green-100 text-green-600' },
    { label: 'Fario Cash', value: 'Rs. 1,500', icon: WalletIcon, color: 'bg-fario-purple/10 text-fario-purple' } // Custom icon below
];

function WalletIcon(props: any) {
    return <CreditCard {...props} />;
}

// Timeline Stages
const TIMELINE_STEPS = [
    { id: 'placed', label: 'Order Placed', icon: ShoppingCart },
    { id: 'processing', label: 'Processing', icon: Package },
    { id: 'shipped', label: 'Shipped', icon: Truck },
    { id: 'out_for_delivery', label: 'Out for Delivery', icon: MapPin },
    { id: 'delivered', label: 'Delivered', icon: CheckCircle2 }
];

const FAQS = [
    { q: "Where is my order?", a: "You can track your order in the 'Orders' tab. We provide real-time updates." },
    { q: "How do I return an item?", a: "Go to 'Orders', select the item, and click 'Return'. Pickup is free." },
    { q: "Benefits of Platinum?", a: "Free shipping, priority support, and early access to sales." },
    { q: "Can I change my address?", a: "Yes, manage your saved addresses in the 'Addresses' tab." }
];

// --- MAIN COMPONENT ---

const ProfileDashboard: React.FC = () => {
    const navigate = useNavigate();
    const toast = useToast();
    const { cartCount, savedItems: wishlistItems, removeFromSaved: removeFromWishlist, addToCart, orders } = useCart();

    // Local State
    const [activeTab, setActiveTab] = useState<'overview' | 'orders' | 'returns' | 'vault' | 'addresses' | 'payments' | 'settings' | 'help'>('overview');
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [userProfile, setUserProfile] = useState<any>(USER_PROFILE); // Fallback to default
    const [selectedOrder, setSelectedOrder] = useState<any>(null); // For timeline modal
    const [showLogoutAlert, setShowLogoutAlert] = useState(false);

    const [isLoading, setIsLoading] = useState(true);

    // Sync / Auth Check
    useEffect(() => {
        const checkAuth = () => {
            const token = localStorage.getItem('fario_auth_token');
            const storedProfile = localStorage.getItem('fario_user_profile');

            // Simulate network delay for skeleton demo (remove in prod if not needed)
            setTimeout(() => setIsLoading(false), 800);

            if (token) {
                setIsAuthenticated(true);
                if (storedProfile) {
                    try {
                        setUserProfile({ ...USER_PROFILE, ...JSON.parse(storedProfile) });
                    } catch (e) {
                        console.error("Failed to parse profile", e);
                    }
                }
            } else {
                setIsAuthenticated(false);
                setUserProfile(USER_PROFILE); // Reset to default/mock
                if (activeTab !== 'overview' && activeTab !== 'help') {
                    setActiveTab('overview');
                }
            }
        };

        window.addEventListener('storage', checkAuth);
        checkAuth(); // Initial check

        return () => window.removeEventListener('storage', checkAuth);
    }, [activeTab]);

    // --- SUB-VIEWS ---

    const renderOverview = () => (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* Welcome Banner */}
            <div className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-3xl p-8 text-white relative overflow-hidden shadow-xl">
                <div className="absolute top-0 right-0 p-12 opacity-10 transform translate-x-10 -translate-y-10">
                    <Sparkles size={120} />
                </div>
                <div className="relative z-10">
                    <h2 className="text-3xl font-black tracking-tight mb-2">
                        Welcome back, {isAuthenticated ? userProfile.name.split(' ')[0] : 'Explorer'}! 👋
                    </h2>
                    <p className="text-gray-300 max-w-lg mb-6 text-lg">
                        {isAuthenticated
                            ? "You have 3 items in your cart and 2 offers waiting for you."
                            : "Sign in to unlock your Platinum benefits and manage your orders."
                        }
                    </p>
                    {!isAuthenticated && (
                        <button onClick={() => navigate('/login')} className="bg-white text-gray-900 px-6 py-3 rounded-xl font-bold uppercase tracking-widest hover:bg-gray-100 transition-colors">
                            Sign In Now
                        </button>
                    )}
                </div>
            </div>

            {/* Stats Grid */}
            {isLoading ? (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[1, 2, 3, 4].map(i => (
                        <div key={i} className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
                            <Skeleton className="w-10 h-10 rounded-full mb-3" />
                            <Skeleton className="h-4 w-20 mb-2" />
                            <Skeleton className="h-8 w-16" />
                        </div>
                    ))}
                </div>
            ) : isAuthenticated && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {STATS.map((stat, i) => (
                        <motion.div
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: i * 0.1 }}
                            key={i}
                            className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow"
                        >
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-3 ${stat.color}`}>
                                <stat.icon size={20} />
                            </div>
                            <p className="text-gray-500 text-sm font-bold uppercase tracking-wider">{stat.label}</p>
                            <p className="text-2xl font-black text-gray-900">{stat.value}</p>
                        </motion.div>
                    ))}
                </div>
            )}

            {/* Recent Orders Preview */}
            {isAuthenticated && orders.length > 0 && (
                <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-xl font-black text-gray-900">Recent Order</h3>
                        <button onClick={() => setActiveTab('orders')} className="text-fario-purple font-bold text-sm hover:underline">View All</button>
                    </div>

                    <div className="flex gap-4 items-center">
                        <div className="w-20 h-20 bg-gray-50 rounded-xl p-2 border border-gray-200">
                            <img src={orders[0].items[0].image} className="w-full h-full object-contain mix-blend-multiply" alt="" />
                        </div>
                        <div className="flex-1">
                            <div className="flex justify-between">
                                <h4 className="font-bold text-gray-900">{orders[0].items[0].name}</h4>
                                <span className="text-sm font-bold text-gray-900">Rs. {orders[0].total.toLocaleString()}</span>
                            </div>
                            <p className="text-sm text-gray-500 mb-2">Order #{orders[0].id} • {orders[0].date}</p>
                            <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wide ${orders[0].status === 'Delivered' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'
                                }`}>
                                {orders[0].status === 'Delivered' ? <CheckCircle2 size={12} /> : <Truck size={12} />}
                                {orders[0].status}
                            </span>
                        </div>
                    </div>
                </div>
            )}

            {/* Recommendations Carousel */}
            <div className="bg-indigo-50/50 rounded-3xl p-6 border border-indigo-100">
                <h3 className="text-xl font-black text-gray-900 mb-6 flex items-center gap-2">
                    <Sparkles className="text-fario-purple" size={20} /> Recommended for You
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {PRODUCTS.slice(4, 8).map(p => (
                        <div key={p.id} className="bg-white p-4 rounded-2xl border border-gray-100 hover:shadow-lg transition-all group cursor-pointer" onClick={() => navigate(`/products/${p.id}`)}>
                            <div className="aspect-square bg-gray-50 rounded-xl mb-3 p-2 overflow-hidden">
                                <img src={p.image} className="w-full h-full object-contain mix-blend-multiply group-hover:scale-110 transition-transform" alt={p.name} />
                            </div>
                            <p className="font-bold text-gray-900 text-sm truncate">{p.name}</p>
                            <p className="text-fario-purple font-black text-sm">Rs. {p.price.toLocaleString()}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );

    const renderOrders = () => {
        // Generate dummy timeline for tracking if missing
        const getTimeline = (status: string) => {
            const stepIndex = TIMELINE_STEPS.findIndex(s => s.label.toLowerCase() === status.toLowerCase());
            const targetIndex = stepIndex === -1 ? (status === 'Delivered' ? 4 : 1) : stepIndex;
            return TIMELINE_STEPS.map((step, idx) => ({
                ...step,
                completed: idx <= targetIndex,
                current: idx === targetIndex
            }));
        };

        return (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
                    <div>
                        <h2 className="text-2xl font-black text-gray-900">Your Orders</h2>
                        <p className="text-gray-500">Track, return, or buy things again.</p>
                    </div>
                    <div className="relative w-full md:w-64">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                        <input type="text" placeholder="Search orders..." className="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-xl text-sm font-medium focus:outline-none focus:border-fario-purple" />
                    </div>
                </div>

                {isAuthenticated && orders.map((order, idx) => (
                    <div key={order.id} className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                        <div className="bg-gray-50/50 p-4 border-b border-gray-100 flex flex-wrap gap-4 md:gap-8 justify-between items-center text-sm">
                            <div>
                                <span className="block text-gray-500 uppercase text-[10px] font-bold tracking-wider">Order Placed</span>
                                <span className="font-bold text-gray-900">{order.date}</span>
                            </div>
                            <div>
                                <span className="block text-gray-500 uppercase text-[10px] font-bold tracking-wider">Total</span>
                                <span className="font-bold text-gray-900">Rs. {order.total.toLocaleString()}</span>
                            </div>
                            <div>
                                <span className="block text-gray-500 uppercase text-[10px] font-bold tracking-wider">Order #</span>
                                <span className="font-bold text-gray-900">{order.id}</span>
                            </div>
                            <div className="flex-1 md:text-right">
                                <button
                                    onClick={() => navigate(`/info/invoices`)} // Dummy link
                                    className="text-fario-purple font-bold hover:underline"
                                >
                                    Invoice
                                </button>
                            </div>
                        </div>

                        <div className="p-6">
                            <div className="flex flex-col md:flex-row gap-6">
                                <div className="flex-1">
                                    <h3 className="font-black text-lg text-gray-900 mb-1">{order.status}</h3>
                                    <p className="text-gray-500 text-sm mb-4">Package was handled by Fario Express</p>

                                    <div className="flex flex-col gap-4">
                                        {order.items.map((item, i) => (
                                            <div key={i} className="flex gap-4 items-center">
                                                <div className="w-16 h-16 border rounded-lg p-1 bg-white flex-shrink-0">
                                                    <img src={item.image} className="w-full h-full object-contain" alt="" />
                                                </div>
                                                <div className="flex-1">
                                                    <p className="font-bold text-gray-900 line-clamp-1">{item.name}</p>
                                                    <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                                                    <button onClick={() => navigate(`/products/${item.id}`)} className="text-fario-purple text-xs font-bold hover:underline mt-1 uppercase tracking-wide">Buy it again</button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="flex flex-col gap-3 min-w-[200px]">
                                    <button
                                        onClick={() => setSelectedOrder({ ...order, timeline: getTimeline(order.status) })}
                                        className="w-full py-3 bg-fario-purple text-white rounded-xl font-bold text-sm shadow-md hover:bg-fario-teal transition-colors"
                                    >
                                        Track Package
                                    </button>
                                    {order.status === 'Delivered' && (
                                        <button onClick={() => navigate('/returns')} className="w-full py-3 bg-white border border-gray-200 text-gray-900 rounded-xl font-bold text-sm hover:bg-gray-50 transition-colors">
                                            Return Items
                                        </button>
                                    )}
                                    <button className="w-full py-3 bg-white border border-gray-200 text-gray-900 rounded-xl font-bold text-sm hover:bg-gray-50 transition-colors">
                                        Leave Seller Feedback
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}

                {!isAuthenticated && (
                    <div className="text-center py-20">
                        <Package className="mx-auto text-gray-300 mb-4" size={48} />
                        <p className="text-gray-500">Please sign in to view your orders.</p>
                    </div>
                )}
            </div>
        );
    };

    const renderVault = () => (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-black text-gray-900">The Vault <span className="text-gray-400 font-medium text-lg ml-2">({wishlistItems.length})</span></h2>
            </div>

            {isAuthenticated && wishlistItems.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {wishlistItems.map(item => (
                        <div key={item.id} className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex flex-col relative group hover:border-fario-purple/30 transition-all">
                            <button
                                onClick={() => removeFromWishlist(item.id)}
                                className="absolute top-4 right-4 text-gray-300 hover:text-red-500 transition-colors"
                            >
                                <X size={18} />
                            </button>

                            <div className="w-full h-40 bg-gray-50 rounded-xl mb-4 p-4 flex items-center justify-center">
                                <img src={item.image} className="max-h-full max-w-full object-contain mix-blend-multiply group-hover:scale-105 transition-transform" alt="" />
                            </div>

                            <div className="flex-1 mb-4">
                                <h4 className="font-bold text-gray-900 line-clamp-2 mb-1">{item.name}</h4>
                                <div className="flex items-center gap-2">
                                    <p className="text-xl font-black text-fario-purple">Rs. {item.price.toLocaleString()}</p>
                                    {item.price > 1000 && <span className="text-xs text-gray-400 line-through">Rs. {(item.price * 1.2).toFixed(0)}</span>}
                                </div>
                                <div className="flex items-center gap-1 mt-2 text-xs font-bold text-yellow-500">
                                    <Star size={12} fill="currentColor" /> {item.rating} <span className="text-gray-400">({item.reviewsCount} reviews)</span>
                                </div>
                            </div>

                            <button
                                onClick={() => { addToCart(item, "Default"); removeFromWishlist(item.id); }}
                                className="w-full py-3 bg-gray-900 text-white rounded-xl font-bold uppercase tracking-wider text-xs hover:bg-black transition-colors flex items-center justify-center gap-2"
                            >
                                <ShoppingCart size={14} /> Move to Cart
                            </button>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-gray-200">
                    <Heart className="mx-auto text-gray-300 mb-4" size={48} />
                    <p className="text-gray-500 font-medium mb-4">Your vault is empty.</p>
                    <button onClick={() => navigate('/products')} className="text-fario-purple font-bold hover:underline">Explore Products</button>
                </div>
            )}
        </div>
    );

    const renderAddresses = () => (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-black text-gray-900">Saved Addresses</h2>
                <button onClick={() => toast.info("Address modification is available during checkout.")} className="flex items-center gap-2 px-4 py-2 bg-fario-purple text-white rounded-xl font-bold text-sm shadow-md hover:bg-fario-teal transition-colors">
                    <Plus size={16} /> Add New
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Mock Addresses */}
                {isAuthenticated && [1, 2].map((i) => (
                    <div key={i} className="bg-white p-6 rounded-2xl border-2 border-gray-100 relative group">
                        {i === 1 && (
                            <span className="absolute top-4 right-4 bg-gray-100 text-gray-600 px-2 py-1 rounded text-[10px] font-black uppercase tracking-wider">Default</span>
                        )}
                        <div className="flex items-center gap-2 mb-4 font-bold text-gray-900">
                            <Briefcase size={16} className="text-gray-400" /> {i === 1 ? 'Work' : 'Home'}
                        </div>
                        <p className="font-bold text-gray-900 mb-1">{userProfile.name}</p>
                        <p className="text-gray-500 text-sm mb-4 leading-relaxed">
                            {i === 1 ? 'Bannari Amman Institute, Alathukombai Post' : '15, Gandhi Road, Adyar'} <br />
                            {i === 1 ? 'Sathyamangalam, TN 638401' : 'Chennai, TN 600020'} <br />
                            India <br />
                            Phone: {userProfile.phone}
                        </p>
                        <div className="flex gap-4 text-xs font-bold text-gray-400">
                            <button className="hover:text-fario-purple transition-colors">Edit</button>
                            <button className="hover:text-red-500 transition-colors">Remove</button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );

    const renderSettings = () => (
        <div className="max-w-2xl bg-white rounded-3xl border border-gray-100 p-8 animate-in fade-in duration-500">
            <h2 className="text-2xl font-black text-gray-900 mb-8">Account Settings</h2>

            <div className="space-y-8">
                <section>
                    <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-4">Personal Profile</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-gray-900">Full Name</label>
                            <div className="flex gap-2">
                                <input type="text" value={userProfile.name} disabled className="w-full p-3 bg-gray-50 rounded-xl border border-gray-200 text-gray-500 font-medium" />
                                <button className="p-3 hover:bg-gray-100 rounded-xl text-fario-purple"><Edit2 size={18} /></button>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-gray-900">Email Address</label>
                            <div className="flex gap-2">
                                <input type="text" value={userProfile.email} disabled className="w-full p-3 bg-gray-50 rounded-xl border border-gray-200 text-gray-500 font-medium" />
                            </div>
                        </div>
                    </div>
                </section>

                <div className="h-px bg-gray-100" />

                <section>
                    <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-4">Security</h3>
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl mb-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-white rounded-lg border border-gray-200"><Key size={20} className="text-fario-purple" /></div>
                            <div>
                                <p className="font-bold text-gray-900">Password</p>
                                <p className="text-xs text-gray-500">Last changed 3 months ago</p>
                            </div>
                        </div>
                        <button className="text-xs font-bold bg-white border border-gray-200 px-4 py-2 rounded-lg hover:border-gray-900 transition-colors">Update</button>
                    </div>
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-white rounded-lg border border-gray-200"><ShieldCheck size={20} className="text-green-600" /></div>
                            <div>
                                <p className="font-bold text-gray-900">Two-Factor Auth</p>
                                <p className="text-xs text-gray-500">Protect your account</p>
                            </div>
                        </div>
                        <div className="relative inline-block w-10 mr-2 align-middle select-none transition duration-200 ease-in">
                            <input type="checkbox" className="toggle-checkbox absolute block w-5 h-5 rounded-full bg-white border-4 appearance-none cursor-pointer border-gray-300" />
                            <label className="toggle-label block overflow-hidden h-5 rounded-full bg-gray-300 cursor-pointer"></label>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );

    const renderHelp = () => (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-in fade-in duration-500">
            <div className="lg:col-span-2 space-y-6">
                <h2 className="text-2xl font-black text-gray-900">Help & Support</h2>
                <div className="space-y-4">
                    {FAQS.map((faq, i) => (
                        <div key={i} className="bg-white p-6 rounded-2xl border border-gray-100 hover:border-fario-purple/30 transition-colors">
                            <h4 className="font-bold text-gray-900 mb-2 flex items-start gap-3">
                                <HelpCircle size={20} className="text-fario-purple shrink-0 mt-0.5" />
                                {faq.q}
                            </h4>
                            <p className="text-gray-500 text-sm ml-8 leading-relaxed">{faq.a}</p>
                        </div>
                    ))}
                </div>
            </div>

            <div className="space-y-6">
                <div className="bg-fario-purple text-white p-8 rounded-3xl shadow-xl shadow-fario-purple/20 relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-8 opacity-10"><Mail size={80} /></div>
                    <h3 className="text-xl font-black mb-2 relative z-10">Need more help?</h3>
                    <p className="text-purple-100 text-sm mb-6 relative z-10">Our priority support team is available 24/7 for Platinum members.</p>
                    <button
                        onClick={() => toast.success("Ticket #1234 Created! Support will contact you shortly.")}
                        className="w-full py-3 bg-white text-fario-purple rounded-xl font-bold uppercase tracking-widest text-xs hover:bg-gray-100 transition-colors relative z-10"
                    >
                        Create Support Ticket
                    </button>
                </div>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-[#F8F9FB] font-sans">
            {/* --- TOP BAR --- */}
            <nav className="sticky top-0 z-40 bg-white/80 backdrop-blur-xl border-b border-gray-200 shadow-sm">
                <div className="max-w-7xl mx-auto px-4 md:px-8 h-20 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <button className="md:hidden p-2 text-gray-600" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
                            {isMobileMenuOpen ? <X /> : <Menu />}
                        </button>
                        <h1 className="text-2xl font-black italic tracking-tighter text-gray-900 hidden md:block" style={{ fontFamily: 'Montserrat' }}>
                            Your Account
                        </h1>
                    </div>

                    <div className="flex items-center gap-6">
                        {isAuthenticated && (
                            <div className="flex items-center gap-3 bg-gray-50 py-1.5 px-3 rounded-full border border-gray-100">
                                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-fario-purple to-fario-teal p-0.5">
                                    <img src={userProfile.avatar} className="w-full h-full rounded-full object-cover border-2 border-white" alt="Avatar" />
                                </div>
                                <div className="hidden md:block">
                                    <p className="text-xs font-bold text-gray-900 leading-none">{userProfile.name}</p>
                                    <p className="text-[10px] font-bold text-fario-purple uppercase tracking-wider">{userProfile.tier || 'Platinum'}</p>
                                </div>
                            </div>
                        )}

                        <div className="relative">
                            <Bell size={22} className="text-gray-400 hover:text-gray-900 transition-colors cursor-pointer" />
                            <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-[10px] font-bold flex items-center justify-center rounded-full border-2 border-white">3</span>
                        </div>

                        {isAuthenticated && (
                            <button onClick={() => setShowLogoutAlert(true)} className="flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-red-600 transition-colors">
                                <div className="p-2 bg-gray-50 rounded-full hover:bg-red-50 transition-colors">
                                    <LogOut size={18} />
                                </div>
                            </button>
                        )}
                    </div>
                </div>
            </nav>

            <div className="max-w-7xl mx-auto px-4 md:px-8 py-8 flex items-start gap-8 relative">

                {/* --- SIDEBAR --- */}
                <aside className={`fixed md:sticky md:top-28 inset-y-0 left-0 bg-white md:bg-transparent z-30 w-64 p-6 md:p-0 border-r md:border-none border-gray-200 transition-transform duration-300 md:transform-none ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                    <div className="space-y-1">
                        {[
                            { id: 'overview', label: 'Overview', icon: LayoutGrid },
                            { id: 'orders', label: 'Your Orders', icon: Package },
                            { id: 'returns', label: 'Returns & Exchanges', icon: RotateCcw },
                            { id: 'vault', label: 'The Vault', icon: Heart },
                            { id: 'addresses', label: 'Addresses', icon: MapPin },
                            { id: 'payments', label: 'Wallet & Cards', icon: CreditCard },
                            { id: 'settings', label: 'Settings', icon: Settings },
                            { id: 'help', label: 'Help', icon: HelpCircle },
                        ].map((item) => (
                            <button
                                key={item.id}
                                disabled={!isAuthenticated && item.id !== 'overview' && item.id !== 'help'}
                                onClick={() => { setActiveTab(item.id as any); setIsMobileMenuOpen(false); }}
                                className={`w-full flex items-center gap-4 p-4 rounded-xl font-bold transition-all ${activeTab === item.id
                                    ? 'bg-fario-purple text-white shadow-lg shadow-fario-purple/20'
                                    : (!isAuthenticated && item.id !== 'overview' && item.id !== 'help')
                                        ? 'text-gray-300 cursor-not-allowed'
                                        : 'text-gray-500 hover:bg-white hover:text-gray-900'
                                    }`}
                            >
                                <item.icon size={20} />
                                <span>{item.label}</span>
                                {!isAuthenticated && item.id !== 'overview' && item.id !== 'help' && <Lock size={14} className="ml-auto opacity-50" />}
                            </button>
                        ))}
                    </div>

                    {!isAuthenticated && (
                        <div className="mt-8 p-4 bg-gray-900 text-white rounded-2xl">
                            <p className="text-sm font-bold mb-3">Join Fario Platinum</p>
                            <button onClick={() => navigate('/login')} className="w-full py-2 bg-white text-black rounded-lg font-bold text-xs uppercase tracking-wider">
                                Login / Sign Up
                            </button>
                        </div>
                    )}
                </aside>

                {/* --- MAIN CONTENT --- */}
                <main className="flex-1 min-h-[600px] pb-20">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={activeTab}
                            initial={{ opacity: 0, x: 10 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -10 }}
                            transition={{ duration: 0.2 }}
                        >
                            {activeTab === 'overview' && renderOverview()}
                            {activeTab === 'orders' && renderOrders()}
                            {activeTab === 'returns' && (
                                <div className="space-y-6 animate-in fade-in duration-500">
                                    <h2 className="text-2xl font-black text-gray-900">Returns & Exchanges</h2>
                                    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                                        <div className="p-4 border-b border-gray-200 bg-gray-50/50">
                                            <h3 className="font-bold text-gray-900">Eligible for Return</h3>
                                        </div>
                                        <div className="divide-y divide-gray-100">
                                            {orders.filter(o => o.status === 'Delivered').length > 0 ? (
                                                orders.filter(o => o.status === 'Delivered').map((order) => (
                                                    <div key={order.id} className="p-4 hover:bg-gray-50 transition-colors">
                                                        <div className="flex gap-4">
                                                            <img src={order.items[0].image} className="w-16 h-16 object-contain border border-gray-100 rounded-md bg-white" alt="" />
                                                            <div className="flex-1">
                                                                <div className="flex justify-between items-start mb-1">
                                                                    <h4 className="font-bold text-gray-900 text-sm line-clamp-1">{order.items[0].name}</h4>
                                                                    <span className="text-xs text-gray-500 font-medium">Order #{order.id}</span>
                                                                </div>
                                                                <p className="text-xs text-gray-500 mb-3">Delivered on {order.date}</p>
                                                                <div className="flex gap-2">
                                                                    <button className="px-4 py-1.5 bg-[#FFD814] border border-[#FCD200] rounded-md text-xs font-medium text-gray-900 hover:bg-[#F7CA00] shadow-sm">
                                                                        Return or Replace
                                                                    </button>
                                                                    <button className="px-4 py-1.5 border border-gray-300 rounded-md text-xs font-medium text-gray-700 hover:bg-gray-50 shadow-sm">
                                                                        View Details
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))
                                            ) : (
                                                <div className="p-8 text-center text-gray-500 text-sm">
                                                    No orders eligible for return within the last 90 days.
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden mt-6">
                                        <div className="p-4 border-b border-gray-200 bg-gray-50/50">
                                            <h3 className="font-bold text-gray-900">Previous Returns</h3>
                                        </div>
                                        <div className="p-8 text-center text-gray-500 text-sm">
                                            You have no past returns.
                                        </div>
                                    </div>
                                </div>
                            )}
                            {activeTab === 'vault' && renderVault()}
                            {activeTab === 'addresses' && renderAddresses()}
                            {activeTab === 'settings' && renderSettings()}
                            {activeTab === 'help' && renderHelp()}
                            {activeTab === 'payments' && (
                                <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-gray-200">
                                    <CreditCard className="mx-auto text-gray-300 mb-4" size={48} />
                                    <h3 className="font-bold text-gray-900">Payment Methods</h3>
                                    <p className="text-gray-500 mb-4">Manage your securely saved cards.</p>
                                    <button className="text-fario-purple font-bold hover:underline">Add New Card</button>
                                </div>
                            )}
                        </motion.div>
                    </AnimatePresence>
                </main>

            </div>

            {/* --- TIMELINE MODAL --- */}
            <AnimatePresence>
                {selectedOrder && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            onClick={() => setSelectedOrder(null)}
                            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                        />
                        <motion.div
                            initial={{ scale: 0.9, y: 20, opacity: 0 }}
                            animate={{ scale: 1, y: 0, opacity: 1 }}
                            exit={{ scale: 0.9, y: 20, opacity: 0 }}
                            className="bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden relative z-10"
                        >
                            <div className="bg-fario-purple p-6 text-white flex justify-between items-start">
                                <div>
                                    <h3 className="text-xl font-black mb-1">Order Tracking</h3>
                                    <p className="opacity-80 font-medium text-sm">#{selectedOrder.id}</p>
                                </div>
                                <button onClick={() => setSelectedOrder(null)} className="p-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors"><X size={20} /></button>
                            </div>

                            <div className="p-8">
                                <div className="space-y-8 relative">
                                    <div className="absolute left-[19px] top-2 bottom-2 w-0.5 bg-gray-100" />
                                    {selectedOrder.timeline.map((step: any, i: number) => (
                                        <div key={i} className={`relative flex gap-6 ${step.completed ? 'opacity-100' : 'opacity-40'}`}>
                                            <div className={`relative z-10 w-10 h-10 rounded-full flex items-center justify-center border-4 border-white shadow-sm ${step.completed ? 'bg-fario-purple text-white' : 'bg-gray-100 text-gray-400'}`}>
                                                <step.icon size={16} />
                                                {step.current && <span className="absolute inset-0 rounded-full bg-fario-purple/30 animate-ping" />}
                                            </div>
                                            <div className="pt-1">
                                                <p className="font-bold text-gray-900 text-lg leading-none mb-1">{step.label}</p>
                                                {step.completed && <p className="text-xs text-gray-500 font-bold">{step.date} • {step.time || '10:00 AM'}</p>}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="p-6 bg-gray-50 border-t border-gray-100">
                                <button onClick={() => setSelectedOrder(null)} className="w-full py-3 bg-white border border-gray-200 font-bold rounded-xl hover:bg-gray-100 transition-colors">
                                    Close Tracking
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* --- LOGOUT ALERT --- */}
            <AnimatePresence>
                {showLogoutAlert && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowLogoutAlert(false)} />
                        <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} className="bg-white rounded-3xl p-8 max-w-sm w-full relative z-10 text-center">
                            <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4 text-red-500">
                                <LogOut size={32} />
                            </div>
                            <h3 className="text-xl font-black text-gray-900 mb-2">Sign Out?</h3>
                            <p className="text-gray-500 mb-6">Are you sure you want to log out of your account?</p>
                            <div className="flex gap-3">
                                <button onClick={() => setShowLogoutAlert(false)} className="flex-1 py-3 bg-gray-100 text-gray-900 font-bold rounded-xl hover:bg-gray-200">Cancel</button>
                                <button
                                    onClick={() => {
                                        localStorage.removeItem('fario_auth_token');
                                        localStorage.removeItem('fario_user_profile');
                                        window.location.reload();
                                    }}
                                    className="flex-1 py-3 bg-red-500 text-white font-bold rounded-xl hover:bg-red-600"
                                >
                                    Logout
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

        </div>
    );
};

export default ProfileDashboard;
