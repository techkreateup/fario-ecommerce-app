import React, { useState } from 'react';
import { Wallet, Plus, ArrowUpRight, ArrowDownLeft, History, CreditCard, ShieldCheck, X } from 'lucide-react';
import { useToast } from '../../context/ToastContext';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';

export const ProfileWalletCards: React.FC = () => {
    const { user } = useAuth();
    // --- STATE ---
    const [balance, setBalance] = useState(0);
    const [cards, setCards] = useState<any[]>([]);
    const [modalType, setModalType] = useState<'money' | 'card' | null>(null);
    const [amount, setAmount] = useState('');
    const [cardData, setCardData] = useState({ number: '', name: '', expiry: '' });
    const [loading, setLoading] = useState(false);

    // --- HOOKS ---
    const toast = useToast();

    // --- EFFECTS ---
    React.useEffect(() => {
        if (!user) return;
        const fetchWallet = async () => {
            const { supabase } = await import('../../lib/supabase');
            const { data, error } = await supabase
                .from('profiles')
                .select('wallet_balance, saved_cards')
                .eq('id', user.id)
                .single();

            if (data) {
                setBalance(data.wallet_balance || 0);
                setCards(data.saved_cards || []);
            }
        };
        fetchWallet();
    }, [user]);

    // --- HANDLERS ---
    // --- HANDLERS ---
    const handleAddMoney = async (e: React.FormEvent) => {
        e.preventDefault();
        const amountToAdd = Number(amount);
        if (amountToAdd <= 0) {
            toast.error("Please enter a valid amount");
            return;
        }

        try {
            setLoading(true);
            const { supabase } = await import('../../lib/supabase');

            // Use RPC
            const { data, error } = await supabase.rpc('add_wallet_money', { p_amount: amountToAdd });

            if (error) throw error;

            setBalance(data); // RPC returns new balance
            setModalType(null);
            setAmount('');
            toast.success(`Successfully added Rs. ${amountToAdd} to your wallet!`);
        } catch (err: any) {
            console.error(err);
            toast.error("Failed to add money: " + err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleAddCard = async (e: React.FormEvent) => {
        e.preventDefault();
        const newCard = {
            id: Date.now(),
            type: 'VISA', // Mock detection
            bank: 'Added Card',
            last4: cardData.number.slice(-4) || '0000',
            color: 'bg-indigo-600'
        };

        try {
            setLoading(true);
            const { supabase } = await import('../../lib/supabase');
            const newCards = [...cards, newCard];

            const { error } = await supabase
                .from('profiles')
                .update({ saved_cards: newCards, updated_at: new Date().toISOString() })
                .eq('id', user?.id);

            if (error) throw error;

            setCards(newCards);
            setModalType(null);
            setCardData({ number: '', name: '', expiry: '' });
            toast.success('Card saved securely');
        } catch (err: any) {
            toast.error("Failed to save card");
        } finally {
            setLoading(false);
        }
    };

    const removeCard = async (id: number) => {
        if (!window.confirm('Remove this card?')) return;

        try {
            const { supabase } = await import('../../lib/supabase');
            const newCards = cards.filter(c => c.id !== id);

            const { error } = await supabase
                .from('profiles')
                .update({ saved_cards: newCards })
                .eq('id', user?.id);

            if (error) throw error;
            setCards(newCards);
            toast.info("Card removed");
        } catch (err) {
            toast.error("Failed to remove card");
        }
    };

    return (
        <div className="space-y-8 relative">
            <div className="flex items-center justify-between pb-4 border-b border-gray-100">
                <div>
                    <h2 className="text-2xl font-black text-gray-900 tracking-tight flex items-center gap-2">
                        Wallet & Cards <CreditCard className="text-fario-purple" size={24} strokeWidth={2.5} />
                    </h2>
                    <p className="text-sm text-gray-500 font-medium">Manage payment methods securely</p>
                </div>
            </div>

            {/* Fario Balance */}
            <div className="bg-gradient-to-br from-gray-900 to-black text-white rounded-2xl p-8 shadow-xl shadow-gray-900/20 relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-16 -mt-16 blur-2xl group-hover:bg-white/10 transition-colors duration-700"></div>
                <div className="relative z-10 flex items-center justify-between">
                    <div>
                        <p className="text-sm font-medium text-gray-400 mb-1 flex items-center gap-2"><Wallet size={16} /> Fario Pay Balance</p>
                        <h3 className="text-4xl font-black tracking-tight flex items-start gap-1">
                            <span className="text-2xl mt-1">Rs. </span> {balance.toLocaleString('en-IN')}.00
                        </h3>
                    </div>
                    <button
                        onClick={() => setModalType('money')}
                        className="px-6 py-3 bg-white text-gray-900 rounded-xl font-bold text-sm hover:bg-gray-100 transition-all shadow-lg active:scale-95"
                    >
                        + Add Money
                    </button>
                </div>
            </div>

            {/* Saved Cards */}
            <h3 className="font-bold text-gray-900 text-lg">Saved Cards</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <AnimatePresence>
                    {cards.map(card => (
                        <motion.div
                            key={card.id}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            whileHover={{ y: -4 }}
                            className="bg-white rounded-xl border border-gray-200 p-6 flex items-start justify-between group hover:border-gray-300 transition-colors hover:shadow-lg"
                        >
                            <div className="flex gap-4">
                                <div className={`w-12 h-8 ${card.color} rounded flex items-center justify-center text-white font-bold italic text-[10px]`}>{card.type}</div>
                                <div>
                                    <p className="font-bold text-gray-900">{card.bank}</p>
                                    <p className="text-sm text-gray-500 font-medium">Ending in •••• {card.last4}</p>
                                    <p className="text-xs text-green-600 font-bold mt-2 flex items-center gap-1">
                                        <ShieldCheck size={12} /> Secure
                                    </p>
                                </div>
                            </div>
                            <button
                                onClick={() => removeCard(card.id)}
                                className="text-xs font-bold text-red-500 opacity-0 group-hover:opacity-100 transition-opacity hover:underline"
                            >
                                Remove
                            </button>
                        </motion.div>
                    ))}
                </AnimatePresence>

                {/* Add New Trigger */}
                <button
                    onClick={() => setModalType('card')}
                    className="border-2 border-dashed border-gray-200 rounded-xl p-6 flex flex-col items-center justify-center text-gray-400 hover:border-fario-purple hover:text-fario-purple hover:bg-fario-purple/5 transition-all h-full min-h-[120px] group"
                >
                    <div className="w-10 h-10 bg-gray-50 rounded-full flex items-center justify-center mb-2 group-hover:bg-white transition-colors">
                        <Plus size={20} />
                    </div>
                    <span className="font-bold text-sm">Add New Card</span>
                </button>
            </div>

            {/* Recent Transactions (NEW) */}
            <div className="pt-6 border-t border-gray-100">
                <h3 className="font-bold text-gray-900 text-lg mb-4 flex items-center gap-2">
                    <History size={18} className="text-gray-400" /> Recent Transactions
                </h3>
                <div className="bg-white rounded-xl border border-gray-200 divide-y divide-gray-100 overflow-hidden">
                    {[
                        { id: 1, type: 'Added Money', amount: 5000, date: '2 Feb 2026', icon: ArrowDownLeft, color: 'text-green-600' },
                        { id: 2, type: 'Refund: Order #405-3920', amount: 1299, date: '1 Feb 2026', icon: ArrowDownLeft, color: 'text-green-600' },
                        { id: 3, type: 'Payment: Order #405-1122', amount: 3450, date: '28 Jan 2026', icon: ArrowUpRight, color: 'text-gray-900' }
                    ].map(tx => (
                        <div key={tx.id} className="p-4 flex items-center justify-between hover:bg-gray-50 transition-colors">
                            <div className="flex items-center gap-3">
                                <div className={`p-2 rounded-full bg-gray-50 ${tx.color === 'text-green-600' ? 'text-green-600' : 'text-gray-600'}`}>
                                    <tx.icon size={16} />
                                </div>
                                <div>
                                    <p className="font-bold text-gray-900 text-sm">{tx.type}</p>
                                    <p className="text-xs text-gray-500">{tx.date}</p>
                                </div>
                            </div>
                            <span className={`font-black text-sm ${tx.color}`}>
                                {tx.color === 'text-green-600' ? '+' : '-'}Rs. {tx.amount}
                            </span>
                        </div>
                    ))}
                </div>
            </div>

            <p className="text-center text-xs text-gray-400 flex items-center justify-center gap-2 pt-4">
                <ShieldCheck size={12} /> Your payment information is encrypted and secure.
            </p>

            {/* --- MODALS --- */}
            <AnimatePresence>
                {modalType && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <div className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm" onClick={() => setModalType(null)} />

                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="bg-white rounded-2xl p-6 w-full max-w-sm relative z-10 shadow-2xl"
                        >
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="font-black text-xl text-gray-900">{modalType === 'money' ? 'Add Money' : 'Add New Card'}</h3>
                                <button onClick={() => setModalType(null)}><X size={20} className="text-gray-400 hover:text-gray-900" /></button>
                            </div>

                            {modalType === 'money' ? (
                                <form onSubmit={handleAddMoney} className="space-y-4">
                                    <div>
                                        <label className="text-xs font-bold text-gray-500 uppercase">Amount (Rs.)</label>
                                        <input autoFocus type="number" value={amount} onChange={e => setAmount(e.target.value)} className="w-full text-3xl font-black text-gray-900 border-b-2 border-gray-200 focus:border-fario-purple outline-none py-2" placeholder="0" min="1" required />
                                    </div>
                                    <div className="flex gap-2">
                                        {[500, 1000, 2000].map(val => (
                                            <button type="button" key={val} onClick={() => setAmount(val.toString())} className="px-3 py-1 bg-gray-100 rounded-full text-xs font-bold text-gray-600 hover:bg-gray-200">+Rs. {val}</button>
                                        ))}
                                    </div>
                                    <button type="submit" className="w-full py-3 bg-fario-purple text-white rounded-xl font-bold mt-4">Proceed to Add</button>
                                </form>
                            ) : (
                                <form onSubmit={handleAddCard} className="space-y-4">
                                    <div>
                                        <label className="text-xs font-bold text-gray-500 uppercase block mb-1">Card Number</label>
                                        <input type="text" maxLength={19} value={cardData.number} onChange={e => setCardData({ ...cardData, number: e.target.value })} className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2 font-bold text-gray-900" placeholder="0000 0000 0000 0000" required />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="text-xs font-bold text-gray-500 uppercase block mb-1">Expiry</label>
                                            <input type="text" maxLength={5} value={cardData.expiry} onChange={e => setCardData({ ...cardData, expiry: e.target.value })} className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2 font-bold text-gray-900" placeholder="MM/YY" required />
                                        </div>
                                        <div>
                                            <label className="text-xs font-bold text-gray-500 uppercase block mb-1">CVV</label>
                                            <input type="password" maxLength={3} className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2 font-bold text-gray-900" placeholder="123" required />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="text-xs font-bold text-gray-500 uppercase block mb-1">Name on Card</label>
                                        <input type="text" value={cardData.name} onChange={e => setCardData({ ...cardData, name: e.target.value })} className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2 font-bold text-gray-900" placeholder={user?.user_metadata?.name || 'Your Name'} required />
                                    </div>
                                    <button type="submit" className="w-full py-3 bg-gray-900 text-white rounded-xl font-bold mt-4 shadow-lg">Save Card</button>
                                </form>
                            )}
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};
