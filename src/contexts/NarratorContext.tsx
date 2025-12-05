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
  const [enabled, setEnabledState] = useState(true); // Enabled by default
  const [isSupported] = useState(() => 'speechSynthesis' in window);
  const [isSpeaking, setIsSpeaking] = useState(false);
  
  useEffect(() => {
    // Load saved preference, default to true if not set
    const saved = localStorage.getItem('narrator-enabled');
    if (saved !== null) {
      const isEnabled = saved === 'true';
      setEnabledState(isEnabled);
      narrator.setEnabled(isEnabled);
    } else {
      // First time - enable by default and save preference
      setEnabledState(true);
      narrator.setEnabled(true);
      localStorage.setItem('narrator-enabled', 'true');
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
      setIsSpeaking(true);
      
      // Create utterance with event handlers
      const utterance = new SpeechSynthesisUtterance(text);
      
      // Set voice and parameters
      const voices = window.speechSynthesis.getVoices();
      if (voices.length > 0) {
        const preferredVoice = voices.find(
          (voice) =>
            voice.name.toLowerCase().includes('male') ||
            voice.name.toLowerCase().includes('daniel') ||
            voice.name.toLowerCase().includes('alex')
        );
        utterance.voice = preferredVoice || voices[0];
      }
      
      utterance.rate = 0.8;
      utterance.pitch = 0.7;
      utterance.volume = 0.8;
      
      // Update state when speech ends
      utterance.onend = () => {
        setIsSpeaking(false);
      };
      
      utterance.onerror = () => {
        setIsSpeaking(false);
      };
      
      // Cancel any ongoing speech and speak
      window.speechSynthesis.cancel();
      window.speechSynthesis.speak(utterance);
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
      setIsSpeaking(true);
      
      const intros = [
        "Now reading...",
        "Behold...",
        "Witness...",
        "Prepare yourself for...",
        "Enter the world of...",
        "Dare to read...",
      ];
      
      const intro = intros[Math.floor(Math.random() * intros.length)];
      const fullText = `${intro} ${title}`;
      
      // Create utterance with event handlers
      const utterance = new SpeechSynthesisUtterance(fullText);
      
      // Set voice and parameters
      const voices = window.speechSynthesis.getVoices();
      if (voices.length > 0) {
        const preferredVoice = voices.find(
          (voice) =>
            voice.name.toLowerCase().includes('male') ||
            voice.name.toLowerCase().includes('daniel') ||
            voice.name.toLowerCase().includes('alex')
        );
        utterance.voice = preferredVoice || voices[0];
      }
      
      utterance.rate = 0.8;
      utterance.pitch = 0.7;
      utterance.volume = 0.8;
      
      // Update state when speech ends
      utterance.onend = () => {
        setIsSpeaking(false);
      };
      
      utterance.onerror = () => {
        setIsSpeaking(false);
      };
      
      // Cancel any ongoing speech and speak
      window.speechSynthesis.cancel();
      window.speechSynthesis.speak(utterance);
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
