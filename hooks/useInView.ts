
import { useState, useEffect, RefObject } from 'react';

const useInView = (ref: RefObject<Element>, options: IntersectionObserverInit = {}) => {
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setIsInView(true);
        // Optional: unobserve after it's in view
        // observer.unobserve(entry.target);
      }
    }, {
      threshold: 0.15,
      rootMargin: '0px 0px -80px 0px',
      ...options
    });

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) {
        // eslint-disable-next-line react-hooks/exhaustive-deps
        observer.unobserve(ref.current);
      }
    };
  }, [ref, options]);

  return isInView;
};

export default useInView;
