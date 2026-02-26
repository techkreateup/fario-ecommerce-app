import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Button from '../components/Button';
import { MapPin, Phone, Mail, Clock, Send, MessageCircle, ArrowRight, Smartphone } from 'lucide-react';
import PageNav from '../components/PageNav';

// Define Variants type locally if missing
type Variants = any;

const Contact: React.FC = () => {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  const contactCards = [
    {
      icon: <MapPin size={24} />,
      title: "Visit Our Store",
      content: (
        <>
          <p>123 Fashion Street, Style District</p>
          <p>Mumbai, Maharashtra 400001</p>
          <p>India</p>
        </>
      ),
      action: { label: "Get Directions", link: "#" },
      bg: "bg-fario-purple/5",
      text: "text-fario-purple"
    },
    {
      icon: <Phone size={24} />,
      title: "Call Us",
      content: (
        <>
          <p>+91 98765 43210</p>
          <p>+91 87654 32109</p>
          <p className="text-fario-purple font-bold mt-1">Toll Free: 1800-FARIO-01</p>
        </>
      ),
      action: { label: "Call Now", link: "tel:+919876543210" },
      bg: "bg-fario-lime/20",
      text: "text-fario-dark"
    },
    {
      icon: <Mail size={24} />,
      title: "Email Us",
      content: (
        <>
          <p>hello@fario.in</p>
          <p>support@fario.in</p>
          <p>business@fario.in</p>
        </>
      ),
      action: { label: "Send Email", link: "mailto:hello@fario.in" },
      bg: "bg-pink-50",
      text: "text-pink-500"
    },
    {
      icon: <Clock size={24} />,
      title: "Business Hours",
      content: (
        <div className="w-full text-xs font-bold uppercase tracking-wide text-gray-400 space-y-2">
          <div className="flex justify-between border-b border-gray-100 pb-1">
            <span>Mon - Fri</span> <span>9:00 AM - 7:00 PM</span>
          </div>
          <div className="flex justify-between border-b border-gray-100 pb-1">
            <span>Saturday</span> <span>10:00 AM - 6:00 PM</span>
          </div>
          <div className="flex justify-between">
            <span>Sunday</span> <span>11:00 AM - 5:00 PM</span>
          </div>
        </div>
      ),
      action: null,
      bg: "bg-blue-50",
      text: "text-blue-600"
    }
  ];

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const cardVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: "spring", stiffness: 50, damping: 20 }
    }
  };

  // Cast motion components to any to bypass prop errors
  const MotionDiv = (motion as any).div;

  return (
    <div className="pt-24 pb-24 min-h-screen bg-fario-light relative overflow-x-hidden selection:bg-fario-purple selection:text-white">

      {/* Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute inset-0 bg-topo-pattern opacity-[0.03]" />
        <div className="absolute top-[-20%] right-[-10%] w-[700px] h-[700px] bg-fario-purple/5 rounded-full blur-[120px] mix-blend-multiply" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] bg-fario-lime/10 rounded-full blur-[100px] mix-blend-multiply" />
      </div>

      <div className="container mx-auto px-6 relative z-10">

        {/* Page Navigation Controls */}
        <PageNav />

        {/* --- Header --- */}
        <div className="text-center max-w-4xl mx-auto mb-20 mt-8">
          <MotionDiv
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <span className="bg-white border border-gray-200 px-5 py-2 text-[10px] font-black uppercase tracking-[0.3em] rounded-full mb-8 inline-block text-fario-dark shadow-sm">Get In Touch</span>
            <h1 className="text-5xl md:text-7xl font-black text-fario-dark mb-6 uppercase tracking-tighter font-heading leading-[0.9]">
              Contact <span className="text-transparent bg-clip-text bg-gradient-to-r from-fario-purple to-indigo-600">FARIO</span>
            </h1>
            <p className="text-xl text-gray-500 font-medium max-w-2xl mx-auto">
              We'd love to hear from you. Reach out to us through any of these channels.
            </p>
          </MotionDiv>
        </div>

        {/* --- Info Cards Grid --- */}
        <MotionDiv
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-24"
        >
          {contactCards.map((card, idx) => (
            <MotionDiv
              key={idx}
              variants={cardVariants}
              className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-xl hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 flex flex-col items-start group h-full"
            >
              <div className={`w-14 h-14 ${card.bg} rounded-2xl flex items-center justify-center ${card.text} mb-6 group-hover:scale-110 transition-transform duration-300`}>
                {card.icon}
              </div>
              <h3 className="text-lg font-black font-heading text-fario-dark uppercase tracking-tight mb-4">{card.title}</h3>
              <div className="text-sm text-gray-500 font-medium leading-relaxed mb-6 w-full flex-grow">
                {card.content}
              </div>
              {card.action && (
                <a
                  href={card.action.link}
                  className={`inline-flex items-center gap-2 text-xs font-black uppercase tracking-widest ${card.text} hover:opacity-80 transition-opacity mt-auto`}
                >
                  {card.action.label} <ArrowRight size={12} />
                </a>
              )}
            </MotionDiv>
          ))}
        </MotionDiv>

        {/* --- Main Interaction Section --- */}
        <section className="bg-fario-dark rounded-[3rem] p-10 lg:p-20 relative overflow-hidden text-white shadow-2xl">
          <div className="absolute inset-0 bg-topo-pattern opacity-10 invert pointer-events-none" />
          <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] bg-fario-purple/20 rounded-full blur-[100px] pointer-events-none" />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 relative z-10">

            {/* Left Column: Ready to Connect? */}
            <MotionDiv
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="flex flex-col justify-center"
            >
              <div className="flex items-center gap-3 mb-8">
                <MessageCircle size={24} className="text-fario-lime" />
                <span className="text-fario-lime text-xs font-bold uppercase tracking-widest">Priority Support</span>
              </div>

              <h2 className="text-4xl lg:text-6xl font-black font-heading uppercase leading-[0.9] mb-8">
                Ready to <br /> <span className="text-outline-white">Connect?</span>
              </h2>

              <p className="text-gray-400 text-lg mb-12 leading-relaxed max-w-md">
                Have questions or need assistance? We're here to help you find the perfect footwear.
              </p>

              <div className="flex flex-col sm:flex-row gap-5">
                <a
                  href="tel:+919876543210"
                  className="group flex items-center justify-center gap-3 bg-white text-fario-dark px-8 py-5 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-fario-lime transition-all duration-300 shadow-lg"
                >
                  <Smartphone size={16} />
                  Call Us Now
                </a>
                <a
                  href="https://wa.me/919876543210"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center justify-center gap-3 bg-fario-purple/20 border border-fario-purple/50 text-white px-8 py-5 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-fario-purple hover:border-fario-purple transition-all duration-300"
                >
                  <MessageCircle size={16} />
                  Chat on WhatsApp
                </a>
              </div>
            </MotionDiv>

            {/* Right Column: Contact Form */}
            <MotionDiv
              className="bg-white/5 backdrop-blur-md border border-white/10 rounded-[2.5rem] p-8 lg:p-10"
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              {!submitted ? (
                <form onSubmit={async (e) => {
                  e.preventDefault();
                  const fd = new FormData(e.currentTarget);
                  const data = {
                    name: fd.get('name') as string,
                    email: fd.get('email') as string,
                    message: fd.get('message') as string,
                    id: 'INQ-' + Date.now()
                  };

                  setSubmitted(true); // Optimistic UI

                  // FIRE AND FORGET
                  try {
                    const { logAction } = await import('../services/logService');
                    await logAction('contact_inquiry', data);
                  } catch (e) { console.error(e); }
                }} className="space-y-6">
                  <h3 className="text-2xl font-black font-heading uppercase text-white mb-2">Send Message</h3>
                  <p className="text-gray-400 text-sm mb-6">Fill out the form below and we'll get back to you shortly.</p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500 ml-2">Identity</label>
                      <input
                        name="name"
                        type="text"
                        placeholder="Your Name"
                        className="w-full bg-black/20 border border-white/10 rounded-xl px-5 py-4 text-sm font-bold text-white placeholder:text-white/20 focus:border-fario-lime outline-none transition-all focus:bg-black/40"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500 ml-2">Contact</label>
                      <input
                        name="email"
                        type="email"
                        placeholder="Email Address"
                        className="w-full bg-black/20 border border-white/10 rounded-xl px-5 py-4 text-sm font-bold text-white placeholder:text-white/20 focus:border-fario-lime outline-none transition-all focus:bg-black/40"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500 ml-2">Details</label>
                    <textarea
                      name="message"
                      rows={4}
                      placeholder="How can we help you?"
                      className="w-full bg-black/20 border border-white/10 rounded-xl px-5 py-4 text-sm font-bold text-white placeholder:text-white/20 focus:border-fario-lime outline-none transition-all resize-none focus:bg-black/40"
                      required
                    />
                  </div>

                  <Button type="submit" className="w-full py-5 bg-gradient-to-r from-fario-purple to-indigo-600 text-white hover:shadow-lg hover:shadow-fario-purple/30 border-none font-black uppercase tracking-widest text-xs flex items-center justify-center gap-3 rounded-xl">
                    Send Transmission <Send size={14} />
                  </Button>
                </form>
              ) : (
                <div className="text-center py-20 h-full flex flex-col items-center justify-center">
                  <MotionDiv
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center mb-8 shadow-2xl shadow-green-500/30"
                  >
                    <Send size={40} className="text-white" />
                  </MotionDiv>
                  <h3 className="text-3xl font-black uppercase tracking-tight mb-4 font-heading">Message Sent</h3>
                  <p className="text-gray-400 text-sm mb-8 max-w-xs mx-auto">We have received your transmission. Our team is analyzing your request.</p>
                  <button onClick={() => setSubmitted(false)} className="text-xs font-black uppercase tracking-widest text-fario-lime hover:text-white transition-colors underline">Send New Message</button>
                </div>
              )}
            </MotionDiv>
          </div>
        </section>

      </div>
    </div>
  );
};

export default Contact;