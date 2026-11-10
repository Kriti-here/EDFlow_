import { useState, useEffect, useRef } from 'react';

interface UseCountUpOptions {
  duration?: number;
  startValue?: number;
  decimals?: number;
}

export const useCountUp = (
  endValue: number,
  duration: number = 1.0,
  options: UseCountUpOptions = {}
) => {
  const { startValue = 0, decimals = 0 } = options;
  const [count, setCount] = useState(startValue);
  const ref = useRef<HTMLElement>(null);
  const hasAnimated = useRef(false);

  const animate = () => {
    if (hasAnimated.current) return;
    hasAnimated.current = true;
    
    const start = startValue;
    const end = endValue;
    const startTime = performance.now();
    const durationMs = duration * 1000;

    const animateFrame = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / durationMs, 1);
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      const currentValue = start + (end - start) * easeOutQuart;
      
      setCount(Number(currentValue.toFixed(decimals)));

      if (progress < 1) {
        requestAnimationFrame(animateFrame);
      }
    };

    requestAnimationFrame(animateFrame);
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            animate();
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );

    const currentRef = ref.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) observer.unobserve(currentRef);
    };
  }, [endValue, duration, startValue, decimals]);

  return { ref, count };
};

export default useCountUp;
