# 🎙️ Spooky Narrator Feature

## Overview

Added an optional **Spooky Narrator** that uses the Web Speech API to provide creepy voice narration for your Doom Scroll experience!

## Features

### 🗣️ Text-to-Speech Narration
- **Creepy Voice**: Lower pitch (0.7) and slower rate (0.8) for maximum spookiness
- **Smart Voice Selection**: Automatically selects male/deep voices when available
- **Volume Control**: Set to 80% by default, adjustable
- **Browser Native**: Uses Web Speech API (no external dependencies!)

### 📖 What Gets Narrated

#### 1. **Article Titles** (Spooky Articles Only)
When you open a spooky article, the narrator introduces it with phrases like:
- "Now reading... [Article Title]"
- "Behold... [Article Title]"
- "Witness... [Article Title]"
- "Prepare yourself for... [Article Title]"
- "Enter the world of... [Article Title]"
- "Dare to read... [Article Title]"

#### 2. **Random Spooky Phrases**
When you enable the narrator, it greets you with random phrases:
- "Welcome... to the darkness..."
- "Are you afraid of what lurks in the shadows?"
- "The void is watching..."
- "Something wicked this way comes..."
- "Do you hear that? Listen closely..."
- "The darkness calls to you..."
- "There's no escape from the horror..."
- "Your fears are about to become real..."
- "The nightmare has only just begun..."
- "Can you feel it? The presence..."
- "They're coming for you..."
- "The dead don't rest here..."
- "Welcome to your doom..."
- "The terror never ends..."
- "Beware what you read..."

## How to Use

### Enable the Narrator

1. **Open Settings**: Click the settings button (⚙️) in the app
2. **Find "Spooky Narrator 🎙️"**: Look for the narrator toggle
3. **Enable**: Click the toggle to turn it on
4. **Listen**: The narrator will greet you with a spooky phrase!

### Disable the Narrator

1. Open Settings
2. Click the narrator toggle to turn it off
3. Any ongoing narration will stop immediately

## Technical Details

### Files Created

#### Core Narrator System:
- **`src/utils/Narrator.ts`**: Main narrator class with TTS functionality
  - Voice selection and configuration
  - Speech synthesis control
  - Random phrase generation
  - Article title narration

#### Context Provider:
- **`src/contexts/NarratorContext.tsx`**: React context for narrator state
  - Global narrator enable/disable
  - Persistent settings (localStorage)
  - Easy access via `useNarrator()` hook

### Integration Points

#### Settings Panel:
- Added narrator toggle in `SettingsPanel.tsx`
- Only shows if browser supports Web Speech API
- Saves preference to localStorage

#### Article View:
- Automatically narrates article titles for spooky articles
- 500ms delay to let page load first
- Only narrates when narrator is enabled

#### App.tsx:
- Wrapped with `NarratorProvider`
- Available throughout the app

## Browser Support

### Supported Browsers:
- ✅ Chrome/Edge (Excellent support)
- ✅ Safari (Good support)
- ✅ Firefox (Good support)
- ✅ Opera (Good support)

### Feature Detection:
The narrator toggle only appears if `window.speechSynthesis` is available.

## Configuration

### Voice Settings (in Narrator.ts):
```typescript
{
  rate: 0.8,    // Slower for creepy effect (0.1-10)
  pitch: 0.7,   // Lower pitch for creepy effect (0-2)
  volume: 0.8,  // 80% volume (0-1)
}
```

### Customization:
You can adjust these values in `src/utils/Narrator.ts`:
- **Rate**: Lower = slower, higher = faster
- **Pitch**: Lower = deeper voice, higher = higher voice
- **Volume**: 0 = silent, 1 = full volume

## API

### useNarrator Hook

```typescript
const {
  enabled,              // boolean: Is narrator enabled?
  setEnabled,           // (value: boolean) => void: Enable/disable
  speak,                // (text: string) => void: Speak any text
  stop,                 // () => void: Stop current narration
  narrateArticleTitle,  // (title: string) => void: Narrate with intro
  getRandomPhrase,      // () => string: Get random spooky phrase
  isSupported,          // boolean: Is TTS supported in browser?
} = useNarrator();
```

### Example Usage

```typescript
import { useNarrator } from '../contexts/NarratorContext';

function MyComponent() {
  const { speak, narrateArticleTitle } = useNarrator();
  
  // Speak custom text
  speak("Welcome to the darkness...");
  
  // Narrate an article title with intro
  narrateArticleTitle("The Haunted Mansion");
}
```

## Accessibility

### Features:
- ✅ **Optional**: Disabled by default, user must opt-in
- ✅ **Persistent**: Setting saved to localStorage
- ✅ **Stoppable**: Can be disabled at any time
- ✅ **Non-intrusive**: Only narrates spooky articles
- ✅ **Volume Control**: Adjustable volume (80% default)

### Considerations:
- Narrator respects user choice (opt-in)
- Can be stopped immediately via settings
- Only activates for spooky category articles
- Doesn't interfere with screen readers

## Performance

### Optimizations:
- ✅ Lazy voice loading
- ✅ Singleton pattern for narrator instance
- ✅ Automatic cleanup on disable
- ✅ No external dependencies
- ✅ Minimal memory footprint

### Resource Usage:
- **Memory**: ~1KB for narrator class
- **CPU**: Minimal (browser handles TTS)
- **Network**: None (uses browser's built-in voices)

## Testing

### To Test the Narrator:

1. **Enable it**:
   ```
   Open Settings → Enable "Spooky Narrator"
   ```

2. **Listen to greeting**:
   - Should hear a random spooky phrase

3. **Navigate to spooky article**:
   - Should hear article title narrated with intro

4. **Disable it**:
   - Narration should stop immediately

### Browser Console Testing:

```javascript
// Test if supported
console.log('TTS Supported:', 'speechSynthesis' in window);

// Get available voices
console.log('Voices:', speechSynthesis.getVoices());

// Test narration
const utterance = new SpeechSynthesisUtterance("Test");
utterance.rate = 0.8;
utterance.pitch = 0.7;
speechSynthesis.speak(utterance);
```

## Future Enhancements

### Possible Additions:
- [ ] Voice selection dropdown in settings
- [ ] Rate/pitch sliders for customization
- [ ] Narrate article content (not just title)
- [ ] Different voices for different categories
- [ ] Sound effects between phrases
- [ ] Multiple language support
- [ ] Custom phrase library

## Troubleshooting

### Narrator Not Appearing?
- Check if browser supports Web Speech API
- Try Chrome/Edge for best support

### No Sound?
- Check system volume
- Check browser permissions
- Try disabling and re-enabling

### Voice Sounds Wrong?
- Browser selects voice automatically
- Different browsers have different voices
- Can be customized in code

## Result

Your Doom Scroll now has an **optional spooky narrator** that:
- ✅ Uses creepy voice settings
- ✅ Narrates article titles
- ✅ Speaks random spooky phrases
- ✅ Fully optional (opt-in)
- ✅ Persistent settings
- ✅ Browser-native (no dependencies)
- ✅ Accessible and user-friendly

Perfect for adding an extra layer of immersion to your spooky reading experience! 🎃👻🎙️
