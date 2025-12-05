import { useEffect, useState, useMemo } from 'react';
import styles from './FloatingGhost.module.css';

interface FloatingGhostProps {
  onComplete?: () => void;
}

// All available ghost/floating images
const GHOST_IMAGES = [
  '/media/images/creepy-ghost-the-unholy.gif',
  '/media/images/scary-rooms-low-detailed.gif',
];

export function FloatingGhost({ onComplete }: FloatingGhostProps) {
  const [startX] = useState(() => Math.random() * 80 + 10); // 10-90%
  const [drift] = useState(() => (Math.random() - 0.5) * 30); // -15 to +15%
  
  const selectedGhost = useMemo(() => {
    return GHOST_IMAGES[Math.floor(Math.random() * GHOST_IMAGES.length)];
  }, []);
  
  useEffect(() => {
    // Animation duration is 10 seconds
    const timer = setTimeout(() => {
      onComplete?.();
    }, 10000);
    
    return () => clearTimeout(timer);
  }, [onComplete]);
  
  return (
    <div
      className={styles.ghost}
      style={{
        left: `${startX}%`,
        '--drift': `${drift}%`,
      } as React.CSSProperties}
      data-testid="floating-ghost"
    >
      <img 
        src={selectedGhost} 
        alt="Floating ghost"
        className={styles.ghostImage}
      />
    </div>
  );
}
