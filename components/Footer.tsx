import React from 'react';
import { motion } from 'framer-motion';
import * as RouterDOM from 'react-router-dom';
import { Instagram, Youtube, Facebook, Mail } from 'lucide-react';
import Logo from './Logo';

// Fix missing member Link in react-router-dom
const { Link } = RouterDOM as any;

const Footer: React.FC = () => {
  const supportLinks = [
    { label: 'Shipping Info', path: '/info/shipping' },
    { label: 'Returns', path: '/info/returns' },
    { label: 'FAQ', path: '/info/faq' },
    { label: 'Contact Us', path: '/contact' },
  ];

  const legalLinks = [
    { label: 'Privacy Policy', path: '/info/privacy' },
    { label: 'Terms of Service', path: '/info/terms' },
    { label: 'Cookie Policy', path: '/info/cookie' },
    { label: 'Accessibility', path: '/info/accessibility' },
  ];

  const socialLinks = [
    { icon: <Instagram size={18} />, label: 'Instagram', href: 'https://instagram.com' },
    { icon: <Mail size={18} />, label: 'Gmail', href: 'mailto:contact@fario.com' },
    { icon: <Youtube size={18} />, label: 'YouTube', href: 'https://youtube.com' },
    { icon: <Facebook size={18} />, label: 'Facebook', href: 'https://facebook.com' },
  ];

  // Cast motion components to any to bypass prop errors
  const MotionDiv = (motion as any).div;

  return (
    <footer className="bg-fario-dark text-white pt-20 pb-10 overflow-hidden border-t border-white/5 relative z-20">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 mb-16">

          {/* Brand - Span 2 cols */}
          <div className="lg:col-span-2">
            <MotionDiv
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <div className="flex items-center gap-3 mb-6">
                <Logo size={48} className="shadow-xl shadow-fario-purple/20" />
                <h2 className="text-2xl font-bold tracking-tight">FARIO</h2>
              </div>
              <p className="text-gray-400 text-sm leading-relaxed max-w-sm mb-8">
                Step Into Your School Story. Premium essentials designed for comfort, durability, and identity. Engineered for the next generation of achievers.
              </p>
              <div className="flex gap-4">
                {socialLinks.map((social) => (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-fario-purple hover:text-white transition-all duration-300 group"
                  >
                    <span className="sr-only">{social.label}</span>
                    <div className="group-hover:scale-110 transition-transform">
                      {social.icon}
                    </div>
                  </a>
                ))}
              </div>
            </MotionDiv>
          </div>

          {/* Support */}
          <MotionDiv
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
            <h3 className="text-lg font-bold mb-6 text-white">Support</h3>
            <ul className="space-y-3">
              {supportLinks.map((item) => (
                <li key={item.path}>
                  <Link to={item.path} className="text-gray-400 hover:text-fario-lime text-sm transition-colors">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </MotionDiv>

          {/* Legal */}
          <MotionDiv
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            <h3 className="text-lg font-bold mb-6 text-white">Legal</h3>
            <ul className="space-y-3">
              {legalLinks.map((item) => (
                <li key={item.path}>
                  <Link to={item.path} className="text-gray-400 hover:text-fario-lime text-sm transition-colors">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </MotionDiv>

          {/* Newsletter */}
          <MotionDiv
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
          >
            <h3 className="text-lg font-bold mb-6 text-white">Stay Updated</h3>
            <p className="text-xs text-gray-500 mb-4">Subscribe for latest drops and exclusive offers.</p>
            <div className="flex flex-col gap-3">
              <input
                type="email"
                placeholder="Enter email address"
                className="bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-sm w-full focus:border-fario-purple outline-none transition-colors"
              />
              <button className="bg-fario-purple text-white font-semibold rounded-lg px-4 py-3 hover:bg-opacity-90 text-sm">
                Subscribe
              </button>
            </div>
          </MotionDiv>
        </div>

        <div className="border-t border-white/10 pt-8 text-center md:text-left flex flex-col md:flex-row justify-between items-center text-gray-500 text-xs">
          <p>© {new Date().getFullYear()} FARIO. All rights reserved.</p>
          <div className="flex gap-6 mt-4 md:mt-0">
            <span>Made with ♥ in Coimbatore</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;