import { View } from 'react-native';
import React, { type ReactNode } from 'react';

type WrapperProps = {
  children: ReactNode;
};

const Layout = ({ children }: WrapperProps) => {
  return <View className="flex-1 bg-lightBG dark:bg-dark-bg">{children}</View>;
};

export default Layout;
