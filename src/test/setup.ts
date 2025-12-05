import '@testing-library/jest-dom'

// Mock localStorage for tests
class LocalStorageMock {
  private store: Map<string, string> = new Map();

  clear() {
    this.store.clear();
  }

  getItem(key: string) {
    return this.store.get(key) || null;
  }

  setItem(key: string, value: string) {
    this.store.set(key, value);
  }

  removeItem(key: string) {
    this.store.delete(key);
  }

  get length() {
    return this.store.size;
  }

  key(index: number) {
    return Array.from(this.store.keys())[index] || null;
  }
}

global.localStorage = new LocalStorageMock() as Storage;

// Mock matchMedia for tests
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => true,
  }),
});

// Test helper to wrap components with all providers
import React from 'react';
import { ThemeProvider } from '../contexts/ThemeContext';
import { AccessibilityProvider } from '../contexts/AccessibilityContext';
import { ArticleProvider } from '../contexts/ArticleContext';
import { NarratorProvider } from '../contexts/NarratorContext';

export function AllProviders({ children }: { children: React.ReactNode }) {
  return React.createElement(
    ThemeProvider,
    null,
    React.createElement(
      AccessibilityProvider,
      null,
      React.createElement(
        ArticleProvider,
        null,
        React.createElement(NarratorProvider, null, children)
      )
    )
  );
}
