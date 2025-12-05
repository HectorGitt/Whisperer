import { useEffect, useMemo } from 'react';
import { audioManager } from '../utils/AudioManager';
import { getJumpScareSound } from '../utils/soundMapping';
import { useNarrator } from '../contexts/NarratorContext';
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
  const { pause, resume } = useNarrator();
  
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
    
    // Pause narrator during jump scare
    pause();
    
    // Play jump scare sound
    audioManager.playSound(selectedSound);

    // Quick jump scare - 2 seconds
    const timer = setTimeout(() => {
      // Resume narrator after jump scare
      resume();
      onComplete?.();
    }, 2000);
    
    return () => {
      clearTimeout(timer);
      // Resume narrator if component unmounts early
      resume();
    };
  }, [onComplete, selectedSound, pause, resume]);
  
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
