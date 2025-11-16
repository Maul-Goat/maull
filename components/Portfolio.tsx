
import React, { forwardRef, useRef } from 'react';
import useInView from '../hooks/useInView';
import { PortfolioItem } from '../types';

interface PortfolioProps {
    portfolioItems: PortfolioItem[];
}

const Portfolio = forwardRef<HTMLElement, PortfolioProps>(({ portfolioItems }, ref) => {
    const sectionRef = useRef<HTMLDivElement>(null);
    const isInView = useInView(sectionRef);

  return (
    <section ref={ref} id="portfolio" className="py-32 relative z-10">
      <div ref={sectionRef} className="container w-[90%] max-w-7xl mx-auto">
        <h2 className="text-center mb-12 text-5xl font-bold relative text-[#5c3d2e] after:content-[''] after:h-[5px] after:w-[80px] after:bg-gradient-to-r after:from-[#FFB6D9] after:to-[#FF85B5] after:absolute after:bottom-[-15px] after:left-1/2 after:-translate-x-1/2 after:rounded-md animate-expandWidth">
          Featured Works
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 mt-12">
          {portfolioItems.map((item, index) => (
            <div key={item.id} className={`bg-white/10 rounded-2xl overflow-hidden shadow-lg transition-all duration-300 backdrop-blur-md border border-white/20 hover:-translate-y-4 hover:shadow-[0_20px_50px_rgba(255,133,181,0.25)] hover:border-pink-300/40 group slide-in-bottom ${isInView ? 'in-view' : ''}`} style={{ animationDelay: `${index * 0.12}s` }}>
              <div className="relative overflow-hidden h-56">
                <img src={item.img_url} alt={item.title} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-pink-500/40 to-pink-300/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
              <div className="p-7 bg-white/5">
                <h3 className="text-xl font-semibold mb-2 text-[#5c3d2e]">{item.title}</h3>
                <p className="text-[#666] mb-4 text-sm leading-relaxed">{item.description}</p>
                <a href={item.project_url || '#'} target="_blank" rel="noopener noreferrer" className="text-[#FF85B5] no-underline font-semibold inline-flex items-center gap-2 transition-all duration-300 hover:text-[#FFB6D9] hover:translate-x-2">
                  Explore →
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
});

export default Portfolio;
