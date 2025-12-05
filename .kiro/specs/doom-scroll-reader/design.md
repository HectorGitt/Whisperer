# Design Document: The Doom Scroll Reader

## Overview

The Doom Scroll is a web-based news/blog reader application featuring a distinctive retro CRT monitor aesthetic. The application will be built using React for component architecture, TypeScript for type safety, and modern CSS techniques for the visual effects. The design emphasizes immersive visual styling while maintaining accessibility and performance standards.

### Technology Stack

- **Frontend Framework**: React 18+ with TypeScript
- **Build Tool**: Vite for fast development and optimized production builds
- **Styling**: CSS Modules with PostCSS for scoped styles and vendor prefixing
- **State Management**: React Context API for global state (theme, filters, accessibility settings)
- **Data Storage**: LocalStorage for article persistence and user preferences
- **Testing**: Vitest for unit tests, fast-check for property-based testing
- **Accessibility**: react-axe for development-time accessibility auditing

## Architecture

### Component Hierarchy

```
App
├── ThemeProvider (CRT aesthetic context)
├── AccessibilityProvider (reduced motion, blur toggle)
├── ArticleProvider (article data and operations)
├── NarratorProvider (text-to-speech narration)
└── Router
    ├── FeedView
    │   ├── Header
    │   ├── CategoryFilter
    │   ├── ArticleList
    │   │   └── ArticleCard (multiple)
    │   └── EmptyState
    ├── ArticleView
    │   ├── BackButton
    │   ├── ArticleHeader
    │   ├── ArticleContent
    │   └── NarrateButton (optional)
    └── CuratorView (optional admin interface)
        └── ArticleForm
```

### Visual Effects Layer

All views will be wrapped with CRT effect components:
- `<Scanlines />`: Overlay component rendering horizontal lines
- `<ScreenJitter />`: Container applying subtle transform animations
- `<CRTGlow />`: Phosphor glow effect around text
- `<BlurOnIdle />`: HOC that applies blur until hover/focus

## Components and Interfaces

### Core Data Types

```typescript
interface Article {
  id: string;
  title: string;
  content: string;
  preview: string; // First 150 chars
  source: string;
  category: 'tech' | 'spooky';
  timestamp: number;
  author?: string;
}

interface AccessibilitySettings {
  reduceMotion: boolean;
  disableBlur: boolean;
  highContrast: boolean;
}

interface FilterState {
  category: 'all' | 'tech' | 'spooky';
  searchQuery?: string;
}

interface NarratorOptions {
  enabled: boolean;
  voice?: SpeechSynthesisVoice;
  rate?: number; // 0.1 to 10 (default 0.8 for creepy effect)
  pitch?: number; // 0 to 2 (default 0.7 for creepy effect)
  volume?: number; // 0 to 1 (default 0.8)
}
```

### Component Interfaces

```typescript
// ArticleCard Component
interface ArticleCardProps {
  article: Article;
  onClick: (id: string) => void;
}

// CategoryFilter Component
interface CategoryFilterProps {
  currentFilter: FilterState['category'];
  onFilterChange: (category: FilterState['category']) => void;
}

// BlurOnIdle HOC
interface BlurOnIdleProps {
  children: React.ReactNode;
  blurAmount?: number; // in pixels, default 4
  transitionDuration?: number; // in ms, default 300
  disabled?: boolean; // from accessibility settings
}
```

## Data Models

### Article Storage

Articles will be stored in LocalStorage with the following structure:

```typescript
// LocalStorage key: 'doom-scroll-articles'
interface ArticleStore {
  articles: Article[];
  lastUpdated: number;
}
```

### User Preferences

```typescript
// LocalStorage key: 'doom-scroll-preferences'
interface UserPreferences {
  accessibility: AccessibilitySettings;
  lastViewedArticle?: string;
  feedScrollPosition?: number;
}
```

### Article Operations

```typescript
class ArticleRepository {
  getAll(): Article[];
  getById(id: string): Article | null;
  getByCategory(category: 'tech' | 'spooky'): Article[];
  add(article: Omit<Article, 'id' | 'timestamp'>): Article;
  delete(id: string): boolean;
  search(query: string): Article[];
}
```

## Narrator System

### Overview

The Narrator system provides optional text-to-speech functionality using the Web Speech API. It enhances the immersive experience by reading content aloud with atmospheric voice settings (lower pitch, slower rate) to match the spooky theme.

