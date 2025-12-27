/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import './global.css';
import { StyleSheet, Text, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

function App() {
  return (
    <LinearGradient
      colors={['#63B5AF', '#539E98', '#438883']}
      angle={135}
      style={styles.linearGradient}
      locations={[0.3, 0.5, 0.7]}
    >
      <View className="flex-1 items-center justify-center">
        <Text className="text-white text-5xl font-bold">Mono</Text>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  linearGradient: {
    flex: 1,
  },
});

export default App;
