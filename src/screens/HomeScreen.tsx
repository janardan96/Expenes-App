import { View, Text, Image } from 'react-native';
import React from 'react';
import { useSelector } from 'react-redux';
import { profile } from '@stores/reducers/userReducers';

const HomeScreen = () => {
  const UserProfile = useSelector(profile);
  return (
    <View className="flex flex-1 ">
      <Image
        source={require('@assets/images/BackgroundCard.png')}
        className="w-full max-h-[290px] absolute top-0"
        resizeMode="cover"
      />
      <Text>HomeScreen {UserProfile?.name}</Text>
    </View>
  );
};

export default HomeScreen;
