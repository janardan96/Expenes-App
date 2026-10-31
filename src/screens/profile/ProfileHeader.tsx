import React from 'react';
import { View } from 'react-native';
import { User } from 'lucide-react-native';

import CustomText from '@components/common/CustomText';

const getInitials = (name: string) =>
  name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map(part => part.charAt(0).toUpperCase())
    .join('');

interface Props {
  name: string;
  contact: string;
  guestLabel: string;
}

const ProfileHeader = ({ name, contact, guestLabel }: Props) => (
  <View className="items-center pt-5">
    <View className="h-20 w-20 items-center justify-center rounded-full bg-primary dark:bg-primaryDark">
      {name ? (
        <CustomText fontSize={26} className="font-semibold text-white">
          {getInitials(name)}
        </CustomText>
      ) : (
        <User size={34} color="#ffffff" strokeWidth={1.8} />
      )}
    </View>

    <CustomText
      variant="h3"
      className="mt-3 font-semibold text-gray-900 dark:text-gray-50"
    >
      {name || guestLabel}
    </CustomText>

    <CustomText
      variant="h7"
      className="mt-1 px-8 text-center text-gray-500 dark:text-gray-400"
    >
      {contact}
    </CustomText>
  </View>
);

export default ProfileHeader;
