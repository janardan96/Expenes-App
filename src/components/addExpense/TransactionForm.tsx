import React, { useEffect, useMemo } from 'react';
import {
  Alert,
  Keyboard,
  Platform,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useDispatch } from 'react-redux';
import { Receipt } from 'lucide-react-native';

import CustomText from '@components/common/CustomText';
import CategoryPicker from './CategoryPicker';
import DatePickerField from './DatePickerField';
import FormError from './FormError';
import FormInput from './FormInput';
import OptionChips from './OptionChips';
import {
  createTransactionSchema,
  type TransactionFormValues,
} from '@screens/AddExpense/transactionSchema';
import {
  addTransaction,
  type Transaction,
} from '@stores/reducers/transactionReducers';
import type { AppDispatch } from '@stores/reducers/store';
import { useTheme } from '@context/ThemeContext';
import { useCurrency } from '@context/CurrencyContext';
import { currencyPrefix } from '@utils/format';
import {
  categoriesForType,
  isPaymentMode,
  isTransactionCategory,
  PAYMENT_MODES,
  type PaymentMode,
  type TransactionCategory,
  type TransactionType,
} from '@utils/transactionCategories';

const DEFAULT_VALUES: TransactionFormValues = {
  amount: '',
  title: '',
  category: '',
  date: new Date(),
  mode: '',
  notes: '',
};

/** Keeps only digits and a single decimal separator with 2 decimals */
const sanitizeAmount = (text: string): string => {
  const cleaned = text.replace(/[^0-9.]/g, '');
  const [whole, ...rest] = cleaned.split('.');
  const decimals = rest.join('').slice(0, 2);
  return rest.length > 0 ? `${whole}.${decimals}` : whole;
};

interface TransactionFormProps {
  type: TransactionType;
  /** Amount detected by the receipt scanner, applied as soon as it changes */
  scannedAmount?: string | null;
  onScanBill?: () => void;
  /** Fired when the notes field gains focus, so the screen can scroll to it */
  onNotesFocus?: () => void;
  onNotesBlur?: () => void;
}

