import HomeTabIcon from '@assets/icons/HomeTabIcon';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from '@screens/HomeScreen';
import React from 'react';
import { BottomTabScreens } from '../utils/screen';
import StatsTabIcon from '@assets/icons/StatsTabIcon';
import WalletTabIcon from '@assets/icons/WalletTabIcon';
import ProfileTabIcon from '@assets/icons/ProfileTabIcon';
import { Platform } from 'react-native';
import AddTabButton from '@components/tab/AddTabButton';
import AddExpense from '@screens/AddExpense/Add';
import { useTheme } from '@context/ThemeContext';

const Tab = createBottomTabNavigator();

const BottomTabs = () => {
  const { theme, setTheme } = useTheme();
  const isDark = theme === 'dark';
  return (
    <Tab.Navigator
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
            <HomeTabIcon focused={focused} size={size ?? 24} />
          ),
        }}
      />

      <Tab.Screen
        name={BottomTabScreens.Stats}
        component={AddExpense}
        options={{
          tabBarIcon: ({ focused, size }) => (
            <StatsTabIcon focused={focused} size={focused ? 28 : size ?? 24} />
          ),
        }}
      />

      <Tab.Screen
        name={BottomTabScreens.AddExpense}
        component={AddExpense} // This screen won't render anything
        options={{
          tabBarButton: props => (
            <AddTabButton
              onPress={() => {
                setTheme(theme === 'dark' ? 'light' : 'dark'); // Toggle theme on button press
                // open your add modal / bottom sheet here
                // e.g. navigation.navigate('AddModal')
              }}
            />
          ),
        }}
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
          tabBarIcon: ({ focused }) => (
            <WalletTabIcon focused={focused} size={32} />
          ),
        }}
      />
      <Tab.Screen
        name={BottomTabScreens.Profile}
        component={HomeScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <ProfileTabIcon focused={focused} size={32} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export default BottomTabs;
