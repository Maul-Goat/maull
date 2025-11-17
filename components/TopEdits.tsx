import React, { forwardRef, useRef, useState, PointerEvent as ReactPointerEvent, useEffect } from 'react';
import useInView from '../hooks/useInView';
import { TopEdit } from '../types';

interface TopEditsProps {
    edits: TopEdit[];
}

const isVideo = (url: string): boolean => {
    if (!url) return false;
    const videoExtensions = ['.mp4', '.webm', '.mov', '.ogg'];
    try {
        // Using toLowerCase() to make the check case-insensitive
        const path = new URL(url).pathname.toLowerCase();
        return videoExtensions.some(ext => path.endsWith(ext));
    } catch (e) {
        // If URL is invalid or relative, it might throw. Fallback to simple check.
        const lowerUrl = url.toLowerCase();
        return videoExtensions.some(ext => lowerUrl.endsWith(ext));
    }
};

const SoundOnIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white drop-shadow-lg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
    </svg>
);
const SoundOffIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white drop-shadow-lg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 14l-4-4m0 4l4-4" />
    </svg>
);

const TopEdits = forwardRef<HTMLElement, TopEditsProps>(({ edits }, ref) => {
    const sectionRef = useRef<HTMLDivElement>(null);
    const sliderRef = useRef<HTMLDivElement>(null);
    const isInView = useInView(sectionRef);

    const [isDown, setIsDown] = useState(false);
    const [startX, setStartX] = useState(0);
    const [scrollLeft, setScrollLeft] = useState(0);
    const [isHovering, setIsHovering] = useState(false);
    
    const [unmutedVideoIndex, setUnmutedVideoIndex] = useState<number | null>(null);
    const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);

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

    // Mute video when scrolling out of view
    useEffect(() => {
        if (!isInView && unmutedVideoIndex !== null) {
            const video = videoRefs.current[unmutedVideoIndex];
            if (video) {
                video.muted = true;
            }
            setUnmutedVideoIndex(null);
        }
    }, [isInView, unmutedVideoIndex]);

    const handleVideoClick = (index: number) => {
        const currentlyUnmuted = unmutedVideoIndex;
        const clickedVideoIsUnmuted = currentlyUnmuted === index;

        // Mute the currently playing video if it exists
        if (currentlyUnmuted !== null && videoRefs.current[currentlyUnmuted]) {
            videoRefs.current[currentlyUnmuted]!.muted = true;
        }

        // If the user clicked a different video, unmute it
        if (!clickedVideoIsUnmuted) {
            const videoToPlay = videoRefs.current[index];
            if (videoToPlay) {
                videoToPlay.muted = false;
                videoToPlay.play().catch(e => console.error("Error playing video:", e));
                setUnmutedVideoIndex(index);
            }
        } else {
            // If they clicked the same video, it's now muted, so reset state
            setUnmutedVideoIndex(null);
        }
    };


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
            {allEdits.map((edit, index) => {
              const url = edit.img_url;
              const isMediaVideo = isVideo(url);
              return (
              <div key={index} className={`flex-shrink-0 w-[300px] h-[520px] bg-white/10 rounded-2xl overflow-hidden backdrop-blur-md border border-white/20 transition-all duration-300 shadow-lg flex flex-col hover:-translate-y-4 hover:scale-105 hover:shadow-[0_20px_50px_rgba(255,133,181,0.25)] hover:border-pink-300/40 slide-in-bottom ${isInView ? 'in-view' : ''}`} style={{ animationDelay: `${index * 0.1}s` }}>
                <div className="w-full h-[400px] overflow-hidden relative group/video">
                    {isMediaVideo ? (
                       <>
                        <video
                            // FIX: Changed ref callback to use a block body to ensure it returns void, resolving a TypeScript type error.
                            ref={el => { videoRefs.current[index] = el; }}
                            src={url}
                            className="w-full h-full object-cover pointer-events-none"
                            autoPlay
                            loop
                            muted
                            playsInline
                        />
                         <div
                            onClick={() => handleVideoClick(index)}
                            className="absolute inset-0 bg-black/20 opacity-0 group-hover/video:opacity-100 flex items-center justify-center transition-opacity duration-300 cursor-pointer"
                            aria-label={unmutedVideoIndex === index ? 'Mute video' : 'Unmute video'}
                        >
                            {unmutedVideoIndex === index ? <SoundOnIcon /> : <SoundOffIcon />}
                        </div>
                       </>
                    ) : (
                        <img src={edit.img_url} alt={edit.title} className="w-full h-full object-cover transition-transform duration-300 pointer-events-none" />
                    )}
                </div>
                <div className="p-6 flex-1 flex flex-col justify-center bg-white/5">
                  <h3 className="text-lg font-semibold mb-2 text-[#5c3d2e]">{edit.title}</h3>
                  <p className="text-[#666] text-sm leading-relaxed">{edit.description}</p>
                </div>
              </div>
            )})}
          </div>
        </div>
      </div>
    </section>
  );
});

export default TopEdits;