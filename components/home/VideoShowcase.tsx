import React from 'react';

export default function VideoShowcase() {
    return (
        <section className="h-[80vh] w-full relative overflow-hidden bg-black">
            <video
                autoPlay
                muted
                loop
                playsInline
                className="w-full h-full object-cover opacity-80"
            >
                <source src="https://videos.pexels.com/video-files/5309381/5309381-hd_1920_1080_25fps.mp4" type="video/mp4" />
            </video>
            <div className="absolute inset-0 bg-black/10" />

            {/* Pure Visual - No Text */}
        </section>
    );
}
