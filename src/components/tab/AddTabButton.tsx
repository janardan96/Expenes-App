// components/AddTabButton.tsx
import AddTabIcon from '@assets/icons/AddExpenseIcon';
import React from 'react';
import { Pressable, StyleSheet, GestureResponderEvent } from 'react-native';
// import AddTabIcon from '@assets/icons/AddTabIcon';

type Props = {
  onPress?: (e: GestureResponderEvent) => void;
};

const AddTabButton: React.FC<Props> = ({ onPress }) => (
  <Pressable onPress={onPress} style={styles.wrapper} hitSlop={12}>
    <AddTabIcon size={65} />
  </Pressable>
);

const styles = StyleSheet.create({
  wrapper: {
    position: 'absolute',
    top: '-45%', // pulls it up above the tab bar top edge
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default AddTabButton;
