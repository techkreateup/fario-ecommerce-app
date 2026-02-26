import React, { useRef, useEffect } from "react";

const VideoSection: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement>(null);

  // Use local file for 100% reliability
  const videoSrc = "/fario-brand.mp4";

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.play().catch(e => console.error("Autoplay failed:", e));
    }
  }, []);

  return (
    <section className="relative w-full h-[60vh] md:h-[80vh] overflow-hidden bg-black flex items-center justify-center">
      <div className="absolute inset-0 w-full h-full pointer-events-none">
        <video
          ref={videoRef}
          src={videoSrc}
          className="w-full h-full object-contain opacity-100"
          autoPlay
          loop
          muted
          playsInline
        />
      </div>
    </section>
  );
};

export default VideoSection;
