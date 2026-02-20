import { useEffect, useRef, useCallback } from 'react';
import { Audio } from 'expo-av';

const AMBIENT_SOUND_URI =
  'https://cdn.pixabay.com/audio/2022/01/18/audio_d0ef98b5d0.mp3';

const TARGET_VOLUME = 0.3;
const FADE_STEP = 0.05;
const FADE_INTERVAL_MS = 50;

/**
 * Manages an ambient forest sound that plays on loop.
 * - When `playing` is true, loads and plays the sound at moderate volume.
 * - When `playing` becomes false, fades volume to 0 then stops and unloads.
 * - Cleans up automatically on unmount.
 */
export function useAmbientSound(playing: boolean) {
  const soundRef = useRef<Audio.Sound | null>(null);
  const fadeIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const isMountedRef = useRef(true);
  const isLoadingRef = useRef(false);

  const clearFadeInterval = useCallback(() => {
    if (fadeIntervalRef.current !== null) {
      clearInterval(fadeIntervalRef.current);
      fadeIntervalRef.current = null;
    }
  }, []);

  const stopAndUnload = useCallback(async () => {
    clearFadeInterval();
    const sound = soundRef.current;
    if (sound) {
      soundRef.current = null;
      try {
        await sound.stopAsync();
      } catch {
        // Already stopped or unloaded
      }
      try {
        await sound.unloadAsync();
      } catch {
        // Already unloaded
      }
    }
  }, [clearFadeInterval]);

  const fadeOutAndStop = useCallback(() => {
    const sound = soundRef.current;
    if (!sound) return;

    clearFadeInterval();

    let currentVolume = TARGET_VOLUME;

    fadeIntervalRef.current = setInterval(async () => {
      currentVolume = Math.max(0, currentVolume - FADE_STEP);
      try {
        if (soundRef.current) {
          await soundRef.current.setVolumeAsync(currentVolume);
        }
      } catch {
        // Sound may have been unloaded during fade
      }

      if (currentVolume <= 0) {
        clearFadeInterval();
        await stopAndUnload();
      }
    }, FADE_INTERVAL_MS);
  }, [clearFadeInterval, stopAndUnload]);

  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  useEffect(() => {
    if (playing) {
      let cancelled = false;

      const startSound = async () => {
        // Prevent duplicate loading
        if (isLoadingRef.current || soundRef.current) return;
        isLoadingRef.current = true;

        try {
          await Audio.setAudioModeAsync({
            playsInSilentModeIOS: true,
            staysActiveInBackground: false,
            shouldDuckAndroid: true,
          });

          if (cancelled || !isMountedRef.current) {
            isLoadingRef.current = false;
            return;
          }

          const { sound } = await Audio.Sound.createAsync(
            { uri: AMBIENT_SOUND_URI },
            {
              isLooping: true,
              volume: TARGET_VOLUME,
              shouldPlay: true,
            }
          );

          if (cancelled || !isMountedRef.current) {
            // Component unmounted or playing toggled off during load
            try {
              await sound.stopAsync();
              await sound.unloadAsync();
            } catch {
              // Ignore
            }
            isLoadingRef.current = false;
            return;
          }

          soundRef.current = sound;
          isLoadingRef.current = false;
        } catch (error) {
          console.warn('[useAmbientSound] Failed to load ambient sound:', error);
          isLoadingRef.current = false;
        }
      };

      startSound();

      return () => {
        cancelled = true;
      };
    } else {
      // playing became false -- fade out
      fadeOutAndStop();
    }
  }, [playing, fadeOutAndStop]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      clearFadeInterval();
      const sound = soundRef.current;
      if (sound) {
        soundRef.current = null;
        sound.stopAsync().catch(() => {});
        sound.unloadAsync().catch(() => {});
      }
    };
  }, [clearFadeInterval]);
}
