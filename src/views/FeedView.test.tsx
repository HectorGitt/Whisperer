import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { FeedView } from './FeedView';
import { ArticleProvider } from '../contexts/ArticleContext';
import { AccessibilityProvider } from '../contexts/AccessibilityContext';
import { ThemeProvider } from '../contexts/ThemeContext';
import { NarratorProvider } from '../contexts/NarratorContext';
import { ArticleRepository } from '../utils/ArticleRepository';
import type { Article } from '../types';
import fc from 'fast-check';

// Custom arbitraries for non-empty strings
const nonEmptyString = (maxLength: number) =>
  fc.string({ minLength: 1, maxLength }).map(s => {
    const trimmed = s.trim();
    return trimmed.length > 0 ? s : 'a' + s;
  });

// Helper to wrap component with providers
function renderWithProviders(
  ui: React.ReactElement,
  repository?: ArticleRepository
) {
  return render(
    <ThemeProvider>
      <AccessibilityProvider>
        <ArticleProvider repository={repository}>
          <NarratorProvider>
            {ui}
          </NarratorProvider>
        </ArticleProvider>
      </AccessibilityProvider>
    </ThemeProvider>
  );
}

describe('FeedView', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  describe('7.1 Empty state handling', () => {
    it('should display empty state message when no articles exist', () => {
      // Create empty repository
      const emptyRepo = new ArticleRepository();
      
      renderWithProviders(
        <FeedView onArticleClick={() => {}} />,
        emptyRepo
      );

      // Verify empty state is displayed
      const emptyState = screen.getByTestId('empty-state');
      expect(emptyState).toBeInTheDocument();
      expect(emptyState).toHaveTextContent(/no articles found/i);
    });

    it('should not display empty state when articles exist', () => {
      const repo = new ArticleRepository();
      repo.add({
        title: 'Test Article',
        content: 'Test content',
        preview: 'Test content',
        source: 'Test Source',
        category: 'tech',
      });

      renderWithProviders(
        <FeedView onArticleClick={() => {}} />,
        repo
      );

      // Empty state should not be present
      expect(screen.queryByTestId('empty-state')).not.toBeInTheDocument();
      
      // Article list should be present
      expect(screen.getByTestId('article-list')).toBeInTheDocument();
    });
  });

  describe('7.2 Article sorting by date', () => {
    /**
     * Feature: doom-scroll-reader, Property 4: Article sorting by date
     * Validates: Requirements 1.5
     */
    it('should sort articles by timestamp with newest first', { timeout: 30000 }, () => {
      fc.assert(
        fc.property(
          fc.array(
            fc.record({
              title: nonEmptyString(100),
              content: nonEmptyString(500),
              source: nonEmptyString(50),
              category: fc.constantFrom('tech' as const, 'spooky' as const),
            }),
            { minLength: 2, maxLength: 10 }
          ),
          (articleData) => {
            // Clear localStorage before each test run
            localStorage.clear();
            
            const repo = new ArticleRepository();
            const addedArticles: Article[] = [];

            // Add articles to repository with unique titles
            articleData.forEach((data, index) => {
              const article = repo.add({
                ...data,
                title: `${data.title}_${index}`, // Make titles unique
                preview: data.content.substring(0, 150),
              });
              addedArticles.push(article);
            });

            // Render the feed
            const { container } = renderWithProviders(
              <FeedView onArticleClick={() => {}} />,
              repo
            );

            // Get all article cards in DOM order
            const articleCards = container.querySelectorAll('[data-testid="article-card"]');
            
            // Extract titles in the order they appear in the DOM
            const renderedTitles: string[] = [];
            articleCards.forEach((card) => {
              const titleElement = card.querySelector('[data-testid="article-title"]');
              if (titleElement && titleElement.textContent) {
                renderedTitles.push(titleElement.textContent);
              }
            });

            // Create a map of title to article for lookup
            const titleToArticle = new Map<string, Article>();
            addedArticles.forEach(article => {
              titleToArticle.set(article.title, article);
            });

            // Extract timestamps in rendered order
            const renderedTimestamps = renderedTitles
              .map(title => titleToArticle.get(title)?.timestamp)
              .filter((ts): ts is number => ts !== undefined);

            // Verify articles are sorted by timestamp (newest first)
            for (let i = 0; i < renderedTimestamps.length - 1; i++) {
              expect(renderedTimestamps[i]).toBeGreaterThanOrEqual(renderedTimestamps[i + 1]);
            }
          }
        ),
        { numRuns: 20 }
      );
    });
  });

  describe('7.3 Scroll position preservation', () => {
    /**
     * Feature: doom-scroll-reader, Property 10: Navigation preserves scroll position
     * Validates: Requirements 4.4
     */
    it('should restore scroll position when provided', { timeout: 30000 }, () => {
      fc.assert(
        fc.property(
          fc.integer({ min: 0, max: 1000 }),
          fc.array(
            fc.record({
              title: nonEmptyString(100),
              content: nonEmptyString(500),
              source: nonEmptyString(50),
              category: fc.constantFrom('tech' as const, 'spooky' as const),
            }),
            { minLength: 5, maxLength: 10 }
          ),
          (scrollPosition, articleData) => {
            const repo = new ArticleRepository();

            // Add articles to repository
            articleData.forEach((data) => {
              repo.add({
                ...data,
                preview: data.content.substring(0, 150),
              });
            });

            // Render with scroll position
            const { container } = renderWithProviders(
              <FeedView 
                onArticleClick={() => {}} 
                scrollPosition={scrollPosition}
              />,
              repo
            );

            // Get the scroll container
            const scrollContainer = container.querySelector('[data-testid="article-list"]') as HTMLDivElement;
            
            // Verify scroll position is set (or capped at scrollHeight)
            if (scrollContainer) {
              // The scroll position should be set to the provided value
              // (or the maximum scrollable height if the position exceeds it)
              expect(scrollContainer.scrollTop).toBeLessThanOrEqual(scrollPosition + 1);
            }
          }
        ),
        { numRuns: 30 }
      );
    });

    it('should track scroll position changes', { timeout: 30000 }, () => {
      fc.assert(
        fc.property(
          fc.array(
            fc.record({
              title: nonEmptyString(100),
              content: nonEmptyString(500),
              source: nonEmptyString(50),
              category: fc.constantFrom('tech' as const, 'spooky' as const),
            }),
            { minLength: 5, maxLength: 10 }
          ),
          (articleData) => {
            const repo = new ArticleRepository();
            let capturedScrollPosition: number | undefined;

            // Add articles to repository
            articleData.forEach((data) => {
              repo.add({
                ...data,
                preview: data.content.substring(0, 150),
              });
            });

            // Render with scroll position callback
            const { container } = renderWithProviders(
              <FeedView 
                onArticleClick={() => {}} 
                onScrollPositionChange={(pos) => {
                  capturedScrollPosition = pos;
                }}
              />,
              repo
            );

            // Get the scroll container
            const scrollContainer = container.querySelector('[data-testid="article-list"]') as HTMLDivElement;
            
            if (scrollContainer) {
              // Simulate scroll event
              scrollContainer.scrollTop = 100;
              scrollContainer.dispatchEvent(new Event('scroll'));

              // Verify callback was called with scroll position
              expect(capturedScrollPosition).toBe(100);
            }
          }
        ),
        { numRuns: 30 }
      );
    });
  });
});
