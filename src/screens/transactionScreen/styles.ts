import { Platform, StyleSheet } from 'react-native';

/** Shared card shadow so every block on the screen lines up */
export const styles = StyleSheet.create({
  cardShadow: {
    ...Platform.select({
      ios: {
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 8,
      },
      android: {
        elevation: 2,
      },
    }),
  },
});
