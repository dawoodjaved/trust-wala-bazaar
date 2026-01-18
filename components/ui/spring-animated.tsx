"use client";

import { useSpring, animated, config } from '@react-spring/web';
import { ReactNode } from 'react';

interface SpringAnimatedProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  from?: { opacity?: number; y?: number; scale?: number; x?: number; rotate?: number };
  to?: { opacity?: number; y?: number; scale?: number; x?: number; rotate?: number };
  style?: React.CSSProperties;
  trigger?: boolean;
}

export function SpringAnimated({
  children,
  className,
  delay = 0,
  from = { opacity: 0, y: 20 },
  to = { opacity: 1, y: 0 },
  style,
  trigger = true,
}: SpringAnimatedProps) {
  const [springs] = useSpring(
    () => ({
      from: trigger ? from : to,
      to: trigger ? to : from,
      delay,
      config: config.gentle,
    }),
    [trigger]
  );

  // Handle rotation transform
  const transform = springs.rotate
    ? `translate(${springs.x?.to(x => x || 0)}px, ${springs.y?.to(y => y || 0)}px) scale(${springs.scale?.to(s => s || 1)}) rotate(${springs.rotate.to(r => `${r}deg`)})`
    : `translate(${springs.x?.to(x => x || 0)}px, ${springs.y?.to(y => y || 0)}px) scale(${springs.scale?.to(s => s || 1)})`;

  return (
    <animated.div 
      className={className} 
      style={{ 
        ...springs, 
        transform: springs.rotate || springs.x || springs.y || springs.scale ? transform : undefined,
        ...style 
      }}
    >
      {children}
    </animated.div>
  );
}
