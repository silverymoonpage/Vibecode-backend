import { useEffect } from 'react';
import { View, Text, Pressable, Dimensions } from 'react-native';
import { Image } from 'expo-image';
import * as Haptics from 'expo-haptics';
import Animated, {
  FadeInDown,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withRepeat,
  withSequence,
  withTiming,
  withDelay,
  Easing,
} from 'react-native-reanimated';
import Svg, { Path, Circle, Defs, RadialGradient, Stop } from 'react-native-svg';
import { Sparkles, TreePine, Star } from 'lucide-react-native';
import { enchantedMessages, type GuidanceMessage } from '@/data/enchanted-messages';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------
const NODE_COUNT = enchantedMessages.length;
const NODE_SPACING = 200;
const FIRST_NODE_Y = 60;
const LAST_NODE_BOTTOM_PAD = 120;
const MAP_HEIGHT = FIRST_NODE_Y + (NODE_COUNT - 1) * NODE_SPACING + LAST_NODE_BOTTOM_PAD;
const NODE_SIZE = 64;

const ROMAN_NUMERALS = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X'];

// ---------------------------------------------------------------------------
// Node positions - alternating left and right
// ---------------------------------------------------------------------------
function getNodePositions(): { x: number; y: number }[] {
  const positions: { x: number; y: number }[] = [];
  for (let i = 0; i < NODE_COUNT; i++) {
    const isLeft = i % 2 === 0; // 0-indexed: chapters 1,3,5,7,9 on left
    const x = isLeft ? SCREEN_WIDTH * 0.25 : SCREEN_WIDTH * 0.75;
    const y = FIRST_NODE_Y + i * NODE_SPACING;
    positions.push({ x, y });
  }
  return positions;
}

