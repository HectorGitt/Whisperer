import { useEffect } from 'react';
import styles from './GlitchEffect.module.css';

interface GlitchEffectProps {
  onComplete?: () => void;
}

export function GlitchEffect({ onComplete }: GlitchEffectProps) {
  useEffect(() => {
    // Glitch effect - 3 seconds
    const timer = setTimeout(() => {
      onComplete?.();
    }, 3000);
    
    return () => clearTimeout(timer);
  }, [onComplete]);
  
  return (
    <div className={styles.glitch} data-testid="glitch-effect">
      <div className={styles.glitchLayer}></div>
      <div className={styles.glitchLayer}></div>
      <div className={styles.glitchLayer}></div>
    </div>
  );
}
