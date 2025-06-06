'use client';

import { motion, useInView } from 'framer-motion';
import { useEffect, useState, useRef } from 'react';

interface RouteAnimationProps {
  className?: string;
  autoPlay?: boolean;
  onProgressChange?: (progress: number) => void;
}

export default function RouteAnimation({ 
  className = '', 
  autoPlay = true,
  onProgressChange
}: RouteAnimationProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.5 });
  const [isAnimating, setIsAnimating] = useState(false);

  const routePath = "M360.03,274.83 L395.64,268.17 L395.86,266.76 L360.66,227.04 L359.71,226.54 L341.98,136 L247.61,107.05 L253.73,100.62 L253.52,100.72 L224.21,86.15 L214.62,57.25 L213.34,56.63 L142.18,23.62 L87.07,56.88 L68.40,38.25";
  
  useEffect(() => {
    if (isInView) {
      setIsAnimating(true);
    }
  }, [isInView]);

  useEffect(() => {
    if (!autoPlay || !isInView) return;
    
    const interval = setInterval(() => {
      setIsAnimating(false);
      setTimeout(() => setIsAnimating(true), 200);
    }, 16500);

    return () => clearInterval(interval);
  }, [autoPlay, isInView]);

  const lineVariants = {
    hidden: {
      pathLength: 0,
      opacity: 0
    },
    visible: {
      pathLength: 1,
      opacity: 1,
      transition: {
        pathLength: {
          duration: 3.5,
          ease: "easeInOut"
        },
        opacity: {
          duration: 0.3,
          ease: "easeIn"
        }
      }
    }
  };

  const glowVariants = {
    hidden: {
      pathLength: 0,
      opacity: 0
    },
    visible: {
      pathLength: 1,
      opacity: 0.6,
      transition: {
        pathLength: {
          duration: 3.5,
          ease: "easeInOut"
        },
        opacity: {
          duration: 0.3,
          ease: "easeIn",
          delay: 0.1
        }
      }
    }
  };

  const pointVariants = (delay: number) => ({
    hidden: { scale: 0, opacity: 0 },
    visible: { 
      scale: 1, 
      opacity: 1,
      transition: { delay, duration: 0.5 }
    }
  });

  return (
    <div 
      ref={ref}
      className={`relative w-full h-80 ${className}`} 
      style={{ overflow: 'visible' }}
    >
      <div className="absolute inset-0 overflow-hidden rounded-xl">
        <svg
          width="100%"
          height="100%"
          viewBox="-150 0 700 300"
          className="absolute inset-0"
          preserveAspectRatio="xMidYMid meet"
        >
          <defs>
            <linearGradient id="routeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#3B82F6" />
              <stop offset="50%" stopColor="#6366F1" />
              <stop offset="100%" stopColor="#8B5CF6" />
            </linearGradient>
            
            <filter id="glow">
              <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
              <feMerge> 
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
            
            <filter id="strongGlow">
              <feGaussianBlur stdDeviation="8" result="coloredBlur"/>
              <feMerge> 
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          </defs>

          {/* Glow Hintergrund-Linie */}
          <motion.path
            d={routePath}
            stroke="url(#routeGradient)"
            strokeWidth="8"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            filter="url(#strongGlow)"
            opacity="0.4"
            variants={glowVariants}
            initial="hidden"
            animate={isAnimating ? "visible" : "hidden"}
          />

          {/* Haupt-Route Linie */}
          <motion.path
            d={routePath}
            stroke="url(#routeGradient)"
            strokeWidth="5"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            filter="url(#glow)"
            variants={lineVariants}
            initial="hidden"
            animate={isAnimating ? "visible" : "hidden"}
            onUpdate={(latest) => {
              if (onProgressChange && typeof latest.pathLength === 'number') {
                onProgressChange(latest.pathLength);
              }
            }}
            onAnimationStart={() => {
              if (onProgressChange) {
                onProgressChange(0);
              }
            }}
            style={{
              vectorEffect: "non-scaling-stroke"
            }}
          />

          {/* Start-Punkt - Apartment */}
          <motion.circle
            cx="360"
            cy="275"
            r="8"
            fill="#22C55E"
            style={{
              vectorEffect: "non-scaling-stroke",
              filter: 'drop-shadow(0px 0px 6px #22C55E)'
            }}
            variants={pointVariants(0.5)}
            initial="hidden"
            animate={isAnimating ? "visible" : "hidden"}
          />

          {/* End-Punkt - Schwarz Digits Campus */}
          <motion.circle
            cx="68"
            cy="38"
            r="8"
            fill="#EF4444"
            style={{
              vectorEffect: "non-scaling-stroke",
              filter: 'drop-shadow(0px 0px 6px #EF4444)'
            }}
            variants={pointVariants(2.7)}
            initial="hidden"
            animate={isAnimating ? "visible" : "hidden"}
          />
        </svg>
      </div>
      
      <div 
        className="absolute inset-0 cursor-pointer rounded-xl"
        onClick={() => {
          if (!autoPlay) {
            setIsAnimating(!isAnimating);
          }
        }}
        onMouseEnter={() => !autoPlay && setIsAnimating(false)}
        onMouseLeave={() => !autoPlay && setIsAnimating(true)}
      />
    </div>
  );
} 