// ---------------------------------------------------------------------------
// Build SVG path string connecting all nodes with smooth curves
// ---------------------------------------------------------------------------
function buildPathString(positions: { x: number; y: number }[]): string {
  if (positions.length < 2) return '';

  let d = `M ${positions[0].x} ${positions[0].y}`;

  for (let i = 0; i < positions.length - 1; i++) {
    const current = positions[i];
    const next = positions[i + 1];
    const midY = (current.y + next.y) / 2;

    // Cubic bezier: control points push the curve outward for a nice S-shape
    const cp1x = current.x;
    const cp1y = midY;
    const cp2x = next.x;
    const cp2y = midY;

    d += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${next.x} ${next.y}`;
  }

  return d;
}

// ---------------------------------------------------------------------------
// Sparkle decoration dot
// ---------------------------------------------------------------------------
function SparkleDecoration({
  x,
  y,
  size,
  delayMs,
}: {
  x: number;
  y: number;
  size: number;
  delayMs: number;
}) {
  const opacity = useSharedValue(0.2);

  useEffect(() => {
    opacity.value = withDelay(
      delayMs,
      withRepeat(
        withSequence(
          withTiming(0.9, { duration: 1500, easing: Easing.inOut(Easing.ease) }),
          withTiming(0.15, { duration: 1500, easing: Easing.inOut(Easing.ease) })
        ),
        -1,
        true
      )
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  return (
    <Animated.View
      style={[
        {
          position: 'absolute',
          left: x - size / 2,
          top: y - size / 2,
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: '#a8d4a0',
          shadowColor: '#7fff7f',
          shadowOffset: { width: 0, height: 0 },
          shadowOpacity: 0.8,
          shadowRadius: 4,
        },
        animatedStyle,
      ]}
    />
  );
}

// ---------------------------------------------------------------------------
// Decorative star element between nodes
// ---------------------------------------------------------------------------
function DecoStar({ x, y, delayMs }: { x: number; y: number; delayMs: number }) {
  const opacity = useSharedValue(0);

  useEffect(() => {
    opacity.value = withDelay(
      delayMs,
      withRepeat(
        withSequence(
          withTiming(0.6, { duration: 2200, easing: Easing.inOut(Easing.ease) }),
          withTiming(0.15, { duration: 2200, easing: Easing.inOut(Easing.ease) })
        ),
        -1,
        true
      )
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  return (
    <Animated.View
      style={[
        {
          position: 'absolute',
          left: x - 8,
          top: y - 8,
        },
        animatedStyle,
      ]}
    >
      <Star size={16} color="#78c878" fill="rgba(120, 200, 120, 0.3)" />
    </Animated.View>
  );
}

// ---------------------------------------------------------------------------
// Decorative tiny tree
// ---------------------------------------------------------------------------
function DecoTree({ x, y, delayMs }: { x: number; y: number; delayMs: number }) {
  const opacity = useSharedValue(0);

  useEffect(() => {
    opacity.value = withDelay(
      delayMs,
      withRepeat(
        withSequence(
          withTiming(0.45, { duration: 3000, easing: Easing.inOut(Easing.ease) }),
          withTiming(0.15, { duration: 3000, easing: Easing.inOut(Easing.ease) })
        ),
        -1,
        true
      )
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  return (
    <Animated.View
      style={[
        {
          position: 'absolute',
          left: x - 7,
          top: y - 7,
        },
        animatedStyle,
      ]}
    >
      <TreePine size={14} color="rgba(80, 180, 100, 0.5)" />
    </Animated.View>
  );
}

// ---------------------------------------------------------------------------
// Single chapter node on the map
// ---------------------------------------------------------------------------
function ChapterNode({
  message,
  index,
  x,
  y,
  onPress,
}: {
  message: GuidanceMessage;
  index: number;
  x: number;
  y: number;
  onPress: () => void;
}) {
  const scale = useSharedValue(1);
  const glowOpacity = useSharedValue(0.3);

  // Staggered pulsing glow
  useEffect(() => {
    glowOpacity.value = withDelay(
      index * 400,
      withRepeat(
        withSequence(
          withTiming(0.8, { duration: 2000, easing: Easing.inOut(Easing.ease) }),
          withTiming(0.25, { duration: 2000, easing: Easing.inOut(Easing.ease) })
        ),
        -1,
        true
      )
    );
  }, []);

  const nodeAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const glowAnimatedStyle = useAnimatedStyle(() => ({
    opacity: glowOpacity.value,
  }));

  const handlePressIn = () => {
    scale.value = withSpring(1.12, { damping: 12, stiffness: 200 });
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 12, stiffness: 200 });
  };

  const handlePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    onPress();
  };

  const imageSource = message.menuImage ?? message.image;

  return (
    <Animated.View
      entering={FadeInDown.delay(200 + index * 120).springify()}
      style={{
        position: 'absolute',
        left: x - NODE_SIZE / 2,
        top: y - NODE_SIZE / 2,
        alignItems: 'center',
        width: NODE_SIZE + 60,
        marginLeft: -30,
      }}
    >
      <Pressable
        onPress={handlePress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        style={{ alignItems: 'center' }}
      >
        <Animated.View style={nodeAnimatedStyle}>
          {/* Outer glow ring */}
          <Animated.View
            style={[
              {
                position: 'absolute',
                top: -12,
                left: -12,
                width: NODE_SIZE + 24,
                height: NODE_SIZE + 24,
                borderRadius: (NODE_SIZE + 24) / 2,
                backgroundColor: 'rgba(80, 200, 120, 0.15)',
                shadowColor: '#50c878',
                shadowOffset: { width: 0, height: 0 },
                shadowOpacity: 0.7,
                shadowRadius: 20,
              },
              glowAnimatedStyle,
            ]}
          />

          {/* Node circle */}
          <View
            style={{
              width: NODE_SIZE,
              height: NODE_SIZE,
              borderRadius: NODE_SIZE / 2,
              overflow: 'hidden',
              borderWidth: 2,
              borderColor: 'rgba(80, 200, 120, 0.5)',
              backgroundColor: '#0a1e12',
              shadowColor: '#50c878',
              shadowOffset: { width: 0, height: 0 },
              shadowOpacity: 0.5,
              shadowRadius: 12,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {imageSource ? (
              <Image
                source={imageSource}
                style={{ width: NODE_SIZE, height: NODE_SIZE, borderRadius: NODE_SIZE / 2 }}
                contentFit="cover"
              />
            ) : (
              <Text style={{ fontSize: 28 }}>{message.symbol}</Text>
            )}
          </View>
        </Animated.View>

        {/* Roman numeral */}
        <Text
          style={{
            marginTop: 8,
            color: '#50c878',
            fontSize: 13,
            fontFamily: 'serif',
            letterSpacing: 2,
            textShadowColor: 'rgba(80, 200, 120, 0.6)',
            textShadowOffset: { width: 0, height: 0 },
            textShadowRadius: 8,
          }}
        >
          {ROMAN_NUMERALS[index] ?? String(index + 1)}
        </Text>

        {/* Chapter title */}
        <Text
          className="text-center"
          style={{
            marginTop: 2,
            color: '#c8e6c9',
            fontSize: 12,
            fontFamily: 'serif',
            letterSpacing: 0.5,
            maxWidth: NODE_SIZE + 50,
            textShadowColor: 'rgba(0,0,0,0.8)',
            textShadowOffset: { width: 0, height: 1 },
            textShadowRadius: 4,
          }}
          numberOfLines={2}
        >
          {message.title}
        </Text>
      </Pressable>
    </Animated.View>
  );
}

// ---------------------------------------------------------------------------
// Generate sparkle decorations scattered along the path
// ---------------------------------------------------------------------------
function generateSparkles(positions: { x: number; y: number }[]) {
  const sparkles: { x: number; y: number; size: number; delay: number; key: string }[] = [];

  for (let i = 0; i < positions.length - 1; i++) {
    const current = positions[i];
    const next = positions[i + 1];
    const midX = (current.x + next.x) / 2;
    const midY = (current.y + next.y) / 2;

    // 3 sparkles between each pair of nodes
    sparkles.push({
      x: midX + (Math.sin(i * 1.5) * 30) - 15,
      y: midY - 30,
      size: 2 + (i % 3),
      delay: i * 300,
      key: `sp-${i}-a`,
    });
    sparkles.push({
      x: midX + (Math.cos(i * 2.1) * 40) + 10,
      y: midY + 20,
      size: 2 + ((i + 1) % 3),
      delay: i * 300 + 500,
      key: `sp-${i}-b`,
    });
    sparkles.push({
      x: midX - (Math.sin(i * 0.8) * 25) - 20,
      y: midY + 5,
      size: 2 + ((i + 2) % 2),
      delay: i * 300 + 1000,
      key: `sp-${i}-c`,
    });
  }

  return sparkles;
}

// ---------------------------------------------------------------------------
// Generate decorative elements (stars and trees)
// ---------------------------------------------------------------------------
function generateDecoElements(positions: { x: number; y: number }[]) {
  const elements: { type: 'star' | 'tree'; x: number; y: number; delay: number; key: string }[] = [];

  for (let i = 0; i < positions.length; i++) {
    const node = positions[i];
    const isLeft = i % 2 === 0;

    // Place a star on the opposite side of the node
    elements.push({
      type: 'star',
      x: isLeft ? SCREEN_WIDTH * 0.65 + (i % 3) * 12 : SCREEN_WIDTH * 0.15 + (i % 3) * 10,
      y: node.y + 20 + (i % 4) * 8,
      delay: i * 500 + 200,
      key: `deco-star-${i}`,
    });

    // Place a tree near some nodes
    if (i % 2 === 0) {
      elements.push({
        type: 'tree',
        x: isLeft ? SCREEN_WIDTH * 0.72 + (i % 3) * 8 : SCREEN_WIDTH * 0.12 + (i % 3) * 6,
        y: node.y - 20 + (i % 5) * 10,
        delay: i * 500 + 800,
        key: `deco-tree-${i}`,
      });
    }

    // Extra trees scattered around
    if (i % 3 === 1) {
      elements.push({
        type: 'tree',
        x: SCREEN_WIDTH * 0.08 + (i * 13) % 40,
        y: node.y + 60,
        delay: i * 400,
        key: `deco-tree-extra-${i}`,
      });
    }
  }

  return elements;
}

// ---------------------------------------------------------------------------
// ForestMap Component
// ---------------------------------------------------------------------------
interface ForestMapProps {
  onChapterPress: (index: number) => void;
}

export function ForestMap({ onChapterPress }: ForestMapProps) {
  const positions = getNodePositions();
  const pathString = buildPathString(positions);
  const sparkles = generateSparkles(positions);
  const decoElements = generateDecoElements(positions);

  return (
    <View style={{ width: SCREEN_WIDTH, height: MAP_HEIGHT, overflow: 'hidden' }}>
      {/* Background image anchored to bottom showing forest floor */}
      <Image
        source={require('@/../assets/images/map_background.jpg')}
        style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
        contentFit="cover"
        contentPosition={{ bottom: 0 }}
      />

      {/* Dark overlay for readability */}
      <View
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.35)',
          zIndex: 1,
        }}
      />

      <View style={{ width: SCREEN_WIDTH, height: MAP_HEIGHT, position: 'relative', zIndex: 2 }}>
        {/* SVG layer: path + glow */}
        <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}>
          <Svg width={SCREEN_WIDTH} height={MAP_HEIGHT}>
            <Defs>
              {/* Glow circles for each node */}
              {positions.map((pos, i) => (
                <RadialGradient
                  key={`grad-${i}`}
                  id={`nodeGlow${i}`}
                  cx={pos.x}
                  cy={pos.y}
                  rx="50"
                  ry="50"
                  gradientUnits="userSpaceOnUse"
                >
                  <Stop offset="0%" stopColor="#50c878" stopOpacity="0.2" />
                  <Stop offset="100%" stopColor="#50c878" stopOpacity="0" />
                </RadialGradient>
              ))}
            </Defs>

            {/* Wide glow path behind the main path */}
            <Path
              d={pathString}
              stroke="rgba(80, 200, 120, 0.08)"
              strokeWidth={24}
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <Path
              d={pathString}
              stroke="rgba(80, 200, 120, 0.12)"
              strokeWidth={12}
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            {/* Main visible path */}
            <Path
              d={pathString}
              stroke="rgba(80, 200, 120, 0.35)"
              strokeWidth={3.5}
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            {/* Bright center line for extra definition */}
            <Path
              d={pathString}
              stroke="rgba(120, 220, 150, 0.2)"
              strokeWidth={1.5}
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            {/* Node glow circles */}
            {positions.map((pos, i) => (
              <Circle
                key={`glow-circle-${i}`}
                cx={pos.x}
                cy={pos.y}
                r={40}
                fill={`url(#nodeGlow${i})`}
              />
            ))}
          </Svg>
        </View>

        {/* Sparkle decorations */}
        {sparkles.map((sp) => (
          <SparkleDecoration
            key={sp.key}
            x={sp.x}
            y={sp.y}
            size={sp.size}
            delayMs={sp.delay}
          />
        ))}

        {/* Stars and trees decorations */}
        {decoElements.map((el) =>
          el.type === 'star' ? (
            <DecoStar key={el.key} x={el.x} y={el.y} delayMs={el.delay} />
          ) : (
            <DecoTree key={el.key} x={el.x} y={el.y} delayMs={el.delay} />
          )
        )}

        {/* Floating sparkles icon near top */}
        <Animated.View
          entering={FadeInDown.delay(100).springify()}
          style={{
            position: 'absolute',
            top: 12,
            alignSelf: 'center',
            left: SCREEN_WIDTH / 2 - 10,
          }}
        >
          <Sparkles size={20} color="rgba(168, 212, 160, 0.5)" />
        </Animated.View>

        {/* Chapter nodes */}
        {enchantedMessages.map((message, index) => (
          <ChapterNode
            key={message.id}
            message={message}
            index={index}
            x={positions[index].x}
            y={positions[index].y}
            onPress={() => onChapterPress(index)}
          />
        ))}
      </View>
    </View>
  );
}
