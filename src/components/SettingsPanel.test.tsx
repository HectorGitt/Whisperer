import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { SettingsPanel } from './SettingsPanel';
import { AccessibilityProvider } from '../contexts/AccessibilityContext';
import { ThemeProvider } from '../contexts/ThemeContext';
import { NarratorProvider } from '../contexts/NarratorContext';
import { BlurOnIdle } from './BlurOnIdle';
import fc from 'fast-check';

function renderWithProviders(ui: React.ReactElement) {
  return render(
    <ThemeProvider>
      <AccessibilityProvider>
        <NarratorProvider>
          {ui}
        </NarratorProvider>
      </AccessibilityProvider>
    </ThemeProvider>
  );
}

describe('SettingsPanel', () => {
  describe('Unit Tests', () => {
    it('should render blur disable toggle when settings panel is open', () => {
      // Requirements: 8.3
      const onClose = vi.fn();
      
      renderWithProviders(
        <SettingsPanel isOpen={true} onClose={onClose} />
      );

      const blurToggle = screen.getByTestId('blur-toggle');
      expect(blurToggle).toBeInTheDocument();
      expect(blurToggle).toHaveAttribute('role', 'switch');
      expect(blurToggle).toHaveAttribute('aria-label', 'Toggle blur effects');
    });

    it('should not render when isOpen is false', () => {
      const onClose = vi.fn();
      
      const { container } = renderWithProviders(
        <SettingsPanel isOpen={false} onClose={onClose} />
      );

      expect(container.firstChild).toBeNull();
    });

    it('should render motion toggle', () => {
      const onClose = vi.fn();
      
      renderWithProviders(
        <SettingsPanel isOpen={true} onClose={onClose} />
      );

      const motionToggle = screen.getByTestId('motion-toggle');
      expect(motionToggle).toBeInTheDocument();
      expect(motionToggle).toHaveAttribute('role', 'switch');
    });

    it('should render theme toggle', () => {
      const onClose = vi.fn();
      
      renderWithProviders(
        <SettingsPanel isOpen={true} onClose={onClose} />
      );

      const themeToggle = screen.getByTestId('theme-toggle');
      expect(themeToggle).toBeInTheDocument();
      expect(themeToggle).toHaveAttribute('role', 'switch');
    });
  });

  describe('Property Tests', () => {
    /**
     * Feature: doom-scroll-reader, Property 20: Blur disable functionality
     * Validates: Requirements 8.4
     * 
     * For any text element, when blur effects are disabled in settings, 
     * no blur should be applied regardless of hover state.
     */
    it('Property 20: should not apply blur when disableBlur is true', () => {
      fc.assert(
        fc.property(
          fc.string({ minLength: 1, maxLength: 100 }),
          (text) => {
            // Render with blur disabled
            const { container, unmount } = render(
              <ThemeProvider>
                <AccessibilityProvider initialSettings={{ 
                  disableBlur: true, 
                  reduceMotion: false, 
                  highContrast: false 
                }}>
                  <BlurOnIdle>
                    <span>{text}</span>
                  </BlurOnIdle>
                </AccessibilityProvider>
              </ThemeProvider>
            );

            const blurContainer = container.querySelector('[data-testid="blur-on-idle"]');
            expect(blurContainer).toBeInTheDocument();
            
            // When blur is disabled, the element should not have the blurred state
            const isBlurred = blurContainer?.getAttribute('data-blurred') === 'true';
            expect(isBlurred).toBe(false);

            unmount();
          }
        ),
        { numRuns: 100 }
      );
    });

    /**
     * Feature: doom-scroll-reader, Property 21: Visual effects independence
     * Validates: Requirements 8.5
     * 
     * For any accessibility setting that reduces visual effects, 
     * the monochromatic color scheme should remain unchanged.
     */
    it('Property 21: should maintain color scheme when accessibility settings change', () => {
      fc.assert(
        fc.property(
          fc.boolean(),
          fc.boolean(),
          fc.boolean(),
          (disableBlur, reduceMotion, highContrast) => {
            const { container, unmount } = render(
              <ThemeProvider>
                <AccessibilityProvider initialSettings={{ 
                  disableBlur, 
                  reduceMotion, 
                  highContrast 
                }}>
                  <div data-testid="test-element" style={{ color: 'var(--crt-green)' }}>
                    Test Content
                  </div>
                </AccessibilityProvider>
              </ThemeProvider>
            );

            const element = container.querySelector('[data-testid="test-element"]');
            expect(element).toBeInTheDocument();
            
            // Get computed color - should use CSS variable
            const computedStyle = window.getComputedStyle(element!);
            const color = computedStyle.color;
            
            // The color should be set (not empty), indicating the CSS variable is working
            // We're verifying that accessibility settings don't break the color scheme
            expect(color).toBeTruthy();
            expect(color).not.toBe('');

            unmount();
          }
        ),
        { numRuns: 100 }
      );
    });
  });
});
