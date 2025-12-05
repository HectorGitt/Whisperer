import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { narrator } from '../utils/Narrator';

interface NarratorContextType {
  enabled: boolean;
  setEnabled: (enabled: boolean) => void;
  speak: (text: string) => void;
  stop: () => void;
  pause: () => void;
  resume: () => void;
  narrateArticleTitle: (title: string) => void;
  getRandomPhrase: () => string;
  isSupported: boolean;
  isSpeaking: boolean;
}

const NarratorContext = createContext<NarratorContextType | undefined>(undefined);

interface NarratorProviderProps {
  children: ReactNode;
}

export function NarratorProvider({ children }: NarratorProviderProps) {
  const [enabled, setEnabledState] = useState(false);
  const [isSupported] = useState(() => 'speechSynthesis' in window);
  const [isSpeaking, setIsSpeaking] = useState(false);
  
  useEffect(() => {
    // Load saved preference
    const saved = localStorage.getItem('narrator-enabled');
    if (saved !== null) {
      const isEnabled = saved === 'true';
      setEnabledState(isEnabled);
      narrator.setEnabled(isEnabled);
    }
  }, []);
  
  const setEnabled = (value: boolean) => {
    setEnabledState(value);
    narrator.setEnabled(value);
    localStorage.setItem('narrator-enabled', String(value));
    
    // Speak a greeting when enabled
    if (value) {
      narrator.speak(narrator.getRandomSpookyPhrase());
    }
  };
  
  const speak = (text: string) => {
    if (enabled && isSupported) {
      narrator.speak(text);
      setIsSpeaking(true);
      
      // Estimate speaking duration and auto-update state
      const wordCount = text.split(/\s+/).length;
      const estimatedDuration = (wordCount / 150) * 60 * 1000; // 150 words per minute
      
      setTimeout(() => {
        setIsSpeaking(false);
      }, estimatedDuration);
    }
  };
  
  const stop = () => {
    narrator.stop();
    setIsSpeaking(false);
  };
  
  const pause = () => {
    narrator.pause();
  };
  
  const resume = () => {
    narrator.resume();
  };
  
  const narrateArticleTitle = (title: string) => {
    if (enabled && isSupported) {
      narrator.narrateArticleTitle(title);
      setIsSpeaking(true);
      
      // Estimate speaking duration for title
      const wordCount = title.split(/\s+/).length;
      const estimatedDuration = (wordCount / 150) * 60 * 1000; // 150 words per minute
      
      setTimeout(() => {
        setIsSpeaking(false);
      }, estimatedDuration);
    }
  };
  
  const getRandomPhrase = () => {
    return narrator.getRandomSpookyPhrase();
  };
  
  return (
    <NarratorContext.Provider
      value={{
        enabled,
        setEnabled,
        speak,
        stop,
        pause,
        resume,
        narrateArticleTitle,
        getRandomPhrase,
        isSupported,
        isSpeaking,
      }}
    >
      {children}
    </NarratorContext.Provider>
  );
}

export function useNarrator() {
  const context = useContext(NarratorContext);
  if (context === undefined) {
    throw new Error('useNarrator must be used within a NarratorProvider');
  }
  return context;
}
