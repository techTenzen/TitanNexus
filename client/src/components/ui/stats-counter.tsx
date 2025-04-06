import { useEffect, useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';

interface StatsCounterProps {
  value: number;
  label: string;
  gradientFrom?: string;
  gradientTo?: string;
}

export function StatsCounter({ 
  value, 
  label, 
  gradientFrom = "from-[#FF3370]", 
  gradientTo = "to-[#7928CA]" 
}: StatsCounterProps) {
  const [displayValue, setDisplayValue] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  
  useEffect(() => {
    if (isInView) {
      let startTime: number;
      const duration = 2000; // 2 seconds
      
      const animateCount = (timestamp: number) => {
        if (!startTime) startTime = timestamp;
        
        const progress = Math.min((timestamp - startTime) / duration, 1);
        const currentValue = Math.floor(progress * value);
        
        setDisplayValue(currentValue);
        
        if (progress < 1) {
          requestAnimationFrame(animateCount);
        } else {
          setDisplayValue(value);
        }
      };
      
      requestAnimationFrame(animateCount);
    }
  }, [isInView, value]);
  
  const formattedValue = new Intl.NumberFormat().format(displayValue);
  
  return (
    <div ref={ref} className="text-center">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.5 }}
        className={`text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r ${gradientFrom} ${gradientTo} mb-2`}
      >
        {formattedValue}
      </motion.div>
      <p className="text-gray-400">{label}</p>
    </div>
  );
}
