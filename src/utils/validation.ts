// Validation utilities for articles

import type { Article } from '../types';
import { ValidationError } from './errors';

export function validateArticle(article: Partial<Article>): ValidationError[] {
  const errors: ValidationError[] = [];

  if (!article.title?.trim()) {
    errors.push(new ValidationError('title', 'Title is required'));
  }

  if (!article.content?.trim()) {
    errors.push(new ValidationError('content', 'Content is required'));
  }

  if (!article.source?.trim()) {
    errors.push(new ValidationError('source', 'Source is required'));
  }

  if (!article.category || !['tech', 'spooky'].includes(article.category)) {
    errors.push(new ValidationError('category', 'Valid category is required'));
  }

  return errors;
}
