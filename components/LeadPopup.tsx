
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle2, Loader2, Lock } from 'lucide-react';
import { useCart } from '../context/CartProvider';

const GoogleIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
  </svg>
);

const LeadPopup: React.FC = () => {
  const { isLeadPopupOpen, setIsLeadPopupOpen, setHasSubscribed } = useCart();
  const [submitted, setSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Cast motion components to any to bypass prop errors
  const MotionDiv = (motion as any).div;

  const handleGoogleLogin = () => {
    setIsLoading(true);
    // Mimic global auth protocol
    setTimeout(() => {
      const mockProfile = {
        name: 'New Scout',
        email: 'scout.01@google.com',
        avatar: 'https://i.pravatar.cc/150?u=new_scout'
      };
      localStorage.setItem('fario_auth_token', `G_LEAD_${Math.random().toString(36).substr(2)}`);
      localStorage.setItem('fario_user_profile', JSON.stringify(mockProfile));

      setIsLoading(false);
      setHasSubscribed(true);
      setSubmitted(true);

      setTimeout(() => {
        setIsLeadPopupOpen(false);
        setSubmitted(false);
      }, 2500);
    }, 1500);
  };

  return (
    <AnimatePresence>
      {isLeadPopupOpen && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center px-4">
          <MotionDiv
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-md"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsLeadPopupOpen(false)}
          />

          <MotionDiv
            className="relative w-full max-w-md bg-white rounded-[3rem] overflow-hidden shadow-2xl p-6 md:p-10 border border-slate-100"
            initial={{ scale: 0.9, opacity: 0, y: 30 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 30 }}
          >
            <button
              onClick={() => setIsLeadPopupOpen(false)}
              className="absolute top-8 right-8 text-slate-300 hover:text-slate-800 transition-colors"
            >
              <X size={20} />
            </button>

            {!submitted ? (
              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 bg-fario-purple/10 rounded-2xl flex items-center justify-center mb-8 text-fario-purple shadow-inner">
                  <span className="font-heading font-black text-2xl uppercase italic">F</span>
                </div>

                <h2 className="text-3xl font-black font-heading text-slate-800 mb-2 uppercase italic tracking-tighter">
                  Wait! One <span className="text-fario-purple">More Thing</span>
                </h2>
                <p className="text-slate-400 mb-10 text-xs font-bold uppercase tracking-[0.2em] leading-relaxed max-w-[280px]">
                  Sync via Google and unlock <span className="text-fario-purple">10% OFF</span> your first procurement instantly.
                </p>

                <button
                  onClick={handleGoogleLogin}
                  disabled={isLoading}
                  className="w-full bg-slate-50 border border-slate-200 text-slate-700 font-black py-5 px-6 rounded-2xl flex items-center justify-center gap-4 hover:bg-slate-100 hover:shadow-lg transition-all mb-6 text-[10px] uppercase tracking-[0.2em]"
                >
                  {isLoading ? (
                    <Loader2 className="animate-spin text-fario-purple" size={20} />
                  ) : (
                    <>
                      <GoogleIcon />
                      <span>Sync with Google Identity</span>
                    </>
                  )}
                </button>

                <div className="flex items-center w-full gap-4 mb-8 opacity-40">
                  <div className="h-px bg-slate-200 flex-1"></div>
                  <span className="text-[8px] text-slate-400 font-black uppercase tracking-widest">secure handshake</span>
                  <div className="h-px bg-slate-200 flex-1"></div>
                </div>

                <p className="text-[8px] font-bold text-slate-300 uppercase tracking-[0.3em] mt-4 leading-relaxed flex items-center gap-2">
                  <Lock size={10} /> Encryption protocol compliant.
                </p>
              </div>
            ) : (
              <div className="flex flex-col items-center text-center py-12">
                <MotionDiv
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="w-24 h-24 bg-fario-lime rounded-full flex items-center justify-center mb-8 shadow-xl shadow-fario-lime/20"
                >
                  <CheckCircle2 size={48} className="text-slate-900" strokeWidth={3} />
                </MotionDiv>
                <h3 className="text-3xl font-black font-heading text-slate-800 mb-2 uppercase italic tracking-tighter">IDENTITY SYNCED</h3>
                <p className="text-slate-400 text-xs font-bold uppercase tracking-[0.2em]">10% Discount applied to session.</p>
              </div>
            )}
          </MotionDiv>
        </div>
      )}
    </AnimatePresence>
  );
};

export default LeadPopup;