const TransactionForm = ({
  type,
  scannedAmount,
  onScanBill,
  onNotesFocus,
  onNotesBlur,
}: TransactionFormProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const { theme } = useTheme();
  const { option } = useCurrency();
  const isDark = theme === 'dark';

  const isIncome = type === 'income';
  const categories = useMemo(() => categoriesForType(type), [type]);

  const schema = useMemo(() => createTransactionSchema(type), [type]);

  const {
    control,
    handleSubmit,
    setValue,
    reset,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<TransactionFormValues>({
    resolver: zodResolver(schema),
    mode: 'onTouched',
    reValidateMode: 'onChange',
    defaultValues: DEFAULT_VALUES,
  });

  const notesValue = watch('notes') ?? '';

  // The scanner lives in the parent screen, the amount lands here
  useEffect(() => {
    if (scannedAmount) {
      setValue('amount', scannedAmount, {
        shouldValidate: true,
        shouldDirty: true,
      });
    }
  }, [scannedAmount, setValue]);

  const onSubmit = (values: TransactionFormValues) => {
    // Validation passed, so close the keyboard before saving
    Keyboard.dismiss();

    // The schema already guarantees both values, the guards keep the types safe
    if (
      !isTransactionCategory(values.category) ||
      !isPaymentMode(values.mode)
    ) {
      return;
    }

    const transaction: Transaction = {
      id: `${Date.now().toString(36)}-${Math.random()
        .toString(36)
        .slice(2, 8)}`,
      type,
      title: values.title.trim(),
      amount: Number(values.amount),
      category: values.category,
      date: values.date.toISOString(),
      mode: values.mode,
      notes: (values.notes ?? '').trim(),
      createdAt: new Date().toISOString(),
    };

    dispatch(addTransaction(transaction));
    reset({ ...DEFAULT_VALUES, date: new Date() });

    Alert.alert(
      isIncome ? 'Income added' : 'Expense added',
      `${transaction.title} · ${currencyPrefix(option.symbol)}${transaction.amount.toFixed(
        2,
      )}`,
    );
  };

  return (
    <>
      {/* ==========================================
          AMOUNT + TITLE
      ========================================== */}

      <View
        style={[
          styles.cardShadow,
          { shadowColor: isDark ? '#000000' : '#438883' },
        ]}
        className="bg-white dark:bg-dark-card rounded-2xl p-4 gap-y-4"
      >
        <Controller
          control={control}
          name="amount"
          render={({ field: { onChange, value, ...field } }) => (
            <FormInput
              {...field}
              value={value}
              onChangeText={text => onChange(sanitizeAmount(text))}
              label="Amount"
              required
              prefix={option.symbol}
              prefixClassName="text-xl"
              placeholder="0.00"
              keyboardType="decimal-pad"
              inputMode="decimal"
              maxLength={12}
              error={errors.amount?.message}
              className="text-xl font-semibold leading-6"
            />
          )}
        />

        <Controller
          control={control}
          name="title"
          render={({ field: { onChange, value, ...field } }) => (
            <FormInput
              {...field}
              value={value}
              onChangeText={onChange}
              label="Title"
              required
              placeholder={
                isIncome ? 'e.g. Salary for August' : 'e.g. Groceries at DMart'
              }
              autoCapitalize="sentences"
              maxLength={60}
              error={errors.title?.message}
            />
          )}
        />

        {onScanBill ? (
          <TouchableOpacity
            onPress={onScanBill}
            activeOpacity={0.8}
            className="self-start flex-row items-center gap-1.5 px-3 py-2 rounded-full"
            style={{ backgroundColor: 'rgba(83, 158, 152, 0.14)' }}
          >
            <Receipt size={14} color="#539e98" />

            <CustomText variant="h8" className="font-medium text-primary">
              Scan bill
            </CustomText>
          </TouchableOpacity>
        ) : null}
      </View>

      {/* ==========================================
          CATEGORY
      ========================================== */}

      <View
        style={[
          styles.cardShadow,
          { shadowColor: isDark ? '#000000' : '#438883' },
        ]}
        className="bg-white dark:bg-dark-card rounded-2xl p-4 mt-4"
      >
        <CustomText
          variant="h7"
          className="font-medium text-gray-600 dark:text-gray-300 mb-1.5"
        >
          Category
          <CustomText className="text-red-500"> *</CustomText>
        </CustomText>

        <Controller
          control={control}
          name="category"
          render={({ field: { onChange, value } }) => (
            <CategoryPicker
              categories={categories}
              value={value as TransactionCategory | ''}
              onChange={onChange}
            />
          )}
        />

        <FormError message={errors.category?.message} />
      </View>

      {/* ==========================================
          DATE + PAYMENT MODE
      ========================================== */}

      <View
        style={[
          styles.cardShadow,
          { shadowColor: isDark ? '#000000' : '#438883' },
        ]}
        className="bg-white dark:bg-dark-card rounded-2xl p-4 mt-4 gap-y-4"
      >
        <Controller
          control={control}
          name="date"
          render={({ field: { onChange, value } }) => (
            <DatePickerField
              label="Date"
              value={value}
              onChange={onChange}
              error={errors.date?.message}
            />
          )}
        />

        <View>
          <CustomText
            variant="h7"
            className="font-medium text-gray-600 dark:text-gray-300 mb-1.5"
          >
            {isIncome ? 'Received via' : 'Payment mode'}
            <CustomText className="text-red-500"> *</CustomText>
          </CustomText>

          <Controller
            control={control}
            name="mode"
            render={({ field: { onChange, value } }) => (
              <OptionChips
                options={PAYMENT_MODES}
                value={value as PaymentMode | ''}
                onChange={onChange}
              />
            )}
          />

          <FormError message={errors.mode?.message} />
        </View>
      </View>

      {/* ==========================================
          NOTES
      ========================================== */}

      <View
        style={[
          styles.cardShadow,
          { shadowColor: isDark ? '#000000' : '#438883' },
        ]}
        className="bg-white dark:bg-dark-card rounded-2xl p-4 mt-4"
      >
        <Controller
          control={control}
          name="notes"
          render={({ field: { onChange, value, ...field } }) => (
            <FormInput
              {...field}
              value={value ?? ''}
              onChangeText={onChange}
              label="Notes"
              hint={`${notesValue.length}/200`}
              placeholder="Add a note (optional)"
              multiline
              numberOfLines={3}
              maxLength={200}
              error={errors.notes?.message}
              onFocus={onNotesFocus}
              onBlur={onNotesBlur}
              className="min-h-[72px] text-left"
            />
          )}
        />
      </View>

      {/* ==========================================
          SAVE
      ========================================== */}

      <TouchableOpacity
        onPress={handleSubmit(onSubmit)}
        disabled={isSubmitting}
        activeOpacity={0.85}
        className={`mt-6 rounded-2xl py-4 items-center ${
          isIncome ? 'bg-[#296e69]' : 'bg-[#296e69] dark:bg-primaryDark'
        }`}
      >
        <CustomText variant="h5" className="text-white font-semibold">
          {isSubmitting ? 'Saving…' : isIncome ? 'Add Income' : 'Save Expense'}
        </CustomText>
      </TouchableOpacity>
    </>
  );
};

const styles = StyleSheet.create({
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

export default TransactionForm;
