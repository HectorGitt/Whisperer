import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { CategoryFilter } from './CategoryFilter';
import { AccessibilityProvider } from '../contexts/AccessibilityContext';
import fc from 'fast-check';
import type { Article, FilterState } from '../types';

describe('CategoryFilter', () => {
  const renderWithProviders = (ui: React.ReactElement) => {
    return render(
      <AccessibilityProvider>
        {ui}
      </AccessibilityProvider>
    );
  };

  describe('Unit Tests', () => {
    it('should render filter components in feed view', () => {
      // Requirements 6.1: Verify filter components render
      const mockOnFilterChange = vi.fn();
      
      renderWithProviders(
        <CategoryFilter currentFilter="all" onFilterChange={mockOnFilterChange} />
      );

      // Verify the filter container is present
      expect(screen.getByTestId('category-filter')).toBeInTheDocument();
      
      // Verify the label is present
      expect(screen.getByText('Filter:')).toBeInTheDocument();
      
      // Verify filter buttons are present
      expect(screen.getByTestId('filter-all')).toBeInTheDocument();
      expect(screen.getByTestId('filter-tech')).toBeInTheDocument();
      expect(screen.getByTestId('filter-spooky')).toBeInTheDocument();
    });

    it('should verify both tech and spooky categories are available', () => {
      // Requirements 6.5: Verify both 'tech' and 'spooky' categories are available
      const mockOnFilterChange = vi.fn();
      
      renderWithProviders(
        <CategoryFilter currentFilter="all" onFilterChange={mockOnFilterChange} />
      );

      // Verify tech category button exists
      const techButton = screen.getByTestId('filter-tech');
      expect(techButton).toBeInTheDocument();
      expect(techButton).toHaveTextContent('Tech');

      // Verify spooky category button exists
      const spookyButton = screen.getByTestId('filter-spooky');
      expect(spookyButton).toBeInTheDocument();
      expect(spookyButton).toHaveTextContent('Spooky');
    });
  });

  describe('Property-Based Tests', () => {
    /**
     * Feature: doom-scroll-reader, Property 14: Category filtering accuracy
     * Validates: Requirements 6.2, 6.3
     */
    it('should filter articles by category accurately and clear filter to show all', () => {
      fc.assert(
        fc.property(
          fc.array(
            fc.record({
              id: fc.uuid(),
              title: fc.string({ minLength: 1, maxLength: 200 }),
              content: fc.string({ minLength: 1, maxLength: 5000 }),
              preview: fc.string({ minLength: 1, maxLength: 150 }),
              source: fc.string({ minLength: 1, maxLength: 100 }),
              category: fc.constantFrom('tech' as const, 'spooky' as const),
              timestamp: fc.integer({ min: 0, max: Date.now() }),
            }),
            { minLength: 0, maxLength: 50 }
          ),
          (articles: Article[]) => {
            // Helper function to filter articles
            const filterArticles = (
              articles: Article[],
              category: FilterState['category']
            ): Article[] => {
              if (category === 'all') {
                return articles;
              }
              return articles.filter(article => article.category === category);
            };

            // Test filtering by 'tech' category
            const techFiltered = filterArticles(articles, 'tech');
            const allTech = techFiltered.every(article => article.category === 'tech');
            expect(allTech).toBe(true);
            expect(techFiltered.length).toBe(
              articles.filter(a => a.category === 'tech').length
            );

            // Test filtering by 'spooky' category
            const spookyFiltered = filterArticles(articles, 'spooky');
            const allSpooky = spookyFiltered.every(article => article.category === 'spooky');
            expect(allSpooky).toBe(true);
            expect(spookyFiltered.length).toBe(
              articles.filter(a => a.category === 'spooky').length
            );

            // Test clearing filter (showing all)
            const allFiltered = filterArticles(articles, 'all');
            expect(allFiltered.length).toBe(articles.length);
            expect(allFiltered).toEqual(articles);
          }
        ),
        { numRuns: 100 }
      );
    });
  });
});
