import React from 'react';
import { Truck, ShieldCheck, RefreshCcw, Award, Zap, Star } from 'lucide-react';

/* ─ BASE PATH ────────────────────────────────────────── */
export const BASE = (import.meta as any).env.BASE_URL as string;

/* ─ VIDEOS (Pexels Premium CDN) ─────────────────── */
export const V_RUN = "https://videos.pexels.com/video-files/3209242/3209242-uhd_2560_1440_25fps.mp4";
export const V_TYING = "https://videos.pexels.com/video-files/7883997/7883997-uhd_1440_2732_25fps.mp4";
export const V_WOMAN = "https://videos.pexels.com/video-files/6372054/6372054-hd_1080_1920_30fps.mp4";
export const V_BEND = "https://videos.pexels.com/video-files/5218686/5218686-hd_1920_1080_30fps.mp4";

// Aliases for legacy compatibility
export const V1 = V_RUN;
export const V2 = V_BEND;

/* ─ IMAGES ─────────────────────────────────────────── */
export const d = (id: string) => `https://lh3.googleusercontent.com/d/${id}`;
export const HL3 = {
    a: d('1tEuedCwZYRWL-aYCOXY46bXCBcnyVuU-'),
    b: d('1pc6UNVFR889igs7LbnQml_DpWpVd5AP2'),
    c: d('1JAkZKl652biLyzUdO5X05Y4s7a1AsqPU'),
    e: d('19UKGRbcIZHffq1xs56MekmVpgF90H2kr'),
    f: d('1fm0yzmL6IQktGcvEZ34X3hF3YaVqcYoC'),
    g: d('1P2Rdo8iTmbVCLJ7bKG8SRiYdjoiEl5TZ'),
    h: d('1BB5uMVdb66bRJLUgle-vUkLaKyK1gC-i'),
};

/* ─ DESIGN TOKENS ────────────────────────────────────── */
export const BG_LIGHT = '#F5F0FF';         // Very light lavender
export const BG_MID = '#EDE7F6';           // Slightly deeper lavender
export const BG_WHITE = '#FFFEF5';          // Milky cream white
export const BG_DARK = '#1a0d2e';          // Deep purple-black
export const BG_DARK2 = '#0f0820';         // Even deeper for contrast
export const PURPLE = '#7a51a0';           // Fario Purple
export const LIME = '#d9f99d';             // Fario Lime
export const MILKY = '#FFFEF5';             // Milky text on dark
export const DARK_TXT = '#1a0d2e';          // Dark text on light
export const PUR_BORDER = 'rgba(122,81,160,0.25)';

/* ─ EASING ────────────────────────────────────────── */
export const E: [number, number, number, number] = [0.16, 1, 0.3, 1];

/* ─ DATA ─────────────────────────────────────────── */
export const PRODUCTS = [
    { id: 'p1', name: 'AeroStride Pro', sub: 'Performance Shoe', price: 12999, orig: 15999, img: HL3.a, alt: HL3.c, tag: 'NEW' },
    { id: 'p2', name: 'Urban Glide', sub: 'Street Edition', price: 8499, orig: 10999, img: HL3.b, alt: HL3.e, tag: 'HOT' },
    { id: 'p3', name: 'Midnight Force', sub: 'Limited Release', price: 14499, orig: 18999, img: HL3.c, alt: HL3.a, tag: 'LTD' },
    { id: 'p4', name: 'Velocity Elite', sub: 'Pro Series', price: 11999, orig: 14999, img: HL3.e, alt: HL3.b },
    { id: 'p5', name: 'Stealth Commuter', sub: 'Urban Backpack', price: 5999, orig: 7999, img: HL3.f, alt: HL3.g },
    { id: 'p6', name: 'Modular Tote', sub: 'Carry Everything', price: 4499, orig: 5999, img: HL3.g, alt: HL3.f },
    { id: 'p7', name: 'Tech Sling', sub: 'Daily Essential', price: 2999, orig: 3999, img: HL3.h, alt: HL3.a },
];

export const TICKER = ['HANDCRAFTED SINCE 2024', 'FREE SHIPPING Rs. 999+', 'NEW COLLECTION 2026', '30-DAY RETURNS', 'CARBON NEUTRAL', 'MEMBERS EXCLUSIVE'];

