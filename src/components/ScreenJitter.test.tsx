import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ScreenJitter } from './ScreenJitter';
import { AccessibilityProvider } from '../contexts/AccessibilityContext';
import styles from './ScreenJitter.module.css';

describe('ScreenJitter', () => {
  it('should render jitter container in DOM', () => {
    render(
      <AccessibilityProvider>
        <ScreenJitter>
          <div>Test content</div>
        </ScreenJitter>
      </AccessibilityProvider>
    );
    const container = screen.getByTestId('screen-jitter');
    expect(container).toBeInTheDocument();
  });

  it('should apply jitter animation when reduced motion is disabled', () => {
    render(
      <AccessibilityProvider initialSettings={{ reduceMotion: false, disableBlur: false, highContrast: false }}>
        <ScreenJitter>
          <div>Test content</div>
        </ScreenJitter>
      </AccessibilityProvider>
    );
    const container = screen.getByTestId('screen-jitter');
    expect(container.className).not.toContain('reducedMotion');
  });

  it('should disable jitter animation when reduced motion is enabled', () => {
    render(
      <AccessibilityProvider initialSettings={{ reduceMotion: true, disableBlur: false, highContrast: false }}>
        <ScreenJitter>
          <div>Test content</div>
        </ScreenJitter>
      </AccessibilityProvider>
    );
    const container = screen.getByTestId('screen-jitter');
    expect(container.className).toContain('reducedMotion');
  });

  // Task 4.2: Verify jitter animation is applied to container
  // Requirements: 2.3
  it('should apply jitter animation CSS class to container', () => {
    render(
      <AccessibilityProvider>
        <ScreenJitter>
          <div>Test content</div>
        </ScreenJitter>
      </AccessibilityProvider>
    );
    const container = screen.getByTestId('screen-jitter');
    // Verify the container has the animation class
    expect(container).toHaveClass(styles.container);
  });
});
