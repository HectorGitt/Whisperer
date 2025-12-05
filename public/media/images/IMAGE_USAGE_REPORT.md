# Image Usage Report

## Images Currently Used in Code

### ✅ Used Images (4 files)

1. **transparent-gif-spider.gif**
   - Used in: `src/components/CrawlingSpider.tsx`
   - Purpose: Animated spider that crawls across the screen
   - Status: ✅ Active

2. **creepy-ghost-the-unholy.gif**
   - Used in: `src/components/FloatingGhost.tsx`
   - Purpose: Floating ghost effect
   - Status: ✅ Active

3. **half-life_scare.gif**
   - Used in: `src/components/JumpScare.tsx`
   - Purpose: Jump scare effect (default image)
   - Status: ✅ Active

4. **darkness-takeover-stewie-griffin-monster-pibby.gif**
   - Used in: `src/components/ShadowFigure.tsx`
   - Purpose: Shadow figure that appears at screen edges
   - Status: ✅ Active

## Unused Images (15 files)

### ❌ Not Currently Referenced in Code

1. **carve-a-pumpkin-michael-myers.gif**
   - Status: ❌ Unused
   - Potential use: Could be used for Halloween-themed jump scares or decorations

2. **colin-raff-grotesque (1).gif**
   - Status: ❌ Unused
   - Potential use: Alternative jump scare or background effect

3. **colin-raff-grotesque (2).gif**
   - Status: ❌ Unused
   - Potential use: Alternative jump scare or background effect

4. **colin-raff-grotesque.gif**
   - Status: ❌ Unused
   - Potential use: Alternative jump scare or background effect

5. **dm4uz3-foekoe.gif**
   - Status: ❌ Unused
   - Potential use: Additional spooky effect

6. **ibtrav-ibtrav-artworks.gif**
   - Status: ❌ Unused
   - Potential use: Additional spooky effect

7. **kuchisake-0nna-nexbot_scare.gif**
   - Status: ❌ Unused
   - Potential use: Alternative jump scare

8. **man_with_knife_dancing.gif**
   - Status: ❌ Unused
   - Potential use: Alternative spooky effect or jump scare

9. **one-piece-scary-moments.gif**
   - Status: ❌ Unused
   - Potential use: Alternative jump scare

10. **react.svg**
    - Status: ❌ Unused
    - Note: Default Vite template file, not spooky-themed

11. **scary-rooms-low-detailed.gif**
    - Status: ❌ Unused
    - Potential use: Background effect or ambient animation

12. **spider-3d.gif**
    - Status: ❌ Unused
    - Potential use: Alternative spider animation (currently using transparent-gif-spider.gif)

13. **spruki.gif**
    - Status: ❌ Unused
    - Potential use: Additional spooky effect

14. **vite.svg**
    - Status: ❌ Unused
    - Note: Default Vite template file, not spooky-themed

15. **wtf-angry.gif**
    - Status: ❌ Unused
    - Potential use: Alternative spooky effect

## Summary

- **Total Images**: 19 files
- **Used**: 4 files (21%)
- **Unused**: 15 files (79%)

## Recommendations

### Option 1: Keep Unused Images
**Pros:**
- Available for future features
- Variety for randomized effects
- Can be used for A/B testing different spooky effects

**Cons:**
- Increases bundle size
- Unused assets clutter the project

### Option 2: Remove Unused Images
**Pros:**
- Cleaner project structure
- Smaller repository size
- Easier to maintain

**Cons:**
- Need to re-add if features are expanded
- Lose variety options

### Option 3: Implement Random Selection
Could enhance existing components to randomly select from multiple images:

```typescript
// Example: Random jump scare images
const jumpScareImages = [
  '/media/images/half-life_scare.gif',
  '/media/images/kuchisake-0nna-nexbot_scare.gif',
  '/media/images/one-piece-scary-moments.gif',
  '/media/images/man_with_knife_dancing.gif',
];

const randomImage = jumpScareImages[Math.floor(Math.random() * jumpScareImages.length)];
```

### Recommended Action

**Keep the unused images** for now because:
1. They provide variety for potential future enhancements
2. The project is themed around spooky content, so having a library of spooky images makes sense
3. They could be used to implement randomized effects for better replayability
4. The file sizes are reasonable (GIFs are already compressed)

However, consider:
- Removing `react.svg` and `vite.svg` as they're default template files not used in the spooky theme
- Implementing random image selection in components for more variety
