import React from 'react';
import { Pressable, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { ArrowLeft } from 'lucide-react-native';

import CustomText from '@components/common/CustomText';
import { useTheme } from '@context/ThemeContext';
import { cardShadow } from '@utils/shadow';

interface Props {
  title: string;
  subtitle?: string;
}

/** Inner-screen header with a back button, used by the stack screens */
const PageHeader = ({ title, subtitle }: Props) => {
  const navigation = useNavigation();
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <View className="flex-row items-center gap-3 pt-2">
      <Pressable
        onPress={() => navigation.goBack()}
        hitSlop={8}
        className="h-9 w-9 items-center justify-center rounded-full bg-white dark:bg-dark-card"
        style={[
          cardShadow,
          { shadowColor: isDark ? '#000000' : '#438883' },
        ]}
      >
        <ArrowLeft size={18} color={isDark ? '#e5e7eb' : '#374151'} />
      </Pressable>

      <View>
        <CustomText
          variant="h4"
          className="font-semibold text-gray-800 dark:text-gray-100"
        >
          {title}
        </CustomText>

        {subtitle ? (
          <CustomText variant="h8" className="text-gray-500 dark:text-gray-400">
            {subtitle}
          </CustomText>
        ) : null}
      </View>
    </View>
  );
};

export default PageHeader;
