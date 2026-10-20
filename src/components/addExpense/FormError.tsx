import React from 'react';
import { View } from 'react-native';
import { CircleAlert } from 'lucide-react-native';
import CustomText from '@components/common/CustomText';

interface FormErrorProps {
  message?: string;
}

const FormError = ({ message }: FormErrorProps) => {
  if (!message) {
    return null;
  }

  return (
    <View className="flex-row items-center gap-1 mt-1.5">
      <CircleAlert size={12} color="#ef4444" />
      <CustomText variant="h8" className="text-red-500 flex-1">
        {message}
      </CustomText>
    </View>
  );
};

export default FormError;
