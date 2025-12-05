// Property-based tests for ArticleRepository

import { describe, it, expect, beforeEach } from 'vitest';
import fc from 'fast-check';
import { ArticleRepository } from './ArticleRepository';
import type { Article } from '../types';

describe('ArticleRepository', () => {
  let repository: ArticleRepository;

  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear();
    repository = new ArticleRepository();
  });

  /**
   * Feature: doom-scroll-reader, Property 12: Valid article addition
   * Validates: Requirements 5.1, 5.3, 5.4
   * 
   * For any article with non-empty title, content, source, and valid category,
   * adding it to the repository should result in the article appearing in the
   * feed with an assigned timestamp.
   */
  describe('Property 12: Valid article addition', () => {
    it('should add valid articles to the repository with assigned timestamp', () => {
      // Generator for valid articles (without id and timestamp)
      const validArticleArb = fc.record({
        title: fc.string({ minLength: 1, maxLength: 200 }).filter(s => s.trim().length > 0),
        content: fc.string({ minLength: 1, maxLength: 5000 }).filter(s => s.trim().length > 0),
        source: fc.string({ minLength: 1, maxLength: 100 }).filter(s => s.trim().length > 0),
        category: fc.constantFrom('tech' as const, 'spooky' as const),
        author: fc.option(fc.string({ minLength: 1, maxLength: 100 }), { nil: undefined }),
      });

      fc.assert(
        fc.property(validArticleArb, (articleInput) => {
          // Clear repository for each iteration
          localStorage.clear();
          const repo = new ArticleRepository();

          // Add the article
          const addedArticle = repo.add(articleInput);

          // Verify the article was added with required fields
          expect(addedArticle.id).toBeDefined();
          expect(typeof addedArticle.id).toBe('string');
          expect(addedArticle.id.length).toBeGreaterThan(0);

          // Verify timestamp was assigned
          expect(addedArticle.timestamp).toBeDefined();
          expect(typeof addedArticle.timestamp).toBe('number');
          expect(addedArticle.timestamp).toBeGreaterThan(0);
          expect(addedArticle.timestamp).toBeLessThanOrEqual(Date.now());

          // Verify preview was generated (max 150 chars)
          expect(addedArticle.preview).toBeDefined();
          expect(addedArticle.preview.length).toBeLessThanOrEqual(150);
          expect(addedArticle.preview).toBe(articleInput.content.substring(0, 150));

          // Verify original fields are preserved
          expect(addedArticle.title).toBe(articleInput.title);
          expect(addedArticle.content).toBe(articleInput.content);
          expect(addedArticle.source).toBe(articleInput.source);
          expect(addedArticle.category).toBe(articleInput.category);
          expect(addedArticle.author).toBe(articleInput.author);

          // Verify the article appears in the feed
          const allArticles = repo.getAll();
          expect(allArticles).toHaveLength(1);
          expect(allArticles[0]).toEqual(addedArticle);

          // Verify the article can be retrieved by ID
          const retrievedArticle = repo.getById(addedArticle.id);
          expect(retrievedArticle).toEqual(addedArticle);
        }),
        { numRuns: 100 }
      );
    });
  });
});

  /**
   * Feature: doom-scroll-reader, Property 13: Invalid article rejection
   * Validates: Requirements 5.2, 5.5
   * 
   * For any article with empty or missing required fields (title, content, source, or category),
   * attempting to add it should be rejected and the feed should remain unchanged.
   */
  describe('Property 13: Invalid article rejection', () => {
    it('should reject articles with empty or missing required fields', () => {
      // Generator for invalid articles - at least one field is invalid
      const invalidArticleArb = fc.oneof(
        // Empty title
        fc.record({
          title: fc.constantFrom('', '   ', '\t\n'),
          content: fc.string({ minLength: 1 }).filter(s => s.trim().length > 0),
          source: fc.string({ minLength: 1 }).filter(s => s.trim().length > 0),
          category: fc.constantFrom('tech' as const, 'spooky' as const),
        }),
        // Empty content
        fc.record({
          title: fc.string({ minLength: 1 }).filter(s => s.trim().length > 0),
          content: fc.constantFrom('', '   ', '\t\n'),
          source: fc.string({ minLength: 1 }).filter(s => s.trim().length > 0),
          category: fc.constantFrom('tech' as const, 'spooky' as const),
        }),
        // Empty source
        fc.record({
          title: fc.string({ minLength: 1 }).filter(s => s.trim().length > 0),
          content: fc.string({ minLength: 1 }).filter(s => s.trim().length > 0),
          source: fc.constantFrom('', '   ', '\t\n'),
          category: fc.constantFrom('tech' as const, 'spooky' as const),
        }),
        // Invalid category
        fc.record({
          title: fc.string({ minLength: 1 }).filter(s => s.trim().length > 0),
          content: fc.string({ minLength: 1 }).filter(s => s.trim().length > 0),
          source: fc.string({ minLength: 1 }).filter(s => s.trim().length > 0),
          category: fc.constantFrom('invalid' as any, '' as any, undefined as any),
        }),
        // Missing fields
        fc.record({
          title: fc.option(fc.string(), { nil: undefined }),
          content: fc.option(fc.string(), { nil: undefined }),
          source: fc.option(fc.string(), { nil: undefined }),
          category: fc.option(fc.constantFrom('tech' as const, 'spooky' as const), { nil: undefined }),
        }).filter(article => 
          !article.title || !article.content || !article.source || !article.category
        )
      );

      fc.assert(
        fc.property(invalidArticleArb, (invalidArticle) => {
          // Clear repository for each iteration
          localStorage.clear();
          const repo = new ArticleRepository();

          // Get initial state
          const initialArticles = repo.getAll();
          const initialCount = initialArticles.length;

          // Attempt to add the invalid article
          let errorThrown = false;
          try {
            repo.add(invalidArticle as any);
          } catch (error) {
            errorThrown = true;
            // Verify it's a ValidationError
            expect(error).toHaveProperty('name', 'ValidationError');
            expect(error).toHaveProperty('field');
          }

          // Verify an error was thrown
          expect(errorThrown).toBe(true);

          // Verify the feed remains unchanged
          const finalArticles = repo.getAll();
          expect(finalArticles).toHaveLength(initialCount);
          expect(finalArticles).toEqual(initialArticles);
        }),
        { numRuns: 100 }
      );
    });
  });
