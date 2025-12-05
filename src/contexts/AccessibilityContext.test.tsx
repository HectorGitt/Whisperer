import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { renderHook, act } from '@testing-library/react';
import fc from 'fast-check';
import { AccessibilityProvider, useAccessibility } from './AccessibilityContext';
import { ThemeProvider, useTheme } from './ThemeContext';

describe('AccessibilityContext', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  /**
   * Feature: doom-scroll-reader, Property 18: Reduced motion detection
   * Validates: Requirements 8.1
   * 
   * For any user with prefers-reduced-motion enabled, the application should detect this preference on load.
   */
  it('should detect reduced motion preference on load', () => {
    fc.assert(
      fc.property(fc.boolean(), (prefersReducedMotion) => {
        // Mock the matchMedia API
        const mockMatchMedia = vi.fn((query: string) => ({
          matches: query === '(prefers-reduced-motion: reduce)' ? prefersReducedMotion : false,
          media: query,
          onchange: null,
          addListener: vi.fn(),
          removeListener: vi.fn(),
          addEventListener: vi.fn(),
          removeEventListener: vi.fn(),
          dispatchEvent: vi.fn(),
        }));

        Object.defineProperty(window, 'matchMedia', {
          writable: true,
          value: mockMatchMedia,
        });

        // Clear localStorage to ensure we're testing detection, not stored preferences
        localStorage.clear();

        // Render the provider without initial settings
        const wrapper = ({ children }: { children: React.ReactNode }) => (
          <AccessibilityProvider>{children}</AccessibilityProvider>
        );

        const { result } = renderHook(() => useAccessibility(), { wrapper });

        // The reduceMotion setting should match the system preference
        expect(result.current.settings.reduceMotion).toBe(prefersReducedMotion);
      }),
      { numRuns: 100 }
    );
  });

  /**
   * Feature: doom-scroll-reader, Property 19: Reduced motion behavior
   * Validates: Requirements 8.2
   * 
   * For any user with reduced motion enabled, screen jitter and transition animations 
   * should be disabled or significantly reduced.
   */
  it('should respect reduced motion setting for animations', () => {
    fc.assert(
      fc.property(fc.boolean(), (reduceMotion) => {
        // Mock matchMedia to return false (we're testing the setting, not detection)
        const mockMatchMedia = vi.fn(() => ({
          matches: false,
          media: '',
          onchange: null,
          addListener: vi.fn(),
          removeListener: vi.fn(),
          addEventListener: vi.fn(),
          removeEventListener: vi.fn(),
          dispatchEvent: vi.fn(),
        }));

        Object.defineProperty(window, 'matchMedia', {
          writable: true,
          value: mockMatchMedia,
        });

        localStorage.clear();

        const wrapper = ({ children }: { children: React.ReactNode }) => (
          <AccessibilityProvider initialSettings={{ reduceMotion, disableBlur: false, highContrast: false }}>
            {children}
          </AccessibilityProvider>
        );

        const { result } = renderHook(() => useAccessibility(), { wrapper });

        // The setting should be preserved
        expect(result.current.settings.reduceMotion).toBe(reduceMotion);

        // When we update the setting, it should change
        act(() => {
          result.current.updateSettings({ reduceMotion: !reduceMotion });
        });

        expect(result.current.settings.reduceMotion).toBe(!reduceMotion);
      }),
      { numRuns: 100 }
    );
  });

  /**
   * Feature: doom-scroll-reader, Property 21: Visual effects independence
   * Validates: Requirements 8.5
   * 
   * For any accessibility setting that reduces visual effects, the monochromatic 
   * color scheme should remain unchanged.
   */
  it('should maintain color scheme when visual effects are reduced', () => {
    fc.assert(
      fc.property(
        fc.boolean(), // reduceMotion
        fc.boolean(), // disableBlur
        fc.boolean(), // highContrast
        fc.constantFrom('green' as const, 'amber' as const), // theme
        (reduceMotion, disableBlur, highContrast, theme) => {
          // Mock matchMedia
          const mockMatchMedia = vi.fn(() => ({
            matches: false,
            media: '',
            onchange: null,
            addListener: vi.fn(),
            removeListener: vi.fn(),
            addEventListener: vi.fn(),
            removeEventListener: vi.fn(),
            dispatchEvent: vi.fn(),
          }));

          Object.defineProperty(window, 'matchMedia', {
            writable: true,
            value: mockMatchMedia,
          });

          localStorage.clear();

          // Create a test component that uses both contexts
          const TestComponent = () => {
            const { settings, updateSettings } = useAccessibility();
            const { theme: currentTheme } = useTheme();
            return (
              <div data-testid="test-component">
                <span data-testid="reduce-motion">{String(settings.reduceMotion)}</span>
                <span data-testid="disable-blur">{String(settings.disableBlur)}</span>
                <span data-testid="high-contrast">{String(settings.highContrast)}</span>
                <span data-testid="theme">{currentTheme}</span>
                <button 
                  data-testid="toggle-reduce-motion"
                  onClick={() => updateSettings({ reduceMotion: !settings.reduceMotion })}
                >
                  Toggle Motion
                </button>
                <button 
                  data-testid="toggle-blur"
                  onClick={() => updateSettings({ disableBlur: !settings.disableBlur })}
                >
                  Toggle Blur
                </button>
              </div>
            );
          };

          const { unmount } = render(
            <ThemeProvider initialTheme={theme}>
              <AccessibilityProvider initialSettings={{ reduceMotion, disableBlur, highContrast }}>
                <TestComponent />
              </AccessibilityProvider>
            </ThemeProvider>
          );

          // Verify initial accessibility settings are applied
          expect(screen.getByTestId('reduce-motion').textContent).toBe(String(reduceMotion));
          expect(screen.getByTestId('disable-blur').textContent).toBe(String(disableBlur));
          expect(screen.getByTestId('high-contrast').textContent).toBe(String(highContrast));

          // Verify initial theme is set
          const initialTheme = screen.getByTestId('theme').textContent;
          expect(initialTheme).toBe(theme);

          // Toggle accessibility settings
          act(() => {
            screen.getByTestId('toggle-reduce-motion').click();
            screen.getByTestId('toggle-blur').click();
          });

          // Verify accessibility settings changed
          expect(screen.getByTestId('reduce-motion').textContent).toBe(String(!reduceMotion));
          expect(screen.getByTestId('disable-blur').textContent).toBe(String(!disableBlur));

          // The theme should remain unchanged after toggling accessibility settings
          const finalTheme = screen.getByTestId('theme').textContent;
          expect(finalTheme).toBe(initialTheme);
          expect(finalTheme).toBe(theme);

          // Also verify the document attribute remains unchanged
          expect(document.documentElement.getAttribute('data-theme')).toBe(theme);

          unmount();
        }
      ),
      { numRuns: 100 }
    );
  });
});
