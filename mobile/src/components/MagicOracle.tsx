import { useEffect, useState, useCallback } from 'react';
import { View, Text, Pressable, Modal, Dimensions } from 'react-native';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import Animated, {
  FadeIn,
  FadeOut,
  ZoomIn,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
  withSpring,
  withDelay,
  Easing,
} from 'react-native-reanimated';
import Svg, {
  Defs,
  RadialGradient,
  LinearGradient as SvgLinearGradient,
  Stop,
  Ellipse,
  Path,
  Circle,
} from 'react-native-svg';
import { X, Sparkles, Lock } from 'lucide-react-native';
import { oracleMessages } from '@/data/oracle-messages';
import { useAmbientSound } from '@/hooks/useAmbientSound';
import useAudioStore from '@/lib/state/audio-store';
import usePurchaseStore from '@/lib/state/purchase-store';
import { AudioControlButton } from '@/components/AudioControlButton';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// ---------------------------------------------------------------------------
// Crystal bowl SVG — a glowing, mystical chalice with a luminous orb inside
// ---------------------------------------------------------------------------
function CrystalBowlGraphic({ size = 88 }: { size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 100 100">
      <Defs>
        <RadialGradient id="orbGlow" cx="50%" cy="42%" rx="32%" ry="32%">
          <Stop offset="0%" stopColor="#e6ffd9" stopOpacity="1" />
          <Stop offset="40%" stopColor="#a8e89a" stopOpacity="0.95" />
          <Stop offset="100%" stopColor="#2d8a4f" stopOpacity="0.2" />
        </RadialGradient>
        <SvgLinearGradient id="bowlFill" x1="0%" y1="0%" x2="0%" y2="100%">
          <Stop offset="0%" stopColor="#9bd9b0" stopOpacity="0.55" />
          <Stop offset="50%" stopColor="#2a6b48" stopOpacity="0.85" />
          <Stop offset="100%" stopColor="#0d2a1a" stopOpacity="1" />
        </SvgLinearGradient>
        <SvgLinearGradient id="bowlRim" x1="0%" y1="0%" x2="0%" y2="100%">
          <Stop offset="0%" stopColor="#f4e9a8" stopOpacity="1" />
          <Stop offset="100%" stopColor="#b8954a" stopOpacity="1" />
        </SvgLinearGradient>
        <RadialGradient id="bowlHighlight" cx="32%" cy="65%" rx="22%" ry="14%">
          <Stop offset="0%" stopColor="#ffffff" stopOpacity="0.6" />
          <Stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
        </RadialGradient>
      </Defs>

      {/* Bowl body — a half-ellipse */}
      <Path
        d="M 14 48 Q 14 86 50 88 Q 86 86 86 48 Z"
        fill="url(#bowlFill)"
        stroke="rgba(244, 233, 168, 0.55)"
        strokeWidth={1.2}
      />

      {/* Inner highlight on the bowl */}
      <Path
        d="M 14 48 Q 14 86 50 88 Q 86 86 86 48 Z"
        fill="url(#bowlHighlight)"
      />

      {/* Gold rim */}
      <Ellipse
        cx={50}
        cy={48}
        rx={36}
        ry={6}
        fill="url(#bowlRim)"
        stroke="rgba(255, 248, 200, 0.9)"
        strokeWidth={0.8}
      />

      {/* Inner liquid surface (slightly recessed) */}
      <Ellipse
        cx={50}
        cy={49}
        rx={32}
        ry={4.2}
        fill="rgba(20, 50, 30, 0.85)"
      />

      {/* Glowing orb floating inside */}
      <Circle cx={50} cy={42} r={14} fill="url(#orbGlow)" />
      <Circle cx={46} cy={38} r={3.2} fill="rgba(255,255,255,0.85)" />

      {/* Decorative gold dots on rim */}
      <Circle cx={18} cy={48} r={1.6} fill="#f4e9a8" />
      <Circle cx={50} cy={42.5} r={1.2} fill="#f4e9a8" opacity={0.6} />
      <Circle cx={82} cy={48} r={1.6} fill="#f4e9a8" />
    </Svg>
  );
}

