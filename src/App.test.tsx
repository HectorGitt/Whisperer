import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import fc from 'fast-check';
import App from './App';
import { ArticleRepository } from './utils/ArticleRepository';

describe('App Integration', () => {
  let originalHash: string;

  beforeEach(() => {
    originalHash = window.location.hash;
    window.location.hash = '';
    localStorage.clear();
  });

  afterEach(() => {
    window.location.hash = originalHash;
    localStorage.clear();
  });

  it('should render feed view by default', async () => {
    render(<App />);
    
    await waitFor(() => {
      expect(screen.getByTestId('feed-view')).toBeInTheDocument();
    });
  });

  it('should render article view when hash is set to article', async () => {
    // First render the app
    render(<App />);
    
    // Wait for feed to load
    await waitFor(() => {
      expect(screen.getByTestId('feed-view')).toBeInTheDocument();
    });

    // Change hash to article view (using a non-existent ID to test routing)
    window.location.hash = 'article/test-id';
    
    // Trigger hashchange event
    window.dispatchEvent(new HashChangeEvent('hashchange'));

    await waitFor(() => {
      expect(screen.getByTestId('article-view')).toBeInTheDocument();
    });
  });

  it('should wrap app with CRT visual effects', async () => {
    render(<App />);
    
    await waitFor(() => {
      expect(screen.getByTestId('scanlines')).toBeInTheDocument();
      expect(screen.getByTestId('screen-jitter')).toBeInTheDocument();
    });
  });

  it('should navigate back to feed from article view', async () => {
    render(<App />);
    
    // Start with article view
    window.location.hash = 'article/test-id';
    window.dispatchEvent(new HashChangeEvent('hashchange'));

    await waitFor(() => {
      expect(screen.getByTestId('article-view')).toBeInTheDocument();
    });

    // Navigate back
    window.location.hash = 'feed';
    window.dispatchEvent(new HashChangeEvent('hashchange'));

    await waitFor(() => {
      expect(screen.getByTestId('feed-view')).toBeInTheDocument();
    });
  });

  /**
   * Feature: doom-scroll-reader, Property 25: Initial load performance
   * Validates: Requirements 10.1
   * 
   * For any feed with up to 100 articles, the initial render should complete within 2 seconds.
   */
  describe('17.1 Initial load performance', () => {
    it('should render initial feed within 2 seconds for up to 100 articles', { timeout: 60000 }, () => {
      // Custom arbitrary for non-empty strings
      const nonEmptyString = (maxLength: number) =>
        fc.string({ minLength: 1, maxLength }).map(s => {
          const trimmed = s.trim();
          return trimmed.length > 0 ? s : 'a' + s;
        });

      // Generator for valid articles
      const validArticleArb = fc.record({
        title: nonEmptyString(200),
        content: nonEmptyString(5000),
        source: nonEmptyString(100),
        category: fc.constantFrom('tech' as const, 'spooky' as const),
        author: fc.option(nonEmptyString(100), { nil: undefined }),
      });

      fc.assert(
        fc.property(
          fc.array(validArticleArb, { minLength: 1, maxLength: 100 }),
          (articleData) => {
            // Clear localStorage before each test run
            localStorage.clear();
            
            // Create repository and add articles
            const repo = new ArticleRepository();
            articleData.forEach((data) => {
              repo.add({
                ...data,
                preview: data.content.substring(0, 150),
              });
            });

            // Measure render time
            const startTime = performance.now();
            
            // Render the app
            const { unmount } = render(<App />);
            
            // Wait for feed view to be present in the DOM
            const feedView = screen.getByTestId('feed-view');
            expect(feedView).toBeInTheDocument();
            
            const endTime = performance.now();
            const renderTime = endTime - startTime;

            // Clean up
            unmount();

            // Verify render completed within 2 seconds (2000ms)
            expect(renderTime).toBeLessThan(2000);
          }
        ),
        { numRuns: 100 }
      );
    });
  });
});
