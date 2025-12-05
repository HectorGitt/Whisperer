import { useState, useEffect, useCallback } from 'react';

export type SpookyEffectType = 'spider' | 'ghost' | 'jumpscare' | 'glitch' | 'shadow' | null;

interface UseRandomSpookyEffectOptions {
  minDelay?: number; // Minimum delay in ms (default: 30000 = 30s)
  maxDelay?: number; // Maximum delay in ms (default: 90000 = 90s)
  enabled?: boolean; // Whether effects are enabled (default: true)
}

export function useRandomSpookyEffect(options: UseRandomSpookyEffectOptions = {}) {
  const {
    minDelay = 30000,
    maxDelay = 90000,
    enabled = true,
  } = options;
  
  const [activeEffect, setActiveEffect] = useState<SpookyEffectType>(null);
  
  const getRandomDelay = useCallback(() => {
    return Math.random() * (maxDelay - minDelay) + minDelay;
  }, [minDelay, maxDelay]);
  
  const getRandomEffect = useCallback((): SpookyEffectType => {
    const effects: SpookyEffectType[] = ['spider', 'ghost', 'glitch', 'shadow'];
    // Jump scares are rarer (10% chance)
    if (Math.random() < 0.1) {
      return 'jumpscare';
    }
    return effects[Math.floor(Math.random() * effects.length)];
  }, []);
  
  const triggerEffect = useCallback(() => {
    if (!enabled) return;
    
    const effect = getRandomEffect();
    setActiveEffect(effect);
  }, [enabled, getRandomEffect]);
  
  const clearEffect = useCallback(() => {
    setActiveEffect(null);
  }, []);
  
  useEffect(() => {
    if (!enabled) {
      setActiveEffect(null);
      return;
    }
    
    // Schedule first effect
    const initialDelay = getRandomDelay();
    let timeoutId = setTimeout(triggerEffect, initialDelay);
    
    return () => {
      clearTimeout(timeoutId);
    };
  }, [enabled, getRandomDelay, triggerEffect]);
  
  useEffect(() => {
    // When an effect completes, schedule the next one
    if (activeEffect === null && enabled) {
      const delay = getRandomDelay();
      const timeoutId = setTimeout(triggerEffect, delay);
      
      return () => {
        clearTimeout(timeoutId);
      };
    }
  }, [activeEffect, enabled, getRandomDelay, triggerEffect]);
  
  return {
    activeEffect,
    clearEffect,
    triggerEffect, // Exposed for manual triggering
  };
}