// ---------------------------------------------------------------------------
// Floating particle inside the overlay
// ---------------------------------------------------------------------------
function OracleParticle({
  delay,
  left,
  size,
  duration,
  color = '#cfeac0',
  glow = '#a8e89a',
}: {
  delay: number;
  left: number;
  size: number;
  duration: number;
  color?: string;
  glow?: string;
}) {
  const translateY = useSharedValue(0);
  const translateX = useSharedValue(0);
  const opacity = useSharedValue(0);

  useEffect(() => {
    translateY.value = withDelay(
      delay,
      withRepeat(
        withSequence(
          withTiming(-SCREEN_HEIGHT * 0.6, {
            duration,
            easing: Easing.inOut(Easing.ease),
          }),
          withTiming(0, { duration: 0 })
        ),
        -1
      )
    );
    // Gentle horizontal drift — gives fireflies a meandering path
    translateX.value = withDelay(
      delay,
      withRepeat(
        withSequence(
          withTiming(12, { duration: duration * 0.5, easing: Easing.inOut(Easing.ease) }),
          withTiming(-12, { duration: duration * 0.5, easing: Easing.inOut(Easing.ease) })
        ),
        -1,
        true
      )
    );
    // Firefly flicker — slow pulse instead of a single fade
    opacity.value = withDelay(
      delay,
      withRepeat(
        withSequence(
          withTiming(0.85, { duration: duration * 0.15 }),
          withTiming(0.25, { duration: duration * 0.25 }),
          withTiming(0.7, { duration: duration * 0.25 }),
          withTiming(0.2, { duration: duration * 0.2 }),
          withTiming(0, { duration: duration * 0.15 })
        ),
        -1
      )
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }, { translateX: translateX.value }],
    opacity: opacity.value,
  }));

  return (
    <Animated.View
      pointerEvents="none"
      style={[
        {
          position: 'absolute',
          bottom: -20,
          left,
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: color,
          shadowColor: glow,
          shadowOffset: { width: 0, height: 0 },
          shadowOpacity: 1,
          shadowRadius: 8,
        },
        animatedStyle,
      ]}
    />
  );
}

