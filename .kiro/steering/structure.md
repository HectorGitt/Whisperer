# Project Structure

## Directory Organization

```
src/
├── components/     # Reusable React components (visual effects, UI elements)
├── contexts/       # React Context providers (Theme, Accessibility, Article, Narrator)
├── hooks/          # Custom React hooks (useArticleAudio, useDebounce, useRandomSpookyEffect)
├── types/          # TypeScript type definitions and interfaces
├── utils/          # Utility functions (AudioManager, Narrator, ArticleRepository, performance)
├── views/          # Top-level view components (FeedView, ArticleView, CuratorView)
├── test/           # Test setup and integration tests
└── styles/         # Global styles (currently empty, using CSS Modules)

public/media/
├── images/         # GIF assets for visual effects
└── sounds/         # Audio files for ambient sounds and effects
```

## Key Patterns

### Component Structure
- Each component has a `.tsx` file and corresponding `.module.css` file
- Components export from `src/components/index.ts` for clean imports
- Use `memo()` for performance optimization where appropriate
- Include `data-testid` attributes for testing

### Testing Conventions
- Co-locate tests with source files (`.test.tsx` or `.test.ts`)
- Use property-based testing with fast-check for universal properties
- Wrap components with required providers using helper functions
- Include feature/property comments linking tests to requirements

### Context Providers
- Nested provider structure: Theme → Accessibility → Article → Narrator
- Test helper `AllProviders` available in `src/test/setup.ts`

### Styling
- CSS Modules with camelCase naming convention
- Scoped class names: `[name]__[local]___[hash:base64:5]`
- Global styles in `src/index.css` and `src/App.css`

### Routing
- Hash-based routing (`#feed`, `#article/:id`, `#curator`)
- Navigation state managed in App.tsx
- Scroll position preservation between views

### Type Safety
- Strict TypeScript configuration
- Core types defined in `src/types/index.ts`
- CSS Module types in `src/types/css-modules.d.ts`
