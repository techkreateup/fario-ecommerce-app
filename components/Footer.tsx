import React from 'react';
import { motion } from 'framer-motion';
import * as RouterDOM from 'react-router-dom';
import { Instagram, Youtube, Facebook, Mail, MapPin, Phone } from 'lucide-react';

const { Link } = RouterDOM as any;

// ─────────────────────────────────────────────────────────────────────────────
// FOOTER — Mobile-First Rewrite
// Mobile: Brand centered on top → 2×2 link grid → newsletter → bottom bar
// Desktop: 5-col grid layout as before
// ─────────────────────────────────────────────────────────────────────────────

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

  const MotionDiv = (motion as any).div;

  return (
    <footer
      style={{ backgroundColor: '#0e3039' }}
      className="text-white pt-10 md:pt-20 pb-28 md:pb-10 overflow-hidden border-t border-white/5 relative z-20"
    >
      <div className="w-full px-5 sm:px-8 md:container md:mx-auto md:px-6">

        {/* ── MOBILE LAYOUT ────────────────────────────────────────────────── */}
        <div className="md:hidden">

          {/* Brand Block */}
          <MotionDiv
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex flex-col items-center text-center mb-8"
          >
            <img
              src="/fario-ecommerce-app/fario-brand-logo.png"
              alt="Fario"
              className="h-12 w-auto object-contain mb-4"
            />
            <p className="text-gray-400 text-[13px] leading-relaxed max-w-xs">
              Step Into Your Next Chapter. Premium footwear designed for comfort, durability, and identity.
            </p>
            {/* Social icons */}
            <div className="flex gap-3 mt-5">
              {socialLinks.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.label}
                  className="w-10 h-10 rounded-full bg-white/8 flex items-center justify-center hover:bg-fario-purple transition-all duration-300"
                >
                  {s.icon}
                </a>
              ))}
            </div>
          </MotionDiv>

          {/* Links — 2 columns side by side */}
          <MotionDiv
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="grid grid-cols-2 gap-x-8 gap-y-1 mb-8 border-t border-white/8 pt-7"
          >
            {/* Support column */}
            <div>
              <h4 className="text-[10px] font-black uppercase tracking-[0.25em] text-white/50 mb-3">Support</h4>
              <ul className="space-y-2.5">
                {supportLinks.map((item) => (
                  <li key={item.path}>
                    <Link
                      to={item.path}
                      className="text-gray-300 text-[13px] font-medium hover:text-fario-lime transition-colors"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Legal column */}
            <div>
              <h4 className="text-[10px] font-black uppercase tracking-[0.25em] text-white/50 mb-3">Legal</h4>
              <ul className="space-y-2.5">
                {legalLinks.map((item) => (
                  <li key={item.path}>
                    <Link
                      to={item.path}
                      className="text-gray-300 text-[13px] font-medium hover:text-fario-lime transition-colors"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </MotionDiv>

          {/* Newsletter */}
          <MotionDiv
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.15 }}
            className="border-t border-white/8 pt-7 mb-7"
          >
            <h4 className="text-[10px] font-black uppercase tracking-[0.25em] text-white/50 mb-1.5">Stay Updated</h4>
            <p className="text-[12px] text-gray-500 mb-4">Latest drops and exclusive member offers.</p>
            <div className="flex gap-2">
              <input
                type="email"
                placeholder="Your email"
                className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-[13px] text-white placeholder:text-gray-600 focus:border-fario-purple outline-none transition-colors min-w-0"
              />
              <button className="bg-fario-purple text-white font-bold rounded-xl px-5 py-3 text-[11px] uppercase tracking-widest hover:bg-opacity-90 flex-shrink-0 transition-colors">
                Go
              </button>
            </div>
          </MotionDiv>

          {/* Contact info */}
          <div className="flex flex-col gap-2 mb-7 border-t border-white/8 pt-6">
            <a href="mailto:contact@fario.com" className="flex items-center gap-2.5 text-gray-400 text-[12px]">
              <Mail size={14} className="flex-shrink-0 text-fario-lime" />
              contact@fario.com
            </a>
            <div className="flex items-center gap-2.5 text-gray-400 text-[12px]">
              <MapPin size={14} className="flex-shrink-0 text-fario-lime" />
              Coimbatore, Tamil Nadu, India
            </div>
          </div>

          {/* Bottom bar */}
          <div className="border-t border-white/8 pt-5 text-center">
            <p className="text-gray-500 text-[11px]">© {new Date().getFullYear()} FARIO. All rights reserved.</p>
            <p className="text-gray-600 text-[10px] mt-1 font-bold uppercase tracking-widest">Made with ♥ in Coimbatore</p>
          </div>
        </div>

        {/* ── DESKTOP LAYOUT (md+) — untouched 5-col grid ─────────────────── */}
        <div className="hidden md:block">
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-12 mb-12 md:mb-16">

            {/* Brand — 2 cols */}
            <div className="lg:col-span-2">
              <MotionDiv initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
                <div className="mb-6">
                  <img
                    src="/fario-ecommerce-app/fario-brand-logo.png"
                    alt="Fario - Step In, Stand Out"
                    className="h-16 w-auto object-contain"
                    style={{ maxWidth: '240px' }}
                  />
                </div>
                <p className="text-gray-400 text-sm leading-relaxed max-w-sm mb-8">
                  Step Into Your Next Chapter. Premium women's essentials designed for comfort, durability, and identity. Engineered for the modern achiever.
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
                      <div className="group-hover:scale-110 transition-transform">{social.icon}</div>
                    </a>
                  ))}
                </div>
              </MotionDiv>
            </div>

            {/* Support */}
            <MotionDiv initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }}>
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
            <MotionDiv initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }}>
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
            <MotionDiv initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.3 }}>
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

          {/* Desktop bottom bar */}
          <div className="border-t border-white/10 pt-8 text-center flex flex-col md:flex-row justify-between items-center text-gray-400 text-[10px] md:text-xs">
            <p>© {new Date().getFullYear()} FARIO. All rights reserved.</p>
            <div className="flex gap-6 mt-4 md:mt-0 font-bold uppercase tracking-widest">
              <span>Made with ♥ in Coimbatore</span>
            </div>
          </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;