// ---------------------------------------------------------------------------
// Crystal bowl button — pulsing glow, tap to open the oracle overlay
// ---------------------------------------------------------------------------
export function CrystalBowlButton({ onPress }: { onPress: () => void }) {
  const glow = useSharedValue(0.4);
  const bowlScale = useSharedValue(1);
  const orbOpacity = useSharedValue(0.7);

  useEffect(() => {
    glow.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 2200, easing: Easing.inOut(Easing.ease) }),
        withTiming(0.35, { duration: 2200, easing: Easing.inOut(Easing.ease) })
      ),
      -1,
      true
    );
    bowlScale.value = withRepeat(
      withSequence(
        withTiming(1.04, { duration: 2200, easing: Easing.inOut(Easing.ease) }),
        withTiming(1, { duration: 2200, easing: Easing.inOut(Easing.ease) })
      ),
      -1,
      true
    );
    orbOpacity.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 1600, easing: Easing.inOut(Easing.ease) }),
        withTiming(0.55, { duration: 1600, easing: Easing.inOut(Easing.ease) })
      ),
      -1,
      true
    );
  }, []);

  const glowStyle = useAnimatedStyle(() => ({
    opacity: glow.value,
    transform: [{ scale: 0.9 + glow.value * 0.25 }],
  }));

  const bowlStyle = useAnimatedStyle(() => ({
    transform: [{ scale: bowlScale.value }],
  }));

  const orbStyle = useAnimatedStyle(() => ({
    opacity: orbOpacity.value,
  }));

  const press = useSharedValue(1);
  const pressStyle = useAnimatedStyle(() => ({
    transform: [{ scale: press.value }],
  }));

  const handlePressIn = () => {
    press.value = withSpring(0.92, { damping: 14, stiffness: 220 });
  };
  const handlePressOut = () => {
    press.value = withSpring(1, { damping: 14, stiffness: 220 });
  };
  const handlePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    onPress();
  };

  const BOWL_SIZE = 88;

  return (
    <Animated.View style={[{ alignItems: 'center' }, pressStyle]}>
      <Pressable
        onPress={handlePress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        accessibilityRole="button"
        accessibilityLabel="Consult the Magic Oracle"
        style={{ alignItems: 'center', padding: 12 }}
      >
        {/* Outer pulsing halo */}
        <Animated.View
          style={[
            {
              position: 'absolute',
              top: -22,
              width: BOWL_SIZE + 88,
              height: BOWL_SIZE + 88,
              borderRadius: (BOWL_SIZE + 88) / 2,
              backgroundColor: 'rgba(168, 232, 154, 0.22)',
              shadowColor: '#a8e89a',
              shadowOffset: { width: 0, height: 0 },
              shadowOpacity: 1,
              shadowRadius: 30,
            },
            glowStyle,
          ]}
        />
        {/* Inner steady glow */}
        <View
          style={{
            position: 'absolute',
            top: 0,
            width: BOWL_SIZE + 40,
            height: BOWL_SIZE + 40,
            borderRadius: (BOWL_SIZE + 40) / 2,
            backgroundColor: 'rgba(244, 233, 168, 0.10)',
          }}
        />
        {/* Bowl graphic with subtle scale pulse */}
        <Animated.View style={bowlStyle}>
          <CrystalBowlGraphic size={BOWL_SIZE} />
        </Animated.View>

        {/* Tiny orb shimmer overlay */}
        <Animated.View
          pointerEvents="none"
          style={[
            {
              position: 'absolute',
              top: 24,
              width: 30,
              height: 30,
              borderRadius: 15,
              backgroundColor: 'rgba(230, 255, 217, 0.35)',
              shadowColor: '#e6ffd9',
              shadowOffset: { width: 0, height: 0 },
              shadowOpacity: 1,
              shadowRadius: 14,
            },
            orbStyle,
          ]}
        />

        <Text
          style={{
            marginTop: 8,
            color: '#e6d49a',
            fontSize: 13,
            fontFamily: 'YesevaOne_400Regular',
            letterSpacing: 3,
            textTransform: 'uppercase',
            textShadowColor: 'rgba(244, 233, 168, 0.7)',
            textShadowOffset: { width: 0, height: 0 },
            textShadowRadius: 8,
          }}
        >
          Magic Oracle
        </Text>
        <Text
          style={{
            marginTop: 2,
            color: 'rgba(200, 230, 200, 0.7)',
            fontSize: 12,
            fontFamily: 'YesevaOne_400Regular',
            fontStyle: 'italic',
            letterSpacing: 0.5,
          }}
        >
          Tap to ask the forest
        </Text>
      </Pressable>
    </Animated.View>
  );
}

// ---------------------------------------------------------------------------
// Pick a random message different from the previous one (if possible)
// ---------------------------------------------------------------------------
function pickRandomMessage(previous: string | null): string {
  if (oracleMessages.length === 0) return '';
  if (oracleMessages.length === 1) return oracleMessages[0];
  let next = oracleMessages[Math.floor(Math.random() * oracleMessages.length)];
  let safety = 0;
  while (next === previous && safety < 8) {
    next = oracleMessages[Math.floor(Math.random() * oracleMessages.length)];
    safety++;
  }
  return next;
}

