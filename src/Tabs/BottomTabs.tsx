import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from '@screens/HomeScreen';
import React from 'react';
import { BottomTabScreens } from '../utils/screen';
const Tab = createBottomTabNavigator();

const BottomTabs = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarHideOnKeyboard: true,
      }}
      //   tabBar={props => <CustomTabBar {...props} />}
    >
      <Tab.Screen name={BottomTabScreens.Home} component={HomeScreen} />

      <Tab.Screen name={BottomTabScreens.Stats} component={HomeScreen} />
      <Tab.Screen name={BottomTabScreens.Wallet} component={HomeScreen} />
      <Tab.Screen name={BottomTabScreens.Profile} component={HomeScreen} />
      {/* <Tab.Screen name="Profile" component={ProfileScreen} /> */}
    </Tab.Navigator>
  );
};

export default BottomTabs;
