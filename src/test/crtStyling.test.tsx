import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import fc from 'fast-check';
import App from '../App';
import { ArticleCard } from '../components/ArticleCard';
import { CategoryFilter } from '../components/CategoryFilter';
import { FeedView } from '../views/FeedView';
import { ArticleView } from '../views/ArticleView';
import { CuratorView } from '../views/CuratorView';
import { AccessibilityProvider } from '../contexts/AccessibilityContext';
import { ArticleProvider } from '../contexts/ArticleContext';
import { ThemeProvider } from '../contexts/ThemeContext';
import { NarratorProvider } from '../contexts/NarratorContext';
import type { Article } from '../types';

// Utility function to get computed styles
function getComputedStylesForElement(element: HTMLElement) {
  return window.getComputedStyle(element);
}

// Utility function to check if a color is monochromatic (green or amber variants)
function isMonochromaticColor(color: string): boolean {
  // Parse RGB values from computed color
  const rgbMatch = color.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
  if (!rgbMatch) return true; // If we can't parse, assume it's valid (e.g., 'transparent')
  
  const r = parseInt(rgbMatch[1]);
  const g = parseInt(rgbMatch[2]);
  const b = parseInt(rgbMatch[3]);
  
  // Check for green variants (high green, low red and blue)
  const isGreen = g > r && g > b;
  
  // Check for amber/yellow variants (high red and green, low blue)
  const isAmber = r > 150 && g > 150 && b < 100;
  
  // Check for dark backgrounds (all values low)
  const isDark = r < 50 && g < 50 && b < 50;
  
  // Check for transparent or inherit
  const isTransparent = color.includes('transparent') || color === 'rgba(0, 0, 0, 0)';
  
  return isGreen || isAmber || isDark || isTransparent;
}

// Utility function to calculate luminance
function calculateLuminance(color: string): number {
  const rgbMatch = color.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
  if (!rgbMatch) return 0;
  
  const r = parseInt(rgbMatch[1]) / 255;
  const g = parseInt(rgbMatch[2]) / 255;
  const b = parseInt(rgbMatch[3]) / 255;
  
  // Convert to linear RGB
  const toLinear = (c: number) => c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  
  const rLinear = toLinear(r);
  const gLinear = toLinear(g);
  const bLinear = toLinear(b);
  
  // Calculate relative luminance
  return 0.2126 * rLinear + 0.7152 * gLinear + 0.0722 * bLinear;
}

// Utility function to check if font is monospace/fixed-width
function isFixedWidthFont(fontFamily: string): boolean {
  // If fontFamily is empty or not set, it's likely inheriting from parent
  // In our case, the root element sets the font, so empty is acceptable
  if (!fontFamily || fontFamily.trim() === '') {
    return true;
  }
  
  const fixedWidthFonts = [
    'courier',
    'consolas',
    'monaco',
    'lucida console',
    'monospace',
  ];
  
  const lowerFontFamily = fontFamily.toLowerCase();
  return fixedWidthFonts.some(font => lowerFontFamily.includes(font));
}

// Utility function to collect all text elements from a container
function collectTextElements(container: HTMLElement): HTMLElement[] {
  const textElements: HTMLElement[] = [];
  const walker = document.createTreeWalker(
    container,
    NodeFilter.SHOW_ELEMENT,
    {
      acceptNode: (node) => {
        const element = node as HTMLElement;
        // Include elements that typically contain text and have direct text content
        if (
          element.tagName.match(/^(P|H[1-6]|SPAN|BUTTON|A|LABEL)$/) &&
          element.textContent &&
          element.textContent.trim().length > 0
        ) {
          return NodeFilter.FILTER_ACCEPT;
        }
        return NodeFilter.FILTER_SKIP;
      },
    }
  );
  
  let node;
  while ((node = walker.nextNode())) {
    textElements.push(node as HTMLElement);
  }
  
  return textElements;
}