### Narrator Class

```typescript
class Narrator {
  private synth: SpeechSynthesis;
  private options: NarratorOptions;
  private voices: SpeechSynthesisVoice[];
  
  constructor(options: Partial<NarratorOptions>);
  speak(text: string): void;
  stop(): void;
  pause(): void;
  resume(): void;
  setEnabled(enabled: boolean): void;
  setVoice(voice: SpeechSynthesisVoice): void;
  getAvailableVoices(): SpeechSynthesisVoice[];
  getRandomSpookyPhrase(): string;
  narrateArticleTitle(title: string): void;
}
```

### NarratorContext

The NarratorContext provides global access to narrator functionality:

```typescript
interface NarratorContextType {
  enabled: boolean;
  setEnabled: (enabled: boolean) => void;
  speak: (text: string) => void;
  stop: () => void;
  pause: () => void;
  resume: () => void;
  narrateArticleTitle: (title: string) => void;
  getRandomPhrase: () => string;
  isSupported: boolean;
  isSpeaking: boolean;
}
```

### Voice Selection

The narrator automatically selects an appropriate voice:
1. Prefers male voices for deeper, more atmospheric sound
2. Falls back to first available voice if no preferred voice found
3. Configures voice with:
   - Rate: 0.8 (slower than normal for dramatic effect)
   - Pitch: 0.7 (lower than normal for creepy atmosphere)
   - Volume: 0.8 (slightly reduced for subtlety)

### Spooky Phrases

The narrator includes a collection of atmospheric phrases for greetings and transitions:
- "Welcome... to the darkness..."
- "Let me tell you a story..."
- "Listen closely... if you dare..."
- "The shadows whisper..."
- And more...

### Integration Points

- **Settings Panel**: Toggle to enable/disable narrator
- **Article View**: Automatic narration of spooky article titles, manual button for full article narration
- **Spooky Effects**: Pause/resume narrator during sound effects
- **Context Persistence**: Narrator preference saved to localStorage

### Narrator Pause/Resume

Spooky visual effects with sound (jump scares, etc.) temporarily pause the narrator:

```typescript
// In JumpScare component
useEffect(() => {
  pause(); // Pause narrator
  audioManager.playSound(selectedSound);
  
  const timer = setTimeout(() => {
    resume(); // Resume narrator after effect
    onComplete?.();
  }, 2000);
  
  return () => {
    resume(); // Ensure narrator resumes if component unmounts
  };
}, [pause, resume]);
```

## Audio System

### Overview

The audio system provides atmospheric background music and sound effects to enhance the immersive experience. It uses randomized selection to keep each session unique and respects browser autoplay policies.

### AudioManager Class

```typescript
class AudioManager {
  private audioElements: Map<string, HTMLAudioElement>;
  private volume: number;
  private enabled: boolean;
  private backgroundAudio: HTMLAudioElement | null;
  private userInteracted: boolean;
  
  constructor();
  playSound(soundFile: string, loop?: boolean): Promise<void>;
  stopSound(soundFile: string): void;
  stopAll(): void;
  getRandomAmbientSound(): string;
  setVolume(volume: number): void;
  setEnabled(enabled: boolean): void;
  hasUserInteracted(): boolean;
}
```

### Audio File Categories

**Background Music (>1.8MB, longer duration)**:
- Abyss.mp3 (2.8MB)
- CrEEP.mp3 (3.6MB)
- Dark Rooms and Scary Things.mp3 (2.5MB)
- Scary Ambient Wind.mp3 (4.9MB)
- down to business.wav (4.9MB)
- Is Anybody Home.wav (5.5MB)
- Scary-Monster.flac (4.2MB)
- trappist.wav (10.5MB)
- amb_01.ogg (2.4MB)
- amb_02.ogg (1.8MB)
- amb_03.ogg (1.8MB)

**Jump Scare Sounds (<500KB, quick impact)**:
- scaryhighpitchedghost.ogg (446KB)
- ghost_1.flac (207KB)
- ghost_2.flac (220KB)
- troll-roars.ogg (126KB)
- scrapped-troll-sounds.ogg (117KB)
- troll-idle-noises.ogg (292KB)

### Sound Mapping System

```typescript
interface SoundMapping {
  keywords: string[];
  soundFile: string;
  category: 'ambient' | 'creature' | 'supernatural' | 'nature';
}

function getSoundsForText(text: string): string[];
function getJumpScareSound(): string;
function getAmbientSound(): string;
```

