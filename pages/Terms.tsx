import React from 'react';

const Terms: React.FC = () => {
    return (
        <div className="min-h-screen bg-white pt-32 pb-20 px-4 md:px-8 font-sans">
            <div className="max-w-4xl mx-auto space-y-8 text-gray-800">
                <h1 className="text-4xl md:text-5xl font-black font-heading italic tracking-tighter">Terms of Service</h1>
                <p className="text-sm text-gray-500 font-medium">Last Updated: March 2026</p>

                <section className="space-y-4">
                    <h2 className="text-2xl font-bold">1. Agreement to Terms</h2>
                    <p className="leading-relaxed">
                        By accessing or using the Fario E-commerce platform, you agree to be bound by these Terms of Service and all applicable laws and regulations.
                        If you do not agree with any of these terms, you are prohibited from using or accessing this site.
                    </p>
                </section>

                <section className="space-y-4">
                    <h2 className="text-2xl font-bold">2. Use License</h2>
                    <p className="leading-relaxed">
                        Permission is granted to temporarily download one copy of the materials (information or software) on Fario's website for personal, non-commercial transitory viewing only.
                    </p>
                </section>

                <section className="space-y-4">
                    <h2 className="text-2xl font-bold">3. Product Descriptions</h2>
                    <p className="leading-relaxed">
                        Fario attempts to be as accurate as possible. However, Fario does not warrant that product descriptions or other content of this site is accurate, complete, reliable, current, or error-free.
                    </p>
                </section>

                <section className="space-y-4">
                    <h2 className="text-2xl font-bold">4. Returns and Refunds</h2>
                    <p className="leading-relaxed">
                        Return requests must be initiated within 14 days of delivery. Approved returns will be refunded to your original payment method or Fario Wallet within 3-5 business days.
                        Items must be returned in their original condition and packaging.
                    </p>
                </section>
            </div>
        </div>
    );
};

export default Terms;
