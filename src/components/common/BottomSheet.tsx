import React, { type ReactNode } from 'react';
import { Modal, Pressable, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

type Props = {
  visible: boolean;
  onClose: () => void;
  children: ReactNode;
  /** Keep the surface light in dark mode, for content that is not themed */
  light?: boolean;
};

/**
 * Translucent bottom sheet used across the app.
 * Tapping the backdrop dismisses it.
 */
const BottomSheet = ({ visible, onClose, children, light = false }: Props) => (
  <Modal
    visible={visible}
    transparent
    animationType="slide"
    statusBarTranslucent
    onRequestClose={onClose}
  >
    <View className="flex-1 justify-end bg-black/50">
      {/* Tapping the backdrop closes the sheet */}
      <Pressable className="flex-1" onPress={onClose} />

      <View
        className={`max-h-[100%] overflow-hidden rounded-t-3xl shadow-lg elevation-12 ${
          light ? 'bg-white' : 'bg-white dark:bg-dark-card'
        }`}
      >
        <View className="items-center pb-1 pt-3">
          <View className="h-1 w-10 rounded-full bg-gray-300 dark:bg-gray-600" />
        </View>

        {children}

        <SafeAreaView edges={['bottom']} className="pb-3" />
      </View>
    </View>
  </Modal>
);

export default BottomSheet;
