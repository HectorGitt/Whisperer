// Core data types for The Doom Scroll Reader

export interface Article {
  id: string;
  title: string;
  content: string;
  preview: string; // First 150 chars
  source: string;
  category: 'spooky'; // All articles are spooky/horror themed
  timestamp: number;
  author?: string;
}

export interface AccessibilitySettings {
  reduceMotion: boolean;
  disableBlur: boolean;
  highContrast: boolean;
}

export interface FilterState {
  category: 'spooky'; // Only spooky category exists
  searchQuery?: string;
}

export interface UserPreferences {
  accessibility: AccessibilitySettings;
  lastViewedArticle?: string;
  feedScrollPosition?: number;
}

export interface ArticleStore {
  articles: Article[];
  lastUpdated: number;
}
