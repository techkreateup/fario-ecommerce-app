import React, { useState } from 'react';
import * as RouterDOM from 'react-router-dom';
import { ChevronRight, Plus, CreditCard, Wallet, Trash2 } from 'lucide-react';
import { useToast } from '../../context/ToastContext';

const { Link, useNavigate } = RouterDOM as any;

const ProfilePayments: React.FC = () => {
    const navigate = useNavigate();
    const toast = useToast();

    const [cards, setCards] = useState([
        { id: 1, type: 'HDFC', last4: '4242', name: 'Akash K', exp: '12/28' }
    ]);
    const [showAddCard, setShowAddCard] = useState(false);
    const [newCard, setNewCard] = useState({ number: '', name: '', exp: '', cvv: '' });

    const handleAddCard = () => {
        // Mock validation
        if (newCard.number.length < 16) {
            toast.error('Invalid card number');
            return;
        }
        setCards([...cards, {
            id: Date.now(),
            type: 'Visa',
            last4: newCard.number.slice(-4),
            name: newCard.name,
            exp: newCard.exp
        }]);
        setShowAddCard(false);
        setNewCard({ number: '', name: '', exp: '', cvv: '' });
    };

    return (
        <div className="min-h-screen bg-white pb-20 pt-28 px-4 font-sans text-[#0F1111]">
            <div className="max-w-4xl mx-auto">

                <div className="flex items-center text-sm text-[#565959] mb-4">
                    <Link to="/profile" className="hover:underline hover:text-[#C7511F]">Your Account</Link>
                    <ChevronRight size={14} className="mx-1" />
                    <span className="text-[#C7511F]">Payment Options</span>
                </div>

                <h1 className="text-[28px] font-normal mb-2">Wallet & Payment Options</h1>
                <p className="text-[#565959] mb-8">Manage your payment methods and Fario Wallet settings.</p>

                {/* CREDIT CARDS */}
                <div className="border border-[#D5D9D9] rounded-lg p-6 mb-8">
                    <h2 className="text-[18px] font-bold mb-4">Credit & Debit Cards</h2>

                    <div className="flex flex-col gap-4">
                        {cards.map(card => (
                            <div key={card.id} className="border border-[#D5D9D9] rounded-lg p-4 flex justify-between items-center bg-[#F7FAFA]">
                                <div className="flex items-center gap-4">
                                    <CreditCard size={32} className="text-[#565959]" />
                                    <div>
                                        <p className="font-bold text-[14px]">{card.type} Bank ending in {card.last4}</p>
                                        <p className="text-[12px] text-[#565959]">{card.name} • Expires {card.exp}</p>
                                    </div>
                                </div>
                                <div className="flex gap-4 text-[13px] text-[#007185] font-medium">
                                    <button onClick={() => setCards(cards.filter(c => c.id !== card.id))} className="hover:underline hover:text-[#C7511F]">Remove</button>
                                    <button className="hover:underline hover:text-[#C7511F]">Edit</button>
                                </div>
                            </div>
                        ))}

                        {showAddCard ? (
                            <div className="border border-[#D5D9D9] rounded-lg p-4 bg-gray-50">
                                <h3 className="font-bold text-sm mb-3">Add a card</h3>
                                <div className="grid gap-3 max-w-md">
                                    <input placeholder="Card Number" className="p-2 border rounded" value={newCard.number} onChange={e => setNewCard({ ...newCard, number: e.target.value })} maxLength={16} />
                                    <input placeholder="Name on Card" className="p-2 border rounded" value={newCard.name} onChange={e => setNewCard({ ...newCard, name: e.target.value })} />
                                    <div className="flex gap-2">
                                        <input placeholder="MM/YY" className="p-2 border rounded w-1/2" value={newCard.exp} onChange={e => setNewCard({ ...newCard, exp: e.target.value })} maxLength={5} />
                                        <input placeholder="CVV" className="p-2 border rounded w-1/2" value={newCard.cvv} onChange={e => setNewCard({ ...newCard, cvv: e.target.value })} maxLength={3} />
                                    </div>
                                    <div className="flex gap-2 mt-2">
                                        <button onClick={handleAddCard} className="bg-[#FFD814] border border-[#FCD200] px-4 py-1 rounded text-sm font-medium">Add Card</button>
                                        <button onClick={() => setShowAddCard(false)} className="border px-4 py-1 rounded text-sm">Cancel</button>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div onClick={() => setShowAddCard(true)} className="border border-[#D5D9D9] rounded-lg p-4 flex items-center cursor-pointer hover:bg-[#F0F2F2]">
                                <Plus size={20} className="text-[#565959] mr-3" />
                                <span className="text-[14px] font-medium">Add a credit or debit card</span>
                            </div>
                        )}
                    </div>
                </div>

                {/* UPI */}
                <div className="border border-[#D5D9D9] rounded-lg p-6">
                    <h2 className="text-[18px] font-bold mb-4">UPI & Bank Accounts</h2>
                    <div className="flex flex-col gap-4">
                        <div className="border border-[#D5D9D9] rounded-lg p-4 flex items-center cursor-pointer hover:bg-[#F0F2F2]">
                            <Plus size={20} className="text-[#565959] mr-3" />
                            <span className="text-[14px] font-medium">Add a bank account</span>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default ProfilePayments;