### User Interaction Detection

The AudioManager waits for user interaction before playing audio to comply with browser autoplay policies:

```typescript
// Setup interaction listeners
document.addEventListener('click', enableAudio, { capture: true, once: true });
document.addEventListener('keydown', enableAudio, { capture: true, once: true });
document.addEventListener('touchstart', enableAudio, { capture: true, once: true });
```

### Audio Integration

**Spooky Article View**:
- Randomly selects and loops background music
- Stops music when leaving article
- Plays contextual sounds based on article content keywords

**Jump Scare Effects**:
- Randomly selects short sound effect
- Plays without interruption
- Pauses narrator during playback

**Background Music Management**:
```typescript
// In ArticleView
useEffect(() => {
  if (article?.category === 'spooky') {
    const randomAmbient = audioManager.getRandomAmbientSound();
    audioManager.playSound(randomAmbient, true); // Loop
  }
  
  return () => {
    audioManager.stopAll(); // Stop when leaving
  };
}, [article?.id, article?.category]);
```

## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system—essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*


### Property Reflection

Before defining properties, let's identify and eliminate redundancy:

- Properties 3.2 and 3.3 (hover adds blur, unhover removes blur) can be combined into a single round-trip property about blur state toggling
- Property 7.4 is redundant with 4.5 (both test keyboard navigation)
- Properties about article addition (5.1, 5.3, 5.4) can be consolidated - if an article is added and persisted, we can verify all aspects in one property
- Properties 6.2 and 6.3 (filter and clear filter) are related and can be tested as filter state management

### Core Properties

**Property 1: Article list rendering completeness**
*For any* collection of articles, when rendered in the feed, each article card should display the article's title, source, and timestamp.
**Validates: Requirements 1.1**

**Property 2: Preview text truncation**
*For any* article with content longer than 150 characters, the preview text should be exactly 150 characters or less.
**Validates: Requirements 1.2**

**Property 3: Article navigation preserves content**
*For any* article, clicking it in the feed and viewing the full article should display the complete original content without modification.
**Validates: Requirements 1.3**

**Property 4: Article sorting by date**
*For any* collection of articles with different timestamps, the rendered feed should display them in descending order by timestamp (newest first).
**Validates: Requirements 1.5**

