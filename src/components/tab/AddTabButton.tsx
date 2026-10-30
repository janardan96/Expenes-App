// components/tab/AddTabButton.tsx
import AddTabIcon from '@assets/icons/AddExpenseIcon';
import React from 'react';
import { Pressable, StyleSheet, GestureResponderEvent } from 'react-native';
// import AddTabIcon from '@assets/icons/AddTabIcon';

type Props = {
  onPress?: (e: GestureResponderEvent) => void;
  onLongPress?: (e: GestureResponderEvent) => void;
  size?: number;
};

const AddTabButton: React.FC<Props> = ({ onPress, onLongPress, size = 56 }) => (
  <Pressable
    onPress={onPress}
    onLongPress={onLongPress}
    hitSlop={12}
    style={styles.wrapper}
    className="active:opacity-90"
  >
    <AddTabIcon size={size} />
  </Pressable>
);

const styles = StyleSheet.create({
  wrapper: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default AddTabButton;
