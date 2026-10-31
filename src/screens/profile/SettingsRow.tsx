import React from 'react';
import { Pressable, View } from 'react-native';
import { ChevronRight } from 'lucide-react-native';

import CustomText from '@components/common/CustomText';
import { useTheme } from '@context/ThemeContext';

interface Props {
  icon: React.ReactNode;
  title: string;
  subtitle?: string;
  value?: string;
  onPress?: () => void;
  destructive?: boolean;
  showChevron?: boolean;
}

const SettingsRow = ({
  icon,
  title,
  subtitle,
  value,
  onPress,
  destructive = false,
  showChevron = false,
}: Props) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const titleColor = destructive
    ? 'text-red-500'
    : 'text-gray-800 dark:text-gray-100';

  const tileColor = destructive
    ? 'rgba(239, 68, 68, 0.12)'
    : isDark
    ? 'rgba(127, 200, 194, 0.14)'
    : 'rgba(78, 147, 142, 0.12)';

  return (
    <Pressable
      onPress={onPress}
      disabled={!onPress}
      className="flex-row items-center gap-3 px-4 py-3.5 active:opacity-60"
    >
      <View
        className="h-9 w-9 items-center justify-center rounded-xl"
        style={{ backgroundColor: tileColor }}
      >
        {icon}
      </View>

      <View className="flex-1">
        <CustomText variant="h6" className={`font-medium ${titleColor}`}>
          {title}
        </CustomText>

        {subtitle ? (
          <CustomText
            variant="h8"
            className="mt-0.5 text-gray-500 dark:text-gray-400"
          >
            {subtitle}
          </CustomText>
        ) : null}
      </View>

      {value ? (
        <CustomText
          variant="h6"
          className="text-gray-500 dark:text-gray-400"
          numberOfLines={1}
        >
          {value}
        </CustomText>
      ) : null}

      {showChevron ? (
        <ChevronRight size={18} color={isDark ? '#6f6f6f' : '#b3b3b3'} />
      ) : null}
    </Pressable>
  );
};

export default SettingsRow;
