import React from 'react';

const Privacy: React.FC = () => {
    return (
        <div className="min-h-screen bg-white pt-32 pb-20 px-4 md:px-8 font-sans">
            <div className="max-w-4xl mx-auto space-y-8 text-gray-800">
                <h1 className="text-4xl md:text-5xl font-black font-heading italic tracking-tighter">Privacy Policy</h1>
                <p className="text-sm text-gray-500 font-medium">Last Updated: March 2026</p>

                <section className="space-y-4">
                    <h2 className="text-2xl font-bold">1. Information We Collect</h2>
                    <p className="leading-relaxed">
                        We collect information you provide directly to us, such as when you create or modify your account, request on-demand services, contact customer support, or otherwise communicate with us.
                        This information may include: name, email, phone number, postal address, profile picture, payment method, and other information you choose to provide.
                    </p>
                </section>

                <section className="space-y-4">
                    <h2 className="text-2xl font-bold">2. How We Use Your Information</h2>
                    <p className="leading-relaxed">
                        We use the information we collect about you to provide, maintain, and improve our services, including to process transactions, send related information, and monitor and analyze trends, usage, and activities.
                    </p>
                </section>

                <section className="space-y-4">
                    <h2 className="text-2xl font-bold">3. Data Security</h2>
                    <p className="leading-relaxed">
                        We use reasonable measures to help protect information about you from loss, theft, misuse and unauthorized access, disclosure, alteration and destruction.
                        Your payment information is securely processed by our payment partners and is never stored on our servers.
                    </p>
                </section>
            </div>
        </div>
    );
};

export default Privacy;
