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
            <div className="absolute inset-0 bg-black/20" />

            <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-white px-4">
                <h2 className="text-[10vw] font-black leading-none uppercase tracking-tighter mix-blend-difference">
                    Unstoppable
                </h2>
                <h2 className="text-[10vw] font-black leading-none uppercase tracking-tighter text-transparent stroke-white stroke-2 opacity-50">
                    Energy
                </h2>
            </div>
        </section>
    );
}