**Property 5: Monochromatic color scheme**
*For any* rendered component, the computed text color should be either green (#00FF00 variants) or amber (#FFBF00 variants), and background colors should be dark (luminance < 0.2).
**Validates: Requirements 2.1**

**Property 6: Fixed-width font usage**
*For any* text element in the application, the computed font-family should include a monospace font.
**Validates: Requirements 2.4**

**Property 7: Blur state toggle on interaction**
*For any* text element with blur-on-idle behavior, hovering should remove the blur effect, and unhovering should reapply it, returning to the original state.
**Validates: Requirements 3.1, 3.2, 3.3**

**Property 8: Blur behavior consistency**
*For any* article displayed, the title, preview text, and body content should all have the blur-on-idle wrapper applied.
**Validates: Requirements 3.5**

**Property 9: Hover feedback on interactive elements**
*For any* article card in the feed, hovering should trigger a visual state change (opacity, border, or glow effect).
**Validates: Requirements 4.2**

**Property 10: Navigation preserves scroll position**
*For any* scroll position in the feed, navigating to an article and back should restore the original scroll position.
**Validates: Requirements 4.4**

**Property 11: Keyboard navigation support**
*For any* interactive element (article cards, buttons, filters), pressing Tab should move focus to it, and pressing Enter or Space should activate it.
**Validates: Requirements 4.5, 7.4**

**Property 12: Valid article addition**
*For any* article with non-empty title, content, source, and valid category, adding it to the repository should result in the article appearing in the feed with an assigned timestamp.
**Validates: Requirements 5.1, 5.3, 5.4**

**Property 13: Invalid article rejection**
*For any* article with empty or missing required fields (title, content, source, or category), attempting to add it should be rejected and the feed should remain unchanged.
**Validates: Requirements 5.2, 5.5**

**Property 14: Category filtering accuracy**
*For any* collection of articles with mixed categories, applying a category filter should return only articles matching that category, and clearing the filter should return all articles.
**Validates: Requirements 6.2, 6.3**

**Property 15: Filter state persistence**
*For any* applied category filter, navigating to an article and back should maintain the same filter state.
**Validates: Requirements 6.4**

**Property 16: Color contrast compliance**
*For any* text and background color combination used in the application, the contrast ratio should meet WCAG AA standards (minimum 4.5:1 for normal text, 3:1 for large text).
**Validates: Requirements 7.3**

**Property 17: Screen reader compatibility**
*For any* interactive element or content section, appropriate ARIA labels and semantic HTML should be present.
**Validates: Requirements 7.5**

**Property 18: Reduced motion detection**
*For any* user with prefers-reduced-motion enabled, the application should detect this preference on load.
**Validates: Requirements 8.1**

**Property 19: Reduced motion behavior**
*For any* user with reduced motion enabled, screen jitter and transition animations should be disabled or significantly reduced.
**Validates: Requirements 8.2**

**Property 20: Blur disable functionality**
*For any* text element, when blur effects are disabled in settings, no blur should be applied regardless of hover state.
**Validates: Requirements 8.4**

**Property 21: Visual effects independence**
*For any* accessibility setting that reduces visual effects, the monochromatic color scheme should remain unchanged.
**Validates: Requirements 8.5**

**Property 22: Responsive layout adaptation**
*For any* viewport width between 320px and 2560px, the application should render without horizontal scrolling or layout breaking.
**Validates: Requirements 9.1, 9.5**

**Property 23: Responsive scanline density**
*For any* viewport width change, the scanline effect should adjust its density or spacing to maintain visual consistency.
**Validates: Requirements 9.2**

**Property 24: Touch interaction equivalence**
*For any* hover-based interaction on mobile viewports, tapping should trigger the same behavior as hovering.
**Validates: Requirements 9.3**

**Property 25: Initial load performance**
*For any* feed with up to 100 articles, the initial render should complete within 2 seconds.
**Validates: Requirements 10.1**

**Property 26: Narrator toggle availability**
*For any* settings panel, when opened, a narrator toggle control should be present and accessible.
**Validates: Requirements 11.1**

**Property 27: Narrator voice configuration**
*For any* narrator instance, when enabled, the speech synthesis should use a rate of 0.8 or lower and pitch of 0.7 or lower for atmospheric effect.
**Validates: Requirements 11.2**

**Property 28: Narrator preference persistence**
*For any* narrator enabled/disabled state change, the preference should be saved to local storage and restored on application reload.
**Validates: Requirements 11.6**

**Property 29: Narrator graceful degradation**
*For any* browser environment without Web Speech API support, the narrator functionality should be disabled without causing errors.
**Validates: Requirements 11.7**

**Property 30: Narrator pause during spooky effects**
*For any* spooky visual effect with sound, when the effect plays, the narrator should pause and then resume after the effect completes.
**Validates: Requirements 11.8**

**Property 31: Background music randomization**
*For any* two consecutive spooky article views, the background music tracks should be independently randomly selected (may be same or different).
**Validates: Requirements 12.1**

**Property 32: Background music looping**
*For any* spooky article being viewed, the background music should loop continuously until the user navigates away.
**Validates: Requirements 12.2**

**Property 33: Background music cleanup**
*For any* article view with background music playing, navigating away should stop the music completely.
**Validates: Requirements 12.3**

**Property 34: Background music file selection**
*For any* randomly selected background music file, it should be from the collection of files larger than 1.8MB.
**Validates: Requirements 12.4**

**Property 35: Audio user interaction requirement**
*For any* audio playback attempt before user interaction, the system should wait and not throw errors.
**Validates: Requirements 12.5**

**Property 36: Jump scare sound randomization**
*For any* jump scare effect, the sound should be randomly selected from the collection of short audio files.
**Validates: Requirements 13.1**

**Property 37: Jump scare sound file selection**
*For any* randomly selected jump scare sound, it should be from the collection of files smaller than 500KB.
**Validates: Requirements 13.2**

**Property 38: Jump scare sound completion**
*For any* jump scare sound that starts playing, it should be allowed to complete without being interrupted by cleanup.
**Validates: Requirements 13.3**

**Property 39: Audio independence**
*For any* spooky effect sound playing, the background music should continue playing uninterrupted.
**Validates: Requirements 13.5**

## Error Handling

### Input Validation Errors

```typescript
class ValidationError extends Error {
  constructor(public field: string, message: string) {
    super(message);
    this.name = 'ValidationError';
  }
}

// Article validation
function validateArticle(article: Partial<Article>): ValidationError[] {
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
```

### Storage Errors

```typescript
class StorageError extends Error {
  constructor(message: string, public cause?: Error) {
    super(message);
    this.name = 'StorageError';
  }
}

// Handle LocalStorage quota exceeded
function safeStorageWrite(key: string, value: any): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    if (error instanceof DOMException && error.name === 'QuotaExceededError') {
      throw new StorageError('Storage quota exceeded. Please clear old articles.');
    }
    throw new StorageError('Failed to save data', error as Error);
  }
}
```

### Graceful Degradation

- If LocalStorage is unavailable, use in-memory storage with a warning
- If CSS animations cause performance issues, automatically reduce complexity
- If blur effects cause rendering problems, fall back to no blur
- Display user-friendly error messages for all validation failures

## Testing Strategy

### Unit Testing

Unit tests will verify specific behaviors and edge cases:

- **Empty state handling**: Verify empty feed displays appropriate message
- **Preview truncation edge cases**: Test articles with exactly 150 characters, 149, 151
- **Filter UI presence**: Verify filter components render in feed view
- **Back button presence**: Verify back button exists in article view
- **Settings toggle presence**: Verify blur disable toggle exists in settings
- **Narrator toggle presence**: Verify narrator toggle exists in settings panel
- **Category support**: Verify both 'tech' and 'spooky' categories are available
- **Scanline rendering**: Verify scanline component is present
- **Jitter animation**: Verify jitter animation is applied to container
- **Timestamp assignment**: Verify articles get timestamps when added
- **Error message display**: Verify validation errors are shown to users
- **Narrator graceful degradation**: Verify narrator handles missing Web Speech API gracefully

### Property-Based Testing

Property-based tests will verify universal properties using **fast-check** library:

- Each property-based test will run a minimum of 100 iterations
- Tests will use smart generators that create realistic test data
- Each test will be tagged with a comment referencing the design property

**Test Configuration**:
```typescript
import fc from 'fast-check';

// Configure all property tests to run 100+ iterations
const testConfig = { numRuns: 100 };
```

**Generators**:
```typescript
// Article generator
const articleArb = fc.record({
  id: fc.uuid(),
  title: fc.string({ minLength: 1, maxLength: 200 }),
  content: fc.string({ minLength: 1, maxLength: 5000 }),
  source: fc.string({ minLength: 1, maxLength: 100 }),
  category: fc.constantFrom('tech', 'spooky'),
  timestamp: fc.integer({ min: 0, max: Date.now() }),
});

// Invalid article generator (for testing validation)
const invalidArticleArb = fc.record({
  title: fc.option(fc.constant(''), { nil: undefined }),
  content: fc.option(fc.constant(''), { nil: undefined }),
  source: fc.option(fc.constant(''), { nil: undefined }),
  category: fc.option(fc.constantFrom('tech', 'spooky'), { nil: undefined }),
});

// Color generator for contrast testing
const colorArb = fc.record({
  r: fc.integer({ min: 0, max: 255 }),
  g: fc.integer({ min: 0, max: 255 }),
  b: fc.integer({ min: 0, max: 255 }),
});
```

**Property Test Examples**:

Each correctness property from the design will be implemented as a property-based test:

- Property 1: Generate random article collections, verify all fields render
- Property 2: Generate articles with varying content lengths, verify preview truncation
- Property 4: Generate random article collections, verify sort order
- Property 12: Generate valid articles, verify they're added successfully
- Property 13: Generate invalid articles, verify they're rejected
- Property 14: Generate mixed article collections, verify filtering accuracy

### Integration Testing

- Test complete user flows: browse feed → view article → return to feed
- Test filter application across navigation
- Test accessibility settings affecting multiple components
- Test responsive behavior at various breakpoints

### Accessibility Testing

- Automated checks using react-axe during development
- Manual keyboard navigation testing
- Screen reader compatibility testing with NVDA/JAWS
- Color contrast validation using automated tools

## Visual Effects Implementation

### Scanlines

```css
.scanlines {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 9999;
  background: repeating-linear-gradient(
    0deg,
    rgba(0, 0, 0, 0.15),
    rgba(0, 0, 0, 0.15) 1px,
    transparent 1px,
    transparent 2px
  );
}

@media (max-width: 768px) {
  .scanlines {
    background-size: 100% 3px; /* Adjust density for mobile */
  }
}
```

### Screen Jitter

```css
@keyframes jitter {
  0%, 100% { transform: translate(0, 0); }
  10% { transform: translate(-1px, 1px); }
  20% { transform: translate(1px, -1px); }
  30% { transform: translate(-1px, -1px); }
  40% { transform: translate(1px, 1px); }
  50% { transform: translate(-1px, 0); }
  60% { transform: translate(1px, 0); }
  70% { transform: translate(0, -1px); }
  80% { transform: translate(0, 1px); }
  90% { transform: translate(-1px, 1px); }
}

.screen-container {
  animation: jitter 0.3s infinite;
}

.screen-container.reduced-motion {
  animation: none;
}
```

### Blur on Idle

```css
.blur-on-idle {
  filter: blur(4px);
  transition: filter 0.3s ease;
}

.blur-on-idle:hover,
.blur-on-idle:focus-within {
  filter: blur(0);
}

.blur-disabled .blur-on-idle {
  filter: none;
}
```

### CRT Glow

```css
.crt-text {
  color: var(--crt-green);
  text-shadow: 
    0 0 5px var(--crt-green),
    0 0 10px var(--crt-green);
}

:root {
  --crt-green: #00ff00;
  --crt-amber: #ffbf00;
  --crt-dark: #0a0a0a;
}

[data-theme="amber"] {
  --crt-green: var(--crt-amber);
}
```

## Performance Considerations

### Optimization Strategies

1. **CSS-based effects**: Use CSS for all visual effects to leverage GPU acceleration
2. **Virtual scrolling**: Implement virtual scrolling for feeds with 100+ articles
3. **Lazy loading**: Load article content only when viewed
4. **Memoization**: Use React.memo for article cards to prevent unnecessary re-renders
5. **Debounced filters**: Debounce filter changes to reduce re-renders
6. **LocalStorage batching**: Batch storage writes to reduce I/O

### Performance Monitoring

```typescript
// Simple performance tracking
function measureRenderTime(componentName: string) {
  const start = performance.now();
  return () => {
    const end = performance.now();
    if (end - start > 16) { // More than one frame
      console.warn(`${componentName} render took ${end - start}ms`);
    }
  };
}
```

## Accessibility Features

### Keyboard Navigation

- Tab order follows logical reading flow
- All interactive elements are keyboard accessible
- Focus indicators are visible and high-contrast
- Escape key closes modals/overlays

### Screen Reader Support

```typescript
// Example ARIA labels
<article 
  role="article"
  aria-label={`${article.title} from ${article.source}`}
  tabIndex={0}
>
  <h2 id={`article-${article.id}-title`}>{article.title}</h2>
  <p aria-describedby={`article-${article.id}-title`}>
    {article.preview}
  </p>
</article>
```

### Reduced Motion

```typescript
// Detect and respect user preferences
const prefersReducedMotion = window.matchMedia(
  '(prefers-reduced-motion: reduce)'
).matches;

// Apply to context
<AccessibilityProvider initialSettings={{
  reduceMotion: prefersReducedMotion,
  disableBlur: false,
  highContrast: false,
}}>
```

## Agent Hook Configuration

### Accessibility Check Hook

Create a hook that runs accessibility audits when UI components are saved:

```json
{
  "name": "Accessibility Check on Save",
  "trigger": "onFileSave",
  "filePattern": "src/components/**/*.tsx",
  "action": "runCommand",
  "command": "npm run test:a11y -- --changed"
}
```

The hook will:
1. Detect when component files are saved
2. Run react-axe checks on the modified components
3. Report any accessibility violations
4. Fail if critical issues are found (color contrast, missing ARIA labels)

## Deployment Considerations

- Build optimized production bundle with Vite
- Minify CSS and JavaScript
- Enable gzip compression
- Use CDN for static assets if needed
- Set appropriate cache headers for assets
- Include meta tags for social sharing with CRT-themed preview images

## Future Enhancements

- RSS feed integration for automatic article updates
- User accounts and personalized feeds
- Article bookmarking and reading history
- Multiple color themes (green, amber, blue phosphor)
- Customizable scanline intensity
- Article search functionality
- Social sharing features
- Dark/light mode toggle (while maintaining CRT aesthetic)
