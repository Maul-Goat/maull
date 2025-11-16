
import React, { forwardRef } from 'react';
import useInView from '../hooks/useInView';

const Hero = forwardRef<HTMLElement>((props, ref) => {
  const isInViewLeft = useInView(ref as React.RefObject<HTMLElement>);
  const isInViewRight = useInView(ref as React.RefObject<HTMLElement>);

  return (
    <section ref={ref} id="home" className="min-h-screen flex items-center pt-20 relative z-10">
      <div className="container w-[90%] max-w-7xl mx-auto hero-content flex items-center justify-between p-8 relative z-10 w-full flex-wrap gap-8">
        <div className={`hero-text flex-1 text-white pr-12 min-w-[300px] slide-in-left ${isInViewLeft ? 'in-view' : ''}`}>
          <div className="overflow-hidden">
            <h1 className="text-6xl font-bold mb-4 text-white drop-shadow-lg animate-titleReveal leading-tight">
              Creative<br /><span className="highlight animate-highlightGlow">Editor</span>
            </h1>
          </div>
          <p className="text-xl mb-4 text-gray-100 drop-shadow-md animate-subtitleSlideIn" style={{ animationDelay: '0.2s' }}>Filmmaker • Programmer • Visual Storyteller</p>
          <p className="text-lg mb-8 text-white/95 animate-subtitleSlideIn" style={{ animationDelay: '0.4s' }}>Transforming ideas into stunning visual experiences through code and creative vision</p>
          <a href="#contact" className="inline-flex items-center gap-3 bg-gradient-to-br from-[#FFB6D9] to-[#FF85B5] text-white py-4 px-10 rounded-full no-underline font-semibold transition-all duration-300 shadow-[0_8px_20px_rgba(255,133,181,0.3)] relative overflow-hidden border-none cursor-pointer hover:-translate-y-1 hover:shadow-[0_12px_35px_rgba(255,133,181,0.5)]">
            <span>Get In Touch</span>
            <span className="animate-arrowBounce">→</span>
          </a>
        </div>
        <div className={`profile-img-container flex-1 flex justify-center items-center relative min-w-[300px] slide-in-right ${isInViewRight ? 'in-view' : ''}`}>
          <img src="https://i.ibb.co/L519V3B/20250518-175049.jpg" alt="Profile Photo" className="w-[300px] h-[400px] object-cover border-4 border-white shadow-[0_15px_35px_rgba(0,0,0,0.2)] relative z-10 animate-imageFloat rounded-2xl" />
        </div>
      </div>
    </section>
  );
});

export default Hero;
