import { useCart } from '../context/CartProvider';
import { X, Minus, Plus, Trash2, ShoppingBag, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import '../styles/CartDrawer.css';

interface CartDrawerProps {
    isOpen: boolean;
    onClose: () => void;
}

export function CartDrawer({ isOpen, onClose }: CartDrawerProps) {
    const { cartItems: items, updateQuantity, removeFromCart: removeItem, cartTotal: totalAmount } = useCart();

    const handleUpdateQuantity = async (itemId: string, newQuantity: number) => {
        if (newQuantity < 1) return;
        await updateQuantity(itemId, newQuantity);
    };

    const handleRemoveItem = async (itemId: string) => {
        await removeItem(itemId);
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop Overlay */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="cart-drawer-overlay"
                        onClick={onClose}
                    />

                    {/* Drawer */}
                    <motion.div
                        initial={{ x: '100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '100%' }}
                        transition={{ type: 'spring', damping: 30, stiffness: 300 }}
                        className="cart-drawer"
                    >
                        {/* Header */}
                        <div className="cart-drawer-header">
                            <div className="cart-header-content">
                                <ShoppingBag size={24} strokeWidth={2} />
                                <h2>Shopping Cart</h2>
                                <span className="cart-count">{items.length}</span>
                            </div>
                            <button onClick={onClose} className="close-btn" aria-label="Close cart">
                                <X size={24} />
                            </button>
                        </div>

                        {/* Cart Items */}
                        <div className="cart-drawer-items">
                            {items.length === 0 ? (
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="cart-empty"
                                >
                                    <div className="empty-cart-icon">
                                        <ShoppingBag size={64} strokeWidth={1.5} />
                                    </div>
                                    <h3>Your cart is empty</h3>
                                    <p>Add some products to get started</p>
                                    <Link to="/products" onClick={onClose} className="continue-shopping">
                                        Browse Products
                                        <ArrowRight size={18} />
                                    </Link>
                                </motion.div>
                            ) : (
                                <div className="cart-items-list">
                                    {items.map((item, index) => (
                                        <motion.div
                                            key={item.cartId || item.id}
                                            initial={{ opacity: 0, x: 20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            exit={{ opacity: 0, x: -20 }}
                                            transition={{ delay: index * 0.05 }}
                                            className="cart-item"
                                        >
                                            {/* Product Image */}
                                            <div className="cart-item-image">
                                                <img src={item.image} alt={item.name} />
                                                {item.quantity > 1 && (
                                                    <span className="item-quantity-badge">{item.quantity}</span>
                                                )}
                                            </div>

                                            {/* Product Details */}
                                            <div className="cart-item-details">
                                                <h3 className="item-name">{item.name}</h3>

                                                {/* Price & Subtotal */}
                                                <div className="item-pricing">
                                                    <span className="item-price">₹{item.price.toFixed(2)}</span>
                                                    {item.quantity > 1 && (
                                                        <span className="item-subtotal">
                                                            × {item.quantity} = ₹{(item.price * item.quantity).toFixed(2)}
                                                        </span>
                                                    )}
                                                </div>

                                                {/* Quantity Controls */}
                                                <div className="quantity-controls">
                                                    <button
                                                        onClick={() => handleUpdateQuantity(item.cartId || item.id, item.quantity - 1)}
                                                        disabled={item.quantity <= 1}
                                                        className="qty-btn"
                                                        aria-label="Decrease quantity"
                                                    >
                                                        <Minus size={14} />
                                                    </button>
                                                    <span className="qty-display">{item.quantity}</span>
                                                    <button
                                                        onClick={() => handleUpdateQuantity(item.cartId || item.id, item.quantity + 1)}
                                                        disabled={item.quantity >= (item.stockQuantity || 99)}
                                                        className="qty-btn"
                                                        aria-label="Increase quantity"
                                                    >
                                                        <Plus size={14} />
                                                    </button>
                                                </div>

                                                {/* Stock Warning */}
                                                {item.stockQuantity && item.quantity >= item.stockQuantity && (
                                                    <span className="stock-warning">Max stock reached</span>
                                                )}
                                            </div>

                                            {/* Remove Button */}
                                            <button
                                                onClick={() => handleRemoveItem(item.cartId || item.id)}
                                                className="remove-item-btn"
                                                aria-label="Remove item"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </motion.div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Footer with Actions */}
                        {items.length > 0 && (
                            <div className="cart-drawer-footer">
                                {/* Subtotal */}
                                <div className="cart-summary">
                                    <div className="summary-row">
                                        <span>Subtotal:</span>
                                        <span className="subtotal-amount">₹{totalAmount.toFixed(2)}</span>
                                    </div>
                                    <p className="summary-note">
                                        Shipping and taxes calculated at checkout
                                    </p>
                                </div>

                                {/* Action Buttons */}
                                <div className="cart-actions">
                                    <Link
                                        to="/cart"
                                        onClick={onClose}
                                        className="view-cart-btn"
                                    >
                                        View Full Cart
                                    </Link>
                                    <Link
                                        to="/checkout"
                                        onClick={onClose}
                                        className="checkout-btn"
                                    >
                                        Proceed to Checkout
                                        <ArrowRight size={18} />
                                    </Link>
                                </div>
                            </div>
                        )}
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
