import { useEffect, useState, useCallback } from 'react';
import { PrivacyPolicyModal } from './PrivacyPolicyModal';
import {
  View,
  Text,
  Modal,
  Pressable,
  ActivityIndicator,
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
  Easing,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Sparkles, Lock } from 'lucide-react-native';
import usePurchaseStore from '@/lib/state/purchase-store';

const PRODUCT_ID = 'com.enchantedpath.fulljourney';

// ---------------------------------------------------------------------------
// Emerald glow pulse for the CTA button
// ---------------------------------------------------------------------------
function GlowPulse() {
  const opacity = useSharedValue(0.4);

  useEffect(() => {
    opacity.value = withRepeat(
      withSequence(
        withTiming(0.9, { duration: 1600, easing: Easing.inOut(Easing.ease) }),
        withTiming(0.3, { duration: 1600, easing: Easing.inOut(Easing.ease) })
      ),
      -1
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
          top: -8,
          left: -8,
          right: -8,
          bottom: -8,
          borderRadius: 28,
          backgroundColor: 'rgba(80, 200, 120, 0.18)',
          shadowColor: '#50c878',
          shadowOffset: { width: 0, height: 0 },
          shadowOpacity: 1,
          shadowRadius: 20,
        },
        animatedStyle,
      ]}
    />
  );
}

// ---------------------------------------------------------------------------
// PaywallModal
// ---------------------------------------------------------------------------
interface PaywallModalProps {
  visible: boolean;
  onClose: () => void;
  onPurchaseSuccess: () => void;
}

