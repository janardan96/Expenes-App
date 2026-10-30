import HomeTabIcon from '@assets/icons/HomeTabIcon';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from '@screens/HomeScreen';
import React from 'react';
import { BottomTabScreens } from '../utils/screen';
import StatsTabIcon from '@assets/icons/StatsTabIcon';
import WalletTabIcon from '@assets/icons/WalletTabIcon';
import ProfileTabIcon from '@assets/icons/ProfileTabIcon';
import { Platform } from 'react-native';
import GlassTabBar from '@components/tab/GlassTabBar';
import AddExpense from '@screens/AddExpense/Add';
import { useTheme } from '@context/ThemeContext';
import { useNavigation, type NavigationProp } from '@react-navigation/native';

const Tab = createBottomTabNavigator();

const BottomTabs = () => {
  const { theme, setTheme } = useTheme();
  const navigation =
    useNavigation<NavigationProp<Record<string, object | undefined>>>();
  const isDark = theme === 'dark';
  return (
    <Tab.Navigator
      tabBar={props => <GlassTabBar {...props} />}
      screenOptions={{
        headerShown: false,
        tabBarHideOnKeyboard: true,
        tabBarShowLabel: false,
        tabBarStyle: {
          height: Platform.OS === 'ios' ? 80 : 60,
          paddingTop: 12,
          paddingBottom: 0,
          backgroundColor: isDark ? '#242626' : '#FFFFFF',
          borderTopColor: isDark ? '#1C3B36' : '#EAEAEA',
          // borderTopWidth: 1,
          elevation: 0, // removes default Android shadow that can look off in dark mode
          shadowOpacity: 0, // removes default iOS shadow
        },
        tabBarIconStyle: {
          marginTop: 0,
          marginBottom: 0,
        },
        tabBarItemStyle: {
          paddingBottom: 0,
        },
      }}
    >
      <Tab.Screen
        name={BottomTabScreens.Home}
        component={HomeScreen}
        options={{
          tabBarIcon: ({ focused, size }) => (
            <HomeTabIcon focused={focused} size={20} />
          ),
        }}
      />

      <Tab.Screen
        name={BottomTabScreens.Stats}
        component={AddExpense}
        options={{
          tabBarIcon: ({ focused, size }) => (
            <StatsTabIcon focused={focused} size={20} />
          ),
        }}
      />

      <Tab.Screen
        name={BottomTabScreens.AddExpense}
        component={AddExpense} // This screen won't render anything
        listeners={{
          tabPress: e => {
            // stop React Navigation from treating this as a normal tab switch
            e.preventDefault();
          },
        }}
      />

      <Tab.Screen
        name={BottomTabScreens.Wallet}
        component={HomeScreen}
        options={{
          tabBarIcon: ({ focused, size }) => (
            <WalletTabIcon focused={focused} size={26} />
          ),
        }}
      />
      <Tab.Screen
        name={BottomTabScreens.Profile}
        component={HomeScreen}
        options={{
          tabBarIcon: ({ focused, size }) => (
            <ProfileTabIcon focused={focused} size={22} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export default BottomTabs;
