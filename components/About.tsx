
import React, { forwardRef, useRef } from 'react';
import useInView from '../hooks/useInView';

const aboutItems = [
  {
    icon: '👨‍💻',
    title: 'Developer & Creator',
    description: 'Expert in crafting responsive web applications and interactive digital experiences',
  },
  {
    icon: '🎬',
    title: 'Video Editor & Filmmaker',
    description: 'Specializing in cinematic editing, motion graphics, and compelling visual narratives',
  },
  {
    icon: '✨',
    title: 'Creative Problem Solver',
    description: 'Combining technical expertise with artistic vision to deliver exceptional results',
  },
];

const About = forwardRef<HTMLElement>((props, ref) => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef);

  return (
    <section ref={ref} id="about" className="py-32 relative z-10">
      <div ref={sectionRef} className="container w-[90%] max-w-7xl mx-auto">
        <h2 className="text-center mb-12 text-5xl font-bold relative text-[#5c3d2e] after:content-[''] after:h-[5px] after:w-[80px] after:bg-gradient-to-r after:from-[#FFB6D9] after:to-[#FF85B5] after:absolute after:bottom-[-15px] after:left-1/2 after:-translate-x-1/2 after:rounded-md animate-expandWidth">
          About Me
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 mb-12">
          {aboutItems.map((item, index) => (
            <div key={index} className={`bg-white/10 p-10 rounded-2xl backdrop-blur-md border border-white/25 transition-all duration-300 hover:-translate-y-2.5 hover:shadow-[0_15px_40px_rgba(255,133,181,0.15)] hover:border-pink-300/40 slide-in-bottom ${isInView ? 'in-view' : ''}`} style={{ animationDelay: `${index * 0.1}s` }}>
              <div className="text-5xl mb-4 inline-block animate-iconBounce" style={{ animationDelay: `${index * 0.3}s` }}>{item.icon}</div>
              <h3 className="text-xl font-semibold mb-3 text-[#5c3d2e]">{item.title}</h3>
              <p className="text-[#666] text-base leading-relaxed">{item.description}</p>
            </div>
          ))}
        </div>
        <div className={`bg-white/10 p-8 rounded-2xl backdrop-blur-md border border-white/25 text-left slide-in-bottom ${isInView ? 'in-view' : ''}`} style={{ animationDelay: '0.3s' }}>
          <p className="text-[#5c3d2e] text-base md:text-lg leading-loose font-normal mb-4">
            I'm a passionate tech enthusiast currently pursuing my university degree while balancing my twin passions for coding and video editing. My journey in programming has equipped me with problem-solving skills that complement my creative side, which thrives in visual storytelling through video production.
          </p>
          <p className="text-[#5c3d2e] text-base md:text-lg leading-loose font-normal mb-4">
            As a student, I'm constantly expanding my knowledge in both technical and creative domains. I approach coding challenges with the same attention to detail that I apply when crafting seamless video transitions. Whether I'm debugging code or color grading footage, I find joy in the process of creating something meaningful from scratch.
          </p>
          <p className="text-[#5c3d2e] text-base md:text-lg leading-loose font-normal mb-4">
            My academic journey provides me with a solid foundation, while my hands-on experience in development and video editing represents my commitment to practical skill-building. I believe in continuous learning and constantly push myself to explore new technologies and techniques.
          </p>
          <p className="text-[#5c3d2e] text-base md:text-lg leading-loose font-normal">
            I'm excited to connect with like-minded individuals and organizations who share my enthusiasm for technology and visual arts. Let's create something amazing together!
          </p>
        </div>
      </div>
    </section>
  );
});

export default About;
