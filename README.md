# The Enchanted Forest

A guided introspection and wisdom app with a mystical, nature-inspired aesthetic. The app presents 10 chapters of life guidance through forest metaphors, encouraging users to trust their inner compass.

## Features

- **Forest Map Navigation** - Interactive winding path map with chapter nodes connected by a glowing SVG trail, replacing the traditional list view. Each chapter appears as a circular landmark with thumbnail, Roman numeral, and title
- **10 Chapters of Wisdom** - Each chapter uses a forest metaphor (The Road, The Magic Well, The Magic Lake, etc.) to guide users through life's journey
- **Full-screen immersive chapter images** - 8 of 10 chapters have beautiful full-screen background images
- **Swipeable chapter viewer** - Swipe left/right between chapters without closing the modal. Includes page indicator dots and chapter counter
- **Ambient forest sounds** - Mystical forest ambience plays automatically when reading chapters and fades out smoothly when closing
- **Enchanted animations** - Floating particles, glowing orbs, pulsing node halos, sparkle decorations, and spring-based interactions using React Native Reanimated
- **Haptic feedback** - Tactile feedback when tapping cards and swiping between chapters
- **Dark forest theme** - Deep green color palette with emerald accents and mystical glowing effects

## Tech Stack

- Expo SDK 53 with React Native
- React Native Reanimated for animations
- expo-av for ambient audio
- NativeWind (Tailwind CSS) for styling
- Lucide icons
- Expo Router for navigation

## Project Structure

- `mobile/` - Expo React Native app (port 8081)
- `backend/` - Hono API server (port 3000)
- `mobile/src/app/(tabs)/index.tsx` - Main screen with hero section, forest map, and swipeable chapter viewer modal
- `mobile/src/components/ForestMap.tsx` - Interactive forest map with winding SVG path and chapter nodes
- `mobile/src/data/enchanted-messages.ts` - Chapter content and image references
- `mobile/src/hooks/useAmbientSound.ts` - Ambient sound management hook
- `mobile/assets/images/` - Chapter and cover images
- `mobile/assets/audio/` - Forest ambience audio
