import {
  View,
  Text,
  Modal,
  Pressable,
  ScrollView,
} from 'react-native';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface PrivacyPolicyModalProps {
  visible: boolean;
  onClose: () => void;
}

export function PrivacyPolicyModal({ visible, onClose }: PrivacyPolicyModalProps) {
  const insets = useSafeAreaInsets();

  return (
    <Modal
      visible={visible}
      animationType="fade"
      transparent
      statusBarTranslucent
      onRequestClose={onClose}
    >
      <View style={{ flex: 1, backgroundColor: '#050d08' }}>
        {/* Background image */}
        <Image
          source={require('@/../assets/images/latest-vibecode-new-menu-background.jpg')}
          style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
          contentFit="cover"
          contentPosition="center"
        />

        {/* Dark gradient overlay */}
        <LinearGradient
          colors={[
            'rgba(5,13,8,0.55)',
            'rgba(5,13,8,0.72)',
            'rgba(5,13,8,0.88)',
            'rgba(5,13,8,0.96)',
          ]}
          locations={[0, 0.3, 0.65, 1]}
          style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
        />

        {/* Close button */}
        <View
          style={{
            position: 'absolute',
            top: insets.top + 16,
            right: 20,
            zIndex: 20,
          }}
        >
          <Pressable
            onPress={onClose}
            style={({ pressed }) => ({ opacity: pressed ? 0.5 : 1, padding: 8 })}
          >
            <Text style={{ color: 'rgba(180,180,180,0.7)', fontSize: 22, lineHeight: 22 }}>
              ×
            </Text>
          </Pressable>
        </View>

        {/* Scrollable content */}
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={{
            paddingTop: insets.top + 60,
            paddingBottom: insets.bottom + 40,
            paddingHorizontal: 28,
          }}
          showsVerticalScrollIndicator={false}
        >
          {/* Title */}
          <Text
            style={{
              fontFamily: 'serif',
              color: '#d4f0d4',
              fontSize: 26,
              fontWeight: '700',
              marginBottom: 8,
              textShadowColor: 'rgba(80,200,120,0.4)',
              textShadowOffset: { width: 0, height: 0 },
              textShadowRadius: 10,
            }}
          >
            Privacy Policy
          </Text>

          {/* Effective date */}
          <Text
            style={{
              fontFamily: 'serif',
              color: 'rgba(150,200,150,0.6)',
              fontSize: 13,
              fontStyle: 'italic',
              marginBottom: 28,
            }}
          >
            Effective Date: April 22, 2026
          </Text>

          {/* Section: Overview */}
          <Text
            style={{
              fontFamily: 'serif',
              color: '#a8d4a0',
              fontSize: 15,
              fontWeight: '700',
              marginTop: 20,
              marginBottom: 6,
            }}
          >
            Overview
          </Text>
          <Text
            style={{
              fontFamily: 'serif',
              color: 'rgba(200,230,200,0.85)',
              fontSize: 14,
              lineHeight: 22,
            }}
          >
            Enchanted Path ("we", "our", or "us") is committed to protecting your privacy. This Privacy Policy explains our practices regarding the information we handle when you use our app.
          </Text>

          {/* Section: Information We Do Not Collect */}
          <Text
            style={{
              fontFamily: 'serif',
              color: '#a8d4a0',
              fontSize: 15,
              fontWeight: '700',
              marginTop: 20,
              marginBottom: 6,
            }}
          >
            Information We Do Not Collect
          </Text>
          <Text
            style={{
              fontFamily: 'serif',
              color: 'rgba(200,230,200,0.85)',
              fontSize: 14,
              lineHeight: 22,
            }}
          >
            We do not collect, store, or transmit any personal information. Enchanted Path does not require you to create an account or provide any personal data to use the app. We do not collect your name, email address, location, device identifiers, or any other personally identifiable information.
          </Text>

          {/* Section: In-App Purchases */}
          <Text
            style={{
              fontFamily: 'serif',
              color: '#a8d4a0',
              fontSize: 15,
              fontWeight: '700',
              marginTop: 20,
              marginBottom: 6,
            }}
          >
            In-App Purchases
          </Text>
          <Text
            style={{
              fontFamily: 'serif',
              color: 'rgba(200,230,200,0.85)',
              fontSize: 14,
              lineHeight: 22,
            }}
          >
            Enchanted Path offers a one-time in-app purchase to unlock the full journey. All payment transactions are processed securely by Apple through the App Store. We do not have access to your payment information. Purchase records are managed by Apple and subject to Apple's Privacy Policy.
          </Text>

          {/* Section: Audio Content */}
          <Text
            style={{
              fontFamily: 'serif',
              color: '#a8d4a0',
              fontSize: 15,
              fontWeight: '700',
              marginTop: 20,
              marginBottom: 6,
            }}
          >
            Audio Content
          </Text>
          <Text
            style={{
              fontFamily: 'serif',
              color: 'rgba(200,230,200,0.85)',
              fontSize: 14,
              lineHeight: 22,
            }}
          >
            The app includes ambient audio tracks that play locally on your device. No audio data is recorded, transmitted, or stored by us.
          </Text>

          {/* Section: Third-Party Services */}
          <Text
            style={{
              fontFamily: 'serif',
              color: '#a8d4a0',
              fontSize: 15,
              fontWeight: '700',
              marginTop: 20,
              marginBottom: 6,
            }}
          >
            Third-Party Services
          </Text>
          <Text
            style={{
              fontFamily: 'serif',
              color: 'rgba(200,230,200,0.85)',
              fontSize: 14,
              lineHeight: 22,
            }}
          >
            We use RevenueCat to manage in-app purchase entitlements. RevenueCat may collect certain non-personal, anonymized data related to purchase transactions. Please refer to RevenueCat's privacy policy for details. We do not use advertising networks, analytics services, or any other third-party data collection services.
          </Text>

          {/* Section: Children's Privacy */}
          <Text
            style={{
              fontFamily: 'serif',
              color: '#a8d4a0',
              fontSize: 15,
              fontWeight: '700',
              marginTop: 20,
              marginBottom: 6,
            }}
          >
            Children's Privacy
          </Text>
          <Text
            style={{
              fontFamily: 'serif',
              color: 'rgba(200,230,200,0.85)',
              fontSize: 14,
              lineHeight: 22,
            }}
          >
            Enchanted Path is suitable for all ages. We do not knowingly collect any personal information from children or anyone else, consistent with our no-collection policy described above.
          </Text>

          {/* Section: Changes to This Privacy Policy */}
          <Text
            style={{
              fontFamily: 'serif',
              color: '#a8d4a0',
              fontSize: 15,
              fontWeight: '700',
              marginTop: 20,
              marginBottom: 6,
            }}
          >
            Changes to This Privacy Policy
          </Text>
          <Text
            style={{
              fontFamily: 'serif',
              color: 'rgba(200,230,200,0.85)',
              fontSize: 14,
              lineHeight: 22,
            }}
          >
            We may update this Privacy Policy from time to time. Any changes will be reflected in the app with an updated effective date. Continued use of the app after changes constitutes acceptance of the revised policy.
          </Text>

          {/* Section: Contact Us */}
          <Text
            style={{
              fontFamily: 'serif',
              color: '#a8d4a0',
              fontSize: 15,
              fontWeight: '700',
              marginTop: 20,
              marginBottom: 6,
            }}
          >
            Contact Us
          </Text>
          <Text
            style={{
              fontFamily: 'serif',
              color: 'rgba(200,230,200,0.85)',
              fontSize: 14,
              lineHeight: 22,
            }}
          >
            If you have questions about this Privacy Policy, please contact us through the App Store support page for Enchanted Path.
          </Text>
        </ScrollView>
      </View>
    </Modal>
  );
}
