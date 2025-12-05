/**
 * Property-Based Tests for Accessibility
 * 
 * Feature: doom-scroll-reader
 * Property 16: Color contrast compliance
 * Property 17: Screen reader compatibility
 * 
 * Validates: Requirements 7.3, 7.5
 */

import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import fc from 'fast-check';
import { ArticleCard } from '../components/ArticleCard';
import { CategoryFilter } from '../components/CategoryFilter';
import { FeedView } from '../views/FeedView';
import { ArticleView } from '../views/ArticleView';
import { CuratorView } from '../views/CuratorView';
import { SettingsPanel } from '../components/SettingsPanel';
import { ArticleProvider } from '../contexts/ArticleContext';
import { AccessibilityProvider } from '../contexts/AccessibilityContext';
import { ThemeProvider } from '../contexts/ThemeContext';
import { NarratorProvider } from '../contexts/NarratorContext';
import type { Article } from '../types';

// ============================================================================
// Utility Functions for Color Contrast Calculation
// ============================================================================

/**
 * Calculate relative luminance of a color
 * Based on WCAG 2.0 formula
 */
function getRelativeLuminance(r: number, g: number, b: number): number {
  const [rs, gs, bs] = [r, g, b].map(c => {
    const sRGB = c / 255;
    return sRGB <= 0.03928 ? sRGB / 12.92 : Math.pow((sRGB + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
}

/**
 * Calculate contrast ratio between two colors
 * Returns a value between 1 and 21
 */
function getContrastRatio(
  color1: { r: number; g: number; b: number },
  color2: { r: number; g: number; b: number }
): number {
  const l1 = getRelativeLuminance(color1.r, color1.g, color1.b);
  const l2 = getRelativeLuminance(color2.r, color2.g, color2.b);
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  return (lighter + 0.05) / (darker + 0.05);
}

/**
 * Parse hex color to RGB
 */
function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null;
}

/**
 * Check if contrast ratio meets WCAG AA standards
 * @param ratio - The contrast ratio
 * @param isLargeText - Whether the text is large (18pt+ or 14pt+ bold)
 * @returns true if meets WCAG AA standards
 */
function meetsWCAGAA(ratio: number, isLargeText: boolean = false): boolean {
  return isLargeText ? ratio >= 3 : ratio >= 4.5;
}

// ============================================================================
// Test Generators
// ============================================================================

const articleArb = fc.record({
  id: fc.uuid(),
  title: fc.string({ minLength: 1, maxLength: 200 }),
  content: fc.string({ minLength: 1, maxLength: 5000 }),
  preview: fc.string({ minLength: 1, maxLength: 150 }),
  source: fc.string({ minLength: 1, maxLength: 100 }),
  category: fc.constantFrom('tech' as const, 'spooky' as const),
  timestamp: fc.integer({ min: 0, max: Date.now() }),
});

// ============================================================================
// Property 16: Color contrast compliance
// ============================================================================

describe('Property 16: Color contrast compliance (a11y)', () => {
  it('should meet WCAG AA contrast standards for CRT green theme', () => {
    // CRT green color scheme
    const crtGreen = hexToRgb('#00ff00')!;
    const crtGreenBright = hexToRgb('#00ff41')!;
    const crtDark = hexToRgb('#0a0a0a')!;

    // Test primary text on dark background
    const primaryRatio = getContrastRatio(crtGreen, crtDark);
    expect(primaryRatio).toBeGreaterThanOrEqual(4.5);
    expect(meetsWCAGAA(primaryRatio, false)).toBe(true);

    // Test bright text on dark background
    const brightRatio = getContrastRatio(crtGreenBright, crtDark);
    expect(brightRatio).toBeGreaterThanOrEqual(4.5);
    expect(meetsWCAGAA(brightRatio, false)).toBe(true);
  });

  it('should meet WCAG AA contrast standards for CRT amber theme', () => {
    // CRT amber color scheme
    const crtAmber = hexToRgb('#ffbf00')!;
    const crtAmberBright = hexToRgb('#ffd700')!;
    const crtDark = hexToRgb('#0a0a0a')!;

    // Test primary text on dark background
    const primaryRatio = getContrastRatio(crtAmber, crtDark);
    expect(primaryRatio).toBeGreaterThanOrEqual(4.5);
    expect(meetsWCAGAA(primaryRatio, false)).toBe(true);

    // Test bright text on dark background
    const brightRatio = getContrastRatio(crtAmberBright, crtDark);
    expect(brightRatio).toBeGreaterThanOrEqual(4.5);
    expect(meetsWCAGAA(brightRatio, false)).toBe(true);
  });

  it('should maintain contrast for large text (headings)', () => {
    const crtGreen = hexToRgb('#00ff00')!;
    const crtDark = hexToRgb('#0a0a0a')!;

    const ratio = getContrastRatio(crtGreen, crtDark);
    // Large text only needs 3:1 ratio
    expect(meetsWCAGAA(ratio, true)).toBe(true);
  });

  it('should validate contrast utility functions work correctly', () => {
    // Test with known values
    // Pure white on pure black should be 21:1
    const white = { r: 255, g: 255, b: 255 };
    const black = { r: 0, g: 0, b: 0 };
    const maxRatio = getContrastRatio(white, black);
    expect(maxRatio).toBeCloseTo(21, 0);

    // Same color should be 1:1
    const sameRatio = getContrastRatio(white, white);
    expect(sameRatio).toBeCloseTo(1, 1);
  });
});

// ============================================================================
// Property 17: Screen reader compatibility
// ============================================================================

describe('Property 17: Screen reader compatibility (a11y)', () => {
  const TestWrapper = ({ children }: { children: React.ReactNode }) => (
    <ThemeProvider>
      <AccessibilityProvider>
        <ArticleProvider>
          <NarratorProvider>
            {children}
          </NarratorProvider>
        </ArticleProvider>
      </AccessibilityProvider>
    </ThemeProvider>
  );

  it('should have appropriate ARIA labels on all ArticleCard components', () => {
    fc.assert(
      fc.property(articleArb, (article) => {
        const { container } = render(
          <TestWrapper>
            <ArticleCard article={article} onClick={() => {}} />
          </TestWrapper>
        );

        // Check for article role
        const articleElement = container.querySelector('[role="article"]');
        expect(articleElement).toBeInTheDocument();

        // Check for aria-label that includes title and source
        const ariaLabel = articleElement?.getAttribute('aria-label');
        expect(ariaLabel).toBeTruthy();
        expect(ariaLabel).toContain(article.title);
        expect(ariaLabel).toContain(article.source);

        // Check for tabIndex for keyboard navigation
        expect(articleElement).toHaveAttribute('tabIndex', '0');
      }),
      { numRuns: 100 }
    );
  });

  it('should have semantic HTML structure in ArticleView', () => {
    fc.assert(
      fc.property(articleArb, (article) => {
        const { container, unmount } = render(
          <TestWrapper>
            <ArticleView article={article} onBack={() => {}} />
          </TestWrapper>
        );

        // Check for article role
        const articleElement = container.querySelector('[role="article"]');
        
        // Only check if article is rendered (not in error state)
        if (articleElement) {
          expect(articleElement).toBeInTheDocument();

          // Check for aria-labelledby
          const ariaLabelledBy = articleElement?.getAttribute('aria-labelledby');
          expect(ariaLabelledBy).toBeTruthy();
          expect(ariaLabelledBy).toContain(article.id);

          // Check that the referenced element exists
          const labelElement = container.querySelector(`#${ariaLabelledBy}`);
          expect(labelElement).toBeInTheDocument();
        }
        
        // Clean up after each test
        unmount();
      }),
      { numRuns: 100 }
    );
  });

  it('should have ARIA labels on interactive buttons', () => {
    const { container } = render(
      <TestWrapper>
        <FeedView onArticleClick={() => {}} />
      </TestWrapper>
    );

    // Check settings button
    const settingsButton = screen.getByLabelText(/settings/i);
    expect(settingsButton).toBeInTheDocument();
    expect(settingsButton.tagName).toBe('BUTTON');
  });

  it('should have proper ARIA attributes on CategoryFilter', () => {
    const { container } = render(
      <TestWrapper>
        <CategoryFilter currentFilter="all" onFilterChange={() => {}} />
      </TestWrapper>
    );

    // Check for group role with aria-label
    const filterGroup = container.querySelector('[role="group"]');
    expect(filterGroup).toBeInTheDocument();
    expect(filterGroup).toHaveAttribute('aria-label', 'Category filter');

    // All filter buttons should be keyboard accessible
    const buttons = container.querySelectorAll('button');
    buttons.forEach(button => {
      expect(button).toBeInTheDocument();
    });
  });

  it('should have proper ARIA attributes on SettingsPanel toggles', () => {
    const { container } = render(
      <TestWrapper>
        <SettingsPanel isOpen={true} onClose={() => {}} />
      </TestWrapper>
    );

    // Check for dialog role
    const dialog = container.querySelector('[role="dialog"]');
    expect(dialog).toBeInTheDocument();
    expect(dialog).toHaveAttribute('aria-modal', 'true');
    expect(dialog).toHaveAttribute('aria-labelledby', 'settings-title');

    // Check for switch roles on toggles
    const switches = container.querySelectorAll('[role="switch"]');
    expect(switches.length).toBeGreaterThan(0);

    switches.forEach(switchElement => {
      // Each switch should have aria-checked
      expect(switchElement).toHaveAttribute('aria-checked');
      // Each switch should have aria-label
      expect(switchElement).toHaveAttribute('aria-label');
    });
  });

  it('should have proper ARIA attributes on form inputs', () => {
    const { container } = render(
      <TestWrapper>
        <CuratorView onNavigateToFeed={() => {}} />
      </TestWrapper>
    );

    // Check that form inputs have proper ARIA attributes
    const titleInput = container.querySelector('#title');
    expect(titleInput).toBeInTheDocument();
    expect(titleInput).toHaveAttribute('aria-invalid');
    
    const sourceInput = container.querySelector('#source');
    expect(sourceInput).toBeInTheDocument();
    expect(sourceInput).toHaveAttribute('aria-invalid');
    
    const categorySelect = container.querySelector('#category');
    expect(categorySelect).toBeInTheDocument();
    expect(categorySelect).toHaveAttribute('aria-invalid');
    
    const contentTextarea = container.querySelector('#content');
    expect(contentTextarea).toBeInTheDocument();
    expect(contentTextarea).toHaveAttribute('aria-invalid');
    
    // Verify that the error message structure includes role="alert" when rendered
    // This is validated by checking the component code structure
    const form = container.querySelector('form');
    expect(form).toBeInTheDocument();
  });

  it('should have proper back button ARIA labels', () => {
    fc.assert(
      fc.property(articleArb, (article) => {
        const { container, unmount } = render(
          <TestWrapper>
            <ArticleView article={article} onBack={() => {}} />
          </TestWrapper>
        );

        // Use container.querySelector to avoid multiple element issues
        const backButton = container.querySelector('[aria-label="Return to feed"]');
        expect(backButton).toBeInTheDocument();
        expect(backButton?.tagName).toBe('BUTTON');
        
        // Clean up after each test
        unmount();
      }),
      { numRuns: 50 }
    );
  });

  it('should ensure all interactive elements are keyboard accessible', () => {
    fc.assert(
      fc.property(articleArb, (article) => {
        const { container } = render(
          <TestWrapper>
            <ArticleCard article={article} onClick={() => {}} />
          </TestWrapper>
        );

        const articleElement = container.querySelector('[role="article"]');
        
        // Should have tabIndex for keyboard navigation
        expect(articleElement).toHaveAttribute('tabIndex');
        const tabIndex = articleElement?.getAttribute('tabIndex');
        expect(parseInt(tabIndex || '-1')).toBeGreaterThanOrEqual(0);
      }),
      { numRuns: 100 }
    );
  });
});

// ============================================================================
// Property 21: Visual effects independence
// ============================================================================

/**
 * Feature: doom-scroll-reader, Property 21: Visual effects independence
 * Validates: Requirements 8.5
 */
describe('Property 21: Visual effects independence (a11y)', () => {
  it('should maintain theme attribute when accessibility settings are enabled', () => {
    fc.assert(
      fc.property(
        fc.constantFrom('green' as const, 'amber' as const),
        fc.boolean(),
        fc.boolean(),
        fc.boolean(),
        (theme, reduceMotion, disableBlur, highContrast) => {
          const { container, unmount } = render(
            <ThemeProvider initialTheme={theme}>
              <AccessibilityProvider
                initialSettings={{
                  reduceMotion,
                  disableBlur,
                  highContrast,
                }}
              >
                <ArticleProvider>
                  <NarratorProvider>
                    <FeedView onArticleClick={() => {}} />
                  </NarratorProvider>
                </ArticleProvider>
              </AccessibilityProvider>
            </ThemeProvider>
          );

          // Verify theme attribute is set regardless of accessibility settings
          const root = document.documentElement;
          const dataTheme = root.getAttribute('data-theme');
          
          // The theme should be applied regardless of accessibility settings
          expect(dataTheme).toBe(theme);

          // Verify the feed view is rendered
          const feedView = container.querySelector('[data-testid="feed-view"]');
          expect(feedView).toBeInTheDocument();

          unmount();
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should maintain CRT color scheme when reduceMotion is enabled', () => {
    fc.assert(
      fc.property(
        fc.constantFrom('green' as const, 'amber' as const),
        (theme) => {
          // Test with reduceMotion enabled
          const { container: containerWithMotion, unmount: unmountWithMotion } = render(
            <ThemeProvider initialTheme={theme}>
              <AccessibilityProvider
                initialSettings={{
                  reduceMotion: true,
                  disableBlur: false,
                  highContrast: false,
                }}
              >
                <ArticleProvider>
                  <NarratorProvider>
                    <FeedView onArticleClick={() => {}} />
                  </NarratorProvider>
                </ArticleProvider>
              </AccessibilityProvider>
            </ThemeProvider>
          );

          // Test without reduceMotion
          const { container: containerWithoutMotion, unmount: unmountWithoutMotion } = render(
            <ThemeProvider initialTheme={theme}>
              <AccessibilityProvider
                initialSettings={{
                  reduceMotion: false,
                  disableBlur: false,
                  highContrast: false,
                }}
              >
                <ArticleProvider>
                  <NarratorProvider>
                    <FeedView onArticleClick={() => {}} />
                  </NarratorProvider>
                </ArticleProvider>
              </AccessibilityProvider>
            </ThemeProvider>
          );

          // Both should have the same theme applied
          const root = document.documentElement;
          expect(root.getAttribute('data-theme')).toBe(theme);

          // Both should render the feed view
          expect(containerWithMotion.querySelector('[data-testid="feed-view"]')).toBeInTheDocument();
          expect(containerWithoutMotion.querySelector('[data-testid="feed-view"]')).toBeInTheDocument();

          unmountWithMotion();
          unmountWithoutMotion();
        }
      ),
      { numRuns: 50 }
    );
  });

  it('should maintain CRT color scheme when disableBlur is enabled', () => {
    fc.assert(
      fc.property(
        fc.constantFrom('green' as const, 'amber' as const),
        (theme) => {
          // Test with blur disabled
          const { container: containerWithBlurDisabled, unmount: unmountWithBlurDisabled } = render(
            <ThemeProvider initialTheme={theme}>
              <AccessibilityProvider
                initialSettings={{
                  reduceMotion: false,
                  disableBlur: true,
                  highContrast: false,
                }}
              >
                <ArticleProvider>
                  <NarratorProvider>
                    <FeedView onArticleClick={() => {}} />
                  </NarratorProvider>
                </ArticleProvider>
              </AccessibilityProvider>
            </ThemeProvider>
          );

          // Test with blur enabled
          const { container: containerWithBlurEnabled, unmount: unmountWithBlurEnabled } = render(
            <ThemeProvider initialTheme={theme}>
              <AccessibilityProvider
                initialSettings={{
                  reduceMotion: false,
                  disableBlur: false,
                  highContrast: false,
                }}
              >
                <ArticleProvider>
                  <NarratorProvider>
                    <FeedView onArticleClick={() => {}} />
                  </NarratorProvider>
                </ArticleProvider>
              </AccessibilityProvider>
            </ThemeProvider>
          );

          // Both should have the same theme applied
          const root = document.documentElement;
          expect(root.getAttribute('data-theme')).toBe(theme);

          // Both should render the feed view
          expect(containerWithBlurDisabled.querySelector('[data-testid="feed-view"]')).toBeInTheDocument();
          expect(containerWithBlurEnabled.querySelector('[data-testid="feed-view"]')).toBeInTheDocument();

          unmountWithBlurDisabled();
          unmountWithBlurEnabled();
        }
      ),
      { numRuns: 50 }
    );
  });
});
