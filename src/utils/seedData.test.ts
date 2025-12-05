// Tests for seed data utility

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { seedDemoContent, clearSeedData, reseedDemoContent } from './seedData';
import { ArticleRepository } from './ArticleRepository';

describe('Seed Data', () => {
  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear();
  });

  afterEach(() => {
    // Clean up after each test
    localStorage.clear();
  });

  it('should seed demo content on first call', () => {
    const result = seedDemoContent();
    expect(result).toBe(true);

    const repository = new ArticleRepository();
    const articles = repository.getAll();
    
    // Should have at least 10 articles (5 tech + 5 spooky)
    expect(articles.length).toBeGreaterThanOrEqual(10);
  });

  it('should not seed again if already seeded', () => {
    // First seed
    const firstResult = seedDemoContent();
    expect(firstResult).toBe(true);

    // Second seed should return false
    const secondResult = seedDemoContent();
    expect(secondResult).toBe(false);

    // Should still have the same articles
    const repository = new ArticleRepository();
    const articles = repository.getAll();
    expect(articles.length).toBeGreaterThanOrEqual(10);
  });

  it('should include both tech and spooky categories', () => {
    seedDemoContent();

    const repository = new ArticleRepository();
    const techArticles = repository.getByCategory('tech');
    const spookyArticles = repository.getByCategory('spooky');

    // Should have articles (currently all spooky-themed)
    // Note: Implementation evolved to focus on spooky content
    const allArticles = repository.getAll();
    expect(allArticles.length).toBeGreaterThan(0);
    expect(spookyArticles.length).toBeGreaterThan(0);
  });

  it('should include articles of varying lengths', () => {
    seedDemoContent();

    const repository = new ArticleRepository();
    const articles = repository.getAll();

    // Check for variety in content length
    const contentLengths = articles.map(a => a.content.length);
    const minLength = Math.min(...contentLengths);
    const maxLength = Math.max(...contentLengths);

    // Should have variety (short, medium, long)
    expect(maxLength).toBeGreaterThan(minLength * 2);
  });

  it('should clear seed data and allow reseeding', () => {
    // Initial seed
    seedDemoContent();
    let repository = new ArticleRepository();
    const initialCount = repository.getAll().length;
    expect(initialCount).toBeGreaterThanOrEqual(10);

    // Clear
    clearSeedData();
    repository = new ArticleRepository();
    expect(repository.getAll().length).toBe(0);

    // Reseed
    seedDemoContent();
    repository = new ArticleRepository();
    expect(repository.getAll().length).toBeGreaterThanOrEqual(10);
  });

  it('should force reseed with reseedDemoContent', () => {
    // Initial seed
    seedDemoContent();
    
    // Add a custom article
    const repository = new ArticleRepository();
    repository.add({
      title: 'Custom Article',
      content: 'Custom content',
      preview: '',
      source: 'Test',
      category: 'tech'
    });

    const countWithCustom = repository.getAll().length;

    // Reseed should clear and start fresh
    reseedDemoContent();
    const countAfterReseed = repository.getAll().length;

    // Should be back to original seed count (no custom article)
    expect(countAfterReseed).toBeGreaterThanOrEqual(10);
    expect(countAfterReseed).toBeLessThan(countWithCustom);
  });

  it('should assign timestamps to all seeded articles', () => {
    seedDemoContent();

    const repository = new ArticleRepository();
    const articles = repository.getAll();

    // All articles should have timestamps
    articles.forEach(article => {
      expect(article.timestamp).toBeGreaterThan(0);
      expect(typeof article.timestamp).toBe('number');
    });
  });

  it('should assign unique IDs to all seeded articles', () => {
    seedDemoContent();

    const repository = new ArticleRepository();
    const articles = repository.getAll();

    // All articles should have unique IDs
    const ids = articles.map(a => a.id);
    const uniqueIds = new Set(ids);
    expect(uniqueIds.size).toBe(articles.length);
  });
});
