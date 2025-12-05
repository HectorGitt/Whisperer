# 🎃 The Doom Scroll Reader

> *"Welcome... to the darkness..."*

A horror-themed story reader with an immersive retro CRT monitor aesthetic. Experience creepypasta and horror stories with atmospheric audio, spooky visual effects, and an optional narrator that reads tales in a haunting voice.

![CRT Monitor Aesthetic](https://img.shields.io/badge/aesthetic-CRT%20Monitor-green?style=for-the-badge)
![Horror Theme](https://img.shields.io/badge/theme-Horror-red?style=for-the-badge)
![Audio Enabled](https://img.shields.io/badge/audio-Atmospheric-purple?style=for-the-badge)

## ✨ Features

### 🖥️ Retro CRT Aesthetic
- Authentic scanline effects across the entire viewport
- Subtle screen jitter animation mimicking CRT instability
- Monochromatic green phosphor glow
- Blur-on-idle text that clears on hover for focused reading
- Fixed-width terminal fonts

### 👻 Spooky Effects
Random atmospheric effects that appear during your reading session:
- **Crawling Spiders** - Watch spiders crawl across your screen
- **Floating Ghosts** - Ethereal apparitions drift through the page
- **Screen Glitches** - Reality-bending visual distortions
- **Jump Scares** - Sudden frightening images with sound
- **Shadow Figures** - Dark entities lurking at the edges

### 🎵 Immersive Audio System
- **Randomized Background Music** - Each story plays a unique atmospheric track from 11 longer audio files
- **Contextual Sound Effects** - Keyword-based audio that matches story content
- **Jump Scare Sounds** - 6 short, impactful sound effects for maximum fright
- **Narrator Voice** - Optional text-to-speech with creepy voice settings (lower pitch, slower rate)
- **Smart Audio Management** - Respects browser autoplay policies, pauses narrator during effects

### 🎙️ Narrator System
- **Enabled by default** - Automatically starts reading stories when you open them
- Reads full article content with atmospheric voice (pitch: 0.7, rate: 0.8)
- Toggle on/off with the NARRATE button or in settings
- Continues narrating even during jump scares and spooky effects
- Uses Web Speech API with event-based state tracking for accurate playback

### ♿ Accessibility
- Full keyboard navigation support
- Screen reader compatible with ARIA labels
- Reduce motion option for sensitive users
- Disable blur effects toggle
- WCAG AA color contrast compliance
- Respects `prefers-reduced-motion` system setting

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd doom-scroll-reader

# Install dependencies
npm install

# Start development server
npm run dev
```

The app will open at `http://localhost:5173` (or the next available port).

### First Run

On first launch, the app automatically seeds with 11 horror stories including:
- The Haunted Server Room
- The Last Commit
- The Cursed Algorithm
- The Midnight Debugger
- The Infinite Loop
- And more creepy tales...

**Important:** 
- Click anywhere on the page after loading to enable audio (browser autoplay policy requirement)
- The narrator is enabled by default and will start reading automatically
- All articles are horror-themed with atmospheric background music

## 🎮 Usage

### Reading Stories
1. Browse the feed of horror stories
2. Click any story to read the full content
3. Background music and narrator start automatically (after user interaction)
4. Random spooky effects appear every 30-90 seconds
5. Click the NARRATE button to pause/resume narration
6. Use the back button to return to the feed

### Narrator Controls
- **Auto-Start**: Narrator is enabled by default and begins reading automatically
- **Toggle**: Click the "NARRATE" button (🔊) in any article to stop/start narration
- **Disable**: Go to settings (⚙️) and toggle "Narrator" to OFF to disable completely
- **Note**: Narrator continues during jump scares and visual effects for uninterrupted storytelling

### Accessibility Settings
- **Reduce Motion** - Disables screen jitter and reduces animations
- **Disable Blur** - Shows all text clearly without hover requirement
- **Narrator** - Enables text-to-speech functionality

## 🛠️ Tech Stack

- **React 19** with TypeScript (strict mode)
- **Vite** - Lightning-fast build tool and dev server
- **CSS Modules** with PostCSS for scoped styling
- **Vitest** - Unit testing framework with jsdom
- **fast-check** - Property-based testing library
- **Web Speech API** - Text-to-speech narrator
- **LocalStorage** - Article persistence and preferences

## 📁 Project Structure

```
src/
├── components/     # React components (visual effects, UI elements)
│   ├── JumpScare.tsx
│   ├── FloatingGhost.tsx
│   ├── CrawlingSpider.tsx
│   ├── GlitchEffect.tsx
│   ├── ShadowFigure.tsx
│   ├── Scanlines.tsx
│   ├── ScreenJitter.tsx
│   └── ...
├── contexts/       # React Context providers
│   ├── ThemeContext.tsx
│   ├── AccessibilityContext.tsx
│   ├── ArticleContext.tsx
│   └── NarratorContext.tsx
├── hooks/          # Custom React hooks
│   ├── useArticleAudio.ts
│   ├── useRandomSpookyEffect.ts
│   └── useDebounce.ts
├── utils/          # Utility functions
│   ├── AudioManager.ts       # Audio playback management
│   ├── Narrator.ts           # Text-to-speech system
│   ├── soundMapping.ts       # Keyword-based audio selection
│   ├── ArticleRepository.ts  # Article CRUD operations
│   └── seedData.ts           # Demo horror stories
├── views/          # Top-level view components
│   ├── FeedView.tsx
│   ├── ArticleView.tsx
│   └── CuratorView.tsx
├── types/          # TypeScript type definitions
└── test/           # Test setup and integration tests
```

## 🧪 Testing

```bash
# Run all tests once
npm run test

# Run tests in watch mode
npm run test:watch

# Run tests with UI
npm run test:ui

# Run accessibility tests only
npm run test:a11y

# Lint code
npm run lint
```

### Testing Strategy
- **Unit Tests** - Specific component behaviors
- **Property-Based Tests** - Universal properties with fast-check (100+ iterations)
- **Integration Tests** - Complete user flows
- **Accessibility Tests** - WCAG compliance with react-axe

## 🎨 Customization

### Adding New Stories
Use the Curator view (accessible via settings) to add new horror stories:
1. Enter title, content, and source
2. Stories are automatically saved to LocalStorage
3. Preview text is generated (first 150 characters)

### Audio Files
Audio files are organized by purpose:

**Background Music** (`public/media/sounds/`)
- Files >1.8MB for sustained atmosphere
- 11 tracks including Abyss.mp3, CrEEP.mp3, trappist.wav

**Jump Scare Sounds**
- Files <500KB for quick impact
- 6 sounds including ghost sounds, roars, screams

### Modifying Visual Effects
Edit component files in `src/components/` to customize:
- Scanline density and opacity
- Screen jitter intensity
- Blur amount and transition speed
- Spooky effect timing and behavior

## 🔧 Available Scripts

```bash
npm run dev          # Start Vite dev server
npm run build        # TypeScript compilation + Vite build
npm run preview      # Preview production build locally
npm run test         # Run all tests once
npm run test:watch   # Run tests in watch mode
npm run test:ui      # Run tests with Vitest UI
npm run test:a11y    # Run accessibility tests only
npm run lint         # Run ESLint
```

## 🌐 Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Opera 76+

**Note:** Web Speech API support varies by browser. Narrator functionality requires a browser with speech synthesis support.

## 📝 License

This project is open source and available under the MIT License.

## 🎃 Credits

Horror stories sourced from:
- Creepypasta Archive
- r/NoSleep
- r/LetsNotMeet
- Various horror fiction communities

Audio assets are royalty-free or used under appropriate licenses.

## 🐛 Known Issues

- Audio may not play until user interacts with the page (browser autoplay policy)
- Some browsers may not support all Web Speech API voices
- Performance may vary on older devices with many visual effects active
- Narrator is enabled by default - disable in settings if you prefer silent reading

## 🤝 Contributing

Contributions are welcome! Feel free to:
- Add new horror stories
- Improve visual effects
- Enhance audio system
- Fix bugs
- Improve accessibility

---

*"The darkness calls to you... Will you answer?"* 👻
