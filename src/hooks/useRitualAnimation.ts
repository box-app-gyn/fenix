import { useInView } from 'framer-motion';
import { useRef } from 'react';

export const useRitualAnimation = (delay: number = 0.33) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  const ritualVariants = {
    hidden: { opacity: 0, y: 30, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.66,
        delay,
        ease: [0.25, 0.46, 0.45, 0.94]
      }
    }
  };

  const pulseVariants = {
    initial: { scale: 1 },
    pulse: {
      scale: [1, 1.02, 1],
      transition: {
        duration: 2,
        repeat: Infinity,
        ease: 'easeInOut'
      }
    }
  };

  return { ref, isInView, ritualVariants, pulseVariants };
}; 