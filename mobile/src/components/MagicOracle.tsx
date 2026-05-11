import { useEffect, useState, useCallback } from 'react';
import { View, Text, Pressable, Modal, Dimensions } from 'react-native';
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
import { X, Sparkles } from 'lucide-react-native';
import { oracleMessages } from '@/data/oracle-messages';

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
}: {
  delay: number;
  left: number;
  size: number;
  duration: number;
}) {
  const translateY = useSharedValue(0);
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
    opacity.value = withDelay(
      delay,
      withRepeat(
        withSequence(
          withTiming(0.7, { duration: duration * 0.2 }),
          withTiming(0.3, { duration: duration * 0.6 }),
          withTiming(0, { duration: duration * 0.2 })
        ),
        -1
      )
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
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
          backgroundColor: '#cfeac0',
          shadowColor: '#a8e89a',
          shadowOffset: { width: 0, height: 0 },
          shadowOpacity: 1,
          shadowRadius: 6,
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
}: {
  visible: boolean;
  onClose: () => void;
}) {
  const [message, setMessage] = useState<string>('');
  const [revealKey, setRevealKey] = useState<number>(0);

  // Pick a fresh message every time the overlay opens
  useEffect(() => {
    if (visible) {
      setMessage(pickRandomMessage(null));
      setRevealKey((k) => k + 1);
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
    setMessage((prev) => pickRandomMessage(prev));
    setRevealKey((k) => k + 1);
  }, []);

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
        {/* Deep forest gradient base — near-black with green undertones */}
        <LinearGradient
          colors={['#02110a', '#04190f', '#020806', '#000000']}
          locations={[0, 0.4, 0.8, 1]}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
          }}
        />

        {/* Painted forest backdrop — silhouetted trees rendered in SVG */}
        <Svg
          width={SCREEN_WIDTH}
          height={SCREEN_HEIGHT}
          style={{ position: 'absolute', top: 0, left: 0 }}
        >
          <Defs>
            <RadialGradient id="moon" cx="50%" cy="50%" rx="50%" ry="50%">
              <Stop offset="0%" stopColor="#cfe8c0" stopOpacity="0.55" />
              <Stop offset="60%" stopColor="#5a8a6a" stopOpacity="0.18" />
              <Stop offset="100%" stopColor="#000000" stopOpacity="0" />
            </RadialGradient>
            <SvgLinearGradient id="forestFloor" x1="0%" y1="0%" x2="0%" y2="100%">
              <Stop offset="0%" stopColor="#000000" stopOpacity="0" />
              <Stop offset="100%" stopColor="#000000" stopOpacity="0.95" />
            </SvgLinearGradient>
          </Defs>

          {/* Soft moon-glow far behind */}
          <Circle cx={SCREEN_WIDTH * 0.7} cy={SCREEN_HEIGHT * 0.18} r={140} fill="url(#moon)" />
          <Circle cx={SCREEN_WIDTH * 0.7} cy={SCREEN_HEIGHT * 0.18} r={30} fill="rgba(220,240,210,0.35)" />

          {/* Distant tree silhouettes — back layer */}
          {Array.from({ length: 9 }).map((_, i) => {
            const x = (i / 8) * SCREEN_WIDTH + (i % 2 === 0 ? -10 : 14);
            const height = 220 + (i % 3) * 50;
            const top = SCREEN_HEIGHT - height - 40;
            return (
              <Path
                key={`bg-tree-${i}`}
                d={`M ${x} ${SCREEN_HEIGHT} L ${x} ${top + 40} L ${x - 22} ${top + 70} L ${x - 8} ${top + 60} L ${x - 18} ${top + 30} L ${x - 4} ${top + 24} L ${x} ${top} L ${x + 4} ${top + 24} L ${x + 18} ${top + 30} L ${x + 8} ${top + 60} L ${x + 22} ${top + 70} L ${x + 4} ${top + 50} L ${x + 4} ${SCREEN_HEIGHT} Z`}
                fill="#031208"
                opacity={0.7}
              />
            );
          })}

          {/* Foreground trees — taller, darker */}
          {[
            { x: SCREEN_WIDTH * 0.08, h: 360 },
            { x: SCREEN_WIDTH * 0.22, h: 300 },
            { x: SCREEN_WIDTH * 0.82, h: 380 },
            { x: SCREEN_WIDTH * 0.94, h: 310 },
          ].map((t, i) => {
            const top = SCREEN_HEIGHT - t.h;
            return (
              <Path
                key={`fg-tree-${i}`}
                d={`M ${t.x} ${SCREEN_HEIGHT} L ${t.x} ${top + 60} L ${t.x - 34} ${top + 100} L ${t.x - 10} ${top + 80} L ${t.x - 26} ${top + 40} L ${t.x - 6} ${top + 30} L ${t.x} ${top} L ${t.x + 6} ${top + 30} L ${t.x + 26} ${top + 40} L ${t.x + 10} ${top + 80} L ${t.x + 34} ${top + 100} L ${t.x + 6} ${top + 70} L ${t.x + 6} ${SCREEN_HEIGHT} Z`}
                fill="#000000"
                opacity={0.95}
              />
            );
          })}

          {/* Forest floor gradient at the bottom */}
          <Path
            d={`M 0 ${SCREEN_HEIGHT * 0.7} L ${SCREEN_WIDTH} ${SCREEN_HEIGHT * 0.7} L ${SCREEN_WIDTH} ${SCREEN_HEIGHT} L 0 ${SCREEN_HEIGHT} Z`}
            fill="url(#forestFloor)"
          />
        </Svg>

        {/* Floating particles drifting upward */}
        <OracleParticle delay={0} left={SCREEN_WIDTH * 0.1} size={3} duration={11000} />
        <OracleParticle delay={1200} left={SCREEN_WIDTH * 0.22} size={2} duration={9000} />
        <OracleParticle delay={400} left={SCREEN_WIDTH * 0.36} size={3} duration={12000} />
        <OracleParticle delay={2000} left={SCREEN_WIDTH * 0.52} size={2} duration={10000} />
        <OracleParticle delay={800} left={SCREEN_WIDTH * 0.68} size={3} duration={13000} />
        <OracleParticle delay={1800} left={SCREEN_WIDTH * 0.84} size={2} duration={10500} />
        <OracleParticle delay={2600} left={SCREEN_WIDTH * 0.92} size={3} duration={11500} />

        {/* Top vignette */}
        <LinearGradient
          colors={['rgba(0,0,0,0.7)', 'transparent']}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: 200,
          }}
        />

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
              fontSize: 22,
              lineHeight: 34,
              fontFamily: 'serif',
              fontStyle: 'italic',
              textAlign: 'center',
              letterSpacing: 0.4,
              textShadowColor: 'rgba(168, 232, 154, 0.55)',
              textShadowOffset: { width: 0, height: 0 },
              textShadowRadius: 14,
              paddingHorizontal: 8,
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
        </View>

        {/* Ask Again button — anchored near the bottom */}
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
        </View>
      </View>
    </Modal>
  );
}
