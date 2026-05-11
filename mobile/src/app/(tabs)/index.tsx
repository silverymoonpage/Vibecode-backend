import { useState, useCallback, useEffect, useRef } from 'react';
import {
  View,
  Text,
  ScrollView,
  Pressable,
  Dimensions,
  Modal,
  StyleSheet,
  FlatList,
  NativeSyntheticEvent,
  NativeScrollEvent,
  Platform,
} from 'react-native';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import Animated, {
  FadeIn,
  FadeInUp,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
  withDelay,
  Easing,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { X, Sparkles, Moon, Star, ChevronLeft, ChevronRight, ChevronDown } from 'lucide-react-native';
import { enchantedMessages, type GuidanceMessage } from '@/data/enchanted-messages';
import { useAmbientSound } from '@/hooks/useAmbientSound';
import { ForestMap } from '@/components/ForestMap';
import { AudioControlButton } from '@/components/AudioControlButton';
import useAudioStore from '@/lib/state/audio-store';
import { PaywallModal } from '@/components/PaywallModal';
import { CrystalBowlButton, MagicOracleOverlay } from '@/components/MagicOracle';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// ---------------------------------------------------------------------------
// Floating magical particle
// ---------------------------------------------------------------------------
function FloatingParticle({
  delay,
  size,
  left,
  duration,
}: {
  delay: number;
  size: number;
  left: number;
  duration: number;
}) {
  const translateY = useSharedValue(0);
  const opacity = useSharedValue(0);
  const scale = useSharedValue(0.5);

  useEffect(() => {
    translateY.value = withDelay(
      delay,
      withRepeat(
        withSequence(
          withTiming(-SCREEN_HEIGHT * 0.4, {
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
          withTiming(0.8, { duration: duration * 0.2 }),
          withTiming(0.3, { duration: duration * 0.6 }),
          withTiming(0, { duration: duration * 0.2 })
        ),
        -1
      )
    );
    scale.value = withDelay(
      delay,
      withRepeat(
        withSequence(
          withTiming(1, { duration: duration * 0.3 }),
          withTiming(0.6, { duration: duration * 0.7 })
        ),
        -1
      )
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }, { scale: scale.value }],
    opacity: opacity.value,
  }));

  return (
    <Animated.View
      style={[
        {
          position: 'absolute',
          bottom: 100,
          left: `${left}%`,
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: '#a8d4a0',
          shadowColor: '#7fff7f',
          shadowOffset: { width: 0, height: 0 },
          shadowOpacity: 0.8,
          shadowRadius: 8,
        },
        animatedStyle,
      ]}
    />
  );
}

// ---------------------------------------------------------------------------
// Glowing orb component
// ---------------------------------------------------------------------------
function GlowingOrb({ style }: { style?: object }) {
  const pulseScale = useSharedValue(1);
  const pulseOpacity = useSharedValue(0.4);

  useEffect(() => {
    pulseScale.value = withRepeat(
      withSequence(
        withTiming(1.3, { duration: 2000, easing: Easing.inOut(Easing.ease) }),
        withTiming(1, { duration: 2000, easing: Easing.inOut(Easing.ease) })
      ),
      -1
    );
    pulseOpacity.value = withRepeat(
      withSequence(
        withTiming(0.7, { duration: 2000 }),
        withTiming(0.3, { duration: 2000 })
      ),
      -1
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pulseScale.value }],
    opacity: pulseOpacity.value,
  }));

  return (
    <Animated.View
      style={[
        {
          width: 120,
          height: 120,
          borderRadius: 60,
          backgroundColor: 'rgba(120, 200, 150, 0.15)',
          shadowColor: '#50c878',
          shadowOffset: { width: 0, height: 0 },
          shadowOpacity: 0.5,
          shadowRadius: 30,
        },
        style,
        animatedStyle,
      ]}
    />
  );
}

