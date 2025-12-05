import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { AccessibilitySettings, UserPreferences } from '../types';

interface AccessibilityContextType {
  settings: AccessibilitySettings;
  updateSettings: (settings: Partial<AccessibilitySettings>) => void;
}

const AccessibilityContext = createContext<AccessibilityContextType | undefined>(undefined);

const PREFERENCES_KEY = 'doom-scroll-preferences';

interface AccessibilityProviderProps {
  children: ReactNode;
  initialSettings?: AccessibilitySettings;
}

function getStoredPreferences(): UserPreferences | null {
  try {
    const data = localStorage.getItem(PREFERENCES_KEY);
    if (!data) return null;
    return JSON.parse(data) as UserPreferences;
  } catch {
    return null;
  }
}

function savePreferences(preferences: UserPreferences): void {
  try {
    localStorage.setItem(PREFERENCES_KEY, JSON.stringify(preferences));
  } catch (error) {
    console.error('Failed to save preferences:', error);
  }
}

function detectReducedMotion(): boolean {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

export function AccessibilityProvider({ 
  children, 
  initialSettings 
}: AccessibilityProviderProps) {
  const [settings, setSettings] = useState<AccessibilitySettings>(() => {
    // Priority: initialSettings > stored preferences > defaults with reduced motion detection
    if (initialSettings) {
      return initialSettings;
    }

    const stored = getStoredPreferences();
    if (stored) {
      return stored.accessibility;
    }

    return {
      reduceMotion: detectReducedMotion(),
      disableBlur: false,
      highContrast: false,
    };
  });

  useEffect(() => {
    // Save to localStorage whenever settings change
    const stored = getStoredPreferences() || { accessibility: settings };
    savePreferences({
      ...stored,
      accessibility: settings,
    });
  }, [settings]);

  const updateSettings = (newSettings: Partial<AccessibilitySettings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
  };

  return (
    <AccessibilityContext.Provider value={{ settings, updateSettings }}>
      {children}
    </AccessibilityContext.Provider>
  );
}

export function useAccessibility(): AccessibilityContextType {
  const context = useContext(AccessibilityContext);
  if (context === undefined) {
    throw new Error('useAccessibility must be used within an AccessibilityProvider');
  }
  return context;
}
