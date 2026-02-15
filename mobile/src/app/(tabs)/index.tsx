import { useState, useCallback, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  Pressable,
  Dimensions,
  Modal,
  StyleSheet,
} from 'react-native';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import * as Haptics from 'expo-haptics';
import Animated, {
  FadeIn,
  FadeInDown,
  FadeInUp,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withRepeat,
  withSequence,
  withTiming,
  withDelay,
  Easing,
  interpolate,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { X, Sparkles, Moon, Star } from 'lucide-react-native';
import { enchantedMessages, type GuidanceMessage } from '@/data/enchanted-messages';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

// Floating magical particle
function FloatingParticle({ delay, size, left, duration }: { delay: number; size: number; left: number; duration: number }) {
  const translateY = useSharedValue(0);
  const opacity = useSharedValue(0);
  const scale = useSharedValue(0.5);

  useEffect(() => {
    translateY.value = withDelay(
      delay,
      withRepeat(
        withSequence(
          withTiming(-SCREEN_HEIGHT * 0.4, { duration, easing: Easing.inOut(Easing.ease) }),
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

// Glowing orb component
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

function GuidanceCard({
  message,
  index,
  onPress,
}: {
  message: GuidanceMessage;
  index: number;
  onPress: () => void;
}) {
  const scale = useSharedValue(1);
  const glowOpacity = useSharedValue(0);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const glowStyle = useAnimatedStyle(() => ({
    opacity: glowOpacity.value,
  }));

  const handlePressIn = () => {
    scale.value = withSpring(0.97, { damping: 15 });
    glowOpacity.value = withTiming(1, { duration: 200 });
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 15 });
    glowOpacity.value = withTiming(0, { duration: 300 });
  };

  return (
    <AnimatedPressable
      entering={FadeInDown.delay(100 + index * 80).springify()}
      style={animatedStyle}
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      className="mb-4"
    >
      <View className="relative">
        {/* Magical glow effect on press */}
        <Animated.View
          style={[
            {
              position: 'absolute',
              top: -4,
              left: -4,
              right: -4,
              bottom: -4,
              borderRadius: 20,
              backgroundColor: 'rgba(80, 200, 120, 0.15)',
              shadowColor: '#50c878',
              shadowOffset: { width: 0, height: 0 },
              shadowOpacity: 0.6,
              shadowRadius: 15,
            },
            glowStyle,
          ]}
        />
        <LinearGradient
          colors={['rgba(15, 35, 25, 0.95)', 'rgba(10, 25, 18, 0.98)']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={{
            paddingHorizontal: 18,
            paddingVertical: 16,
            borderRadius: 16,
            borderWidth: 1,
            borderColor: 'rgba(80, 200, 120, 0.25)',
          }}
        >
          <View className="flex-row items-center">
            {/* Symbol container with mystical glow */}
            <View
              style={{
                width: 52,
                height: 52,
                borderRadius: 26,
                alignItems: 'center',
                justifyContent: 'center',
                marginRight: 14,
                backgroundColor: 'rgba(80, 200, 120, 0.12)',
                borderWidth: 1,
                borderColor: 'rgba(120, 220, 150, 0.3)',
                shadowColor: '#50c878',
                shadowOffset: { width: 0, height: 0 },
                shadowOpacity: 0.4,
                shadowRadius: 8,
              }}
            >
              <Text className="text-2xl">{message.symbol}</Text>
            </View>
            <View className="flex-1">
              <Text
                className="text-lg font-semibold mb-1"
                style={{ color: '#c8e6c9', fontFamily: 'serif', letterSpacing: 0.3 }}
              >
                {message.title}
              </Text>
              <Text
                className="text-sm"
                style={{ color: 'rgba(180, 210, 180, 0.6)' }}
                numberOfLines={2}
              >
                {message.message}
              </Text>
            </View>
            {/* Mystical sparkle indicator */}
            <View
              style={{
                width: 32,
                height: 32,
                borderRadius: 16,
                alignItems: 'center',
                justifyContent: 'center',
                marginLeft: 8,
                backgroundColor: 'rgba(80, 200, 120, 0.1)',
              }}
            >
              <Star size={14} color="rgba(150, 220, 150, 0.7)" fill="rgba(150, 220, 150, 0.3)" />
            </View>
          </View>
        </LinearGradient>
      </View>
    </AnimatedPressable>
  );
}

function MessageDetailModal({
  message,
  visible,
  onClose,
}: {
  message: GuidanceMessage | null;
  visible: boolean;
  onClose: () => void;
}) {
  const insets = useSafeAreaInsets();
  const symbolScale = useSharedValue(1);
  const symbolGlow = useSharedValue(0.3);

  useEffect(() => {
    if (visible) {
      symbolScale.value = withRepeat(
        withSequence(
          withTiming(1.08, { duration: 2500, easing: Easing.inOut(Easing.ease) }),
          withTiming(1, { duration: 2500, easing: Easing.inOut(Easing.ease) })
        ),
        -1
      );
      symbolGlow.value = withRepeat(
        withSequence(
          withTiming(0.7, { duration: 2500 }),
          withTiming(0.3, { duration: 2500 })
        ),
        -1
      );
    }
  }, [visible]);

  const symbolAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: symbolScale.value }],
  }));

  const glowAnimatedStyle = useAnimatedStyle(() => ({
    opacity: symbolGlow.value,
  }));

  if (!message) return null;

  return (
    <Modal
      visible={visible}
      animationType="fade"
      transparent
      statusBarTranslucent
      onRequestClose={onClose}
    >
      <View className="flex-1" style={{ backgroundColor: 'rgba(5, 12, 8, 0.98)' }}>
        <LinearGradient
          colors={['rgba(10, 30, 20, 1)', 'rgba(5, 15, 10, 1)', 'rgba(2, 8, 5, 1)']}
          className="flex-1"
        >
          {/* Floating particles in modal */}
          <FloatingParticle delay={0} size={4} left={15} duration={8000} />
          <FloatingParticle delay={1000} size={3} left={35} duration={10000} />
          <FloatingParticle delay={2000} size={5} left={55} duration={7000} />
          <FloatingParticle delay={500} size={3} left={75} duration={9000} />
          <FloatingParticle delay={1500} size={4} left={85} duration={11000} />

          {/* Background glow orbs */}
          <GlowingOrb style={{ position: 'absolute', top: '20%', left: -40 }} />
          <GlowingOrb style={{ position: 'absolute', bottom: '25%', right: -50 }} />

          {/* Close button */}
          <Animated.View
            entering={FadeIn.delay(200)}
            style={{ paddingTop: insets.top + 16, paddingRight: 20 }}
            className="absolute top-0 right-0 z-10"
          >
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

          <ScrollView
            contentContainerStyle={{
              paddingTop: insets.top + 80,
              paddingBottom: insets.bottom + 40,
              paddingHorizontal: 28,
              flexGrow: 1,
              justifyContent: 'center',
            }}
            showsVerticalScrollIndicator={false}
          >
            {/* Symbol with magical aura */}
            <Animated.View
              entering={FadeInUp.delay(100).springify()}
              className="items-center mb-10"
            >
              {/* Outer glow ring */}
              <Animated.View
                style={[
                  {
                    position: 'absolute',
                    width: 160,
                    height: 160,
                    borderRadius: 80,
                    backgroundColor: 'rgba(80, 200, 120, 0.08)',
                    shadowColor: '#50c878',
                    shadowOffset: { width: 0, height: 0 },
                    shadowOpacity: 0.5,
                    shadowRadius: 40,
                  },
                  glowAnimatedStyle,
                ]}
              />
              <Animated.View
                style={[
                  {
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
                  },
                  symbolAnimatedStyle,
                ]}
              >
                <Text className="text-6xl">{message.symbol}</Text>
              </Animated.View>
            </Animated.View>

            {/* Title with mystical styling */}
            <Animated.Text
              entering={FadeInUp.delay(200).springify()}
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
            </Animated.Text>

            {/* Magical divider */}
            <Animated.View
              entering={FadeIn.delay(300)}
              className="flex-row items-center justify-center mb-8"
            >
              <View style={{ width: 30, height: 1, backgroundColor: 'rgba(120, 220, 150, 0.3)' }} />
              <Moon size={16} color="rgba(150, 220, 150, 0.6)" style={{ marginHorizontal: 12 }} />
              <View style={{ width: 30, height: 1, backgroundColor: 'rgba(120, 220, 150, 0.3)' }} />
            </Animated.View>

            {/* Message with enchanted typography */}
            <Animated.Text
              entering={FadeInUp.delay(350).springify()}
              className="text-lg text-center"
              style={{
                color: 'rgba(200, 230, 200, 0.9)',
                fontFamily: 'serif',
                lineHeight: 32,
                letterSpacing: 0.3,
              }}
            >
              {message.message}
            </Animated.Text>

            {/* Bottom mystical decoration */}
            <Animated.View
              entering={FadeIn.delay(500)}
              className="items-center mt-12"
            >
              <View className="flex-row items-center">
                <Star size={12} color="rgba(150, 220, 150, 0.4)" fill="rgba(150, 220, 150, 0.2)" />
                <Sparkles size={20} color="rgba(150, 220, 150, 0.5)" style={{ marginHorizontal: 16 }} />
                <Star size={12} color="rgba(150, 220, 150, 0.4)" fill="rgba(150, 220, 150, 0.2)" />
              </View>
            </Animated.View>
          </ScrollView>
        </LinearGradient>
      </View>
    </Modal>
  );
}

export default function EnchantedForestScreen() {
  const insets = useSafeAreaInsets();
  const [selectedMessage, setSelectedMessage] = useState<GuidanceMessage | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

  const handleCardPress = useCallback((message: GuidanceMessage) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setSelectedMessage(message);
    setModalVisible(true);
  }, []);

  const handleCloseModal = useCallback(() => {
    setModalVisible(false);
    setTimeout(() => setSelectedMessage(null), 300);
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
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: insets.bottom + 100 }}
      >
        {/* Hero Section with Cover Image */}
        <View style={{ height: SCREEN_HEIGHT * 0.58 }}>
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
              bottom: 24,
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
                style={{ color: 'rgba(150, 220, 150, 0.8)' }}
              >
                Your Guide Through
              </Text>
            </Animated.View>
            <Animated.Text
              entering={FadeInUp.delay(300).springify()}
              className="text-4xl font-bold"
              style={{
                color: '#d4f0d4',
                fontFamily: 'serif',
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
              }}
            >
              10 messages of guidance, each a metaphor{'\n'}for life's enchanted pathway
            </Animated.Text>
          </View>
        </View>

        {/* Messages List */}
        <View className="px-4 -mt-2">
          <Animated.View
            entering={FadeIn.delay(500)}
            className="flex-row items-center mb-6"
          >
            <View
              style={{
                width: 36,
                height: 36,
                borderRadius: 18,
                alignItems: 'center',
                justifyContent: 'center',
                marginRight: 12,
                backgroundColor: 'rgba(80, 200, 120, 0.12)',
                borderWidth: 1,
                borderColor: 'rgba(80, 200, 120, 0.25)',
                shadowColor: '#50c878',
                shadowOffset: { width: 0, height: 0 },
                shadowOpacity: 0.4,
                shadowRadius: 8,
              }}
            >
              <Moon size={16} color="#78c878" />
            </View>
            <Text
              className="text-sm uppercase tracking-widest"
              style={{ color: 'rgba(150, 220, 150, 0.7)' }}
            >
              Wisdom of the Woods
            </Text>
          </Animated.View>

          {enchantedMessages.map((message, index) => (
            <GuidanceCard
              key={message.id}
              message={message}
              index={index}
              onPress={() => handleCardPress(message)}
            />
          ))}
        </View>
      </ScrollView>

      {/* Message Detail Modal */}
      <MessageDetailModal
        message={selectedMessage}
        visible={modalVisible}
        onClose={handleCloseModal}
      />
    </View>
  );
}
