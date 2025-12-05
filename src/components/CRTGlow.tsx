import type { ReactNode } from 'react';
import styles from './CRTGlow.module.css';

interface CRTGlowProps {
  children: ReactNode;
  intensity?: 'low' | 'medium' | 'high';
}

export function CRTGlow({ children, intensity = 'medium' }: CRTGlowProps) {
  return (
    <span className={`${styles.glow} ${styles[intensity]}`}>
      {children}
    </span>
  );
}
