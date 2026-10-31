import { Platform, StyleSheet } from 'react-native';

/** The card shadow used across the app's list/summary cards */
export const cardShadow = StyleSheet.create({
  card: {
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
}).card;
