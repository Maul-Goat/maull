import React, { forwardRef, useRef, useState, useEffect, MouseEvent, TouchEvent } from 'react';
import useInView from '../hooks/useInView';
import { Skill } from '../types';

interface SkillPosition {
    id: number;
    x: number;
    y: number;
}

interface SkillsProps {
    skills: Skill[];
}

const Skills = forwardRef<HTMLElement, SkillsProps>(({ skills }, ref) => {
    const sectionRef = useRef<HTMLDivElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const isInView = useInView(sectionRef);

    const [positions, setPositions] = useState<SkillPosition[]>([]);
    const [draggedIcon, setDraggedIcon] = useState<{ id: number; offsetX: number; offsetY: number } | null>(null);

    const randomAnimations = ["animate-randomFloat1", "animate-randomFloat2", "animate-randomFloat3"];

    const getIconSize = () => window.innerWidth < 768 ? 96 : 128; // 96px (w-24) for mobile, 128px (w-32) for desktop

    useEffect(() => {
        const container = containerRef.current;
        if (!container || skills.length === 0) return;

        const observer = new ResizeObserver(() => {
            const containerRect = container.getBoundingClientRect();
            const iconSize = getIconSize();

            if (containerRect.width > 0 && positions.length === 0) {
                 const calculatedPositions = skills.map(skill => ({
                    id: skill.id,
                    x: Math.random() * (containerRect.width - iconSize),
                    y: Math.random() * (containerRect.height - iconSize),
                }));
                setPositions(calculatedPositions);
            }
        });
        
        observer.observe(container);

        return () => observer.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [skills]);

    const handleDragStart = (e: MouseEvent<HTMLDivElement> | TouchEvent<HTMLDivElement>, id: number) => {
        e.preventDefault();
        const container = containerRef.current;
        if (!container) return;

        const pos = positions.find(p => p.id === id);
        if (!pos) return;

        const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
        const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

        const iconRect = (e.target as HTMLDivElement).closest('.skill-icon-wrapper')?.getBoundingClientRect();
        if(!iconRect) return;
        
        const offsetX = clientX - iconRect.left;
        const offsetY = clientY - iconRect.top;

        setDraggedIcon({ id, offsetX, offsetY });
    };

    const handleDragMove = (e: globalThis.MouseEvent | globalThis.TouchEvent) => {
        if (!draggedIcon) return;

        const container = containerRef.current;
        if (!container) return;
        
        const containerRect = container.getBoundingClientRect();
        const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
        const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
        
        let newX = clientX - containerRect.left - draggedIcon.offsetX;
        let newY = clientY - containerRect.top - draggedIcon.offsetY;
        
        const iconSize = getIconSize();
        newX = Math.max(0, Math.min(newX, containerRect.width - iconSize));
        newY = Math.max(0, Math.min(newY, containerRect.height - iconSize));

        setPositions(prev =>
            prev.map(p => (p.id === draggedIcon.id ? { ...p, x: newX, y: newY } : p))
        );
    };
    
    const handleDragEnd = () => {
        setDraggedIcon(null);
    };

    useEffect(() => {
        if (draggedIcon) {
            window.addEventListener('mousemove', handleDragMove);
            window.addEventListener('mouseup', handleDragEnd);
            window.addEventListener('touchmove', handleDragMove);
            window.addEventListener('touchend', handleDragEnd);
        }
        return () => {
            window.removeEventListener('mousemove', handleDragMove);
            window.removeEventListener('mouseup', handleDragEnd);
            window.removeEventListener('touchmove', handleDragMove);
            window.removeEventListener('touchend', handleDragEnd);
        };
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [draggedIcon]);

  return (
    <section ref={ref} id="skills" className="py-32 relative z-10">
      <div ref={sectionRef} className="container w-[90%] max-w-7xl mx-auto">
        <h2 className="text-center mb-12 text-5xl font-bold relative text-[#5c3d2e] after:content-[''] after:h-[5px] after:w-[80px] after:bg-gradient-to-r after:from-[#FFB6D9] after:to-[#FF85B5] after:absolute after:bottom-[-15px] after:left-1/2 after:-translate-x-1/2 after:rounded-md animate-expandWidth">
          Tech Stack & Tools
        </h2>
        <div ref={containerRef} className={`relative flex items-center justify-center min-h-[500px] md:min-h-[700px] w-full mt-12 slide-in-bottom ${isInView ? 'in-view' : ''}`}>
          
            {skills.map((skill, index) => {
                const pos = positions.find(p => p.id === skill.id);
                if (!pos) return null;
                
                const animationClass = randomAnimations[index % randomAnimations.length];

                return (
                    <div 
                        key={skill.id}
                        className={`absolute w-24 h-24 md:w-32 md:h-32 skill-icon-wrapper ${animationClass}`}
                        style={{
                            left: `${pos.x}px`,
                            top: `${pos.y}px`,
                        }}
                        onMouseDown={(e) => handleDragStart(e, skill.id)}
                        onTouchStart={(e) => handleDragStart(e, skill.id)}
                    >
                        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-pink-300/80 to-pink-500/80 rounded-2xl border-2 border-white/60 shadow-[0_8px_25px_rgba(255,133,181,0.4)] transition-all duration-300 hover:scale-110 hover:shadow-[0_12px_40px_rgba(255,133,181,0.6)] hover:border-white/90 cursor-grab active:cursor-grabbing">
                            <img src={skill.img_url} alt={skill.name} className="w-16 h-16 md:w-24 md:h-24 object-contain pointer-events-none" />
                        </div>
                    </div>
                );
            })}
        </div>
      </div>
    </section>
  );
});

export default Skills;