export const STATS = [
    { val: 50000, suf: '+', label: 'Pairs Sold', icon: React.createElement(Star, { size: 22 }) },
    { val: 14, suf: '', label: 'Prototype Stages', icon: React.createElement(Zap, { size: 22 }) },
    { val: 99, suf: '%', label: 'Customer Love', icon: React.createElement(Award, { size: 22 }) },
    { val: 2, suf: 'yr', label: 'Warranty', icon: React.createElement(ShieldCheck, { size: 22 }) },
];

export const TRUST = [
    { icon: React.createElement(Truck, { size: 28 }), title: 'Free Delivery', sub: 'On orders Rs. 999+' },
    { icon: React.createElement(ShieldCheck, { size: 28 }), title: '2-Year Warranty', sub: 'Genuine craftsmanship' },
    { icon: React.createElement(RefreshCcw, { size: 28 }), title: '30-Day Returns', sub: 'Hassle-free' },
    { icon: React.createElement(Award, { size: 28 }), title: 'ISO Certified', sub: 'Master artisans' },
];

export const GALLERY = [
    { img: HL3.a, label: 'AeroStride Pro', cls: 'col-span-2 row-span-2' },
    { img: HL3.b, label: 'Urban Glide', cls: 'col-span-1 row-span-1' },
    { img: HL3.c, label: 'Midnight Force', cls: 'col-span-1 row-span-1' },
    { img: HL3.e, label: 'Velocity Elite', cls: 'col-span-1 row-span-2' },
    { img: HL3.f, label: 'Stealth Bag', cls: 'col-span-1 row-span-1' },
    { img: HL3.g, label: 'Modular Tote', cls: 'col-span-1 row-span-1' },
    { img: HL3.h, label: 'Tech Sling', cls: 'col-span-1 row-span-1' },
    { img: HL3.e, label: 'Scholar Edition', cls: 'col-span-1 row-span-1' },
];

export const ACTIVITY = [
    { city: 'Mumbai', product: 'AeroStride Pro', time: '2 min ago', avatar: '🏃', qty: 1 },
    { city: 'Delhi', product: 'Urban Glide', time: '5 min ago', avatar: '✨', qty: 2 },
    { city: 'Bangalore', product: 'Midnight Force', time: '8 min ago', avatar: '👟', qty: 1 },
    { city: 'Hyderabad', product: 'Velocity Elite', time: '12 min ago', avatar: '⚡', qty: 1 },
    { city: 'Chennai', product: 'Modular Tote', time: '14 min ago', avatar: '📦', qty: 3 },
    { city: 'Pune', product: 'Tech Sling', time: '18 min ago', avatar: '📱', qty: 1 },
    { city: 'Kolkata', product: 'Stealth Commuter', time: '21 min ago', avatar: '🌆', qty: 2 },
    { city: 'Ahmedabad', product: 'AeroStride Pro', time: '25 min ago', avatar: '🔥', qty: 1 },
];

export const WHEEL_SLICES = [
    { label: '5% OFF', color: PURPLE, text: MILKY },
    { label: 'FREE BAG', color: LIME, text: DARK_TXT },
    { label: '10% OFF', color: '#5a3a7a', text: MILKY },
    { label: '₹200 OFF', color: '#c9f99d', text: DARK_TXT },
    { label: 'TRY AGAIN', color: '#3a2060', text: MILKY },
    { label: '15% OFF', color: '#7a51a0cc', text: MILKY },
    { label: 'FREE SHIP', color: LIME, text: DARK_TXT },
    { label: '₹500 OFF', color: PURPLE, text: MILKY },
];

export const CINEMATIC_ITEMS = [
    { id: 1, title: 'Extreme Grip', detail: 'Hexagonal tread for wet marble', vid: V_RUN },
    { id: 2, title: 'Carbon Core', detail: 'Featherlight arch plate', vid: V_BEND },
    { id: 3, title: 'Ghost Mesh', detail: 'Zero-sweat breathability', vid: V_TYING },
    { id: 4, title: 'Kinetic Foam', detail: '98% energy return', vid: V_WOMAN },
];
