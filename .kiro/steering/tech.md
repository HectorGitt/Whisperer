# Tech Stack

## Core Technologies

- **React 19** with TypeScript (strict mode enabled)
- **Vite** - Build tool and dev server
- **CSS Modules** with PostCSS for scoped styling
- **Vitest** - Testing framework with jsdom environment
- **fast-check** - Property-based testing library
- **react-axe** - Accessibility auditing

## Build System

### Development
```bash
npm run dev          # Start Vite dev server
npm run preview      # Preview production build locally
```

### Production
```bash
npm run build        # TypeScript compilation + Vite build
```

### Testing
```bash
npm run test         # Run all tests once
npm run test:watch   # Run tests in watch mode
npm run test:ui      # Run tests with Vitest UI
npm run test:a11y    # Run accessibility tests only
```

### Code Quality
```bash
npm run lint         # Run ESLint
```

## Configuration Notes

- CSS Modules use camelCase convention with scoped class names
- Vitest configured with globals enabled and jsdom environment
- TypeScript uses project references (tsconfig.app.json, tsconfig.node.json)
- ESLint configured with React hooks and React refresh plugins
