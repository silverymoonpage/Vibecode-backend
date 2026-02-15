import { useState, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  Pressable,
  Dimensions,
  Modal,
} from 'react-native';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import * as Haptics from 'expo-haptics';
import Animated, {
  FadeIn,
  FadeInDown,
  FadeInUp,
  FadeOut,
  SlideInRight,
  SlideOutLeft,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
  interpolate,
  Extrapolation,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { X, Sparkles, TreeDeciduous } from 'lucide-react-native';
import { enchantedMessages, type GuidanceMessage } from '@/data/enchanted-messages';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

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

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    scale.value = withSpring(0.97, { damping: 15 });
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 15 });
  };

  return (
    <AnimatedPressable
      entering={FadeInDown.delay(100 + index * 80).springify()}
      style={animatedStyle}
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      className="mb-3"
    >
      <BlurView
        intensity={25}
        tint="dark"
        className="rounded-2xl overflow-hidden"
      >
        <LinearGradient
          colors={['rgba(34, 47, 36, 0.85)', 'rgba(24, 36, 26, 0.9)']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={{
            paddingHorizontal: 20,
            paddingVertical: 18,
            borderRadius: 16,
            borderWidth: 1,
            borderColor: 'rgba(144, 179, 134, 0.2)',
          }}
        >
          <View className="flex-row items-center">
            <View
              className="w-12 h-12 rounded-full items-center justify-center mr-4"
              style={{ backgroundColor: 'rgba(144, 179, 134, 0.2)' }}
            >
              <Text className="text-2xl">{message.symbol}</Text>
            </View>
            <View className="flex-1">
              <Text
                className="text-lg font-semibold mb-1"
                style={{ color: '#E8F0E4', fontFamily: 'serif' }}
              >
                {message.title}
              </Text>
              <Text
                className="text-sm"
                style={{ color: 'rgba(200, 215, 195, 0.7)' }}
                numberOfLines={2}
              >
                {message.message}
              </Text>
            </View>
            <View
              className="w-8 h-8 rounded-full items-center justify-center ml-2"
              style={{ backgroundColor: 'rgba(144, 179, 134, 0.15)' }}
            >
              <Sparkles size={16} color="rgba(200, 215, 195, 0.6)" />
            </View>
          </View>
        </LinearGradient>
      </BlurView>
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

  if (!message) return null;

  return (
    <Modal
      visible={visible}
      animationType="fade"
      transparent
      statusBarTranslucent
      onRequestClose={onClose}
    >
      <View className="flex-1" style={{ backgroundColor: 'rgba(10, 18, 12, 0.95)' }}>
        <BlurView intensity={40} tint="dark" className="flex-1">
          <LinearGradient
            colors={['rgba(20, 35, 22, 0.9)', 'rgba(10, 18, 12, 0.95)', 'rgba(5, 12, 7, 1)']}
            className="flex-1"
          >
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
                className="w-10 h-10 rounded-full items-center justify-center"
                style={{ backgroundColor: 'rgba(144, 179, 134, 0.2)' }}
              >
                <X size={20} color="#E8F0E4" />
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
              {/* Symbol */}
              <Animated.View
                entering={FadeInUp.delay(100).springify()}
                className="items-center mb-8"
              >
                <View
                  className="w-28 h-28 rounded-full items-center justify-center"
                  style={{
                    backgroundColor: 'rgba(144, 179, 134, 0.15)',
                    borderWidth: 2,
                    borderColor: 'rgba(144, 179, 134, 0.3)',
                  }}
                >
                  <Text className="text-6xl">{message.symbol}</Text>
                </View>
              </Animated.View>

              {/* Title */}
              <Animated.Text
                entering={FadeInUp.delay(200).springify()}
                className="text-3xl font-bold text-center mb-8"
                style={{ color: '#E8F0E4', fontFamily: 'serif', letterSpacing: 0.5 }}
              >
                {message.title}
              </Animated.Text>

              {/* Divider */}
              <Animated.View
                entering={FadeIn.delay(300)}
                className="w-16 h-0.5 self-center mb-8"
                style={{ backgroundColor: 'rgba(144, 179, 134, 0.4)' }}
              />

              {/* Message */}
              <Animated.Text
                entering={FadeInUp.delay(350).springify()}
                className="text-lg text-center leading-8"
                style={{ color: 'rgba(220, 235, 215, 0.9)', fontFamily: 'serif', lineHeight: 32 }}
              >
                {message.message}
              </Animated.Text>

              {/* Bottom decoration */}
              <Animated.View
                entering={FadeIn.delay(500)}
                className="items-center mt-12"
              >
                <TreeDeciduous size={32} color="rgba(144, 179, 134, 0.3)" />
              </Animated.View>
            </ScrollView>
          </LinearGradient>
        </BlurView>
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
    <View className="flex-1" style={{ backgroundColor: '#0A120C' }}>
      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: insets.bottom + 100 }}
      >
        {/* Hero Section with Cover Image */}
        <View style={{ height: SCREEN_HEIGHT * 0.55 }}>
          <Image
            source={require('@/../../assets/images/enchanted-forest-cover.png')}
            style={{ width: '100%', height: '100%' }}
            contentFit="cover"
          />
          {/* Gradient overlay */}
          <LinearGradient
            colors={['transparent', 'rgba(10, 18, 12, 0.6)', 'rgba(10, 18, 12, 1)']}
            locations={[0.3, 0.7, 1]}
            style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              height: '70%',
            }}
          />
          {/* Title overlay */}
          <View
            style={{
              position: 'absolute',
              bottom: 20,
              left: 0,
              right: 0,
              paddingHorizontal: 24,
            }}
          >
            <Animated.Text
              entering={FadeInUp.delay(200).springify()}
              className="text-sm uppercase tracking-widest mb-2"
              style={{ color: 'rgba(144, 179, 134, 0.8)' }}
            >
              Your Guide Through
            </Animated.Text>
            <Animated.Text
              entering={FadeInUp.delay(300).springify()}
              className="text-4xl font-bold"
              style={{ color: '#E8F0E4', fontFamily: 'serif', lineHeight: 48 }}
            >
              The Enchanted{'\n'}Forest
            </Animated.Text>
            <Animated.Text
              entering={FadeInUp.delay(400).springify()}
              className="text-base mt-3"
              style={{ color: 'rgba(200, 215, 195, 0.7)', lineHeight: 24 }}
            >
              10 messages of guidance, each a metaphor{'\n'}for life's enchanted pathway
            </Animated.Text>
          </View>
        </View>

        {/* Messages List */}
        <View className="px-4 -mt-2">
          <Animated.View
            entering={FadeIn.delay(500)}
            className="flex-row items-center mb-5"
          >
            <View
              className="w-8 h-8 rounded-full items-center justify-center mr-3"
              style={{ backgroundColor: 'rgba(144, 179, 134, 0.2)' }}
            >
              <Sparkles size={16} color="#90B386" />
            </View>
            <Text
              className="text-sm uppercase tracking-widest"
              style={{ color: 'rgba(144, 179, 134, 0.7)' }}
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
