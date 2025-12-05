import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { Article, FilterState } from '../types';
import { ArticleRepository } from '../utils/ArticleRepository';

interface ArticleContextType {
  articles: Article[];
  filteredArticles: Article[];
  filterState: FilterState;
  setFilterState: (filter: FilterState) => void;
  addArticle: (article: Omit<Article, 'id' | 'timestamp'>) => Article;
  deleteArticle: (id: string) => boolean;
  getArticleById: (id: string) => Article | null;
  refreshArticles: () => void;
}

const ArticleContext = createContext<ArticleContextType | undefined>(undefined);

interface ArticleProviderProps {
  children: ReactNode;
  repository?: ArticleRepository;
}

export function ArticleProvider({ children, repository }: ArticleProviderProps) {
  const [repo] = useState(() => repository || new ArticleRepository());
  const [articles, setArticles] = useState<Article[]>([]);
  const [filterState, setFilterState] = useState<FilterState>({
    category: 'all',
  });

  const refreshArticles = () => {
    const allArticles = repo.getAll();
    setArticles(allArticles);
  };

  useEffect(() => {
    refreshArticles();
  }, []);

  const filteredArticles = React.useMemo(() => {
    let filtered = articles;

    if (filterState.category !== 'all') {
      filtered = filtered.filter(article => article.category === filterState.category);
    }

    if (filterState.searchQuery) {
      const query = filterState.searchQuery.toLowerCase();
      filtered = filtered.filter(article =>
        article.title.toLowerCase().includes(query) ||
        article.content.toLowerCase().includes(query) ||
        article.source.toLowerCase().includes(query)
      );
    }

    return filtered;
  }, [articles, filterState]);

  const addArticle = (article: Omit<Article, 'id' | 'timestamp'>): Article => {
    const newArticle = repo.add(article);
    refreshArticles();
    return newArticle;
  };

  const deleteArticle = (id: string): boolean => {
    const result = repo.delete(id);
    if (result) {
      refreshArticles();
    }
    return result;
  };

  const getArticleById = (id: string): Article | null => {
    return repo.getById(id);
  };

  return (
    <ArticleContext.Provider
      value={{
        articles,
        filteredArticles,
        filterState,
        setFilterState,
        addArticle,
        deleteArticle,
        getArticleById,
        refreshArticles,
      }}
    >
      {children}
    </ArticleContext.Provider>
  );
}

export function useArticles(): ArticleContextType {
  const context = useContext(ArticleContext);
  if (context === undefined) {
    throw new Error('useArticles must be used within an ArticleProvider');
  }
  return context;
}
