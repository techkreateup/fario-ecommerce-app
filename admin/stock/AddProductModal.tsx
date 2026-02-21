import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Check, Loader2, Image as ImageIcon, Link as LinkIcon, AlertTriangle, Palette, Ruler } from 'lucide-react';
import { EnhancedProduct, ASSETS, drive } from '../../constants';
import { useCart } from '../../context/CartProvider';

interface AddProductModalProps {
    isOpen: boolean;
    onClose: () => void;
    productToEdit?: EnhancedProduct | null;
}

const AddProductModal: React.FC<AddProductModalProps> = ({ isOpen, onClose, productToEdit }) => {
    const { addProduct, updateProduct } = useCart();
    const [isSyncing, setIsSyncing] = useState(false);
    const [imageWarning, setImageWarning] = useState('');

    const AVAILABLE_COLORS = ['Black', 'Grey', 'White', 'Lime', 'Purple', 'Blue'];
    const AVAILABLE_SIZES = ['UK 3', 'UK 4', 'UK 5', 'UK 6', 'UK 7', 'UK 8', 'UK 9', 'OS', 'Small', 'Medium', 'Large'];

    const [formData, setFormData] = useState<Partial<EnhancedProduct>>({
        name: '',
        category: 'Shoes',
        price: 0,
        inStock: true,
        image: ASSETS.products.shoe1,
        colors: ['Black'],
        sizes: ['UK 7'],
        stockQuantity: 0
    });

    useEffect(() => {
        if (productToEdit) {
            setFormData({
                ...productToEdit,
                colors: productToEdit.colors || [],
                sizes: productToEdit.sizes || []
            });
        } else {
            // Reset defaults for new product
            setFormData({
                name: '',
                category: 'Shoes',
                price: 0,
                inStock: true,
                image: ASSETS.products.shoe1,
                colors: ['Black'],
                sizes: ['UK 7'],
                stockQuantity: 0
            });
        }
        setImageWarning('');
    }, [productToEdit, isOpen]);

    const toggleSelection = (field: 'colors' | 'sizes', value: string) => {
        setFormData(prev => {
            const current = prev[field] || [];
            const exists = current.includes(value);
            return {
                ...prev,
                [field]: exists ? current.filter(i => i !== value) : [...current, value]
            };
        });
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value;
        if (val.includes('/folders/')) {
            setImageWarning('Detection: You pasted a Folder link. Please use a specific Image File link.');
            setFormData({ ...formData, image: val });
            return;
        }
        setImageWarning('');
        const formattedUrl = (val.includes('drive.google.com') || val.includes('lh3.googleusercontent.com'))
            ? drive(val)
            : val;
        setFormData({ ...formData, image: formattedUrl });
    };

    const handleSave = (e: React.FormEvent) => {
        e.preventDefault();
        if (imageWarning) return;

        if (productToEdit) {
            updateProduct({
                ...productToEdit,
                ...formData,
                price: Number(formData.price),
                colors: formData.colors || [],
                sizes: formData.sizes || []
            } as EnhancedProduct);
        } else {
            addProduct({
                ...formData,
                tagline: formData.tagline || 'Premium Series',
                description: formData.description || 'A new addition to the Fario collection.',
                features: formData.features || ['Standard Build'],
                rating: Number(formData.rating) || 4.5,
                gender: formData.gender || 'Unisex',
                colors: formData.colors || ['Black'],
                sizes: formData.sizes || ['UK 7'],
                price: Number(formData.price) || 0,
                stockQuantity: Number(formData.stockQuantity) || 0,
            } as any);
        }
        setIsSyncing(false);
        onClose();
    };

    // Cast motion components
    const MotionDiv = (motion as any).div;

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[2000] flex items-center justify-end">
                    <MotionDiv initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => !isSyncing && onClose()} className="absolute inset-0 bg-slate-900/60 backdrop-blur-md" />
                    <MotionDiv initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} transition={{ type: 'spring', damping: 25, stiffness: 200 }} className="relative w-full max-w-lg h-full bg-white shadow-2xl flex flex-col">
                        <div className="p-10 border-b border-gray-100 flex items-center justify-between">
                            <div>
                                <h2 className="text-2xl font-black font-heading text-slate-900 uppercase italic">{productToEdit ? 'Edit Asset' : 'New Deployment'}</h2>
                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">Catalog Configuration</p>
                            </div>
                            <button onClick={onClose} className="w-12 h-12 rounded-full hover:bg-gray-50 flex items-center justify-center transition-colors"><X size={24} /></button>
                        </div>
                        <form onSubmit={handleSave} className="p-10 space-y-8 flex-grow overflow-y-auto scrollbar-hide">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Product Name</label>
                                <input required value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-6 py-4 text-sm font-bold focus:ring-2 focus:ring-fario-purple/5 outline-none transition-all" placeholder="e.g. Edustep Core" />
                            </div>

                            {/* Enhanced Image Input */}
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                                    <ImageIcon size={12} /> Asset URL (Drive Link)
                                </label>
                                <div className="relative">
                                    <input
                                        required
                                        value={formData.image}
                                        onChange={handleImageChange}
                                        className={`w-full bg-gray-50 border rounded-2xl px-6 py-4 pl-12 text-sm font-bold focus:ring-2 outline-none transition-all ${imageWarning ? 'border-red-300 focus:ring-red-100' : 'border-gray-100 focus:ring-fario-purple/5'}`}
                                        placeholder="https://drive.google.com/file/d/..."
                                    />
                                    <LinkIcon size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                                </div>
                                {imageWarning ? (
                                    <p className="text-[10px] font-bold text-red-500 mt-2 flex items-center gap-2 bg-red-50 p-2 rounded-lg">
                                        <AlertTriangle size={14} /> {imageWarning}
                                    </p>
                                ) : (
                                    <p className="text-[9px] font-bold text-gray-400 mt-2 ml-1">
                                        Supported: Direct Google Drive file links or hosted URLs.
                                    </p>
                                )}
                                {formData.image && !imageWarning && (
                                    <div className="mt-4 w-full h-40 bg-gray-50 rounded-2xl border border-gray-100 flex items-center justify-center overflow-hidden relative">
                                        <img src={formData.image} alt="Preview" className="h-full object-contain" onError={(e) => (e.currentTarget.style.display = 'none')} />
                                        <span className="absolute bottom-2 right-2 bg-white/80 px-2 py-1 text-[8px] font-bold uppercase rounded tracking-widest backdrop-blur-sm">Preview</span>
                                    </div>
                                )}
                            </div>

                            <div className="grid grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Value (INR)</label>
                                    <div className="relative">
                                        <span className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 font-bold">Rs.</span>
                                        <input type="number" required value={formData.price} onChange={e => setFormData({ ...formData, price: Number(e.target.value) })} className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-6 py-4 pl-10 text-sm font-bold focus:ring-2 focus:ring-fario-purple/5 outline-none" />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Category</label>
                                    <select value={formData.category} onChange={e => setFormData({ ...formData, category: e.target.value as any })} className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-6 py-4 text-sm font-bold focus:ring-2 focus:ring-fario-purple/5 outline-none appearance-none">
                                        <option value="Shoes">Shoes</option>
                                        <option value="Bags">Bags</option>
                                        <option value="Accessories">Accessories</option>
                                        <option value="School Shoes">School Shoes</option>
                                        <option value="Kids">Kids</option>
                                        <option value="Socks">Socks</option>
                                    </select>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Gender</label>
                                    <select value={formData.gender || 'Unisex'} onChange={e => setFormData({ ...formData, gender: e.target.value as any })} className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-6 py-4 text-sm font-bold focus:ring-2 focus:ring-fario-purple/5 outline-none appearance-none">
                                        <option value="Unisex">Unisex</option>
                                        <option value="Male">Male</option>
                                        <option value="Female">Female</option>
                                        <option value="Kids">Kids</option>
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Rating</label>
                                    <input type="number" step="0.1" min="0" max="5" value={formData.rating || 4.5} onChange={e => setFormData({ ...formData, rating: Number(e.target.value) })} className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-6 py-4 text-sm font-bold focus:ring-2 focus:ring-fario-purple/5 outline-none" />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Tagline</label>
                                <input value={formData.tagline || ''} onChange={e => setFormData({ ...formData, tagline: e.target.value })} className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-6 py-4 text-sm font-bold focus:ring-2 focus:ring-fario-purple/5 outline-none" placeholder="e.g. Resilient. Refined. Essential." />
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Description</label>
                                <textarea rows={3} value={formData.description || ''} onChange={e => setFormData({ ...formData, description: e.target.value })} className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-6 py-4 text-sm font-bold focus:ring-2 focus:ring-fario-purple/5 outline-none resize-none" placeholder="Product details and highlights..." />
                            </div>

                            <div className="space-y-6 pt-4 border-t border-gray-50">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                                        <Palette size={12} /> Available Colors
                                    </label>
                                    <div className="flex flex-wrap gap-2">
                                        {AVAILABLE_COLORS.map(color => (
                                            <button
                                                key={color}
                                                type="button"
                                                onClick={() => toggleSelection('colors', color)}
                                                className={`flex items-center gap-2 px-3 py-2 rounded-xl border-2 transition-all ${(formData.colors || []).includes(color)
                                                    ? 'border-fario-purple bg-fario-purple/5 text-fario-purple shadow-sm'
                                                    : 'border-gray-100 bg-white text-gray-400 hover:border-gray-200'
                                                    }`}
                                            >
                                                <div
                                                    className="w-3 h-3 rounded-full border border-gray-200 shadow-sm"
                                                    style={{ backgroundColor: color.toLowerCase() }}
                                                />
                                                <span className="text-[9px] font-bold uppercase tracking-wider">{color}</span>
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                                        <Ruler size={12} /> Available Sizes
                                    </label>
                                    <div className="flex flex-wrap gap-2">
                                        {AVAILABLE_SIZES.map(size => (
                                            <button
                                                key={size}
                                                type="button"
                                                onClick={() => toggleSelection('sizes', size)}
                                                className={`px-3 py-2 rounded-xl text-[9px] font-bold uppercase tracking-wider border-2 transition-all ${(formData.sizes || []).includes(size)
                                                    ? 'bg-fario-dark text-white border-fario-dark shadow-md'
                                                    : 'bg-white text-gray-400 border-gray-100 hover:border-gray-200'
                                                    }`}
                                            >
                                                {size}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-2 pt-4 border-t border-gray-50">
                                <div className="flex justify-between items-center px-1">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Stock Quantity</label>
                                    <span className="text-[10px] font-bold text-fario-purple">{formData.stockQuantity || 0} Units in Hand</span>
                                </div>
                                <input
                                    type="number"
                                    value={formData.stockQuantity}
                                    onChange={e => {
                                        const qty = Number(e.target.value);
                                        setFormData({ ...formData, stockQuantity: qty, inStock: qty > 0 });
                                    }}
                                    className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-6 py-4 text-sm font-bold focus:ring-2 focus:ring-fario-purple/5 outline-none"
                                    placeholder="Enter items available..."
                                />
                            </div>

                            <div className="space-y-2 pt-4 border-t border-gray-50">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Inventory Status</label>
                                <div className="grid grid-cols-2 gap-4">
                                    <button
                                        type="button"
                                        onClick={() => setFormData({ ...formData, inStock: true })}
                                        className={`py-4 rounded-2xl text-xs font-black uppercase tracking-widest border transition-all ${formData.inStock ? 'bg-emerald-50 text-emerald-600 border-emerald-200 ring-2 ring-emerald-500/10' : 'bg-white text-gray-400 border-gray-100 hover:bg-gray-50'}`}
                                    >
                                        In Stock
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setFormData({ ...formData, inStock: false })}
                                        className={`py-4 rounded-2xl text-xs font-black uppercase tracking-widest border transition-all ${!formData.inStock ? 'bg-rose-50 text-rose-600 border-rose-200 ring-2 ring-rose-500/10' : 'bg-white text-gray-400 border-gray-100 hover:bg-gray-50'}`}
                                    >
                                        Out of Stock
                                    </button>
                                </div>
                            </div>
                        </form>
                        <div className="p-10 border-t border-gray-100 bg-white">
                            <button onClick={handleSave} disabled={isSyncing || !!imageWarning} className="w-full py-5 bg-fario-dark text-white rounded-[2rem] font-black text-xs uppercase tracking-[0.3em] hover:bg-fario-purple transition-all shadow-xl flex items-center justify-center gap-3 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed">
                                {isSyncing ? <Loader2 size={18} className="animate-spin" /> : <Check size={18} />}
                                {productToEdit ? 'Update Asset' : 'Deploy to Catalog'}
                            </button>
                        </div>
                    </MotionDiv>
                </div>
            )}
        </AnimatePresence>
    );
};

export default AddProductModal;
