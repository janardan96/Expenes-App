import React, { useRef, useState } from 'react';
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  View,
  Keyboard,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import Layout from '@components/common/Layout';
import CustomText from '@components/common/CustomText';
import SegmentedControl from '@components/addExpense/SegmentedControl';
import TransactionForm from '@components/addExpense/TransactionForm';
import { ReceiptScannerContent, type ReceiptSaveResult } from './RecipetPicker';
import type { TransactionType } from '@utils/transactionCategories';

const ACCENT_COLOR = {
  expense: '#296e69',
  income: '#296e69',
} as const;

const AddExpense = () => {
  const [type, setType] = useState<TransactionType>('expense');
  const [scannerVisible, setScannerVisible] = useState(false);
  const [scannedAmount, setScannedAmount] = useState<string | null>(null);
  const scrollViewRef = useRef<ScrollView>(null);

  const isIncome = type === 'income';

  const handleTypeChange = (next: TransactionType) => {
    setType(next);
    setScannedAmount(null);
  };

  const closeScanner = () => setScannerVisible(false);

  const handleReceiptSave = ({ total }: ReceiptSaveResult) => {
    setScannedAmount(total.toFixed(2));
    closeScanner();
  };

  React.useEffect(() => {
    const subscription = Keyboard.addListener('keyboardDidShow', () => {
      scrollViewRef.current?.scrollTo({
        y: 380,
        animated: true,
      });
    });

    return () => subscription.remove();
  }, []);

  return (
    <Layout>
      <SafeAreaView className="flex-1" edges={['top']}>
        <KeyboardAvoidingView
          className="flex-1"
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          keyboardVerticalOffset={10}
        >
          <ScrollView
            ref={scrollViewRef}
            className="flex-1"
            contentContainerClassName="px-4 pb-32"
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            {/* ==========================================
                HEADER + EXPENSE / INCOME SWITCH
            ========================================== */}

            <View className="pt-4 pb-4">
              <CustomText
                variant="h3"
                className="font-semibold text-gray-800 dark:text-gray-100"
              >
                {isIncome ? 'Add Income' : 'Add Expense'}
              </CustomText>

              <CustomText
                variant="h7"
                className="text-gray-500 dark:text-gray-400 mt-1 mb-4"
              >
                {isIncome
                  ? 'Log the money that came in'
                  : 'Track where your money went'}
              </CustomText>

              <SegmentedControl
                options={[
                  { label: 'Expense', value: 'expense' },
                  { label: 'Income', value: 'income' },
                ]}
                value={type}
                onChange={handleTypeChange}
                accentColor={ACCENT_COLOR[type]}
              />
            </View>

            {/* ==========================================
                FORM (expense / income)
            ========================================== */}

            <TransactionForm
              key={type}
              type={type}
              scannedAmount={scannedAmount}
              onScanBill={() => setScannerVisible(true)}
            />
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>

      {/* ==========================================
          RECEIPT SCANNER (bottom sheet)
      ========================================== */}

      <Modal
        visible={scannerVisible}
        transparent
        animationType="slide"
        statusBarTranslucent
        onRequestClose={closeScanner}
      >
        <View className="flex-1 bg-black/50">
          {/* Tapping the backdrop closes the sheet */}
          <Pressable className="flex-1" onPress={closeScanner} />

          <View className="bg-white rounded-t-3xl max-h-[100%] shadow-lg elevation-12">
            {/* Drag handle */}
            <View className="items-center pt-3 pb-1">
              <View className="h-1 w-10 rounded-full bg-gray-300" />
            </View>

            <SafeAreaView edges={['bottom']} className="pb-3">
              <ReceiptScannerContent
                onSave={handleReceiptSave}
                onClose={closeScanner}
              />
            </SafeAreaView>
          </View>
        </View>
      </Modal>
    </Layout>
  );
};

export default AddExpense;
