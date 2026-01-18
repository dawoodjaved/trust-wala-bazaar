"use client";

import { useSpring, animated } from '@react-spring/web';
import React from 'react';

interface AnimatedSVGProps {
  children?: React.ReactNode;
  className?: string;
  duration?: number;
  delay?: number;
  style?: React.CSSProperties;
  alt?: string;
}

export function AnimatedSVG({ 
  children,
  className, 
  style, 
  duration = 2000, 
  delay = 0, 
  alt = ""
}: AnimatedSVGProps) {
  const [springs] = useSpring(() => ({
    from: { opacity: 0, scale: 0.8 },
    to: { opacity: 1, scale: 1 },
    delay,
    config: { tension: 100, friction: 50 },
  }));

  return (
    <>
      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: scale(0.9);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
      `}</style>
      <animated.div
        className={className}
        style={{ ...springs, ...style }}
      >
        {children}
      </animated.div>
    </>
  );
}