// ---------------------------------------------------------------------------
// Single chapter page rendered inside the FlatList
// ---------------------------------------------------------------------------
function ChapterPage({ message }: { message: GuidanceMessage }) {
  const insets = useSafeAreaInsets();

  if (message.image) {
    return (
      <View style={{ width: SCREEN_WIDTH, flex: 1, backgroundColor: '#050d08' }}>
        {/* Full-screen background image */}
        <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, zIndex: 0 }}>
          <Image
            source={message.image}
            style={{ width: '100%', height: '100%' }}
            contentFit="cover"
          />
          {/* Dark overlay for readability */}
          <LinearGradient
            colors={[
              'rgba(5, 15, 10, 0.3)',
              'rgba(5, 15, 10, 0.5)',
              'rgba(5, 15, 10, 0.7)',
            ]}
            locations={[0.0, 0.5, 1.0]}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
            }}
          />
        </View>

        <ScrollView
          contentContainerStyle={{
            paddingTop: insets.top + (message.title === 'The Magic Well' ? 105 : 80),
            paddingBottom: insets.bottom + 80,
            flexGrow: 1,
            justifyContent: 'center',
          }}
          showsVerticalScrollIndicator={false}
        >
          <View style={{ paddingHorizontal: 28, flex: 1, justifyContent: 'center' }}>
            {/* Title */}
            <Text
              className="text-3xl font-bold text-center mb-6"
              style={{
                color: '#d4f0d4',
                fontFamily: 'serif',
                letterSpacing: 1,
                textShadowColor: 'rgba(80, 200, 120, 0.5)',
                textShadowOffset: { width: 0, height: 0 },
                textShadowRadius: 10,
              }}
            >
              {message.title}
            </Text>

            {/* Magical divider */}
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: 32,
              }}
            >
              <View
                style={{
                  width: 30,
                  height: 1,
                  backgroundColor: 'rgba(120, 220, 150, 0.3)',
                }}
              />
              <Moon
                size={16}
                color="rgba(150, 220, 150, 0.6)"
                style={{ marginHorizontal: 12 }}
              />
              <View
                style={{
                  width: 30,
                  height: 1,
                  backgroundColor: 'rgba(120, 220, 150, 0.3)',
                }}
              />
            </View>

            {/* Message */}
            <Text
              className="text-center"
              style={{
                color: 'rgba(200, 230, 200, 0.9)',
                fontFamily: 'serif',
                fontSize: message.title === 'Your Guides' ? 15 : 18,
                lineHeight: message.title === 'Your Guides' ? 26 : 32,
                letterSpacing: 0.3,
                marginTop: message.title === 'Your Guides' ? (Platform.OS === 'web' ? 35 : 0) : 0,
              }}
            >
              {message.message}
            </Text>

            {/* Bottom decoration */}
            <View
              style={{
                alignItems: 'center',
                marginTop: 48,
              }}
            >
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Star
                  size={12}
                  color="rgba(150, 220, 150, 0.4)"
                  fill="rgba(150, 220, 150, 0.2)"
                />
                <Sparkles
                  size={20}
                  color="rgba(150, 220, 150, 0.5)"
                  style={{ marginHorizontal: 16 }}
                />
                <Star
                  size={12}
                  color="rgba(150, 220, 150, 0.4)"
                  fill="rgba(150, 220, 150, 0.2)"
                />
              </View>
            </View>
          </View>
        </ScrollView>
      </View>
    );
  }

  // Fallback layout for chapters without image
  return (
    <View
      style={{ width: SCREEN_WIDTH, flex: 1, backgroundColor: 'rgba(5, 12, 8, 0.98)' }}
    >
      <LinearGradient
        colors={['rgba(10, 30, 20, 1)', 'rgba(5, 15, 10, 1)', 'rgba(2, 8, 5, 1)']}
        style={{ flex: 1 }}
      >
        {/* Floating particles */}
        <FloatingParticle delay={0} size={4} left={15} duration={8000} />
        <FloatingParticle delay={1000} size={3} left={35} duration={10000} />
        <FloatingParticle delay={2000} size={5} left={55} duration={7000} />
        <FloatingParticle delay={500} size={3} left={75} duration={9000} />
        <FloatingParticle delay={1500} size={4} left={85} duration={11000} />

        {/* Background glow orbs */}
        <GlowingOrb style={{ position: 'absolute', top: '20%', left: -40 }} />
        <GlowingOrb style={{ position: 'absolute', bottom: '25%', right: -50 }} />

        <ScrollView
          contentContainerStyle={{
            paddingTop: insets.top + 80,
            paddingBottom: insets.bottom + 80,
            flexGrow: 1,
            justifyContent: 'center',
          }}
          showsVerticalScrollIndicator={false}
        >
          {/* Symbol with magical aura */}
          <View style={{ alignItems: 'center', marginBottom: 40 }}>
            {/* Outer glow ring */}
            <View
              style={{
                position: 'absolute',
                width: 160,
                height: 160,
                borderRadius: 80,
                backgroundColor: 'rgba(80, 200, 120, 0.08)',
                shadowColor: '#50c878',
                shadowOffset: { width: 0, height: 0 },
                shadowOpacity: 0.5,
                shadowRadius: 40,
              }}
            />
            <View
              style={{
                width: 120,
                height: 120,
                borderRadius: 60,
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: 'rgba(80, 200, 120, 0.1)',
                borderWidth: 2,
                borderColor: 'rgba(120, 220, 150, 0.4)',
                shadowColor: '#50c878',
                shadowOffset: { width: 0, height: 0 },
                shadowOpacity: 0.6,
                shadowRadius: 20,
              }}
            >
              <Text className="text-6xl">{message.symbol}</Text>
            </View>
          </View>

          {/* Content */}
          <View style={{ paddingHorizontal: 28, flex: 1, justifyContent: 'center' }}>
            {/* Title */}
            <Text
              className="text-3xl font-bold text-center mb-6"
              style={{
                color: '#d4f0d4',
                fontFamily: 'serif',
                letterSpacing: 1,
                textShadowColor: 'rgba(80, 200, 120, 0.5)',
                textShadowOffset: { width: 0, height: 0 },
                textShadowRadius: 10,
              }}
            >
              {message.title}
            </Text>

            {/* Magical divider */}
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: 32,
              }}
            >
              <View
                style={{
                  width: 30,
                  height: 1,
                  backgroundColor: 'rgba(120, 220, 150, 0.3)',
                }}
              />
              <Moon
                size={16}
                color="rgba(150, 220, 150, 0.6)"
                style={{ marginHorizontal: 12 }}
              />
              <View
                style={{
                  width: 30,
                  height: 1,
                  backgroundColor: 'rgba(120, 220, 150, 0.3)',
                }}
              />
            </View>

            {/* Message */}
            <Text
              className="text-lg text-center"
              style={{
                color: 'rgba(200, 230, 200, 0.9)',
                fontFamily: 'serif',
                lineHeight: 32,
                letterSpacing: 0.3,
              }}
            >
              {message.message}
            </Text>

            {/* Bottom decoration */}
            <View style={{ alignItems: 'center', marginTop: 48 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Star
                  size={12}
                  color="rgba(150, 220, 150, 0.4)"
                  fill="rgba(150, 220, 150, 0.2)"
                />
                <Sparkles
                  size={20}
                  color="rgba(150, 220, 150, 0.5)"
                  style={{ marginHorizontal: 16 }}
                />
                <Star
                  size={12}
                  color="rgba(150, 220, 150, 0.4)"
                  fill="rgba(150, 220, 150, 0.2)"
                />
              </View>
            </View>
          </View>
        </ScrollView>
      </LinearGradient>
    </View>
  );
}

