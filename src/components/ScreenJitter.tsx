import type { ReactNode } from 'react';
import { useAccessibility } from '../contexts/AccessibilityContext';
import styles from './ScreenJitter.module.css';

interface ScreenJitterProps {
  children: ReactNode;
}

export function ScreenJitter({ children }: ScreenJitterProps) {
  const { settings } = useAccessibility();

  return (
    <div 
      className={`${styles.container} ${settings.reduceMotion ? styles.reducedMotion : ''}`}
      data-testid="screen-jitter"
    >
      {children}
    </div>
  );
}
