import React from 'react';
import { View } from 'react-native';

/** Card that groups rows and draws a hairline divider between them. */
const SettingsGroup = ({ children }: { children: React.ReactNode }) => {
  const rows = React.Children.toArray(children);

  return (
    <View className="mt-2 overflow-hidden rounded-2xl border border-BDPrimary bg-white dark:border-BDPrimary-dark dark:bg-dark-card">
      {rows.map((row, index) => (
        <React.Fragment key={index}>
          {row}

          {index < rows.length - 1 ? (
            <View className="ml-16 border-b border-BDPrimary dark:border-BDPrimary-dark" />
          ) : null}
        </React.Fragment>
      ))}
    </View>
  );
};

export default SettingsGroup;
