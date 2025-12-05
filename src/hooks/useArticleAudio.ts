import { useEffect, useRef } from 'react';
import { audioManager } from '../utils/AudioManager';
import { getSoundsForText } from '../utils/soundMapping';

interface UseArticleAudioOptions {
  text: string;
  category?: 'spooky';
  enabled?: boolean;
}

/**
 * Hook to manage audio playback based on article content
 */
export function useArticleAudio(options: UseArticleAudioOptions) {
  const { text, enabled = true } = options;
  const hasPlayedRef = useRef(false);
  
  useEffect(() => {
    if (!enabled || !text || hasPlayedRef.current) {
      console.log('useArticleAudio: Skipping audio', { enabled, hasText: !!text, hasPlayed: hasPlayedRef.current });
      return;
    }
    
    // Play contextual sounds based on article content keywords
    const sounds = getSoundsForText(text);
    console.log('useArticleAudio: Found sounds for article:', sounds);
    
    if (sounds.length > 0) {
      // Play the first matched sound
      console.log('useArticleAudio: Playing sound:', sounds[0]);
      audioManager.playSound(sounds[0]);
      hasPlayedRef.current = true;
    }
    
    // Cleanup on unmount
    return () => {
      // Don't stop sounds on unmount to allow them to finish
    };
  }, [text, enabled]);
  
  return {
    playSound: (soundFile: string) => audioManager.playSound(soundFile),
    stopAllSounds: () => audioManager.stopAll(),
  };
}
