import { createNativeStackNavigator } from '@react-navigation/native-stack';
import * as React from 'react';
import SplashScreen from '../screens/SplashScreen';
import { NavigationContainer } from '@react-navigation/native';
import LoginScreen from '@screens/login';
import StartUpScreen from '@screens/StartUpScreen';
import TransactionsScreen from '@screens/transactionScreen';
import CategoriesScreen from '@screens/categoriesScreen';
import BottomTabs from '../Tabs/BottomTabs';
import { ScreensName } from '../utils/screen';

const Stack = createNativeStackNavigator();

function RootStack() {
  return (
    <Stack.Navigator
      initialRouteName={ScreensName.SplashScreen}
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name={ScreensName.SplashScreen} component={SplashScreen} />
      <Stack.Screen
        options={{ animation: 'fade' }}
        name={ScreensName.StartUpScreen}
        component={StartUpScreen}
      />
      <Stack.Screen
        options={{ animation: 'slide_from_right' }}
        name={ScreensName.LoginScreen}
        component={LoginScreen}
      />
      <Stack.Screen
        options={{ animation: 'fade' }}
        name={ScreensName.UserBottomTab}
        component={BottomTabs}
      />
      <Stack.Screen
        options={{ animation: 'slide_from_right' }}
        name={ScreensName.Transactions}
        component={TransactionsScreen}
      />
      <Stack.Screen
        options={{ animation: 'slide_from_right' }}
        name={ScreensName.Categories}
        component={CategoriesScreen}
      />
    </Stack.Navigator>
  );
}

export function NavigationWrapper() {
  return (
    <NavigationContainer>
      <RootStack />
    </NavigationContainer>
  );
}
