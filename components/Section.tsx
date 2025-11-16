
import React, { useRef, forwardRef } from 'react';
import useInView from '../hooks/useInView';

interface SectionProps {
  children: React.ReactNode;
  id: string;
  className?: string;
  animationClass?: 'slide-in-left' | 'slide-in-right' | 'slide-in-bottom';
}

const Section = forwardRef<HTMLElement, SectionProps>(({ children, id, className = '', animationClass }, ref) => {
  const internalRef = useRef<HTMLElement>(null);
  const isInView = useInView(internalRef);

  // Combine forwarded ref and internal ref
  React.useImperativeHandle(ref, () => internalRef.current!);
  
  const animationClasses = animationClass ? `${animationClass} ${isInView ? 'in-view' : ''}` : '';

  return (
    <section ref={internalRef} id={id} className={`${className} ${animationClasses}`}>
      {children}
    </section>
  );
});

export default Section;
