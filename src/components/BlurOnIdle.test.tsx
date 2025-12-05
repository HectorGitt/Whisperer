import { describe, it, expect } from 'vitest';
import { render, cleanup, fireEvent } from '@testing-library/react';
import fc from 'fast-check';
import { BlurOnIdle } from './BlurOnIdle';
import { AccessibilityProvider } from '../contexts/AccessibilityContext';

describe('BlurOnIdle', () => {
  /**
   * Feature: doom-scroll-reader, Property 7: Blur state toggle on interaction
   * Validates: Requirements 3.1, 3.2, 3.3
   * 
   * For any text element with blur-on-idle behavior, hovering should remove the blur effect,
   * and unhovering should reapply it, returning to the original state.
   */
  it('property: blur state toggles on hover interaction (round trip)', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.string({ minLength: 1, maxLength: 100 }),
        fc.integer({ min: 1, max: 10 }),
        fc.integer({ min: 100, max: 500 }),
        async (content, blurAmount, transitionDuration) => {
          const { container } = render(
            <AccessibilityProvider initialSettings={{ reduceMotion: false, disableBlur: false, highContrast: false }}>
              <BlurOnIdle blurAmount={blurAmount} transitionDuration={transitionDuration}>
                <div>{content}</div>
              </BlurOnIdle>
            </AccessibilityProvider>
          );

          const blurContainer = container.querySelector('[data-testid="blur-on-idle"]');
          if (!blurContainer) throw new Error('BlurOnIdle container not found');
          
          // Initial state: should be blurred
          const initialBlurred = blurContainer.getAttribute('data-blurred') === 'true';
          expect(initialBlurred).toBe(true);

          // Hover: should remove blur
          fireEvent.mouseEnter(blurContainer);
          const hoveredBlurred = blurContainer.getAttribute('data-blurred') === 'true';
          expect(hoveredBlurred).toBe(false);

          // Unhover: should reapply blur (round trip)
          fireEvent.mouseLeave(blurContainer);
          const unhoveredBlurred = blurContainer.getAttribute('data-blurred') === 'true';
          expect(unhoveredBlurred).toBe(true);

          // Verify we returned to initial state
          expect(unhoveredBlurred).toBe(initialBlurred);
          
          cleanup();
        }
      ),
      { numRuns: 100 }
    );
  });

  it('property: blur is disabled when accessibility setting is enabled', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.string({ minLength: 1, maxLength: 100 }),
        async (content) => {
          const { container } = render(
            <AccessibilityProvider initialSettings={{ reduceMotion: false, disableBlur: true, highContrast: false }}>
              <BlurOnIdle>
                <div>{content}</div>
              </BlurOnIdle>
            </AccessibilityProvider>
          );

          const blurContainer = container.querySelector('[data-testid="blur-on-idle"]');
          if (!blurContainer) throw new Error('BlurOnIdle container not found');
          
          // Should never be blurred when disableBlur is true
          expect(blurContainer.getAttribute('data-blurred')).toBe('false');

          // Even after hover/unhover
          fireEvent.mouseEnter(blurContainer);
          expect(blurContainer.getAttribute('data-blurred')).toBe('false');

          fireEvent.mouseLeave(blurContainer);
          expect(blurContainer.getAttribute('data-blurred')).toBe('false');
          
          cleanup();
        }
      ),
      { numRuns: 100 }
    );
  });
});
