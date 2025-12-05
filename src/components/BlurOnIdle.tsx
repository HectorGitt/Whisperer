import { useState } from 'react';
import type { ReactNode } from 'react';
import { useAccessibility } from '../contexts/AccessibilityContext';
import styles from './BlurOnIdle.module.css';

interface BlurOnIdleProps {
  children: ReactNode;
  blurAmount?: number;
  transitionDuration?: number;
  disabled?: boolean;
}

export function BlurOnIdle({ 
  children, 
  blurAmount = 4, 
  transitionDuration = 300,
  disabled = false 
}: BlurOnIdleProps) {
  const { settings } = useAccessibility();
  const [isHovered, setIsHovered] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  const shouldBlur = !disabled && !settings.disableBlur && !isHovered && !isFocused;

  return (
    <div
      className={`${styles.container} ${shouldBlur ? styles.blurred : ''}`}
      style={{
        '--blur-amount': `${blurAmount}px`,
        '--transition-duration': `${transitionDuration}ms`,
      } as React.CSSProperties}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onFocus={() => setIsFocused(true)}
      onBlur={() => setIsFocused(false)}
      data-testid="blur-on-idle"
      data-blurred={shouldBlur}
    >
      {children}
    </div>
  );
}
