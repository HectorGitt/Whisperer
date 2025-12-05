# Spooky Media Assets

This directory contains audio and visual assets for the Doom Scroll immersive experience.

## Directory Structure

```
media/
├── sounds/          # Audio effects (29 files)
│   ├── Abyss.mp3
│   ├── CrEEP.mp3
│   ├── Dark Rooms and Scary Things - isaiah658.mp3
│   ├── Scary Ambient Wind.mp3
│   ├── Scary-Monster.flac
│   ├── ghost_1.flac
│   ├── ghost_2.flac
│   ├── scaryhighpitchedghost.ogg
│   ├── Void Estate.ogg
│   ├── Void Estate [Haunted Arcade].ogg
│   ├── surrealization.mp3
│   ├── troll-roars.ogg
│   ├── troll-idle-noises.ogg
│   └── ... and more!
└── images/          # Visual assets (19 files)
    ├── transparent-gif-spider.gif (used for spider effect)
    ├── creepy-ghost-the-unholy.gif (used for ghost effect)
    ├── spider-3d.gif
    ├── half-life_scare.gif
    └── ... and more!
```

## Sound Effects Available ✅

All sound effects are already in place! The system uses:

### Ambient Sounds:
- **Abyss.mp3** - Dark, void-like ambience
- **CrEEP.mp3** - Creepy, unsettling atmosphere
- **Dark Rooms and Scary Things - isaiah658.mp3** - Indoor horror ambience
- **Scary Ambient Wind.mp3** - Howling wind effects
- **surrealization.mp3** - Surreal, bizarre atmosphere
- **Void Estate.ogg** - Abandoned mansion ambience
- **Void Estate [Haunted Arcade].ogg** - Retro horror arcade sounds

### Creature Sounds:
- **Scary-Monster.flac** - Monster/beast sounds
- **troll-roars.ogg** - Creature roars
- **troll-idle-noises.ogg** - Growls and snarls

### Supernatural Sounds:
- **ghost_1.flac** - Ghost presence
- **ghost_2.flac** - Ghostly whispers
- **scaryhighpitchedghost.ogg** - High-pitched screams

### Additional Effects:
- **silence_01.ogg, silence_02.ogg, silence_03.ogg** - Eerie silence
- **action_01.ogg, action_02.ogg** - Action sounds
- **amb_01.ogg, amb_02.ogg, amb_03.ogg** - Ambient variations

## Visual Assets Available ✅

All visual effects are ready to use!

### Active Effects:
- **transparent-gif-spider.gif** - Used for crawling spider animation
- **creepy-ghost-the-unholy.gif** - Used for floating ghost animation

### Additional Spooky GIFs:
- **spider-3d.gif** - Alternative spider animation
- **half-life_scare.gif** - Jump scare effect
- **scary-rooms-low-detailed.gif** - Room ambience
- **one-piece-scary-moments.gif** - Horror moments
- **kuchisake-0nna-nexbot_scare.gif** - Scare effect
- **darkness-takeover-stewie-griffin-monster-pibby.gif** - Monster effect
- And many more!

## Usage

The sound system automatically:
1. Analyzes article text for keywords
2. Plays relevant sounds when keywords are detected
3. Manages volume and playback
4. Respects user accessibility preferences

Visual effects:
1. Randomly appear every 30-90 seconds
2. Animate across the screen
3. Respect reduced motion preferences
4. Use GPU-accelerated CSS animations

## License Compliance

When downloading assets, ensure you:
- Check the license terms
- Attribute creators if required
- Use only royalty-free or Creative Commons content
- Keep a record of sources for attribution

## Performance Notes

- Sounds are preloaded for smooth playback
- Images use `will-change` CSS for GPU acceleration
- All animations respect `prefers-reduced-motion`
- Audio volume defaults to 30% to avoid startling users
