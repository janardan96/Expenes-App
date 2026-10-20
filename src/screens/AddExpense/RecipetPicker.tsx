/**
 * ReceiptScannerScreen.tsx
 *
 * Full screen: pick/capture a receipt image -> run on-device OCR (ML Kit)
 * -> auto-fill an editable "Total" field the user can correct before saving.
 *
 * The screen is split in two parts:
 *   - ReceiptScannerContent  -> just the content, ready to be dropped inside
 *                                a bottom sheet (see Add.tsx) or any container.
 *   - ReceiptScannerScreen   -> the full screen wrapper (safe area + background)
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
import { X } from 'lucide-react-native';
import { parseTotalFromText, Confidence } from '../../utils/recieptParser';

export interface ReceiptSaveResult {
  imageUri: string | null;
  total: number;
}

interface ReceiptScannerContentProps {
  onSave?: (result: ReceiptSaveResult) => void;
  /** Shows a close button, used when the content lives inside a sheet */
  onClose?: () => void;
}

interface ReceiptScannerScreenProps {
  onSave?: (result: ReceiptSaveResult) => void;
}

export function ReceiptScannerContent({
  onSave,
  onClose,
}: ReceiptScannerContentProps) {
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [totalText, setTotalText] = useState<string>('');
  const [confidence, setConfidence] = useState<Confidence | null>(null);

  const resetState = (): void => {
    setTotalText('');
    setConfidence(null);
  };

  const runOcr = async (uri: string): Promise<void> => {
    setLoading(true);
    resetState();
    try {
      const result = await TextRecognition.recognize(uri);
      const { total, confidence: conf } = parseTotalFromText(result.text);

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

  const confidenceBadgeClass = (level: Confidence): string => {
    if (level === 'high') return 'bg-green-50';
    if (level === 'medium') return 'bg-yellow-50';
    return 'bg-red-50';
  };

  const confidenceLabel = (level: Confidence): string => {
    if (level === 'high') return '✓ Detected automatically';
    if (level === 'medium') return '⚠ Detected, please double-check';
    return '⚠ Low confidence — please verify this amount';
  };

  return (
    <ScrollView
      contentContainerClassName="px-5 pt-3 pb-8"
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
    >
      {/* ==========================================
          HEADER
      ========================================== */}

      <View className="flex-row items-center justify-between mb-4">
        <View className="flex-1 pr-3">
          <Text className="text-xl font-bold text-gray-900">Scan a bill</Text>

          <Text className="text-sm text-gray-500 mt-0.5">
            Capture the receipt and we will fill the total for you
          </Text>
        </View>

        {onClose ? (
          <TouchableOpacity
            onPress={onClose}
            activeOpacity={0.7}
            className="h-9 w-9 items-center justify-center rounded-full bg-gray-100"
          >
            <X size={18} color="#4b5563" />
          </TouchableOpacity>
        ) : null}
      </View>

      {/* ==========================================
          RECEIPT PREVIEW
      ========================================== */}

      <View className="overflow-hidden rounded-2xl border border-gray-100 bg-gray-50">
        {imageUri ? (
          <Image
            source={{ uri: imageUri }}
            className="w-full h-56"
            resizeMode="contain"
          />
        ) : (
          <View className="w-full h-48 items-center justify-center">
            <Text className="text-gray-400 text-sm">No image selected</Text>
          </View>
        )}
      </View>

      {/* ==========================================
          SOURCE PICKERS
      ========================================== */}

      <View className="flex-row gap-3 mt-4">
        <TouchableOpacity
          className="flex-1 bg-[#296e69] py-3.5 rounded-xl items-center active:opacity-90"
          onPress={takePhoto}
        >
          <Text className="text-white font-semibold">Take Photo</Text>
        </TouchableOpacity>

        <TouchableOpacity
          className="flex-1 bg-white border border-[#296e69] py-3.5 rounded-xl items-center active:opacity-90"
          onPress={pickFromLibrary}
        >
          <Text className="text-[#296e69] font-semibold">Choose a Photo</Text>
        </TouchableOpacity>
      </View>

      {loading && (
        <View className="flex-row items-center gap-2 mt-3">
          <ActivityIndicator size="small" color="#296e69" />
          <Text className="text-gray-600 text-sm">Reading receipt…</Text>
        </View>
      )}

      {/* ==========================================
          TOTAL
      ========================================== */}

      {!loading && imageUri && (
        <View className="mt-5">
          <Text className="text-sm font-semibold mb-1.5 text-gray-800">
            Total amount
          </Text>

          <View className="flex-row items-center border border-gray-200 rounded-xl px-3 bg-white">
            <Text className="text-lg mr-1.5 text-gray-800">₹</Text>

            <TextInput
              className="flex-1 text-lg py-3 text-gray-900"
              keyboardType="decimal-pad"
              value={totalText}
              onChangeText={setTotalText}
              placeholder="0.00"
              placeholderTextColor="#9ca3af"
            />
          </View>

          {confidence && (
            <View
              className={`mt-2 self-start px-2.5 py-1 rounded-full ${confidenceBadgeClass(
                confidence,
              )}`}
            >
              <Text className={`text-xs ${confidenceTextClass(confidence)}`}>
                {confidenceLabel(confidence)}
              </Text>
            </View>
          )}

          <TouchableOpacity
            className="mt-5 bg-[#296e69] py-3.5 rounded-xl items-center active:opacity-90"
            onPress={handleSave}
          >
            <Text className="text-white font-bold text-base">
              Use this amount
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </ScrollView>
  );
}

export default function ReceiptScannerScreen({
  onSave,
}: ReceiptScannerScreenProps) {
  return (
    <SafeAreaView className="flex-1 bg-white" edges={['top', 'bottom']}>
      <ReceiptScannerContent onSave={onSave} />
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
