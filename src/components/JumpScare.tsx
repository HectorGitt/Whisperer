import { useEffect, useMemo } from 'react';
import { audioManager } from '../utils/AudioManager';
import { getJumpScareSound } from '../utils/soundMapping';
import styles from './JumpScare.module.css';

interface JumpScareProps {
  onComplete?: () => void;
  imageUrl?: string;
}

// All available jump scare images
const JUMP_SCARE_IMAGES = [
  '/media/images/half-life_scare.gif',
  '/media/images/kuchisake-0nna-nexbot_scare.gif',
  '/media/images/one-piece-scary-moments.gif',
  '/media/images/man_with_knife_dancing.gif',
  '/media/images/carve-a-pumpkin-michael-myers.gif',
  '/media/images/wtf-angry.gif',
];

export function JumpScare({ onComplete, imageUrl }: JumpScareProps) {
  // Select random image on mount
  const selectedImage = useMemo(() => {
    if (imageUrl) return imageUrl;
    return JUMP_SCARE_IMAGES[Math.floor(Math.random() * JUMP_SCARE_IMAGES.length)];
  }, [imageUrl]);

  // Select random short sound for jump scare on mount
  const selectedSound = useMemo(() => {
    return getJumpScareSound();
  }, []);

  useEffect(() => {
    console.log('JumpScare: Attempting to play sound:', selectedSound);
    
    // Don't pause narrator - let it continue during jump scare
    // Play jump scare sound
    audioManager.playSound(selectedSound);

    // Quick jump scare - 2 seconds
    const timer = setTimeout(() => {
      onComplete?.();
    }, 2000);
    
    return () => {
      clearTimeout(timer);
    };
  }, [onComplete, selectedSound]);
  
  return (
    <div className={styles.jumpScare} data-testid="jump-scare">
      <img 
        src={selectedImage} 
        alt="Jump scare"
        className={styles.scareImage}
      />
    </div>
  );
}
