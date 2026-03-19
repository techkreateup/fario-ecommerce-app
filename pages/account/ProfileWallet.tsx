import React from 'react';
import * as RouterDOM from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { ProfileWalletCards } from '../../components/profile/ProfileWalletCards';

const { Link } = RouterDOM as any;

const ProfileWallet: React.FC = () => {
    return (
        <div className="min-h-screen bg-white pb-20 pt-28 px-4 font-sans text-[#0F1111]">
            <div className="max-w-4xl mx-auto">
                <div className="flex items-center text-sm text-[#565959] mb-4">
                    <Link to="/profile" className="hover:underline hover:text-[#C7511F]">Your Account</Link>
                    <ChevronRight size={14} className="mx-1" />
                    <span className="text-[#C7511F]">Fario Balance & Cards</span>
                </div>

                <ProfileWalletCards />
            </div>
        </div>
    );
};

export default ProfileWallet;