// ---------------------------------------------------------------------------
// Page indicator dots
// ---------------------------------------------------------------------------
function PageIndicator({
  total,
  current,
}: {
  total: number;
  current: number;
}) {
  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {Array.from({ length: total }).map((_, i) => {
        const isActive = i === current;
        return (
          <View
            key={i}
            style={{
              width: isActive ? 10 : 6,
              height: isActive ? 10 : 6,
              borderRadius: isActive ? 5 : 3,
              backgroundColor: isActive
                ? '#50c878'
                : 'rgba(80, 200, 120, 0.3)',
              marginHorizontal: 3,
              shadowColor: isActive ? '#50c878' : 'transparent',
              shadowOffset: { width: 0, height: 0 },
              shadowOpacity: isActive ? 0.8 : 0,
              shadowRadius: isActive ? 6 : 0,
            }}
          />
        );
      })}
    </View>
  );
}

// ---------------------------------------------------------------------------
// Swipeable chapter viewer (replaces the old single-message modal)
// ---------------------------------------------------------------------------
function ChapterViewerModal({
  initialIndex,
  visible,
  onClose,
}: {
  initialIndex: number;
  visible: boolean;
  onClose: () => void;
}) {
  const insets = useSafeAreaInsets();
  const flatListRef = useRef<FlatList<GuidanceMessage>>(null);
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const hasScrolledToInitial = useRef(false);

  // Ambient forest sound
  const isMuted = useAudioStore((s) => s.isMuted);
  useAmbientSound(visible, isMuted);

  // When modal opens with a new initialIndex, scroll to it
  useEffect(() => {
    if (visible) {
      setCurrentIndex(initialIndex);
      currentIndexRef.current = initialIndex;
      hasScrolledToInitial.current = false;
    }
  }, [visible, initialIndex]);

  const getItemLayout = useCallback(
    (_data: ArrayLike<GuidanceMessage> | null | undefined, index: number) => ({
      length: SCREEN_WIDTH,
      offset: SCREEN_WIDTH * index,
      index,
    }),
    []
  );

  const currentIndexRef = useRef(initialIndex);

  const onMomentumScrollEnd = useCallback(
    (event: NativeSyntheticEvent<NativeScrollEvent>) => {
      const newIndex = Math.round(
        event.nativeEvent.contentOffset.x / SCREEN_WIDTH
      );
      if (newIndex >= 0 && newIndex < enchantedMessages.length && newIndex !== currentIndexRef.current) {
        currentIndexRef.current = newIndex;
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        setCurrentIndex(newIndex);
      }
    },
    []
  );

  const renderItem = useCallback(
    ({ item }: { item: GuidanceMessage }) => <ChapterPage message={item} />,
    []
  );

  const keyExtractor = useCallback(
    (item: GuidanceMessage) => String(item.id),
    []
  );

  return (
    <Modal
      visible={visible}
      animationType="fade"
      transparent
      statusBarTranslucent
      onRequestClose={onClose}
    >
      <View style={{ flex: 1, backgroundColor: '#050d08' }}>
        {/* Chapter counter at the top */}
        <Animated.View
          entering={FadeIn.delay(200)}
          style={{
            position: 'absolute',
            top: insets.top + 16,
            left: 0,
            right: 0,
            zIndex: 10,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <View
            style={{
              paddingHorizontal: 14,
              paddingVertical: 6,
              borderRadius: 16,
              backgroundColor: 'rgba(10, 30, 20, 0.7)',
              borderWidth: 1,
              borderColor: 'rgba(80, 200, 120, 0.2)',
            }}
          >
            <Text
              style={{
                color: 'rgba(180, 230, 180, 0.8)',
                fontSize: 13,
                fontFamily: 'serif',
                letterSpacing: 1,
              }}
            >
              {currentIndex + 1} of {enchantedMessages.length}
            </Text>
          </View>
        </Animated.View>

        {/* Close button + mute button row */}
        <Animated.View
          entering={FadeIn.delay(200)}
          style={{
            position: 'absolute',
            top: insets.top + 16,
            right: 20,
            zIndex: 10,
            flexDirection: 'row',
            alignItems: 'center',
            gap: 8,
          }}
        >
          {/* Mute toggle */}
          <AudioControlButton inline />
          {/* Close */}
          <Pressable
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              onClose();
            }}
            style={{
              width: 44,
              height: 44,
              borderRadius: 22,
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: 'rgba(80, 200, 120, 0.15)',
              borderWidth: 1,
              borderColor: 'rgba(80, 200, 120, 0.3)',
            }}
          >
            <X size={20} color="#a8d4a0" />
          </Pressable>
        </Animated.View>

        {/* Swipeable FlatList of chapters */}
        <FlatList
          ref={flatListRef}
          data={enchantedMessages}
          renderItem={renderItem}
          keyExtractor={keyExtractor}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          initialScrollIndex={initialIndex}
          getItemLayout={getItemLayout}
          onMomentumScrollEnd={onMomentumScrollEnd}
          bounces={false}
          style={{ flex: 1 }}
        />

        {/* Bottom page indicator + swipe hint */}
        <Animated.View
          entering={FadeIn.delay(400)}
          style={{
            position: 'absolute',
            bottom: insets.bottom + 24,
            left: 0,
            right: 0,
            zIndex: 10,
            alignItems: 'center',
          }}
        >
          <PageIndicator
            total={enchantedMessages.length}
            current={currentIndex}
          />
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginTop: 10,
            }}
          >
            <ChevronLeft size={12} color="rgba(150, 220, 150, 0.4)" />
            <Text
              style={{
                color: 'rgba(150, 220, 150, 0.4)',
                fontSize: 11,
                marginHorizontal: 6,
                letterSpacing: 0.5,
              }}
            >
              swipe to explore
            </Text>
            <ChevronRight size={12} color="rgba(150, 220, 150, 0.4)" />
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
}