export function PaywallModal({
  visible,
  onClose,
  onPurchaseSuccess,
}: PaywallModalProps) {
  const insets = useSafeAreaInsets();
  const setUnlocked = usePurchaseStore((s) => s.setUnlocked);

  const [displayPrice, setDisplayPrice] = useState<string>('$6.99');
  const [isPurchasing, setIsPurchasing] = useState(false);
  const [isRestoring, setIsRestoring] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);
  const [privacyVisible, setPrivacyVisible] = useState(false);

  // Fetch real product price on mount
  useEffect(() => {
    if (!visible) return;
    let cancelled = false;

    async function fetchPrice() {
      try {
        const Purchases = (await import('react-native-purchases')).default;
        const products = await Purchases.getProducts([PRODUCT_ID]);
        if (!cancelled && products.length > 0) {
          setDisplayPrice(products[0].priceString);
        }
      } catch (_err) {
        // Not configured or unavailable — keep default price
      }
    }

    fetchPrice();
    return () => {
      cancelled = true;
    };
  }, [visible]);

  const showFeedback = useCallback((msg: string) => {
    setFeedbackMessage(msg);
    setTimeout(() => setFeedbackMessage(null), 3000);
  }, []);

  const handlePurchase = useCallback(async () => {
    if (isPurchasing) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setIsPurchasing(true);
    try {
      const Purchases = (await import('react-native-purchases')).default;
      const result = await Purchases.purchaseProduct(PRODUCT_ID);
      // Check entitlements or active subscriptions
      const info = result.customerInfo;
      const hasEntitlement =
        info.entitlements.active['full_journey'] !== undefined ||
        info.allPurchasedProductIdentifiers.includes(PRODUCT_ID) ||
        (info.nonSubscriptionTransactions ?? []).some(
          (t: { productIdentifier: string }) => t.productIdentifier === PRODUCT_ID
        );

      if (hasEntitlement) {
        setUnlocked(true);
        onPurchaseSuccess();
      } else {
        showFeedback('Purchase recorded — enjoy the full journey!');
        setUnlocked(true);
        onPurchaseSuccess();
      }
    } catch (err: unknown) {
      const errCode = (err as { userCancelled?: boolean })?.userCancelled;
      if (errCode) {
        // User cancelled — silent
      } else {
        console.log('[Paywall] Purchase error:', err);
        showFeedback('Purchase could not be completed. Please try again.');
      }
    } finally {
      setIsPurchasing(false);
    }
  }, [isPurchasing, setUnlocked, onPurchaseSuccess, showFeedback]);

  const handleRestore = useCallback(async () => {
    if (isRestoring) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setIsRestoring(true);
    try {
      const Purchases = (await import('react-native-purchases')).default;
      const info = await Purchases.restorePurchases();
      const hasEntitlement =
        info.entitlements.active['full_journey'] !== undefined ||
        info.allPurchasedProductIdentifiers.includes(PRODUCT_ID) ||
        (info.nonSubscriptionTransactions ?? []).some(
          (t: { productIdentifier: string }) => t.productIdentifier === PRODUCT_ID
        );

      if (hasEntitlement) {
        setUnlocked(true);
        showFeedback('Purchase restored!');
        onPurchaseSuccess();
      } else {
        showFeedback('No previous purchase found.');
      }
    } catch (err) {
      console.log('[Paywall] Restore error:', err);
      showFeedback('Could not restore purchases. Please try again.');
    } finally {
      setIsRestoring(false);
    }
  }, [isRestoring, setUnlocked, onPurchaseSuccess, showFeedback]);

  const handleClose = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onClose();
  }, [onClose]);

  return (
    <Modal
      visible={visible}
      animationType="fade"
      transparent
      statusBarTranslucent
      onRequestClose={handleClose}
    >
      <View style={{ flex: 1, backgroundColor: '#050d08' }}>
        {/* Background image */}
        <Image
          source={require('@/../assets/images/latest-vibecode-new-menu-background.jpg')}
          style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
          contentFit="cover"
          contentPosition="center"
        />

        {/* Dark gradient overlay for readability */}
        <LinearGradient
          colors={[
            'rgba(5, 13, 8, 0.55)',
            'rgba(5, 13, 8, 0.72)',
            'rgba(5, 13, 8, 0.88)',
            'rgba(5, 13, 8, 0.96)',
          ]}
          locations={[0, 0.3, 0.65, 1]}
          style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
        />

        {/* Close button */}
        <Animated.View
          entering={FadeIn.delay(100)}
          style={{
            position: 'absolute',
            top: insets.top + 16,
            right: 20,
            zIndex: 20,
          }}
        >
          <Pressable
            onPress={handleClose}
            style={({ pressed }) => ({ opacity: pressed ? 0.5 : 1, padding: 8 })}
          >
            <Text style={{ color: 'rgba(180, 180, 180, 0.7)', fontSize: 22, lineHeight: 22 }}>×</Text>
          </Pressable>
        </Animated.View>

        {/* Content */}
        <View
          style={{
            flex: 1,
            justifyContent: 'flex-end',
            paddingBottom: insets.bottom + 40,
            paddingHorizontal: 28,
          }}
        >
          {/* Lock icon + sparkle header */}
          <Animated.View
            entering={FadeInUp.delay(150).springify()}
            style={{ alignItems: 'center', marginBottom: 24 }}
          >
            <View
              style={{
                width: 80,
                height: 80,
                borderRadius: 40,
                backgroundColor: 'rgba(80, 200, 120, 0.08)',
                borderWidth: 1.5,
                borderColor: 'rgba(80, 200, 120, 0.3)',
                alignItems: 'center',
                justifyContent: 'center',
                shadowColor: '#50c878',
                shadowOffset: { width: 0, height: 0 },
                shadowOpacity: 0.5,
                shadowRadius: 20,
                marginBottom: 20,
              }}
            >
              <Lock size={32} color="#50c878" />
            </View>

            {/* Decorative sparkle row */}
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 16 }}>
              <View
                style={{ width: 40, height: 1, backgroundColor: 'rgba(120, 220, 150, 0.3)' }}
              />
              <Sparkles
                size={14}
                color="rgba(150, 220, 150, 0.7)"
                style={{ marginHorizontal: 10 }}
              />
              <View
                style={{ width: 40, height: 1, backgroundColor: 'rgba(120, 220, 150, 0.3)' }}
              />
            </View>
          </Animated.View>

          {/* Title */}
          <Animated.Text
            entering={FadeInUp.delay(200).springify()}
            style={{
              color: '#d4f0d4',
              fontFamily: 'serif',
              fontSize: 30,
              fontWeight: '700',
              textAlign: 'center',
              letterSpacing: 0.5,
              lineHeight: 38,
              textShadowColor: 'rgba(80, 200, 120, 0.4)',
              textShadowOffset: { width: 0, height: 0 },
              textShadowRadius: 12,
              marginBottom: 14,
            }}
          >
            Unlock the Full Journey
          </Animated.Text>

          {/* Subtitle */}
          <Animated.Text
            entering={FadeInUp.delay(260).springify()}
            style={{
              color: 'rgba(180, 220, 180, 0.75)',
              fontSize: 16,
              textAlign: 'center',
              fontFamily: 'serif',
              fontStyle: 'italic',
              lineHeight: 24,
              marginBottom: 36,
            }}
          >
            Continue through all 10 stops of your enchanted path
          </Animated.Text>

          {/* Feature bullets */}
          <Animated.View
            entering={FadeInUp.delay(310).springify()}
            style={{ marginBottom: 32 }}
          >
            {[
              'All 10 enchanted stops revealed',
              'Timeless wisdom for life\'s journey',
              'Yours forever — no subscription',
            ].map((line, i) => (
              <View
                key={i}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  marginBottom: 10,
                }}
              >
                <View
                  style={{
                    width: 6,
                    height: 6,
                    borderRadius: 3,
                    backgroundColor: '#50c878',
                    marginRight: 12,
                    shadowColor: '#50c878',
                    shadowOffset: { width: 0, height: 0 },
                    shadowOpacity: 0.8,
                    shadowRadius: 4,
                  }}
                />
                <Text
                  style={{
                    color: 'rgba(200, 230, 200, 0.85)',
                    fontSize: 14,
                    fontFamily: 'serif',
                  }}
                >
                  {line}
                </Text>
              </View>
            ))}
          </Animated.View>

          {/* Feedback message */}
          {feedbackMessage ? (
            <Animated.Text
              entering={FadeIn}
              style={{
                color: 'rgba(180, 230, 180, 0.9)',
                fontSize: 13,
                textAlign: 'center',
                marginBottom: 12,
                fontFamily: 'serif',
              }}
            >
              {feedbackMessage}
            </Animated.Text>
          ) : null}

          {/* CTA button */}
          <Animated.View
            entering={FadeInUp.delay(360).springify()}
            style={{ position: 'relative', marginBottom: 16 }}
          >
            <GlowPulse />
            <Pressable
              onPress={handlePurchase}
              disabled={isPurchasing || isRestoring}
              style={({ pressed }) => ({
                backgroundColor: pressed ? '#3daa62' : '#50c878',
                borderRadius: 20,
                paddingVertical: 18,
                paddingHorizontal: 16,
                alignItems: 'center',
                justifyContent: 'center',
                shadowColor: '#50c878',
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.6,
                shadowRadius: 16,
                opacity: isPurchasing || isRestoring ? 0.7 : 1,
              })}
            >
              {isPurchasing ? (
                <ActivityIndicator color="#050d08" size="small" />
              ) : (
                <Text
                  numberOfLines={1}
                  style={{
                    color: '#050d08',
                    fontSize: 18,
                    fontWeight: '700',
                    fontFamily: 'serif',
                    letterSpacing: 0.3,
                  }}
                >
                  Unlock Full Journey · {displayPrice}
                </Text>
              )}
            </Pressable>
          </Animated.View>

          {/* One-time purchase note */}
          <Animated.Text
            entering={FadeInUp.delay(400).springify()}
            style={{
              color: 'rgba(150, 200, 150, 0.6)',
              fontSize: 12,
              textAlign: 'center',
              marginBottom: 16,
              letterSpacing: 0.3,
            }}
          >
            One-time purchase • No subscription
          </Animated.Text>

          {/* Restore purchases */}
          <Animated.View entering={FadeInUp.delay(430).springify()} style={{ alignItems: 'center' }}>
            <Pressable
              onPress={handleRestore}
              disabled={isRestoring || isPurchasing}
              style={({ pressed }) => ({ opacity: pressed ? 0.5 : 1 })}
            >
              {isRestoring ? (
                <ActivityIndicator color="rgba(150, 200, 150, 0.5)" size="small" />
              ) : (
                <Text
                  style={{
                    color: 'rgba(150, 200, 150, 0.5)',
                    fontSize: 13,
                    textDecorationLine: 'underline',
                    fontFamily: 'serif',
                  }}
                >
                  Restore Purchases
                </Text>
              )}
            </Pressable>
          </Animated.View>

          {/* Privacy Policy link */}
          <Animated.View
            entering={FadeInUp.delay(460).springify()}
            style={{ alignItems: 'center', marginTop: 12 }}
          >
            <Pressable
              onPress={() => setPrivacyVisible(true)}
              style={({ pressed }) => ({ opacity: pressed ? 0.5 : 1 })}
            >
              <Text
                style={{
                  color: 'rgba(120,180,120,0.45)',
                  fontSize: 12,
                  textDecorationLine: 'underline',
                  fontFamily: 'serif',
                }}
              >
                Privacy Policy
              </Text>
            </Pressable>
          </Animated.View>
        </View>

        <PrivacyPolicyModal visible={privacyVisible} onClose={() => setPrivacyVisible(false)} />
      </View>
    </Modal>
  );
}
