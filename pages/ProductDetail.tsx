import React, { useState, useEffect, useRef } from 'react';
import * as RouterDOM from 'react-router-dom';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import {
   Star, ShoppingCart, MessageSquare, CheckCircle2,
   ChevronRight, User, ShieldCheck, Zap, Info,
   BarChart3, Activity, Terminal, ExternalLink,
   Clock, Share2, Ruler, Heart, Truck, Package,
   AlertTriangle, ArrowLeft, RotateCcw, AlertCircle,
   Camera, ThumbsUp, X, Plus
} from 'lucide-react';
import { useCart } from '../context/CartProvider';
import { useWishlist } from '../context/WishlistContext';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { EnhancedProduct, ASSETS } from '../constants';
import PageNav from '../components/PageNav';
import Button from '../components/Button';
import QuickViewModal from '../components/QuickViewModal';
import RecentlyViewed from '../components/RecentlyViewed';

const { useParams, useNavigate, useLocation } = RouterDOM as any;

const ProductDetail: React.FC = () => {
   const { id } = useParams();
   const navigate = useNavigate();
   const location = useLocation();
   const { products, addToCart, submitReview } = useCart();
   const { isInWishlist, toggleWishlist } = useWishlist();
   const { user } = useAuth();
   const toast = useToast();

   // Find product from Context or Constants (fallback)
   const product = products.find(p => p.id === id);

   const [selectedSize, setSelectedSize] = useState<string>('');
   const [error, setError] = useState('');
   const [activeImage, setActiveImage] = useState<string>('');
   const [isZoomed, setIsZoomed] = useState(false);
   const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
   const [showSizeGuide, setShowSizeGuide] = useState(false);
   const isWishlisted = product ? isInWishlist(product.id) : false;

   // Delivery Check State
   const [pincode, setPincode] = useState('');
   const [deliveryState, setDeliveryState] = useState<{ status: 'IDLE' | 'LOADING' | 'SUCCESS' | 'ERROR', message?: string, date?: string }>({ status: 'IDLE' });

   // Review Interaction State
   const [reviewHelpfulCount, setReviewHelpfulCount] = useState(24);
   const [isHelpful, setIsHelpful] = useState(false);
   const [isReported, setIsReported] = useState(false);
   const [isLoadingMore, setIsLoadingMore] = useState(false);

   // Dynamic Reviews State
   const [showReviewModal, setShowReviewModal] = useState(false);
   const [userReviews, setUserReviews] = useState<any[]>([]);

   // Load Reviews from Supabase
   useEffect(() => {
      if (product) {
         const fetchReviews = async () => {
            const { supabase } = await import('../lib/supabase');
            const { data, error } = await supabase
               .from('reviews')
               .select('*')
               .eq('product_id', product.id)
               .order('created_at', { ascending: false });

            if (!error && data) {
               const formatted = data.map((r: any) => ({
                  id: r.id,
                  user: r.user_name || 'Verified User',
                  date: new Date(r.created_at).toLocaleDateString(),
                  rating: r.rating,
                  title: r.rating >= 5 ? 'Excellent!' : 'Good Product',
                  text: r.comment,
                  isNew: false
               }));
               setUserReviews(formatted);
            }
         };

         fetchReviews();

         // Real-time subscription for this product's reviews
         let channel: any;
         import('../lib/supabase').then(({ supabase }) => {
            channel = supabase
               .channel(`reviews-${product.id}`)
               .on('postgres_changes',
                  { event: 'INSERT', schema: 'public', table: 'reviews', filter: `product_id=eq.${product.id}` },
                  (payload) => {
                     const r = payload.new;
                     const newReviewUI = {
                        id: r.id,
                        user: r.user_name || 'Verified User',
                        date: 'Just Now',
                        rating: r.rating,
                        title: r.rating >= 5 ? 'Excellent!' : 'Good Product',
                        text: r.comment,
                        isNew: true
                     };
                     setUserReviews(prev => [newReviewUI, ...prev]);
                  }
               )
               .subscribe();
         });

         return () => {
            if (channel) channel.unsubscribe();
         };
      }
   }, [product]);

   // Form State
   const [newReview, setNewReview] = useState({ rating: 5, text: '', title: '' });

   const handleHelpful = () => {
      if (isHelpful) {
         setReviewHelpfulCount(prev => prev - 1);
         setIsHelpful(false);
      } else {
         setReviewHelpfulCount(prev => prev + 1);
         setIsHelpful(true);
      }
   };

   const handleReport = () => {
      if (!isReported) {
         setIsReported(true);
         setTimeout(() => toast.success("Thanks for reporting. We will investigate."), 100);
      }
   };

   const handleLoadMore = () => {
      setIsLoadingMore(true);
      setTimeout(() => setIsLoadingMore(false), 1000);
   };

   const handleSubmitReview = async (e: React.FormEvent) => {
      e.preventDefault();
      if (!product) return;

      try {
         const { supabase } = await import('../lib/supabase');

         if (!user) {
            toast.error("Please login to submit a review");
            return;
         }

         const { error } = await supabase.from('reviews').insert([{
            product_id: product.id,
            user_id: user.id,
            user_name: user.user_metadata?.full_name || user.user_metadata?.name || user.email?.split('@')[0] || 'Verified Customer',
            rating: newReview.rating,
            title: newReview.title,
            comment: newReview.text,
            is_verified_purchase: true, // Optimistic for now, logic can be stricter later
            created_at: new Date().toISOString()
         }]);

         if (error) throw error;

         // Also update locally for immediate feedback if needed, 
         // though the real-time listener should handle it.
         setShowReviewModal(false);
         setNewReview({ rating: 5, text: '', title: '' });
         toast.success("Review Submitted Successfully!");

      } catch (err) {
         console.error("Review failed", err);
         toast.error("Could not save review. Please check connection.");
      }
   };

   const checkPincode = () => {
      if (!pincode || pincode.length !== 6) {
         setDeliveryState({ status: 'ERROR', message: 'Please enter a valid 6-digit pincode' });
         return;
      }
      setDeliveryState({ status: 'LOADING' });

      // Mock API Logic
      setTimeout(() => {
         if (pincode === '641048') {
            setDeliveryState({
               status: 'SUCCESS',
               date: 'Tomorrow, By 9 PM',
               message: 'Fast Delivery to Sathyamangalam'
            });
         } else if (['560001', '600001', '110001'].includes(pincode) || pincode.startsWith('6')) {
            setDeliveryState({
               status: 'SUCCESS',
               date: 'Wednesday, 29 Jan',
               message: 'Standard Delivery'
            });
         } else {
            setDeliveryState({ status: 'ERROR', message: 'Delivery not available to this pincode' });
         }
      }, 1000);
   };

   // Gallery Logic: Ensure at least 4 images
   const gallery = product?.gallery && product.gallery.length > 0
      ? [product.image, ...product.gallery].slice(0, 4)
      : product ? [product.image, product.image, product.image, product.image] : [];

   useEffect(() => {
      if (!product && id) {
         // navigate('/products'); // Optional: redirect if invalid ID
      } else if (product) {
         setActiveImage(gallery[0]);
         window.scrollTo(0, 0);
      }
   }, [product, id]);

   if (!product) return <div className="min-h-screen flex items-center justify-center">Loading Asset...</div>;

   const sizes = Array.isArray(product.sizes) ? product.sizes : ['UK 4', 'UK 5', 'UK 6', 'UK 7', 'UK 8'];
   const isStockAvailable = product.inStock && (product.stockQuantity === undefined || product.stockQuantity > 0);

   // Image Zoom Handler
   const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
      const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
      const x = ((e.clientX - left) / width) * 100;
      const y = ((e.clientY - top) / height) * 100;
      setMousePos({ x, y });
   };

   const handleAddToCart = () => {
      if (!selectedSize) {
         setError('Size Required');
         return;
      }
      setError('');

      // Check Auth (Optional per spec, but good practice)
      // const isAuthenticated = !!localStorage.getItem('fario_auth_token');
      // if (!isAuthenticated) { ... }

      addToCart(product, selectedSize, product.colors?.[0] || 'Default');
      navigate('/cart'); // Redirect to Cart
   };

   const MotionDiv = (motion as any).div;
   const MotionImg = (motion as any).img;

   return (
      <div className="pt-24 pb-40 min-h-screen bg-white relative selection:bg-fario-purple/30">

         {/* SIZE GUIDE MODAL */}
         <AnimatePresence>
            {showSizeGuide && (
               <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-gray-900/40 backdrop-blur-sm" onClick={() => setShowSizeGuide(false)}>
                  <MotionDiv
                     initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }}
                     className="bg-white p-8 rounded-3xl max-w-lg w-full shadow-2xl relative"
                     onClick={(e: any) => e.stopPropagation()}
                  >
                     <h3 className="text-xl font-black font-heading uppercase italic tracking-tighter mb-6">Size Specification</h3>
                     <table className="w-full text-sm text-left">
                        <thead>
                           <tr className="border-b border-gray-100">
                              <th className="pb-2 font-black uppercase text-[10px] tracking-widest text-gray-400">UK/India</th>
                              <th className="pb-2 font-black uppercase text-[10px] tracking-widest text-gray-400">US</th>
                              <th className="pb-2 font-black uppercase text-[10px] tracking-widest text-gray-400">EU</th>
                              <th className="pb-2 font-black uppercase text-[10px] tracking-widest text-gray-400">CM</th>
                           </tr>
                        </thead>
                        <tbody className="font-medium text-gray-600">
                           {[4, 5, 6, 7, 8, 9, 10].map(s => (
                              <tr key={s} className="border-b border-gray-50 last:border-0 hover:bg-gray-50">
                                 <td className="py-3 pl-2">{s}</td>
                                 <td className="py-3">{s + 1}</td>
                                 <td className="py-3">{36 + s}</td>
                                 <td className="py-3">{22 + (s * 0.5)}</td>
                              </tr>
                           ))}
                        </tbody>
                     </table>
                     <button className="absolute top-6 right-6 p-2 hover:bg-gray-100 rounded-full" onClick={() => setShowSizeGuide(false)}><ArrowLeft size={20} /></button>
                  </MotionDiv>
               </div>
            )}
         </AnimatePresence>

         {/* WRITE REVIEW MODAL */}
         <AnimatePresence>
            {showReviewModal && (
               <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm" onClick={() => setShowReviewModal(false)}>
                  <MotionDiv
                     initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
                     className="bg-white p-6 md:p-8 rounded-3xl max-w-md w-full shadow-2xl relative border border-gray-100"
                     onClick={(e: any) => e.stopPropagation()}
                  >
                     <button className="absolute top-6 right-6 p-2 hover:bg-gray-100 rounded-full text-gray-400 hover:text-gray-900 transition-colors" onClick={() => setShowReviewModal(false)}>
                        <X size={20} />
                     </button>

                     <h3 className="text-2xl font-black font-heading uppercase italic tracking-tighter mb-2 text-gray-900">Write a Review</h3>
                     <p className="text-gray-500 text-sm mb-6">Share your experience with the community</p>

                     <form onSubmit={handleSubmitReview} className="space-y-4">
                        <div>
                           <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">Rating</label>
                           <div className="flex">
                              {[1, 2, 3, 4, 5].map(star => (
                                 <button
                                    type="button"
                                    key={star}
                                    onClick={() => setNewReview({ ...newReview, rating: star })}
                                    className="p-2 cursor-pointer focus:outline-none transition-transform hover:scale-110 active:scale-95"
                                 >
                                    <Star
                                       size={32}
                                       className={`transition-colors duration-200 ${star <= newReview.rating
                                          ? "fill-amber-400 text-amber-400"
                                          : "text-gray-200"
                                          }`}
                                    />
                                 </button>
                              ))}
                           </div>
                        </div>
                        <div>
                           <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">Title</label>
                           <input
                              required
                              type="text"
                              value={newReview.title}
                              onChange={e => setNewReview({ ...newReview, title: e.target.value })}
                              className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium focus:border-fario-purple outline-none transition-colors"
                              placeholder="Summarize your experience"
                           />
                        </div>
                        <div>
                           <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">Review</label>
                           <textarea
                              required
                              value={newReview.text}
                              onChange={e => setNewReview({ ...newReview, text: e.target.value })}
                              className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium focus:border-fario-purple outline-none transition-colors h-32 resize-none"
                              placeholder="What did you like or dislike?"
                           ></textarea>
                        </div>
                        <button type="submit" className="w-full py-4 bg-fario-purple hover:bg-[#684389] text-white rounded-xl font-black uppercase tracking-widest text-xs shadow-lg shadow-fario-purple/30 transition-all transform hover:-translate-y-1">
                           Submit Review
                        </button>
                     </form>
                  </MotionDiv>
               </div>
            )}
         </AnimatePresence>

         <div className="container mx-auto px-4 md:px-6 relative z-10 max-w-[1400px]">
            {/* BREADCRUMBS */}
            <div className="flex items-center gap-2 mb-8 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">
               <span className="cursor-pointer hover:text-fario-purple" onClick={() => navigate('/')}>Home</span>
               <ChevronRight size={12} />
               <span className="cursor-pointer hover:text-fario-purple" onClick={() => navigate('/products')}>Depot</span>
               <ChevronRight size={12} />
               <span className="text-gray-900 line-clamp-1">{product.name}</span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start">

               {/* LEFT: GALLERY (Sticky on Desktop) */}
               <div className="lg:col-span-7 space-y-4 lg:sticky lg:top-24">
                  {/* Main Image Stage */}
                  <div
                     className="bg-gray-50 border border-gray-100 rounded-[2rem] relative overflow-hidden aspect-square lg:aspect-[4/3] flex items-center justify-center group cursor-zoom-in"
                     onMouseMove={handleMouseMove}
                     onMouseEnter={() => setIsZoomed(true)}
                     onMouseLeave={() => setIsZoomed(false)}
                  >
                     <div className="absolute inset-0 bg-grid-pattern opacity-[0.03] pointer-events-none" />
                     <AnimatePresence mode="wait">
                        <MotionImg
                           key={activeImage}
                           src={activeImage}
                           alt={product.name}
                           initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}
                           className="w-full h-full object-contain mix-blend-multiply p-8 lg:p-12 transition-transform duration-100"
                           style={{
                              transformOrigin: `${mousePos.x}% ${mousePos.y}%`,
                              transform: isZoomed ? "scale(2)" : "scale(1)"
                           }}
                        />
                     </AnimatePresence>

                     {/* Zoom Hint */}
                     <div className={`absolute bottom-6 right-6 bg-white/80 backdrop-blur px-3 py-1.5 rounded-full text-[9px] font-bold uppercase tracking-widest text-gray-500 border border-gray-200 pointer-events-none transition-opacity ${isZoomed ? 'opacity-0' : 'opacity-100'}`}>
                        Hover to Zoom
                     </div>
                  </div>

                  {/* Thumbnails */}
                  <div className="grid grid-cols-4 md:grid-cols-6 gap-3">
                     {gallery.map((img: string, idx: number) => (
                        <button
                           key={idx}
                           onMouseEnter={() => setActiveImage(img)}
                           onClick={() => setActiveImage(img)}
                           className={`aspect-square rounded-xl bg-white border-2 flex items-center justify-center p-2 transition-all overflow-hidden ${activeImage === img ? 'border-fario-purple ring-2 ring-fario-purple/10' : 'border-gray-100 hover:border-gray-200'}`}
                        >
                           <img src={img || '/placeholder.png'} className="w-full h-full object-contain mix-blend-multiply" alt="" />
                        </button>
                     ))}
                  </div>
               </div>

               {/* RIGHT: INFO PANEL (Sticky Content) */}
               <div className="lg:col-span-5 flex flex-col h-full">
                  <div className="flex items-center gap-3 mb-4">
                     <span className="bg-gray-900 text-white text-[9px] font-black uppercase tracking-[0.3em] px-3 py-1.5 rounded-md shadow-lg">
                        {product.category}
                     </span>
                     {product.inStock ? (
                        <span className="flex items-center gap-1.5 text-[9px] font-bold text-emerald-600 uppercase tracking-widest bg-emerald-50 px-2 py-1 rounded-md">
                           <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> In Stock
                        </span>
                     ) : (
                        <span className="flex items-center gap-1.5 text-[9px] font-bold text-rose-500 uppercase tracking-widest bg-rose-50 px-2 py-1 rounded-md">
                           Out of Stock
                        </span>
                     )}
                  </div>

                  <h1 className="text-4xl md:text-5xl font-black font-heading text-gray-900 mb-2 uppercase italic tracking-tighter leading-[0.9]">
                     {product.name}
                  </h1>

                  <div className="flex items-center justify-between mb-8">
                     <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1 text-yellow-400">
                           <Star size={16} className="fill-current" />
                           <span className="text-sm font-bold text-gray-700 ml-1 mt-0.5">{product.rating}</span>
                        </div>
                        <button className="text-xs text-gray-400 underline hover:text-fario-purple">Read 234 Reviews</button>
                     </div>
                     <button onClick={() => toggleWishlist(product)} className="p-2 hover:bg-gray-50 rounded-full transition-colors">
                        <Heart size={20} className={isWishlisted ? "fill-rose-500 text-rose-500" : "text-gray-400"} />
                     </button>
                  </div>

                  {/* Price Block */}
                  <div className="mb-6">
                     <div className="flex items-baseline gap-3">
                        <span className="text-4xl font-black text-gray-900 tracking-tight">Rs. {product.price}</span>
                        {product.originalPrice && (
                           <>
                              <span className="text-lg text-gray-400 line-through font-medium">Rs. {product.originalPrice}</span>
                              <span className="text-lg font-bold text-rose-500">
                                 {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% OFF
                              </span>
                           </>
                        )}
                     </div>
                     <p className="text-[10px] uppercase font-bold text-gray-400 mt-1">Inclusive of all taxes</p>
                  </div>

                  {/* OFFERS SECTION */}
                  <div className="mb-8 space-y-3">
                     <div className="p-4 rounded-xl bg-white border border-gray-200 shadow-sm flex items-start gap-3">
                        <div className="bg-emerald-100 p-1.5 rounded text-emerald-700 mt-0.5"><Zap size={14} /></div>
                        <div>
                           <h4 className="text-xs font-bold text-gray-900 uppercase">Bank Offer</h4>
                           <p className="text-xs text-gray-500 mt-0.5">Flat Rs. 100 Instant Cashback on HDFC Bank Credit Cards. Min purchase value Rs. 1000</p>
                        </div>
                     </div>
                     <div className="p-4 rounded-xl bg-white border border-gray-200 shadow-sm flex items-start gap-3">
                        <div className="bg-blue-100 p-1.5 rounded text-blue-700 mt-0.5"><Terminal size={14} /></div>
                        <div>
                           <h4 className="text-xs font-bold text-gray-900 uppercase">Partner Offer</h4>
                           <p className="text-xs text-gray-500 mt-0.5">Get GST invoice and save up to 28% on business purchases.</p>
                        </div>
                     </div>
                  </div>

                  {/* SERVICE ICONS */}
                  <div className="grid grid-cols-4 gap-2 mb-8 border-b border-gray-100 pb-8">
                     <div className="text-center">
                        <div className="w-10 h-10 mx-auto bg-gray-50 rounded-full flex items-center justify-center text-gray-700 mb-2"><RotateCcw size={18} /></div>
                        <p className="text-[10px] font-bold text-gray-600 leading-tight">7 Days Return</p>
                     </div>
                     <div className="text-center">
                        <div className="w-10 h-10 mx-auto bg-gray-50 rounded-full flex items-center justify-center text-gray-700 mb-2"><ShieldCheck size={18} /></div>
                        <p className="text-[10px] font-bold text-gray-600 leading-tight">1 Year Warranty</p>
                     </div>
                     <div className="text-center">
                        <div className="w-10 h-10 mx-auto bg-gray-50 rounded-full flex items-center justify-center text-gray-700 mb-2"><Truck size={18} /></div>
                        <p className="text-[10px] font-bold text-gray-600 leading-tight">Free Delivery</p>
                     </div>
                     <div className="text-center">
                        <div className="w-10 h-10 mx-auto bg-gray-50 rounded-full flex items-center justify-center text-gray-700 mb-2"><CheckCircle2 size={18} /></div>
                        <p className="text-[10px] font-bold text-gray-600 leading-tight">Authentic</p>
                     </div>
                  </div>

                  {/* Description */}
                  <p className="text-gray-600 leading-relaxed text-sm font-medium mb-8 whitespace-normal break-words">
                     {product.description}
                  </p>

                  {/* Size Selector */}
                  <div className="mb-8">
                     <div className="flex justify-between items-center mb-3">
                        <span className="text-[10px] font-black uppercase tracking-widest text-gray-900">Select Size</span>
                        <button onClick={() => setShowSizeGuide(true)} className="flex items-center gap-1 text-[10px] font-bold text-fario-purple uppercase tracking-wider hover:underline">
                           <Ruler size={12} /> Size Guide
                        </button>
                     </div>
                     <div className="grid grid-cols-5 gap-2">
                        {sizes.map(size => (
                           <button
                              key={size}
                              onClick={() => { setSelectedSize(size); setError(''); }}
                              disabled={!isStockAvailable}
                              className={`
                         h-12 rounded-xl border text-[11px] font-black uppercase transition-all
                         ${selectedSize === size
                                    ? 'bg-gray-900 text-white border-gray-900 shadow-lg scale-105'
                                    : 'bg-white text-gray-500 border-gray-200 hover:border-gray-400 hover:text-gray-900'}
                         ${!isStockAvailable ? 'opacity-50 cursor-not-allowed' : ''}
                       `}
                           >
                              {size.replace('UK ', '')}
                           </button>
                        ))}
                     </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-4 mt-auto">
                     <Button
                        onClick={handleAddToCart}
                        disabled={!isStockAvailable}
                        className="flex-[2] py-4 rounded-xl text-xs font-black uppercase tracking-[0.3em] flex items-center justify-center gap-3 shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all"
                     >
                        {isStockAvailable ? (
                           <><ShoppingCart size={18} /> Add to Cart</>
                        ) : (
                           <><Clock size={18} /> Out of Stock</>
                        )}
                     </Button>
                     <button className="flex-1 border-2 border-gray-100 rounded-xl font-bold uppercase text-[10px] tracking-widest text-gray-500 hover:border-gray-900 hover:text-gray-900 transition-all flex items-center justify-center gap-2">
                        <Share2 size={16} /> Share
                     </button>
                  </div>

                  {/* DELIVERY CHECK */}
                  <div className="mt-8 pt-8 border-t border-gray-100">
                     <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wider mb-3">Check Delivery</h4>
                     <div className="flex gap-2">
                        <input
                           type="text"
                           placeholder="Enter Pincode"
                           value={pincode}
                           onChange={(e) => { setPincode(e.target.value.replace(/\D/g, '').slice(0, 6)); setDeliveryState({ status: 'IDLE' }); }}
                           className={`flex-1 bg-gray-50 border rounded-lg px-4 py-2 text-sm outline-none focus:border-fario-purple transition-colors ${deliveryState.status === 'ERROR' ? 'border-rose-300 bg-rose-50 text-rose-600' : 'border-gray-200'}`}
                        />
                        <button
                           onClick={checkPincode}
                           disabled={deliveryState.status === 'LOADING' || pincode.length !== 6}
                           className="text-sm font-bold text-fario-purple hover:underline px-2 disabled:opacity-50 disabled:no-underline"
                        >
                           {deliveryState.status === 'LOADING' ? 'Checking...' : 'Check'}
                        </button>
                     </div>

                     <AnimatePresence mode="wait">
                        {deliveryState.status === 'SUCCESS' && (
                           <MotionDiv initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} className="mt-3 flex items-start gap-3 bg-emerald-50 p-3 rounded-lg border border-emerald-100">
                              <Truck size={16} className="text-emerald-600 mt-0.5" />
                              <div>
                                 <p className="text-xs font-bold text-emerald-800">Delivery by {deliveryState.date}</p>
                                 <p className="text-[10px] font-medium text-emerald-600">{deliveryState.message}</p>
                              </div>
                           </MotionDiv>
                        )}
                        {deliveryState.status === 'ERROR' && (
                           <MotionDiv initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} className="mt-2 text-[10px] font-bold text-rose-500 flex items-center gap-1">
                              <AlertCircle size={12} /> {deliveryState.message}
                           </MotionDiv>
                        )}
                        {deliveryState.status === 'IDLE' && (
                           <p className="text-[10px] text-gray-400 mt-2 flex items-center gap-1"><Truck size={12} /> Enter pincode for exact delivery dates</p>
                        )}
                     </AnimatePresence>
                  </div>
               </div>

            </div>

            {/* RECENTLY VIEWED - NEW */}
            <RecentlyViewed currentId={id} />

            {/* PRODUCT REVIEWS SECTION - PREMIUM FARIO STYLE */}
            <div className="mt-24 pt-16 border-t border-stone-100">
               <div className="flex items-center justify-between mb-12">
                  <h2 className="text-3xl font-bold font-serif text-stone-900 tracking-tight">
                     What People Say
                  </h2>
                  <button onClick={() => setShowReviewModal(true)} className="hidden md:flex items-center gap-2 px-6 py-3 bg-stone-900 text-white rounded-xl font-bold text-xs hover:bg-stone-800 transition-all shadow-lg shadow-stone-900/10">
                     <MessageSquare size={16} /> Add Your Voice
                  </button>
               </div>

               <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-24">
                  {/* LEFT: RATINGS & BREAKDOWN */}
                  <div className="lg:col-span-4 space-y-8">
                     {/* -- DYNAMIC STATS CALCULATION -- */}
                     {(() => {
                        const totalReviews = userReviews.length;
                        const avgRating = totalReviews > 0
                           ? (userReviews.reduce((acc, r) => acc + r.rating, 0) / totalReviews).toFixed(1)
                           : '0.0';

                        const starCounts = [5, 4, 3, 2, 1].map(star => {
                           const count = userReviews.filter(r => Math.round(r.rating) === star).length;
                           const pct = totalReviews > 0 ? Math.round((count / totalReviews) * 100) + '%' : '0%';
                           return { stars: star, pct, count };
                        });

                        return (
                           <div className="bg-gray-50 rounded-3xl p-8 border border-gray-100 relative overflow-hidden">
                              <div className="absolute top-0 right-0 p-32 bg-fario-purple/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>

                              {totalReviews > 0 ? (
                                 <>
                                    <div className="flex items-baseline gap-4 mb-2">
                                       <span className="text-6xl font-black text-gray-900 tracking-tighter">{avgRating}</span>
                                       <div className="flex flex-col">
                                          <div className="flex text-fario-purple mb-1">
                                             {[1, 2, 3, 4, 5].map(i => (
                                                <Star key={i} size={18} className={i <= Math.round(Number(avgRating)) ? "fill-current text-fario-purple" : "text-gray-300"} />
                                             ))}
                                          </div>
                                          <span className="text-xs font-bold text-gray-500 uppercase tracking-wide">Based on {totalReviews} Reviews</span>
                                       </div>
                                    </div>

                                    <div className="space-y-4 mt-8 relative z-10">
                                       {starCounts.map(row => (
                                          <div key={row.stars} className="flex items-center gap-4 text-xs font-bold text-gray-600">
                                             <span className="w-8 flex items-center gap-1">{row.stars} <Star size={10} className="text-gray-400" /></span>
                                             <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                                                <div className="h-full bg-fario-purple rounded-full" style={{ width: row.pct }} />
                                             </div>
                                             <span className="w-8 text-right text-gray-900">{row.pct}</span>
                                          </div>
                                       ))}
                                    </div>
                                 </>
                              ) : (
                                 <div className="text-center py-8">
                                    <MessageSquare size={32} className="mx-auto text-gray-300 mb-2" />
                                    <p className="text-sm font-bold text-gray-400">No Reviews Yet</p>
                                    <p className="text-xs text-gray-400 mt-1">Be the first to share your thoughts!</p>
                                 </div>
                              )}
                           </div>
                        );
                     })()}

                     {/* Media Gallery */}
                     <div>
                        <h3 className="text-xs font-black text-gray-900 uppercase tracking-widest mb-4 flex items-center gap-2">
                           <Camera size={14} /> User Gallery
                        </h3>
                        <div className="flex gap-3 overflow-x-auto pb-4 no-scrollbar">
                           {[ASSETS.products.shoe1, ASSETS.products.shoe2, ASSETS.products.schoolShoe].map((img, i) => (
                              <div key={i} className="w-20 h-20 flex-shrink-0 bg-gray-100 rounded-xl overflow-hidden border border-gray-200 cursor-pointer hover:scale-105 transition-transform">
                                 <img src={img} alt={`User photo ${i}`} className="w-full h-full object-cover" />
                              </div>
                           ))}
                           <div className="w-20 h-20 flex-shrink-0 bg-fario-purple text-white rounded-xl flex flex-col items-center justify-center cursor-pointer hover:bg-gray-900 transition-colors">
                              <span className="text-xl font-black">+12</span>
                              <span className="text-[9px] font-bold uppercase">Photos</span>
                           </div>
                        </div>
                     </div>
                  </div>

                  {/* RIGHT: REVIEWS LIST */}
                  <div className="lg:col-span-8 space-y-8">
                     {/* FEATURED REVIEW (Make dynamic or remove if empty) */}
                     {userReviews.length > 0 && (
                        <div className="bg-white rounded-none border-b border-gray-100 pb-8 hover:bg-gray-50/50 transition-colors -mx-4 px-4 lg:mx-0 lg:px-0">
                           <div className="flex items-start justify-between mb-4">
                              <div className="flex items-center gap-3">
                                 <div className="w-10 h-10 rounded-full bg-gradient-to-br from-fario-purple to-indigo-600 text-white flex items-center justify-center font-bold text-sm shadow-md shadow-fario-purple/20">
                                    {userReviews[0].user.charAt(0)}
                                 </div>
                                 <div>
                                    <h4 className="font-bold text-gray-900 text-sm">{userReviews[0].user}</h4>
                                    <div className="flex items-center gap-2 text-[10px] text-gray-500 font-medium uppercase tracking-wide">
                                       <span className="bg-emerald-100 text-emerald-700 px-1.5 py-0.5 rounded flex items-center gap-1">
                                          <CheckCircle2 size={10} /> Verified Purchase
                                       </span>
                                       <span>• {userReviews[0].date}</span>
                                    </div>
                                 </div>
                              </div>
                              <div className="flex text-fario-purple">
                                 {[1, 2, 3, 4, 5].map(i => <Star key={i} size={14} className={i <= userReviews[0].rating ? "fill-current" : "text-gray-300"} />)}
                              </div>
                           </div>

                           <h3 className="text-lg font-black text-gray-900 italic mb-3">"{userReviews[0].title}"</h3>

                           <div className="text-sm text-gray-600 space-y-4 leading-relaxed font-medium">
                              <p>{userReviews[0].text}</p>
                           </div>
                        </div>
                     )}

                     {/* DYNAMIC USER REVIEWS LIST */}
                     <AnimatePresence>
                        {userReviews.map(review => (
                           <MotionDiv
                              key={review.id}
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              className={`bg-white rounded-2xl border ${review.isNew ? 'border-fario-purple/30 bg-fario-purple/5' : 'border-gray-100'} p-6 mb-6`}
                           >
                              <div className="flex items-start justify-between mb-3">
                                 <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center font-bold text-xs text-gray-500">
                                       {review.user.charAt(0)}
                                    </div>
                                    <div>
                                       <h4 className="font-bold text-gray-900 text-sm">{review.user}</h4>
                                       <div className="text-[10px] text-gray-400 font-bold uppercase">{review.date}</div>
                                    </div>
                                 </div>
                                 <div className="flex text-yellow-400">
                                    {[...Array(5)].map((_, i) => <Star key={i} size={12} className={i < review.rating ? "fill-current" : "text-gray-200 fill-gray-200"} />)}
                                 </div>
                              </div>
                              <h3 className="font-bold text-gray-900 text-sm mb-2">{review.title}</h3>
                              <p className="text-sm text-gray-600 leading-relaxed">{review.text}</p>
                           </MotionDiv>
                        ))}
                     </AnimatePresence>

                     <button
                        type="button"
                        onClick={handleLoadMore}
                        disabled={isLoadingMore}
                        className="w-full py-4 border-2 border-dashed border-gray-200 rounded-2xl text-xs font-bold uppercase tracking-widest text-gray-500 hover:border-gray-900 hover:text-gray-900 hover:bg-gray-50 transition-all flex items-center justify-center gap-2"
                     >
                        {isLoadingMore ? (
                           <><div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div> Loading...</>
                        ) : 'Load More Reviews'}
                     </button>
                  </div>
               </div>
            </div>

         </div>
      </div>
   );
};

export default ProductDetail;
