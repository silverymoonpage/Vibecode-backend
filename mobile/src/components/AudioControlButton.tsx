import { Pressable, ViewStyle } from 'react-native';
import { Volume2, VolumeX } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import useAudioStore from '@/lib/state/audio-store';

interface AudioControlButtonProps {
  /** When true, renders inline (no absolute positioning). Default: false (floats top-right). */
  inline?: boolean;
}

export function AudioControlButton({ inline = false }: AudioControlButtonProps) {
  const insets = useSafeAreaInsets();
  const isMuted = useAudioStore((s) => s.isMuted);
  const toggleMute = useAudioStore((s) => s.toggleMute);

  const handlePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    toggleMute();
  };

  const positionStyle: ViewStyle = inline
    ? {}
    : { position: 'absolute', top: insets.top + 12, right: 16, zIndex: 100 };

  return (
    <Pressable
      onPress={handlePress}
      style={[
        positionStyle,
        {
          width: 40,
          height: 40,
          borderRadius: 20,
          backgroundColor: 'rgba(0, 0, 0, 0.45)',
          borderWidth: 1,
          borderColor: 'rgba(80, 200, 120, 0.3)',
          alignItems: 'center',
          justifyContent: 'center',
        },
      ]}
    >
      {isMuted ? (
        <VolumeX size={18} color="rgba(168, 212, 160, 0.5)" />
      ) : (
        <Volume2 size={18} color="rgba(168, 212, 160, 0.9)" />
      )}
    </Pressable>
  );
}
