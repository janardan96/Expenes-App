/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import './global.css';
import { NavigationWrapper } from '@navigation/Navigation';
import { Provider } from 'react-redux';
import store, { persistore } from '@stores/reducers/store';
import { PersistGate } from 'redux-persist/es/integration/react';
import { ThemeProvider } from '@context/ThemeContext';
import { LanguageProvider } from '@context/LanguageContext';

function App() {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistore}>
        <ThemeProvider>
          <LanguageProvider>
            <NavigationWrapper />
          </LanguageProvider>
        </ThemeProvider>
      </PersistGate>
    </Provider>
  );
}

export default App;
