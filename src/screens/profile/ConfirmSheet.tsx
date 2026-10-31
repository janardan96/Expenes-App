import React from 'react';
import { Pressable, View } from 'react-native';

import BottomSheet from '@components/common/BottomSheet';
import CustomText from '@components/common/CustomText';

interface Props {
  visible: boolean;
  title: string;
  message: string;
  confirmLabel: string;
  cancelLabel: string;
  onConfirm: () => void;
  onClose: () => void;
}

const ConfirmSheet = ({
  visible,
  title,
  message,
  confirmLabel,
  cancelLabel,
  onConfirm,
  onClose,
}: Props) => (
  <BottomSheet visible={visible} onClose={onClose}>
    <View className="px-5 pt-4">
      <CustomText
        variant="h4"
        className="font-semibold text-gray-900 dark:text-gray-50"
      >
        {title}
      </CustomText>

      <CustomText
        variant="h6"
        className="mt-2 text-gray-500 dark:text-gray-400"
      >
        {message}
      </CustomText>
    </View>

    <View className="gap-2 px-3 pb-2 pt-5">
      <Pressable
        onPress={onConfirm}
        className="items-center rounded-2xl bg-red-500 py-3.5 active:opacity-80"
      >
        <CustomText variant="h5" className="font-semibold text-white">
          {confirmLabel}
        </CustomText>
      </Pressable>

      <Pressable
        onPress={onClose}
        className="items-center rounded-2xl bg-black/5 py-3.5 active:opacity-70 dark:bg-white/10"
      >
        <CustomText
          variant="h5"
          className="font-medium text-gray-700 dark:text-gray-200"
        >
          {cancelLabel}
        </CustomText>
      </Pressable>
    </View>
  </BottomSheet>
);

export default ConfirmSheet;
