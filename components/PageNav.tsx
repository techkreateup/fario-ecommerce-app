
import React from 'react';
import * as RouterDOM from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, ArrowRight } from 'lucide-react';

const { useNavigate } = RouterDOM as any;

const PageNav: React.FC = () => {
  const navigate = useNavigate();

  // Cast motion components to any to bypass prop errors
  const MotionButton = (motion as any).button;

  return (
    <div className="hidden md:flex items-center gap-2 mb-8">
      <MotionButton
        whileHover={{ x: -3 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => navigate(-1)}
        className="flex items-center justify-center w-10 h-10 rounded-full bg-white border border-gray-100 shadow-sm text-fario-dark hover:text-fario-purple hover:border-fario-purple transition-all"
        aria-label="Go back"
      >
        <ArrowLeft size={18} />
      </MotionButton>

      <MotionButton
        whileHover={{ x: 3 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => navigate(1)}
        className="flex items-center justify-center w-10 h-10 rounded-full bg-white border border-gray-100 shadow-sm text-fario-dark hover:text-fario-purple hover:border-fario-purple transition-all"
        aria-label="Go forward"
      >
        <ArrowRight size={18} />
      </MotionButton>
    </div>
  );
};

export default PageNav;
