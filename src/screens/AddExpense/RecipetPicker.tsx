/**
 * ReceiptScannerScreen.tsx
 *
 * Full screen: pick/capture a receipt image -> run on-device OCR (ML Kit)
 * -> auto-fill an editable "Total" field the user can correct before saving.
 *
 * Dependencies (install these first):
 *   npm install react-native-image-picker
 *   npm install @react-native-ml-kit/text-recognition
 *   npm install react-native-safe-area-context
 *   npm install nativewind tailwindcss
 *   cd ios && pod install   (iOS only)
 *
 * Both native packages contain native code, so after installing you need a
 * fresh native build (npx react-native run-android / run-ios) — a JS-only
 * reload is not enough the first time.
 *
 * Styling uses Tailwind classes via NativeWind. If you haven't set up
 * NativeWind yet, see: https://www.nativewind.dev/getting-started/react-native-cli
 * (className props on RN components only work once NativeWind's babel
 * plugin + tailwind.config.js are configured in your project.)
 *
 * IMPORTANT re: SafeAreaProvider — it should be mounted ONCE near the root
 * of your app (e.g. in App.tsx), not inside every screen. Individual
 * screens should use SafeAreaView to consume the safe-area insets that
 * the provider makes available. See the bottom of this file for the
 * App.tsx wiring example.
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  Alert,
  ScrollView,
  PermissionsAndroid,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  launchCamera,
  launchImageLibrary,
  Asset,
  ImagePickerResponse,
} from 'react-native-image-picker';
import TextRecognition from '@react-native-ml-kit/text-recognition';
import { parseTotalFromText, Confidence } from '../../utils/recieptParser';

export interface ReceiptSaveResult {
  imageUri: string | null;
  total: number;
}

interface ReceiptScannerScreenProps {
  onSave?: (result: ReceiptSaveResult) => void;
}

export default function ReceiptScannerScreen({
  onSave,
}: ReceiptScannerScreenProps) {
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [totalText, setTotalText] = useState<string>('');
  const [confidence, setConfidence] = useState<Confidence | null>(null);
  const [rawText, setRawText] = useState<string>('');

  const resetState = (): void => {
    setTotalText('');
    setConfidence(null);
    setRawText('');
  };

  const runOcr = async (uri: string): Promise<void> => {
    setLoading(true);
    resetState();
    try {
      const result = await TextRecognition.recognize(uri);
      const { total, confidence: conf } = parseTotalFromText(result.text);

      setRawText(result.text);
      setConfidence(conf);
      setTotalText(total !== null ? total.toFixed(2) : '');

      if (total === null) {
        Alert.alert(
          'Could not detect total',
          'No amount was found automatically. Please enter it manually.',
        );
      }
    } catch (err) {
      console.error('OCR error:', err);
      Alert.alert(
        'Error',
        'Failed to read the receipt. Please try again or enter the total manually.',
      );
    } finally {
      setLoading(false);
    }
  };

  const requestAndroidCameraPermission = async (): Promise<boolean> => {
    if (Platform.OS !== 'android') return true;
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.CAMERA,
      {
        title: 'Camera permission',
        message: 'Allow camera access to scan a bill.',
        buttonPositive: 'OK',
        buttonNegative: 'Cancel',
        buttonNeutral: 'Ask Me Later',
      },
    );
    return granted === PermissionsAndroid.RESULTS.GRANTED;
  };

  const handlePickerResponse = (result: ImagePickerResponse): void => {
    if (result.didCancel) return;
    if (result.errorCode) {
      Alert.alert('Error', result.errorMessage || 'Something went wrong.');
      return;
    }
    const asset: Asset | undefined = result.assets?.[0];
    if (asset?.uri) {
      setImageUri(asset.uri);
      runOcr(asset.uri);
    }
  };

  const pickFromLibrary = async (): Promise<void> => {
    const result = await launchImageLibrary({
      mediaType: 'photo',
      quality: 0.8,
    });
    handlePickerResponse(result);
  };

  const takePhoto = async (): Promise<void> => {
    const hasPermission = await requestAndroidCameraPermission();
    if (!hasPermission) {
      Alert.alert(
        'Permission needed',
        'Please allow camera access to scan a bill.',
      );
      return;
    }
    const result = await launchCamera({
      mediaType: 'photo',
      quality: 0.8,
      saveToPhotos: true,
    });
    handlePickerResponse(result);
  };

  const handleSave = (): void => {
    const parsedTotal = parseFloat(totalText);
    if (!totalText || Number.isNaN(parsedTotal)) {
      Alert.alert(
        'Invalid amount',
        'Please enter a valid number for the total.',
      );
      return;
    }
    onSave?.({ imageUri, total: parsedTotal });
  };

  const confidenceTextClass = (level: Confidence): string => {
    if (level === 'high') return 'text-green-700';
    if (level === 'medium') return 'text-yellow-700';
    return 'text-red-600';
  };

  const confidenceLabel = (level: Confidence): string => {
    if (level === 'high') return '✓ Detected automatically';
    if (level === 'medium') return '⚠ Detected, please double-check';
    return '⚠ Low confidence — please verify this amount';
  };

  return (
    <SafeAreaView className="flex-1 bg-white" edges={['top', 'bottom']}>
      <ScrollView contentContainerClassName="p-5 pb-16">
        <Text className="text-2xl font-bold mb-4 text-gray-900">
          Scan a bill
        </Text>

        {imageUri ? (
          <Image
            source={{ uri: imageUri }}
            className="w-full h-64 rounded-xl bg-gray-100 mb-4"
            resizeMode="contain"
          />
        ) : (
          <View className="w-full h-52 rounded-xl bg-gray-100 items-center justify-center mb-4">
            <Text className="text-gray-400">No image selected</Text>
          </View>
        )}

        <View className="flex-row gap-3 mb-4">
          <TouchableOpacity
            className="flex-1 bg-gray-900 py-3 rounded-xl items-center"
            onPress={takePhoto}
          >
            <Text className="text-white font-semibold">Take Photo</Text>
          </TouchableOpacity>
          <TouchableOpacity
            className="flex-1 bg-gray-900 py-3 rounded-xl items-center"
            onPress={pickFromLibrary}
          >
            <Text className="text-white font-semibold">
              Choose from Gallery
            </Text>
          </TouchableOpacity>
        </View>

        {loading && (
          <View className="flex-row items-center gap-2 mt-2">
            <ActivityIndicator size="small" />
            <Text className="text-gray-600">Reading receipt…</Text>
          </View>
        )}

        {!loading && imageUri && (
          <View className="mt-5">
            <Text className="text-sm font-semibold mb-1.5 text-gray-800">
              Total amount
            </Text>
            <View className="flex-row items-center border border-gray-300 rounded-xl px-3">
              <Text className="text-lg mr-1.5 text-gray-800">₹</Text>
              <TextInput
                className="flex-1 text-lg py-3 text-gray-900"
                keyboardType="decimal-pad"
                value={totalText}
                onChangeText={setTotalText}
                placeholder="0.00"
              />
            </View>

            {confidence && (
              <Text
                className={`mt-2 text-sm ${confidenceTextClass(confidence)}`}
              >
                {confidenceLabel(confidence)}
              </Text>
            )}

            <TouchableOpacity
              className="mt-5 bg-blue-600 py-3.5 rounded-xl items-center"
              onPress={handleSave}
            >
              <Text className="text-white font-bold text-base">
                Save Expense
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

/**
 * ---------------------------------------------------------------------
 * App.tsx wiring example (SafeAreaProvider belongs at the ROOT, once):
 * ---------------------------------------------------------------------
 *
 * import React from 'react';
 * import { SafeAreaProvider } from 'react-native-safe-area-context';
 * import ReceiptScannerScreen from './ReceiptScannerScreen';
 *
 * export default function App() {
 *   return (
 *     <SafeAreaProvider>
 *       <ReceiptScannerScreen onSave={(result) => console.log(result)} />
 *     </SafeAreaProvider>
 *   );
 * }
 */
