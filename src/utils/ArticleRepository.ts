// ArticleRepository for managing article data with LocalStorage

import type { Article, ArticleStore } from '../types';
import { StorageError } from './errors';
import { validateArticle } from './validation';

const STORAGE_KEY = 'whisperer-articles';

export class ArticleRepository {
  private lastTimestamp: number = 0;

  private getUniqueTimestamp(): number {
    const now = Date.now();
    // Ensure timestamp is always greater than the last one
    this.lastTimestamp = Math.max(now, this.lastTimestamp + 1);
    return this.lastTimestamp;
  }

  private getStore(): ArticleStore {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      if (!data) {
        return { articles: [], lastUpdated: Date.now() };
      }
      return JSON.parse(data) as ArticleStore;
    } catch (error) {
      throw new StorageError('Failed to read from storage', error as Error);
    }
  }

  private saveStore(store: ArticleStore): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
    } catch (error) {
      if (error instanceof DOMException && error.name === 'QuotaExceededError') {
        throw new StorageError('Storage quota exceeded. Please clear old articles.');
      }
      throw new StorageError('Failed to save data', error as Error);
    }
  }

  getAll(): Article[] {
    const store = this.getStore();
    return store.articles;
  }

  getById(id: string): Article | null {
    const store = this.getStore();
    return store.articles.find(article => article.id === id) || null;
  }

  getByCategory(category: 'tech' | 'spooky'): Article[] {
    const store = this.getStore();
    return store.articles.filter(article => article.category === category);
  }

  add(article: Omit<Article, 'id' | 'timestamp'>): Article {
    // Validate the article
    const errors = validateArticle(article);
    if (errors.length > 0) {
      throw errors[0]; // Throw the first validation error
    }

    // Create the full article with id and timestamp
    const newArticle: Article = {
      ...article,
      id: crypto.randomUUID(),
      timestamp: this.getUniqueTimestamp(),
      preview: article.content.substring(0, 150),
    };

    // Save to storage
    const store = this.getStore();
    store.articles.push(newArticle);
    store.lastUpdated = Date.now();
    this.saveStore(store);

    return newArticle;
  }

  delete(id: string): boolean {
    const store = this.getStore();
    const initialLength = store.articles.length;
    store.articles = store.articles.filter(article => article.id !== id);
    
    if (store.articles.length < initialLength) {
      store.lastUpdated = Date.now();
      this.saveStore(store);
      return true;
    }
    
    return false;
  }

  search(query: string): Article[] {
    const store = this.getStore();
    const lowerQuery = query.toLowerCase();
    return store.articles.filter(article =>
      article.title.toLowerCase().includes(lowerQuery) ||
      article.content.toLowerCase().includes(lowerQuery) ||
      article.source.toLowerCase().includes(lowerQuery)
    );
  }
}
