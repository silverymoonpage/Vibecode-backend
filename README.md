# The Enchanted Forest

A guided introspection and wisdom app with a mystical, nature-inspired aesthetic. The app presents 10 chapters of life guidance through forest metaphors, encouraging users to trust their inner compass.

## Features

- **10 Chapters of Wisdom** - Each chapter uses a forest metaphor (The Road, The Magic Well, The Magic Lake, etc.) to guide users through life's journey
- **Full-screen immersive chapter images** - 8 of 10 chapters have beautiful full-screen background images
- **Swipeable chapter viewer** - Swipe left/right between chapters without closing the modal. Includes page indicator dots and chapter counter
- **Ambient forest sounds** - Peaceful nature ambience plays automatically when reading chapters and fades out smoothly when closing
- **Enchanted animations** - Floating particles, glowing orbs, pulsing symbols, and spring-based card interactions using React Native Reanimated
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
- `mobile/src/app/(tabs)/index.tsx` - Main screen with chapter list and swipeable viewer modal
- `mobile/src/data/enchanted-messages.ts` - Chapter content and image references
- `mobile/src/hooks/useAmbientSound.ts` - Ambient sound management hook
- `mobile/assets/images/` - Chapter and cover images