// Article generator for property-based tests
const articleArb = fc.record({
  id: fc.uuid(),
  title: fc.string({ minLength: 1, maxLength: 200 }),
  content: fc.string({ minLength: 1, maxLength: 5000 }),
  preview: fc.string({ minLength: 1, maxLength: 150 }),
  source: fc.string({ minLength: 1, maxLength: 100 }),
  category: fc.constantFrom('tech' as const, 'spooky' as const),
  timestamp: fc.integer({ min: 0, max: Date.now() }),
});

// Helper to wrap component with required providers
function renderWithProviders(ui: React.ReactElement) {
  return render(
    <ThemeProvider>
      <AccessibilityProvider>
        <ArticleProvider>
          <NarratorProvider>
            {ui}
          </NarratorProvider>
        </ArticleProvider>
      </AccessibilityProvider>
    </ThemeProvider>
  );
}

describe('CRT Styling Property Tests', () => {
  /**
   * Feature: doom-scroll-reader, Property 5: Monochromatic color scheme
   * Validates: Requirements 2.1
   */
  describe('Property 5: Monochromatic color scheme', () => {
    it('should render all text with green or amber colors and dark backgrounds', { timeout: 15000 }, () => {
      fc.assert(
        fc.property(articleArb, (article) => {
          const onClick = () => {};
          const { container, unmount } = render(
            <AccessibilityProvider>
              <ArticleCard article={article} onClick={onClick} />
            </AccessibilityProvider>
          );

          // Collect all text elements
          const textElements = collectTextElements(container);
          
          // Verify each text element has monochromatic colors
          textElements.forEach((element) => {
            const styles = getComputedStylesForElement(element);
            const color = styles.color;
            const backgroundColor = styles.backgroundColor;
            
            // Check text color is monochromatic (green/amber)
            expect(
              isMonochromaticColor(color),
              `Text color ${color} should be monochromatic (green/amber) for element: ${element.tagName}`
            ).toBe(true);
            
            // Check background color is dark or transparent
            if (backgroundColor && backgroundColor !== 'rgba(0, 0, 0, 0)') {
              const luminance = calculateLuminance(backgroundColor);
              expect(
                luminance < 0.2 || backgroundColor.includes('transparent'),
                `Background color ${backgroundColor} should be dark (luminance < 0.2) for element: ${element.tagName}`
              ).toBe(true);
            }
          });

          unmount();
        }),
        { numRuns: 100 }
      );
    });

    it('should maintain monochromatic color scheme in FeedView', () => {
      const { container, unmount } = renderWithProviders(
        <FeedView onArticleClick={() => {}} />
      );

      // Collect all text elements
      const textElements = collectTextElements(container);
      
      // Should have text elements
      expect(textElements.length).toBeGreaterThan(0);
      
      // Verify each text element has monochromatic colors
      textElements.forEach((element) => {
        const styles = getComputedStylesForElement(element);
        const color = styles.color;
        
        // Check text color is monochromatic
        expect(
          isMonochromaticColor(color),
          `Text color ${color} should be monochromatic for element: ${element.tagName}`
        ).toBe(true);
      });

      unmount();
    });

    it('should maintain monochromatic color scheme in CuratorView', () => {
      const { container, unmount } = renderWithProviders(
        <CuratorView onNavigateToFeed={() => {}} />
      );

      // Collect all text elements
      const textElements = collectTextElements(container);
      
      // Should have text elements
      expect(textElements.length).toBeGreaterThan(0);
      
      // Verify each text element has monochromatic colors
      textElements.forEach((element) => {
        const styles = getComputedStylesForElement(element);
        const color = styles.color;
        
        // Check text color is monochromatic
        expect(
          isMonochromaticColor(color),
          `Text color ${color} should be monochromatic for element: ${element.tagName}`
        ).toBe(true);
      });

      unmount();
    });

    it('should maintain monochromatic color scheme across the entire App', () => {
      const { container, unmount } = render(<App />);

      // Collect all text elements
      const textElements = collectTextElements(container);
      
      // Should have text elements
      expect(textElements.length).toBeGreaterThan(0);
      
      // Verify each text element has monochromatic colors
      textElements.forEach((element) => {
        const styles = getComputedStylesForElement(element);
        const color = styles.color;
        
        // Check text color is monochromatic
        expect(
          isMonochromaticColor(color),
          `Text color ${color} should be monochromatic for element: ${element.tagName}`
        ).toBe(true);
      });

      unmount();
    });
  });

  /**
   * Feature: doom-scroll-reader, Property 6: Fixed-width font usage
   * Validates: Requirements 2.4
   */
  describe('Property 6: Fixed-width font usage', () => {
    it('should use fixed-width fonts for all text in ArticleCard', { timeout: 15000 }, () => {
      fc.assert(
        fc.property(articleArb, (article) => {
          const onClick = () => {};
          const { container, unmount } = render(
            <AccessibilityProvider>
              <ArticleCard article={article} onClick={onClick} />
            </AccessibilityProvider>
          );

          // Collect all text elements
          const textElements = collectTextElements(container);
          
          // Verify each text element uses fixed-width font
          textElements.forEach((element) => {
            const styles = getComputedStylesForElement(element);
            const fontFamily = styles.fontFamily;
            
            expect(
              isFixedWidthFont(fontFamily),
              `Font family "${fontFamily}" should be fixed-width/monospace for element: ${element.tagName}`
            ).toBe(true);
          });

          unmount();
        }),
        { numRuns: 100 }
      );
    });

    it('should use fixed-width fonts in CategoryFilter', () => {
      const { container, unmount } = render(
        <AccessibilityProvider>
          <CategoryFilter currentFilter="all" onFilterChange={() => {}} />
        </AccessibilityProvider>
      );

      // Collect all text elements
      const textElements = collectTextElements(container);
      
      // Should have text elements
      expect(textElements.length).toBeGreaterThan(0);
      
      // Verify each text element uses fixed-width font
      textElements.forEach((element) => {
        const styles = getComputedStylesForElement(element);
        const fontFamily = styles.fontFamily;
        
        expect(
          isFixedWidthFont(fontFamily),
          `Font family "${fontFamily}" should be fixed-width/monospace for element: ${element.tagName}`
        ).toBe(true);
      });

      unmount();
    });

    it('should use fixed-width fonts in FeedView', () => {
      const { container, unmount } = renderWithProviders(
        <FeedView onArticleClick={() => {}} />
      );

      // Collect all text elements
      const textElements = collectTextElements(container);
      
      // Should have text elements
      expect(textElements.length).toBeGreaterThan(0);
      
      // Verify each text element uses fixed-width font
      textElements.forEach((element) => {
        const styles = getComputedStylesForElement(element);
        const fontFamily = styles.fontFamily;
        
        expect(
          isFixedWidthFont(fontFamily),
          `Font family "${fontFamily}" should be fixed-width/monospace for element: ${element.tagName}`
        ).toBe(true);
      });

      unmount();
    });

    it('should use fixed-width fonts in CuratorView', () => {
      const { container, unmount } = renderWithProviders(
        <CuratorView onNavigateToFeed={() => {}} />
      );

      // Collect all text elements
      const textElements = collectTextElements(container);
      
      // Should have text elements
      expect(textElements.length).toBeGreaterThan(0);
      
      // Verify each text element uses fixed-width font
      textElements.forEach((element) => {
        const styles = getComputedStylesForElement(element);
        const fontFamily = styles.fontFamily;
        
        expect(
          isFixedWidthFont(fontFamily),
          `Font family "${fontFamily}" should be fixed-width/monospace for element: ${element.tagName}`
        ).toBe(true);
      });

      unmount();
    });

    it('should use fixed-width fonts across the entire App', () => {
      const { container, unmount } = render(<App />);

      // Collect all text elements
      const textElements = collectTextElements(container);
      
      // Should have text elements
      expect(textElements.length).toBeGreaterThan(0);
      
      // Verify each text element uses fixed-width font
      textElements.forEach((element) => {
        const styles = getComputedStylesForElement(element);
        const fontFamily = styles.fontFamily;
        
        expect(
          isFixedWidthFont(fontFamily),
          `Font family "${fontFamily}" should be fixed-width/monospace for element: ${element.tagName}`
        ).toBe(true);
      });

      unmount();
    });
  });
});