// ---------------------------------------------------------------------------
// Main screen
// ---------------------------------------------------------------------------
export default function EnchantedForestScreen() {
  const insets = useSafeAreaInsets();
  const scrollViewRef = useRef<ScrollView>(null);
  const [selectedIndex, setSelectedIndex] = useState<number>(0);
  const [modalVisible, setModalVisible] = useState(false);
  const [paywallVisible, setPaywallVisible] = useState(false);
  const [pendingLockedIndex, setPendingLockedIndex] = useState<number | null>(null);
  const [oracleVisible, setOracleVisible] = useState(false);

  const handleOpenOracle = useCallback(() => {
    setOracleVisible(true);
  }, []);

  const handleCloseOracle = useCallback(() => {
    setOracleVisible(false);
  }, []);

  const handleBeginJourney = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    scrollViewRef.current?.scrollTo({ y: SCREEN_HEIGHT, animated: true });
  }, []);

  const handleCardPress = useCallback((index: number) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setSelectedIndex(index);
    setModalVisible(true);
  }, []);

  const handleLockedChapterPress = useCallback((index: number) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setPendingLockedIndex(index);
    setPaywallVisible(true);
  }, []);

  const handlePaywallClose = useCallback(() => {
    setPaywallVisible(false);
    setPendingLockedIndex(null);
  }, []);

  const handlePurchaseSuccess = useCallback(() => {
    setPaywallVisible(false);
    if (pendingLockedIndex !== null) {
      setSelectedIndex(pendingLockedIndex);
      setModalVisible(true);
      setPendingLockedIndex(null);
    }
  }, [pendingLockedIndex]);

  const handleCloseModal = useCallback(() => {
    setModalVisible(false);
  }, []);

  return (
    <View className="flex-1" style={{ backgroundColor: '#050d08' }}>
      {/* Floating magical particles in background */}
      <View style={StyleSheet.absoluteFill} pointerEvents="none">
        <FloatingParticle delay={0} size={4} left={10} duration={12000} />
        <FloatingParticle delay={2000} size={3} left={25} duration={15000} />
        <FloatingParticle delay={1000} size={5} left={40} duration={10000} />
        <FloatingParticle delay={3000} size={3} left={60} duration={14000} />
        <FloatingParticle delay={500} size={4} left={75} duration={11000} />
        <FloatingParticle delay={1500} size={3} left={90} duration={13000} />
      </View>

      <ScrollView
        ref={scrollViewRef}
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 0 }}
      >
        {/* Hero Section with Cover Image */}
        <View style={{ height: SCREEN_HEIGHT }}>
          <Image
            source={require('@/../assets/images/enchanted-forest-cover.png')}
            style={{ width: '100%', height: '100%' }}
            contentFit="cover"
          />
          {/* Mystical gradient overlay */}
          <LinearGradient
            colors={[
              'transparent',
              'rgba(5, 13, 8, 0.3)',
              'rgba(5, 13, 8, 0.7)',
              'rgba(5, 13, 8, 1)',
            ]}
            locations={[0.2, 0.5, 0.75, 1]}
            style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              height: '80%',
            }}
          />
          {/* Magical vignette at top */}
          <LinearGradient
            colors={['rgba(5, 13, 8, 0.6)', 'transparent']}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: 120,
            }}
          />
          {/* Title overlay with magical styling */}
          <View
            style={{
              position: 'absolute',
              bottom: insets.bottom + 24,
              left: 0,
              right: 0,
              paddingHorizontal: 24,
            }}
          >
            <Animated.View
              entering={FadeInUp.delay(200).springify()}
              className="flex-row items-center mb-3"
            >
              <Sparkles size={14} color="rgba(150, 220, 150, 0.8)" />
              <Text
                className="text-xs uppercase tracking-widest ml-2"
                style={{ color: 'rgba(150, 220, 150, 0.8)', fontFamily: 'Almendra_400Regular' }}
              >
                Your Guide Through
              </Text>
            </Animated.View>
            <Animated.Text
              entering={FadeInUp.delay(300).springify()}
              className="text-4xl font-bold"
              style={{
                color: '#d4f0d4',
                fontFamily: 'Almendra_700Bold',
                lineHeight: 48,
                textShadowColor: 'rgba(80, 200, 120, 0.4)',
                textShadowOffset: { width: 0, height: 0 },
                textShadowRadius: 15,
              }}
            >
              The Enchanted{'\n'}Forest
            </Animated.Text>
            <Animated.Text
              entering={FadeInUp.delay(400).springify()}
              className="text-base mt-3"
              style={{
                color: 'rgba(180, 220, 180, 0.7)',
                lineHeight: 24,
                fontStyle: 'italic',
                fontFamily: 'YesevaOne_400Regular',
              }}
            >
              10 messages of guidance, each a metaphor{'\n'}for life's enchanted pathway
            </Animated.Text>

            {/* Begin Your Journey button */}
            <Animated.View
              entering={FadeInUp.delay(520).springify()}
              style={{
                marginTop: 20,
                alignSelf: 'flex-start',
                minWidth: 200,
                shadowColor: '#a8d478',
                shadowOffset: { width: 0, height: 0 },
                shadowOpacity: 0.5,
                shadowRadius: 16,
              }}
            >
              <View
                style={{
                  borderRadius: 32,
                  borderWidth: 1.5,
                  borderColor: 'rgba(168, 212, 120, 0.85)',
                  backgroundColor: 'rgba(20, 60, 35, 0.6)',
                  overflow: 'hidden',
                  minWidth: 200,
                }}
              >
                <Pressable
                  onPress={handleBeginJourney}
                  style={({ pressed }) => ({
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'center',
                    paddingVertical: 14,
                    paddingHorizontal: 28,
                    backgroundColor: pressed ? 'rgba(80, 200, 120, 0.25)' : 'transparent',
                  })}
                >
                  <Sparkles
                    size={14}
                    color="rgba(168, 212, 120, 0.9)"
                    fill="rgba(168, 212, 120, 0.4)"
                    style={{ marginRight: 10 }}
                  />
                  <Text
                    style={{
                      color: '#c8e8a0',
                      fontSize: 15,
                      fontFamily: 'YesevaOne_400Regular',
                      fontWeight: '300',
                      letterSpacing: 1.5,
                      textAlign: 'center',
                      textShadowColor: 'rgba(168, 212, 120, 0.6)',
                      textShadowOffset: { width: 0, height: 0 },
                      textShadowRadius: 8,
                    }}
                  >
                    Begin Your Journey
                  </Text>
                  <Sparkles
                    size={14}
                    color="rgba(168, 212, 120, 0.9)"
                    fill="rgba(168, 212, 120, 0.4)"
                    style={{ marginLeft: 10 }}
                  />
                </Pressable>
              </View>
            </Animated.View>
          </View>
        </View>

        {/* Forest Map Navigation */}
        <ForestMap
          onChapterPress={handleCardPress}
          onLockedChapterPress={handleLockedChapterPress}
        />

        {/* Magic Oracle — glowing crystal bowl at the end of the path */}
        <View
          style={{
            alignItems: 'center',
            paddingTop: 12,
            paddingBottom: insets.bottom + 48,
            backgroundColor: '#050d08',
          }}
        >
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginBottom: 18,
            }}
          >
            <View style={{ height: 1, width: 50, backgroundColor: 'rgba(244, 233, 168, 0.35)' }} />
            <Text
              style={{
                color: '#e6d49a',
                fontSize: 11,
                letterSpacing: 4,
                marginHorizontal: 12,
                fontFamily: 'Almendra_400Regular',
                textTransform: 'uppercase',
              }}
            >
              Seek a Sign
            </Text>
            <View style={{ height: 1, width: 50, backgroundColor: 'rgba(244, 233, 168, 0.35)' }} />
          </View>
          <CrystalBowlButton onPress={handleOpenOracle} />
        </View>
      </ScrollView>

      {/* Swipeable Chapter Viewer Modal */}
      <ChapterViewerModal
        initialIndex={selectedIndex}
        visible={modalVisible}
        onClose={handleCloseModal}
      />

      {/* Paywall modal */}
      <PaywallModal
        visible={paywallVisible}
        onClose={handlePaywallClose}
        onPurchaseSuccess={handlePurchaseSuccess}
      />

      {/* Global audio mute/unmute button */}
      <AudioControlButton />

      {/* Magic Oracle full-screen overlay */}
      <MagicOracleOverlay visible={oracleVisible} onClose={handleCloseOracle} />
    </View>
  );
}
