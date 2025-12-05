import { useEffect, useState, useMemo } from 'react';
import styles from './ShadowFigure.module.css';

interface ShadowFigureProps {
  onComplete?: () => void;
}

// All available shadow/grotesque images
const SHADOW_IMAGES = [
  '/media/images/darkness-takeover-stewie-griffin-monster-pibby.gif',
  '/media/images/colin-raff-grotesque.gif',
  '/media/images/colin-raff-grotesque (1).gif',
  '/media/images/colin-raff-grotesque (2).gif',
  '/media/images/dm4uz3-foekoe.gif',
  '/media/images/ibtrav-ibtrav-artworks.gif',
  '/media/images/spruki.gif',
];

export function ShadowFigure({ onComplete }: ShadowFigureProps) {
  const [side] = useState<'left' | 'right'>(() => 
    Math.random() > 0.5 ? 'left' : 'right'
  );
  
  const selectedImage = useMemo(() => {
    return SHADOW_IMAGES[Math.floor(Math.random() * SHADOW_IMAGES.length)];
  }, []);
  
  useEffect(() => {
    // Shadow figure - 5 seconds
    const timer = setTimeout(() => {
      onComplete?.();
    }, 5000);
    
    return () => clearTimeout(timer);
  }, [onComplete]);
  
  return (
    <div 
      className={`${styles.shadow} ${side === 'left' ? styles.left : styles.right}`}
      data-testid="shadow-figure"
    >
      <img 
        src={selectedImage} 
        alt="Shadow figure"
        className={styles.shadowImage}
      />
    </div>
  );
}
