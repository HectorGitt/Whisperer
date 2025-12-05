import { useEffect, useState } from 'react';
import styles from './Scanlines.module.css';

export function Scanlines() {
  const [density, setDensity] = useState(2);

  useEffect(() => {
    const updateDensity = () => {
      const width = window.innerWidth;
      if (width <= 768) {
        setDensity(3); // Less dense on mobile
      } else if (width <= 1024) {
        setDensity(2);
      } else {
        setDensity(2);
      }
    };

    updateDensity();
    window.addEventListener('resize', updateDensity);
    return () => window.removeEventListener('resize', updateDensity);
  }, []);

  return (
    <div 
      className={styles.scanlines} 
      data-testid="scanlines"
      style={{ '--scanline-spacing': `${density}px` } as React.CSSProperties}
      aria-hidden="true"
    />
  );
}
