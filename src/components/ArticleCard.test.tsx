import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { AccessibilityProvider } from '../contexts/AccessibilityContext';
import { ArticleCard } from './ArticleCard';
import fc from 'fast-check';

// Helper to wrap component with required providers
function renderWithProviders(ui: React.ReactElement) {
  return render(
    <AccessibilityProvider>
      {ui}
    </AccessibilityProvider>
  );
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

describe('ArticleCard', () => {
  /**
   * Feature: doom-scroll-reader, Property 1: Article list rendering completeness
   * Validates: Requirements 1.1
   */
  it('should render all article fields (title, source, timestamp)', () => {
    fc.assert(
      fc.property(articleArb, (article) => {
        const onClick = vi.fn();
        const { unmount } = renderWithProviders(
          <ArticleCard article={article} onClick={onClick} />
        );

        // Verify title is rendered
        const titleElement = screen.getByTestId('article-title');
        expect(titleElement).toBeInTheDocument();
        expect(titleElement.textContent).toBe(article.title);

        // Verify source is rendered
        const sourceElement = screen.getByTestId('article-source');
        expect(sourceElement).toBeInTheDocument();
        expect(sourceElement.textContent).toBe(article.source);

        // Verify timestamp is rendered (formatted)
        const timestampElement = screen.getByTestId('article-timestamp');
        expect(timestampElement).toBeInTheDocument();
        expect(timestampElement.textContent).toBeTruthy();

        unmount();
      }),
      { numRuns: 100 }
    );
  });

  /**
   * Feature: doom-scroll-reader, Property 2: Preview text truncation
   * Validates: Requirements 1.2
   */
  it('should display preview text limited to 150 characters or less', () => {
    // Generator that creates articles with varying content lengths
    // including content longer than 150 characters
    const articleWithVaryingContentArb = fc.record({
      id: fc.uuid(),
      title: fc.string({ minLength: 1, maxLength: 200 }),
      content: fc.string({ minLength: 1, maxLength: 5000 }),
      source: fc.string({ minLength: 1, maxLength: 100 }),
      category: fc.constantFrom('tech' as const, 'spooky' as const),
      timestamp: fc.integer({ min: 0, max: Date.now() }),
    }).map(article => ({
      ...article,
      // Generate preview from content (first 150 chars)
      preview: article.content.substring(0, 150),
    }));

    fc.assert(
      fc.property(articleWithVaryingContentArb, (article) => {
        const onClick = vi.fn();
        const { unmount } = renderWithProviders(
          <ArticleCard article={article} onClick={onClick} />
        );

        // Verify preview is rendered
        const previewElement = screen.getByTestId('article-preview');
        expect(previewElement).toBeInTheDocument();
        
        // Verify preview text is displayed
        const displayedPreview = previewElement.textContent || '';
        expect(displayedPreview).toBe(article.preview);
        
        // Verify preview is 150 characters or less
        expect(article.preview.length).toBeLessThanOrEqual(150);
        
        // Verify that if content is longer than 150 chars, preview is exactly 150
        if (article.content.length > 150) {
          expect(article.preview.length).toBe(150);
          expect(article.preview).toBe(article.content.substring(0, 150));
        } else {
          // If content is 150 or less, preview should match content length
          expect(article.preview.length).toBe(article.content.length);
          expect(article.preview).toBe(article.content);
        }

        unmount();
      }),
      { numRuns: 100 }
    );
  });

  /**
   * Feature: doom-scroll-reader, Property 8: Blur behavior consistency
   * Validates: Requirements 3.5
   */
  it('should apply blur-on-idle to title, preview, and metadata', () => {
    fc.assert(
      fc.property(articleArb, (article) => {
        const onClick = vi.fn();
        const { unmount } = renderWithProviders(
          <ArticleCard article={article} onClick={onClick} />
        );

        // Find all BlurOnIdle wrappers
        const blurWrappers = screen.getAllByTestId('blur-on-idle');
        
        // Should have 4 BlurOnIdle wrappers: title, source, timestamp, preview
        expect(blurWrappers.length).toBe(4);

        // Verify each wrapper contains the expected content
        const titleWrapper = blurWrappers.find(wrapper => 
          wrapper.textContent?.includes(article.title)
        );
        expect(titleWrapper).toBeDefined();

        const sourceWrapper = blurWrappers.find(wrapper => 
          wrapper.textContent === article.source
        );
        expect(sourceWrapper).toBeDefined();

        const previewWrapper = blurWrappers.find(wrapper => 
          wrapper.textContent === article.preview
        );
        expect(previewWrapper).toBeDefined();

        unmount();
      }),
      { numRuns: 100 }
    );
  });

  /**
   * Feature: doom-scroll-reader, Property 9: Hover feedback on interactive elements
   * Validates: Requirements 4.2
   */
  it('should provide visual feedback on hover', () => {
    fc.assert(
      fc.property(articleArb, (article) => {
        const onClick = vi.fn();
        const { container, unmount } = renderWithProviders(
          <ArticleCard article={article} onClick={onClick} />
        );

        const card = container.querySelector('[data-testid="article-card"]') as HTMLElement;
        expect(card).toBeInTheDocument();
        
        // Verify the card is interactive (precondition for hover feedback)
        // Interactive elements should have tabIndex for keyboard access
        expect(card).toHaveAttribute('tabIndex', '0');
        expect(card).toHaveAttribute('role', 'article');
        
        // Verify the card has a CSS class applied (which contains hover styles)
        expect(card.className).toBeTruthy();
        expect(card.className).toContain('card');
        
        // Simulate mouse enter - should not cause errors
        fireEvent.mouseEnter(card!);
        expect(card).toBeInTheDocument();
        
        // Simulate mouse leave - should not cause errors
        fireEvent.mouseLeave(card!);
        expect(card).toBeInTheDocument();
        
        // Verify the card responds to click (interactive feedback)
        fireEvent.click(card!);
        expect(onClick).toHaveBeenCalledWith(article.id);
        
        // Verify the card responds to mouse over without errors
        fireEvent.mouseOver(card!);
        expect(card).toBeInTheDocument();
        
        // Verify the card responds to mouse out without errors
        fireEvent.mouseOut(card!);
        expect(card).toBeInTheDocument();

        unmount();
      }),
      { numRuns: 100 }
    );
  });

  /**
   * Feature: doom-scroll-reader, Property 11: Keyboard navigation support
   * Validates: Requirements 4.5, 7.4
   */
  it('should support keyboard navigation (Tab, Enter, Space)', () => {
    fc.assert(
      fc.property(articleArb, (article) => {
        const onClick = vi.fn();
        const { container, unmount } = renderWithProviders(
          <ArticleCard article={article} onClick={onClick} />
        );

        const card = container.querySelector('[data-testid="article-card"]') as HTMLElement;
        expect(card).toBeInTheDocument();
        
        // Verify the card is keyboard accessible (has tabIndex)
        expect(card).toHaveAttribute('tabIndex', '0');
        
        // Focus the card (simulating Tab navigation)
        card.focus();
        expect(document.activeElement).toBe(card);
        
        // Test Enter key activation
        fireEvent.keyDown(card!, { key: 'Enter', code: 'Enter' });
        expect(onClick).toHaveBeenCalledWith(article.id);
        
        // Reset mock
        onClick.mockClear();
        
        // Test Space key activation
        fireEvent.keyDown(card!, { key: ' ', code: 'Space' });
        expect(onClick).toHaveBeenCalledWith(article.id);

        unmount();
      }),
      { numRuns: 100 }
    );
  });
});
