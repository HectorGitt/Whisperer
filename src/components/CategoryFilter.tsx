import type { FilterState } from '../types';
import { BlurOnIdle } from './BlurOnIdle';
import styles from './CategoryFilter.module.css';

interface CategoryFilterProps {
  currentFilter: FilterState['category'];
  onFilterChange: (category: FilterState['category']) => void;
}

export function CategoryFilter({ currentFilter, onFilterChange }: CategoryFilterProps) {
  const categories: Array<{ value: FilterState['category']; label: string }> = [
    { value: 'all', label: 'All' },
    { value: 'tech', label: 'Tech' },
    { value: 'spooky', label: 'Spooky' },
  ];

  const handleClick = (category: FilterState['category']) => {
    onFilterChange(category);
  };

  const handleKeyDown = (event: React.KeyboardEvent, category: FilterState['category']) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      onFilterChange(category);
    }
  };

  return (
    <div className={styles.filterContainer} data-testid="category-filter">
      <BlurOnIdle>
        <span className={styles.label}>Filter:</span>
      </BlurOnIdle>
      <div className={styles.buttonGroup} role="group" aria-label="Category filter">
        {categories.map(({ value, label }) => (
          <button
            key={value}
            className={`${styles.filterButton} ${
              currentFilter === value ? styles.active : ''
            }`}
            onClick={() => handleClick(value)}
            onKeyDown={(e) => handleKeyDown(e, value)}
            aria-pressed={currentFilter === value}
            data-testid={`filter-${value}`}
          >
            <BlurOnIdle>
              <span>{label}</span>
            </BlurOnIdle>
          </button>
        ))}
      </div>
    </div>
  );
}