// ---------------------------------------------------------------------------
// Full-screen overlay shown when the bowl is tapped
// ---------------------------------------------------------------------------
export function MagicOracleOverlay({
  visible,
  onClose,
  onRequestUnlock,
}: {
  visible: boolean;
  onClose: () => void;
  onRequestUnlock: () => void;
}) {
  const [message, setMessage] = useState<string>('');
  const [revealKey, setRevealKey] = useState<number>(0);
  const [lockedView, setLockedView] = useState<boolean>(false);

  // Ambient music — plays while the Oracle is visible, respects global mute state
  const isMuted = useAudioStore((s) => s.isMuted);
  useAmbientSound(visible, isMuted);

  useEffect(() => {
    if (visible) {
      const state = usePurchaseStore.getState();
      const unlocked = state.isUnlocked;
      if (unlocked || !state.hasUsedFreeOracle) {
        setLockedView(false);
        setMessage(pickRandomMessage(null));
        setRevealKey((k) => k + 1);
        if (!unlocked) {
          state.setHasUsedFreeOracle(true);
        }
      } else {
        setLockedView(true);
      }
    }
  }, [visible]);

  const orbPulse = useSharedValue(0.6);
  useEffect(() => {
    orbPulse.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 2400, easing: Easing.inOut(Easing.ease) }),
        withTiming(0.5, { duration: 2400, easing: Easing.inOut(Easing.ease) })
      ),
      -1,
      true
    );
  }, []);

  const orbStyle = useAnimatedStyle(() => ({
    opacity: orbPulse.value,
    transform: [{ scale: 0.95 + orbPulse.value * 0.1 }],
  }));

  const handleAskAgain = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    const state = usePurchaseStore.getState();
    if (state.isUnlocked) {
      setMessage((prev) => pickRandomMessage(prev));
      setRevealKey((k) => k + 1);
    } else {
      setLockedView(true);
    }
  }, []);

  const handleUnlockPress = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    onRequestUnlock();
  }, [onRequestUnlock]);

  const handleClose = useCallback(() => {
    Haptics.selectionAsync();
    onClose();
  }, [onClose]);

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={handleClose}
      statusBarTranslucent
    >
      <View
        style={{
          flex: 1,
          backgroundColor: '#020806',
        }}
      >
        {/* Enchanted forest backdrop — same image as the welcome screen */}
        <Image
          source={require('@/../assets/images/enchanted-forest-cover.png')}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: SCREEN_WIDTH,
            height: SCREEN_HEIGHT,
          }}
          contentFit="cover"
        />

        {/* Mysterious moonlight overlay — deep greens and cool shadow, no warm sun */}
        <LinearGradient
          colors={[
            'rgba(2, 14, 18, 0.72)',
            'rgba(4, 24, 20, 0.68)',
            'rgba(2, 14, 12, 0.85)',
            'rgba(0, 6, 6, 0.96)',
          ]}
          locations={[0, 0.4, 0.75, 1]}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
          }}
        />

        {/* Cool blue-green wash to push the scene from "day" toward "midnight" */}
        <LinearGradient
          colors={['rgba(20, 60, 70, 0.18)', 'rgba(10, 40, 38, 0.12)', 'rgba(2, 10, 12, 0.4)']}
          locations={[0, 0.5, 1]}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
          }}
        />

        {/* Moon + filtered moonlight shafts */}
        <Svg
          width={SCREEN_WIDTH}
          height={SCREEN_HEIGHT}
          style={{ position: 'absolute', top: 0, left: 0 }}
          pointerEvents="none"
        >
          <Defs>
            <RadialGradient id="moon" cx="50%" cy="50%" rx="50%" ry="50%">
              <Stop offset="0%" stopColor="#dcecdc" stopOpacity="0.55" />
              <Stop offset="45%" stopColor="#9cb8b0" stopOpacity="0.20" />
              <Stop offset="100%" stopColor="#000000" stopOpacity="0" />
            </RadialGradient>
            <RadialGradient id="canopyLight" cx="50%" cy="50%" rx="50%" ry="50%">
              <Stop offset="0%" stopColor="#c4dcc8" stopOpacity="0.22" />
              <Stop offset="100%" stopColor="#000000" stopOpacity="0" />
            </RadialGradient>
            <SvgLinearGradient id="forestFloor" x1="0%" y1="0%" x2="0%" y2="100%">
              <Stop offset="0%" stopColor="#000000" stopOpacity="0" />
              <Stop offset="100%" stopColor="#000000" stopOpacity="0.92" />
            </SvgLinearGradient>
          </Defs>

          {/* Soft moon high in the sky */}
          <Circle cx={SCREEN_WIDTH * 0.72} cy={SCREEN_HEIGHT * 0.13} r={180} fill="url(#moon)" />
          <Circle cx={SCREEN_WIDTH * 0.72} cy={SCREEN_HEIGHT * 0.13} r={32} fill="rgba(220,235,220,0.4)" />
          <Circle cx={SCREEN_WIDTH * 0.72} cy={SCREEN_HEIGHT * 0.13} r={18} fill="rgba(240,250,235,0.85)" />

          {/* Moonlight filtering through the canopy */}
          <Circle cx={SCREEN_WIDTH * 0.22} cy={SCREEN_HEIGHT * 0.24} r={130} fill="url(#canopyLight)" />
          <Circle cx={SCREEN_WIDTH * 0.5} cy={SCREEN_HEIGHT * 0.34} r={110} fill="url(#canopyLight)" />
          <Circle cx={SCREEN_WIDTH * 0.82} cy={SCREEN_HEIGHT * 0.46} r={95} fill="url(#canopyLight)" />

          {/* Deeper forest floor shadow */}
          <Path
            d={`M 0 ${SCREEN_HEIGHT * 0.65} L ${SCREEN_WIDTH} ${SCREEN_HEIGHT * 0.65} L ${SCREEN_WIDTH} ${SCREEN_HEIGHT} L 0 ${SCREEN_HEIGHT} Z`}
            fill="url(#forestFloor)"
          />
        </Svg>

        {/* Fireflies drifting upward — mixed warm amber and cool moonlit green */}
        <OracleParticle delay={0} left={SCREEN_WIDTH * 0.06} size={3} duration={11000} color="#f4e9a8" glow="#f4e9a8" />
        <OracleParticle delay={900} left={SCREEN_WIDTH * 0.14} size={2.5} duration={13500} />
        <OracleParticle delay={2100} left={SCREEN_WIDTH * 0.22} size={3.5} duration={9500} color="#fff2c0" glow="#f4e9a8" />
        <OracleParticle delay={600} left={SCREEN_WIDTH * 0.32} size={2} duration={12500} />
        <OracleParticle delay={1700} left={SCREEN_WIDTH * 0.40} size={3} duration={10500} color="#f4e9a8" glow="#f4e9a8" />
        <OracleParticle delay={2600} left={SCREEN_WIDTH * 0.48} size={2.5} duration={14000} />
        <OracleParticle delay={300} left={SCREEN_WIDTH * 0.56} size={3.5} duration={11500} color="#fff2c0" glow="#f4e9a8" />
        <OracleParticle delay={1500} left={SCREEN_WIDTH * 0.64} size={2} duration={13000} />
        <OracleParticle delay={2300} left={SCREEN_WIDTH * 0.72} size={3} duration={10000} color="#f4e9a8" glow="#f4e9a8" />
        <OracleParticle delay={800} left={SCREEN_WIDTH * 0.80} size={2.5} duration={12500} />
        <OracleParticle delay={2900} left={SCREEN_WIDTH * 0.88} size={3.5} duration={11000} color="#fff2c0" glow="#f4e9a8" />
        <OracleParticle delay={1200} left={SCREEN_WIDTH * 0.94} size={2} duration={13500} />

        {/* Top vignette — deepens the sky and frames the oracle */}
        <LinearGradient
          colors={['rgba(0,0,0,0.85)', 'rgba(0,0,0,0.35)', 'transparent']}
          locations={[0, 0.5, 1]}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: 240,
          }}
        />

        {/* Bottom vignette — settles the floor in sacred darkness */}
        <LinearGradient
          colors={['transparent', 'rgba(0,0,0,0.65)']}
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: 200,
          }}
        />

        {/* Volume / mute toggle */}
        <View
          style={{
            position: 'absolute',
            top: 58,
            right: 74,
            zIndex: 10,
          }}
        >
          <AudioControlButton inline />
        </View>

        {/* Close button */}
        <Pressable
          onPress={handleClose}
          accessibilityLabel="Close oracle"
          style={({ pressed }) => ({
            position: 'absolute',
            top: 56,
            right: 20,
            width: 44,
            height: 44,
            borderRadius: 22,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: pressed ? 'rgba(168, 212, 120, 0.25)' : 'rgba(10, 25, 16, 0.7)',
            borderWidth: 1,
            borderColor: 'rgba(168, 212, 120, 0.4)',
            zIndex: 10,
          })}
        >
          <X size={22} color="#d6e6c8" />
        </Pressable>

        {/* Content */}
        <View
          style={{
            flex: 1,
            paddingHorizontal: 28,
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 5,
          }}
        >
          {lockedView ? (
            <>
              {/* Locked crystal bowl with overlaid lock icon */}
              <Animated.View
                key={`oracle-lock-${revealKey}`}
                entering={ZoomIn.duration(700).springify()}
                style={[
                  {
                    width: 140,
                    height: 140,
                    borderRadius: 70,
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: 'rgba(168, 232, 154, 0.10)',
                    marginBottom: 32,
                    borderWidth: 1.5,
                    borderColor: 'rgba(244, 233, 168, 0.55)',
                    shadowColor: '#a8e89a',
                    shadowOffset: { width: 0, height: 0 },
                    shadowOpacity: 1,
                    shadowRadius: 24,
                  },
                  orbStyle,
                ]}
              >
                <View style={{ opacity: 0.55 }}>
                  <CrystalBowlGraphic size={120} />
                </View>
                <View
                  style={{
                    position: 'absolute',
                    width: 64,
                    height: 64,
                    borderRadius: 32,
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: 'rgba(10, 25, 16, 0.72)',
                    borderWidth: 1,
                    borderColor: 'rgba(244, 233, 168, 0.6)',
                  }}
                >
                  <Lock size={30} color="#f4e9a8" />
                </View>
              </Animated.View>

              {/* Decorative top sparkles row */}
              <Animated.View
                entering={FadeIn.delay(150).duration(600)}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  marginBottom: 22,
                }}
              >
                <View
                  style={{
                    height: 1,
                    width: 40,
                    backgroundColor: 'rgba(244, 233, 168, 0.5)',
                  }}
                />
                <Sparkles
                  size={16}
                  color="#f4e9a8"
                  fill="rgba(244, 233, 168, 0.4)"
                  style={{ marginHorizontal: 10 }}
                />
                <Text
                  style={{
                    color: '#e6d49a',
                    fontSize: 11,
                    letterSpacing: 4,
                    fontFamily: 'serif',
                    textTransform: 'uppercase',
                  }}
                >
                  The Oracle Rests
                </Text>
                <Sparkles
                  size={16}
                  color="#f4e9a8"
                  fill="rgba(244, 233, 168, 0.4)"
                  style={{ marginHorizontal: 10 }}
                />
                <View
                  style={{
                    height: 1,
                    width: 40,
                    backgroundColor: 'rgba(244, 233, 168, 0.5)',
                  }}
                />
              </Animated.View>

              {/* Lock message */}
              <Animated.Text
                entering={FadeIn.delay(250).duration(700)}
                style={{
                  color: '#d4f0c8',
                  fontSize: 19,
                  lineHeight: 30,
                  fontFamily: 'serif',
                  fontStyle: 'italic',
                  textAlign: 'center',
                  letterSpacing: 0.3,
                  textShadowColor: 'rgba(168, 232, 154, 0.5)',
                  textShadowOffset: { width: 0, height: 0 },
                  textShadowRadius: 14,
                  paddingHorizontal: 8,
                }}
              >
                The forest has more secrets to share. Unlock unlimited oracle
                messages to continue your journey.
              </Animated.Text>

              {/* Decorative divider beneath the message */}
              <Animated.View
                entering={FadeIn.delay(400).duration(600)}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  marginTop: 28,
                }}
              >
                <View style={{ height: 1, width: 60, backgroundColor: 'rgba(168, 212, 120, 0.4)' }} />
                <View
                  style={{
                    width: 6,
                    height: 6,
                    borderRadius: 3,
                    marginHorizontal: 10,
                    backgroundColor: '#f4e9a8',
                    shadowColor: '#f4e9a8',
                    shadowOffset: { width: 0, height: 0 },
                    shadowOpacity: 1,
                    shadowRadius: 8,
                  }}
                />
                <View style={{ height: 1, width: 60, backgroundColor: 'rgba(168, 212, 120, 0.4)' }} />
              </Animated.View>
            </>
          ) : (
            <>
              {/* Crystal bowl above the message — same graphic as the menu button,
                  re-animates with every new message */}
              <Animated.View
                key={`oracle-bowl-${revealKey}`}
                entering={ZoomIn.duration(700).springify()}
                style={[
                  {
                    width: 140,
                    height: 140,
                    borderRadius: 70,
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: 'rgba(168, 232, 154, 0.12)',
                    marginBottom: 32,
                    shadowColor: '#a8e89a',
                    shadowOffset: { width: 0, height: 0 },
                    shadowOpacity: 1,
                    shadowRadius: 30,
                  },
                  orbStyle,
                ]}
              >
                <CrystalBowlGraphic size={120} />
              </Animated.View>

              {/* Decorative top sparkles row */}
              <Animated.View
                entering={FadeIn.delay(150).duration(600)}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  marginBottom: 18,
                }}
              >
                <View
                  style={{
                    height: 1,
                    width: 40,
                    backgroundColor: 'rgba(244, 233, 168, 0.5)',
                  }}
                />
                <Sparkles
                  size={16}
                  color="#f4e9a8"
                  fill="rgba(244, 233, 168, 0.4)"
                  style={{ marginHorizontal: 10 }}
                />
                <Text
                  style={{
                    color: '#e6d49a',
                    fontSize: 11,
                    letterSpacing: 4,
                    fontFamily: 'serif',
                    textTransform: 'uppercase',
                  }}
                >
                  The Oracle Speaks
                </Text>
                <Sparkles
                  size={16}
                  color="#f4e9a8"
                  fill="rgba(244, 233, 168, 0.4)"
                  style={{ marginHorizontal: 10 }}
                />
                <View
                  style={{
                    height: 1,
                    width: 40,
                    backgroundColor: 'rgba(244, 233, 168, 0.5)',
                  }}
                />
              </Animated.View>

              {/* The message itself — re-enters on every reveal */}
              <Animated.Text
                key={`oracle-msg-${revealKey}`}
                entering={ZoomIn.duration(700).springify()}
                exiting={FadeOut.duration(200)}
                style={{
                  color: '#d4f0c8',
                  fontSize: 28,
                  lineHeight: 38,
                  fontFamily: 'serif',
                  fontStyle: 'italic',
                  textAlign: 'center',
                  letterSpacing: 0.4,
                  textShadowColor: 'rgba(168, 232, 154, 0.55)',
                  textShadowOffset: { width: 0, height: 0 },
                  textShadowRadius: 14,
                  paddingHorizontal: 24,
                  maxWidth: SCREEN_WIDTH * 0.85,
                  marginLeft: 'auto',
                  marginRight: 'auto',
                  flexWrap: 'wrap',
                }}
              >
                “{message}”
              </Animated.Text>

              {/* Decorative divider beneath the message */}
              <Animated.View
                entering={FadeIn.delay(300).duration(600)}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  marginTop: 28,
                }}
              >
                <View style={{ height: 1, width: 60, backgroundColor: 'rgba(168, 212, 120, 0.4)' }} />
                <View
                  style={{
                    width: 6,
                    height: 6,
                    borderRadius: 3,
                    marginHorizontal: 10,
                    backgroundColor: '#f4e9a8',
                    shadowColor: '#f4e9a8',
                    shadowOffset: { width: 0, height: 0 },
                    shadowOpacity: 1,
                    shadowRadius: 8,
                  }}
                />
                <View style={{ height: 1, width: 60, backgroundColor: 'rgba(168, 212, 120, 0.4)' }} />
              </Animated.View>
            </>
          )}
        </View>

        {/* Bottom action buttons — anchored near the bottom */}
        <View
          style={{
            position: 'absolute',
            bottom: 60,
            left: 0,
            right: 0,
            alignItems: 'center',
            zIndex: 10,
          }}
        >
          {/* Back to Your Path button */}
          <Animated.View
            entering={FadeIn.delay(200).duration(600)}
            style={{
              shadowColor: '#a8d478',
              shadowOffset: { width: 0, height: 0 },
              shadowOpacity: 0.5,
              shadowRadius: 18,
              marginBottom: 14,
            }}
          >
            <View
              style={{
                borderRadius: 32,
                borderWidth: 1.5,
                borderColor: 'rgba(244, 233, 168, 0.8)',
                backgroundColor: 'rgba(20, 60, 35, 0.65)',
                overflow: 'hidden',
                minWidth: 200,
              }}
            >
              <Pressable
                onPress={handleClose}
                style={({ pressed }) => ({
                  display: 'flex',
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'center',
                  paddingVertical: 14,
                  paddingHorizontal: 28,
                  backgroundColor: pressed ? 'rgba(168, 212, 120, 0.28)' : 'transparent',
                })}
              >
                <Sparkles
                  size={14}
                  color="rgba(244, 233, 168, 0.9)"
                  fill="rgba(244, 233, 168, 0.4)"
                  style={{ marginRight: 10 }}
                />
                <Text
                  style={{
                    color: '#f4e9a8',
                    fontSize: 15,
                    fontFamily: 'serif',
                    fontWeight: '300',
                    letterSpacing: 1.5,
                    textAlign: 'center',
                    textShadowColor: 'rgba(244, 233, 168, 0.7)',
                    textShadowOffset: { width: 0, height: 0 },
                    textShadowRadius: 8,
                  }}
                >
                  Back to Your Path
                </Text>
                <Sparkles
                  size={14}
                  color="rgba(244, 233, 168, 0.9)"
                  fill="rgba(244, 233, 168, 0.4)"
                  style={{ marginLeft: 10 }}
                />
              </Pressable>
            </View>
          </Animated.View>

          {lockedView ? (
            /* Unlock Now button — primary CTA when oracle is locked */
            <Animated.View
              entering={FadeIn.delay(300).duration(600)}
              style={{
                shadowColor: '#50c878',
                shadowOffset: { width: 0, height: 0 },
                shadowOpacity: 0.8,
                shadowRadius: 20,
              }}
            >
              <View
                style={{
                  borderRadius: 32,
                  borderWidth: 1.5,
                  borderColor: 'rgba(244, 233, 168, 0.9)',
                  backgroundColor: '#50c878',
                  overflow: 'hidden',
                  minWidth: 220,
                }}
              >
                <Pressable
                  onPress={handleUnlockPress}
                  accessibilityRole="button"
                  accessibilityLabel="Unlock unlimited oracle messages"
                  style={({ pressed }) => ({
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'center',
                    paddingVertical: 14,
                    paddingHorizontal: 28,
                    backgroundColor: pressed ? '#3daa62' : 'transparent',
                  })}
                >
                  <Sparkles
                    size={14}
                    color="#0a1f0e"
                    fill="rgba(10, 31, 14, 0.6)"
                    style={{ marginRight: 10 }}
                  />
                  <Text
                    style={{
                      color: '#0a1f0e',
                      fontSize: 15,
                      fontFamily: 'serif',
                      fontWeight: '600',
                      letterSpacing: 1.5,
                      textAlign: 'center',
                    }}
                  >
                    Unlock Now
                  </Text>
                  <Sparkles
                    size={14}
                    color="#0a1f0e"
                    fill="rgba(10, 31, 14, 0.6)"
                    style={{ marginLeft: 10 }}
                  />
                </Pressable>
              </View>
            </Animated.View>
          ) : (
            /* Ask Again button */
            <Animated.View
              entering={FadeIn.delay(250).duration(600)}
              style={{
                shadowColor: '#a8d478',
                shadowOffset: { width: 0, height: 0 },
                shadowOpacity: 0.5,
                shadowRadius: 18,
              }}
            >
              <View
                style={{
                  borderRadius: 32,
                  borderWidth: 1.5,
                  borderColor: 'rgba(244, 233, 168, 0.8)',
                  backgroundColor: 'rgba(20, 60, 35, 0.65)',
                  overflow: 'hidden',
                  minWidth: 200,
                }}
              >
                <Pressable
                  onPress={handleAskAgain}
                  style={({ pressed }) => ({
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'center',
                    paddingVertical: 14,
                    paddingHorizontal: 28,
                    backgroundColor: pressed ? 'rgba(168, 212, 120, 0.28)' : 'transparent',
                  })}
                >
                  <Sparkles
                    size={14}
                    color="rgba(244, 233, 168, 0.9)"
                    fill="rgba(244, 233, 168, 0.4)"
                    style={{ marginRight: 10 }}
                  />
                  <Text
                    style={{
                      color: '#f4e9a8',
                      fontSize: 15,
                      fontFamily: 'serif',
                      fontWeight: '300',
                      letterSpacing: 1.5,
                      textAlign: 'center',
                      textShadowColor: 'rgba(244, 233, 168, 0.7)',
                      textShadowOffset: { width: 0, height: 0 },
                      textShadowRadius: 8,
                    }}
                  >
                    Ask Again
                  </Text>
                  <Sparkles
                    size={14}
                    color="rgba(244, 233, 168, 0.9)"
                    fill="rgba(244, 233, 168, 0.4)"
                    style={{ marginLeft: 10 }}
                  />
                </Pressable>
              </View>
            </Animated.View>
          )}
        </View>
      </View>
    </Modal>
  );
}
