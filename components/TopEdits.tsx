
import React, { forwardRef, useRef, useState, PointerEvent as ReactPointerEvent, useEffect } from 'react';
import useInView from '../hooks/useInView';
import { TopEdit } from '../types';

interface TopEditsProps {
    edits: TopEdit[];
}

const TopEdits = forwardRef<HTMLElement, TopEditsProps>(({ edits }, ref) => {
    const sectionRef = useRef<HTMLDivElement>(null);
    const sliderRef = useRef<HTMLDivElement>(null);
    const isInView = useInView(sectionRef);

    const [isDown, setIsDown] = useState(false);
    const [startX, setStartX] = useState(0);
    const [scrollLeft, setScrollLeft] = useState(0);
    const [isHovering, setIsHovering] = useState(false);

    // Duplicate for infinite scroll effect
    const allEdits = edits.length > 0 ? [...edits, ...edits] : [];


    // JS-based auto-scroll animation
    useEffect(() => {
        const slider = sliderRef.current;
        if (!slider || !isInView || allEdits.length === 0) return;

        let animationFrameId: number;

        const autoScroll = () => {
            if (!isDown && !isHovering) {
                // If scroll reaches the end of the first set, reset to the beginning for a seamless loop
                if (slider.scrollLeft >= slider.scrollWidth / 2) {
                    slider.scrollLeft = 0;
                } else {
                    slider.scrollLeft += 0.75; // Adjust scroll speed here
                }
            }
            animationFrameId = requestAnimationFrame(autoScroll);
        };

        animationFrameId = requestAnimationFrame(autoScroll);

        return () => {
            cancelAnimationFrame(animationFrameId);
        };
    }, [isInView, isDown, isHovering, allEdits.length]);


    const handlePointerDown = (e: ReactPointerEvent<HTMLDivElement>) => {
        const slider = sliderRef.current;
        if (!slider) return;
        setIsDown(true);
        setStartX(e.pageX - slider.offsetLeft);
        setScrollLeft(slider.scrollLeft);
        slider.style.cursor = 'grabbing';
    };
    
    const handlePointerLeave = () => {
        setIsDown(false);
        const slider = sliderRef.current;
        if (slider) slider.style.cursor = 'grab';
    };
    
    const handlePointerUp = () => {
        setIsDown(false);
        const slider = sliderRef.current;
        if (slider) slider.style.cursor = 'grab';
    };
    
    const handlePointerMove = (e: ReactPointerEvent<HTMLDivElement>) => {
        if (!isDown) return;
        e.preventDefault();
        const slider = sliderRef.current;
        if (!slider) return;
        const x = e.pageX - slider.offsetLeft;
        const walk = (x - startX) * 2; // Scrolling speed multiplier
        slider.scrollLeft = scrollLeft - walk;
    };


  return (
    <section ref={ref} id="top-edits" className="py-32 relative z-10">
      <div ref={sectionRef} className="container w-[90%] max-w-7xl mx-auto">
        <h2 className="text-center mb-12 text-5xl font-bold relative text-[#5c3d2e] after:content-[''] after:h-[5px] after:w-[80px] after:bg-gradient-to-r after:from-[#FFB6D9] after:to-[#FF85B5] after:absolute after:bottom-[-15px] after:left-1/2 after:-translate-x-1/2 after:rounded-md animate-expandWidth">
          My Top Edits
        </h2>
        <div className="relative overflow-hidden w-full mt-12">
            <div className="absolute top-0 left-0 w-24 h-full bg-gradient-to-r from-white/0 via-pink-100/10 to-transparent z-10 pointer-events-none"></div>
            <div className="absolute top-0 right-0 w-24 h-full bg-gradient-to-l from-white/0 via-pink-100/10 to-transparent z-10 pointer-events-none"></div>
          <div 
            ref={sliderRef}
            className="flex gap-8 py-4 cursor-grab select-none overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
            onPointerDown={handlePointerDown}
            onPointerUp={handlePointerUp}
            onPointerLeave={handlePointerLeave}
            onPointerMove={handlePointerMove}
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
          >
            {allEdits.map((edit, index) => (
              <div key={index} className={`flex-shrink-0 w-[300px] h-[520px] bg-white/10 rounded-2xl overflow-hidden backdrop-blur-md border border-white/20 transition-all duration-300 shadow-lg flex flex-col hover:-translate-y-4 hover:scale-105 hover:shadow-[0_20px_50px_rgba(255,133,181,0.25)] hover:border-pink-300/40 slide-in-bottom ${isInView ? 'in-view' : ''}`} style={{ animationDelay: `${index * 0.1}s` }}>
                <div className="w-full h-[400px] overflow-hidden relative">
                  <img src={edit.img_url} alt={edit.title} className="w-full h-full object-cover transition-transform duration-300 pointer-events-none" />
                </div>
                <div className="p-6 flex-1 flex flex-col justify-center bg-white/5">
                  <h3 className="text-lg font-semibold mb-2 text-[#5c3d2e]">{edit.title}</h3>
                  <p className="text-[#666] text-sm leading-relaxed">{edit.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
});

export default TopEdits;
