import React, { useEffect, useState } from 'react';
import { Keyboard, Pressable, View } from 'react-native';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import AddTabButton from '@components/tab/AddTabButton';
import { useTheme } from '@context/ThemeContext';
import { BottomTabScreens } from '@utils/screen';

/**
 * Floating bottom tab bar:
 *   - a rounded bar that hovers above the content
 *   - the background follows the theme (white / dark)
 *   - the active tab is highlighted through its icon and label colour
 */
const GlassTabBar = ({ state, descriptors, navigation }: BottomTabBarProps) => {
  const insets = useSafeAreaInsets();
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';

  const [keyboardVisible, setKeyboardVisible] = useState(false);

  useEffect(() => {
    const show = Keyboard.addListener('keyboardDidShow', () =>
      setKeyboardVisible(true),
    );
    const hide = Keyboard.addListener('keyboardDidHide', () =>
      setKeyboardVisible(false),
    );

    return () => {
      show.remove();
      hide.remove();
    };
  }, []);

  const activeColor = isDark ? '#7fc8c2' : '#4E938E';
  const inactiveColor = isDark ? '#8e8e8e' : '#AAAAAA';

  return (
    <View className="h-[72px] bg-lightBG dark:bg-dark-bg">
      <View
        className={`absolute left-8 right-8 -bottom-4 items-center justify-end
         ${
           keyboardVisible
             ? 'opacity-0 translate-y-[120px]'
             : 'opacity-100 translate-y-0'
         }
         `}
        style={{ paddingBottom: Math.max(insets.bottom, 10) }}
      >
        {/* -------------------------------------
          BAR
      ------------------------------------- */}

        <View
          pointerEvents={keyboardVisible ? 'none' : 'auto'}
          className="w-full mx-[14px] rounded-[31px] shadow-lg elevation-10"
        >
          <View className="h-[52px] rounded-[31px] border-[0.5px] border-black/10 dark:border-white/10 bg-white dark:bg-dark-bg overflow-hidden flex-row items-center justify-between">
            {state.routes.map((route, index) => {
              const { options } = descriptors[route.key];
              const isFocused = state.index === index;
              const isCreateButton = route.name === BottomTabScreens.AddExpense;

              // The create button is rendered on top of the bar
              if (isCreateButton) {
                return <View key={route.key} className="flex-1" />;
              }

              const onPress = () => {
                const event = navigation.emit({
                  type: 'tabPress',
                  target: route.key,
                  canPreventDefault: true,
                });

                if (!isFocused && !event.defaultPrevented) {
                  navigation.navigate(route.name);
                }
              };

              const icon = options.tabBarIcon?.({
                focused: isFocused,
                color: isFocused ? activeColor : inactiveColor,
                size: 26,
              });

              return (
                <Pressable
                  key={route.key}
                  accessibilityRole="button"
                  accessibilityState={isFocused ? { selected: true } : {}}
                  onPress={onPress}
                  className="flex-1 items-center justify-center gap-[5px]"
                >
                  <View className="items-center justify-center">{icon}</View>
                </Pressable>
              );
            })}
          </View>
        </View>

        {/* -------------------------------------
          RAISED CREATE BUTTON
      ------------------------------------- */}
        <View
          pointerEvents="box-none"
          className="absolute bottom-[42px] self-center"
        >
          <AddTabButton
            onPress={() => navigation.navigate(BottomTabScreens.Stats)}
            onLongPress={toggleTheme}
          />
        </View>
      </View>
    </View>
  );
};

export default GlassTabBar;
