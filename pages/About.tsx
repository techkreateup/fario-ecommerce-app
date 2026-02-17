
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ASSETS } from '../constants';
import {
  Building2, Target, Eye, Layers, ShieldCheck,
  School, Users, Trophy, Heart, CheckCircle2,
  ArrowRight, Sparkles, Zap, Globe
} from 'lucide-react';
import Button from '../components/Button';
import * as RouterDOM from 'react-router-dom';
import PageNav from '../components/PageNav';

// Fix missing members in react-router-dom
const { useNavigate } = RouterDOM as any;

const About: React.FC = () => {
  const navigate = useNavigate();
  const [formSubmitted, setFormSubmitted] = useState(false);

  const partners = [
    "Bannari Amman Matric & Public School, Sathy",
    "Bannari Amman Institute of Technology, Sathy",
    "Nava Bharath National & International School, Annur",
    "Chandrakanthi School, Coimbatore",
    "Mont Litra Zee School, Salem"
  ];

  const whyChoosePoints = [
    { title: "Uniform Quality", desc: "Consistent excellence across all school products.", icon: <Layers size={24} /> },
    { title: "Durable Materials", desc: "Tested rigorously for wear, tear, and comfort.", icon: <ShieldCheck size={24} /> },
    { title: "Fully Customizable", desc: "Designs tailored with embroidery or printed logos.", icon: <Sparkles size={24} /> },
    { title: "Reliable Support", desc: "Long-term partnerships and after-sales service.", icon: <Heart size={24} /> },
  ];

  const missionPoints = [
    { icon: "🎯", label: "Trend-Driven" },
    { icon: "💎", label: "High-Quality" },
    { icon: "💎", label: "Affordable" },
    { icon: "🔄", label: "Versatile" }
  ];

  const visionPoints = [
    { icon: "🇮🇳", label: "India First" },
    { icon: "👥", label: "Next Gen" },
    { icon: "✨", label: "Always Relevant" },
    { icon: "🌟", label: "Accessible" }
  ];

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormSubmitted(true);
  };

  // Cast motion components to any to bypass prop errors
  const MotionDiv = (motion as any).div;
  const MotionImg = (motion as any).img;

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

        {/* --- HERO SECTION: ABOUT US --- */}
        <section className="mb-24 mt-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <MotionDiv
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="flex flex-col justify-center"
            >
              <div className="flex items-center gap-3 mb-6">
                <span className="w-10 h-1 bg-fario-purple rounded-full"></span>
                <span className="text-sm font-bold uppercase tracking-widest text-fario-purple">Our Philosophy</span>
              </div>
              <h1 className="text-4xl lg:text-5xl font-black font-heading text-fario-dark mb-6 leading-[1.1]">
                We didn't just build a shoe. <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-fario-purple to-indigo-600">We started a movement.</span>
              </h1>
              <p className="text-gray-600 text-lg leading-relaxed mb-6 text-justify">
                In an industry obsessed with logos and hype, Fario stands for the opposite. We noticed that 'premium' often meant 'expensive marketing', not 'better product'. We set out to change that.
              </p>
              <p className="text-gray-600 text-lg leading-relaxed mb-8 text-justify">
                Born in 2024, Fario is the result of an obsession with the fundamental. We create for the creators, the thinkers, and the doers who let their work speak for itself.
              </p>
              <div className="flex gap-4">
                <Button onClick={() => navigate('/products')} className="shadow-xl shadow-fario-purple/20">Join the Movement</Button>
                <Button variant="outline" onClick={() => document.getElementById('enterprise')?.scrollIntoView({ behavior: 'smooth' })}>Partner With Us</Button>
              </div>
            </MotionDiv>

            <MotionDiv
              initial={{ opacity: 0, scale: 0.8, rotate: -10 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              transition={{ duration: 0.8, delay: 0.2, type: "spring" }}
              className="relative flex items-center justify-center h-full max-h-[600px]"
            >
              {/* Pulsing Background Aura */}
              <MotionDiv
                animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
                transition={{ duration: 4, repeat: Infinity }}
                className="absolute inset-0 bg-fario-lime/30 rounded-full blur-[100px]"
              />

              <MotionImg
                src={ASSETS.heroShoe}
                alt="Fario Collection"
                className="w-full h-auto max-h-[500px] object-contain relative z-10 drop-shadow-[0_20px_50px_rgba(0,0,0,0.3)]"
                animate={{ y: [0, -20, 0], rotate: [0, -5, 0] }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                whileHover={{ scale: 1.1, rotate: -15, transition: { duration: 0.3 } }}
              />

              {/* Floating Card 1: Quality */}
              <MotionDiv
                animate={{ y: [0, -15, 0], x: [0, 5, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                className="absolute top-20 right-10 bg-white/90 backdrop-blur-md p-4 rounded-2xl shadow-xl z-20 flex items-center gap-3 border border-white/40"
              >
                <div className="w-10 h-10 bg-fario-purple/10 rounded-full flex items-center justify-center text-fario-purple">
                  <Trophy size={20} />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Quality</p>
                  <p className="font-black text-fario-dark text-sm">Premium Grade</p>
                </div>
              </MotionDiv>

              {/* Floating Card 2: Design */}
              <MotionDiv
                animate={{ y: [0, 15, 0], x: [0, -5, 0] }}
                transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
                className="absolute bottom-20 left-0 bg-white/90 backdrop-blur-md p-4 rounded-2xl shadow-xl z-20 flex items-center gap-3 border border-white/40"
              >
                <div className="w-10 h-10 bg-fario-lime/20 rounded-full flex items-center justify-center text-fario-dark">
                  <Sparkles size={20} />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Design</p>
                  <p className="font-black text-fario-dark text-sm">Ergonomic Fit</p>
                </div>
              </MotionDiv>
            </MotionDiv>
          </div>
        </section>

        {/* --- WHY CHOOSE FARIO --- */}
        <section className="mb-32">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-black font-heading text-fario-dark mb-4">Why Choose <span className="text-fario-purple">Fario?</span></h2>
            <p className="text-gray-500 max-w-2xl mx-auto">Engineering excellence tailored for the next generation of achievers.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {whyChoosePoints.map((point, idx) => (
              <MotionDiv
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 group"
              >
                <div className="w-14 h-14 bg-fario-light rounded-2xl flex items-center justify-center mb-6 text-fario-dark group-hover:bg-fario-purple group-hover:text-white transition-colors">
                  {point.icon}
                </div>
                <h3 className="text-xl font-bold font-heading text-fario-dark mb-3">{point.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{point.desc}</p>
              </MotionDiv>
            ))}
          </div>
        </section>

        {/* --- CORE PURPOSE, MISSION, VISION --- */}
        <section className="mb-32">
          <div className="bg-white rounded-[3rem] p-10 lg:p-20 shadow-2xl border border-gray-100 relative overflow-hidden">
            {/* Background Decoration */}
            <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-gradient-to-b from-fario-purple/5 to-transparent rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />

            <div className="relative z-10">
              {/* Core Purpose */}
              <div className="text-center max-w-4xl mx-auto mb-20">
                <MotionDiv
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                >
                  <span className="bg-fario-lime/20 text-fario-dark px-4 py-1.5 text-xs font-bold uppercase tracking-widest rounded-full mb-6 inline-block">Our Core Purpose</span>
                  <h2 className="text-3xl md:text-5xl font-medium font-heading text-fario-dark leading-tight">
                    "Redefining the intersection of academic identity and everyday comfort through <span className="text-fario-purple font-black">precision engineering</span>."
                  </h2>
                </MotionDiv>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24">
                {/* Mission Protocol */}
                <MotionDiv
                  className="bg-fario-light/50 p-10 rounded-[2.5rem] border border-gray-100"
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                >
                  <div className="flex items-center gap-4 mb-6">
                    <div className="p-3 bg-fario-dark text-white rounded-xl shadow-lg">
                      <Target size={24} />
                    </div>
                    <h3 className="text-2xl font-black font-heading text-fario-dark uppercase">Mission Protocol</h3>
                  </div>
                  <p className="text-lg text-gray-700 font-medium mb-8 leading-relaxed">
                    To create trend-driven, high-quality footwear that blends style with affordability.
                  </p>
                  <div className="grid grid-cols-2 gap-4">
                    {missionPoints.map((pt, i) => (
                      <div key={i} className="flex items-center gap-3 bg-white p-4 rounded-xl shadow-sm border border-gray-50">
                        <span className="text-2xl">{pt.icon}</span>
                        <span className="text-xs font-bold uppercase tracking-wider text-gray-600">{pt.label}</span>
                      </div>
                    ))}
                  </div>
                </MotionDiv>

                {/* Vision Protocol */}
                <MotionDiv
                  className="bg-fario-light/50 p-10 rounded-[2.5rem] border border-gray-100"
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                >
                  <div className="flex items-center gap-4 mb-6">
                    <div className="p-3 bg-fario-purple text-white rounded-xl shadow-lg">
                      <Eye size={24} />
                    </div>
                    <h3 className="text-2xl font-black font-heading text-fario-dark uppercase">Vision Protocol</h3>
                  </div>
                  <p className="text-lg text-gray-700 font-medium mb-8 leading-relaxed">
                    To become India's go-to affordable fashion footwear brand for the next generation.
                  </p>
                  <div className="grid grid-cols-2 gap-4">
                    {visionPoints.map((pt, i) => (
                      <div key={i} className="flex items-center gap-3 bg-white p-4 rounded-xl shadow-sm border border-gray-50">
                        <span className="text-2xl">{pt.icon}</span>
                        <span className="text-xs font-bold uppercase tracking-wider text-gray-600">{pt.label}</span>
                      </div>
                    ))}
                  </div>
                </MotionDiv>
              </div>
            </div>
          </div>
        </section>

        {/* --- OUR HAPPY CLIENTS --- */}
        <section className="mb-32">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-black font-heading text-fario-dark mb-4">Our Happy <span className="text-fario-purple">Clients</span></h2>
            <p className="text-gray-500">Partnering with prestigious institutions across Tamil Nadu.</p>
          </div>

          <div className="bg-white rounded-[2rem] shadow-xl border border-gray-100 p-8">
            <div className="flex flex-wrap justify-center gap-6">
              {partners.map((partner, i) => (
                <MotionDiv
                  key={i}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="flex items-center gap-3 px-6 py-4 bg-fario-light rounded-full border border-gray-200 hover:border-fario-purple hover:bg-fario-purple/5 transition-all cursor-default"
                >
                  <School size={16} className="text-fario-dark" />
                  <span className="text-sm font-bold text-gray-700">{partner}</span>
                </MotionDiv>
              ))}
            </div>
          </div>
        </section>

        {/* --- ENTERPRISE ACCESS --- */}
        <section id="enterprise" className="mb-24">
          <div className="bg-fario-dark rounded-[3rem] p-10 lg:p-20 relative overflow-hidden text-white shadow-2xl">
            <div className="absolute inset-0 bg-topo-pattern opacity-10 invert pointer-events-none" />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center relative z-10">
              <div>
                <div className="flex items-center gap-3 mb-6">
                  <Zap size={20} className="text-fario-lime" />
                  <span className="text-fario-lime text-xs font-bold uppercase tracking-widest">Enterprise Access</span>
                </div>
                <h2 className="text-4xl lg:text-5xl font-black font-heading uppercase leading-tight mb-6">
                  Initialize <br /> <span className="text-outline-white">Onboarding.</span>
                </h2>
                <p className="text-gray-400 text-lg mb-8 leading-relaxed">
                  Direct factory-to-campus allocation systems ensuring 100% availability and identity lock. Get tailored solutions for your institution today.
                </p>
                <ul className="space-y-4 mb-8">
                  <li className="flex items-center gap-3 text-sm font-bold text-gray-300">
                    <CheckCircle2 className="text-fario-lime" size={18} /> Bulk Order Discounts
                  </li>
                  <li className="flex items-center gap-3 text-sm font-bold text-gray-300">
                    <CheckCircle2 className="text-fario-lime" size={18} /> Custom Logo Integration
                  </li>
                  <li className="flex items-center gap-3 text-sm font-bold text-gray-300">
                    <CheckCircle2 className="text-fario-lime" size={18} /> Priority Shipping
                  </li>
                </ul>
              </div>

              <div className="bg-white/10 backdrop-blur-md border border-white/10 rounded-[2.5rem] p-8 lg:p-12">
                {!formSubmitted ? (
                  <form onSubmit={handleFormSubmit} className="space-y-5">
                    <div className="space-y-2">
                      <label className="text-xs font-bold uppercase tracking-widest text-fario-lime ml-2">Institution Identity</label>
                      <input type="text" placeholder="Institution Name" className="w-full bg-black/20 border border-white/10 rounded-xl px-6 py-4 text-sm font-bold text-white placeholder:text-white/30 focus:border-fario-lime outline-none transition-all" required />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-xs font-bold uppercase tracking-widest text-gray-400 ml-2">Contact Person</label>
                        <input type="text" placeholder="Name" className="w-full bg-black/20 border border-white/10 rounded-xl px-6 py-4 text-sm font-bold text-white placeholder:text-white/30 focus:border-fario-lime outline-none transition-all" required />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-bold uppercase tracking-widest text-gray-400 ml-2">Direct Line</label>
                        <input type="tel" placeholder="+91" className="w-full bg-black/20 border border-white/10 rounded-xl px-6 py-4 text-sm font-bold text-white placeholder:text-white/30 focus:border-fario-lime outline-none transition-all" required />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold uppercase tracking-widest text-gray-400 ml-2">Requirement Specs</label>
                      <textarea rows={3} placeholder="Volume, timeline, etc." className="w-full bg-black/20 border border-white/10 rounded-xl px-6 py-4 text-sm font-bold text-white placeholder:text-white/30 focus:border-fario-lime outline-none transition-all resize-none" required />
                    </div>
                    <Button type="submit" className="w-full py-5 bg-fario-lime text-fario-dark hover:bg-white border-none font-black uppercase tracking-widest text-xs shadow-lg shadow-fario-lime/20">Initialize Protocol</Button>
                  </form>
                ) : (
                  <div className="text-center py-16">
                    <MotionDiv
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="w-20 h-20 bg-fario-lime rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl shadow-fario-lime/30"
                    >
                      <CheckCircle2 size={40} className="text-fario-dark" />
                    </MotionDiv>
                    <h3 className="text-2xl font-black uppercase tracking-tight mb-3">Protocol Active</h3>
                    <p className="text-gray-400 text-sm mb-8">Our deployment team will initiate sync shortly.</p>
                    <button onClick={() => setFormSubmitted(false)} className="text-xs font-black uppercase tracking-widest text-fario-lime hover:text-white transition-colors underline">Reset Terminal</button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
};

export default About;
