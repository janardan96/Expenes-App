import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react';
import { storage } from '@stores/storage';
import { formatCurrency } from '@utils/format';

const CURRENCY_KEY = 'app-currency';

export type CurrencyCode =
  | 'INR'
  | 'USD'
  | 'EUR'
  | 'GBP'
  | 'AED'
  | 'SGD'
  | 'AUD'
  | 'CAD'
  | 'JPY';

export type CurrencyOption = {
  code: CurrencyCode;
  symbol: string;
  /** English name shown in the picker */
  label: string;
};

export const CURRENCIES: CurrencyOption[] = [
  { code: 'INR', symbol: '₹', label: 'Indian Rupee' },
  { code: 'USD', symbol: '$', label: 'US Dollar' },
  { code: 'EUR', symbol: '€', label: 'Euro' },
  { code: 'GBP', symbol: '£', label: 'British Pound' },
  { code: 'AED', symbol: 'AED', label: 'UAE Dirham' },
  { code: 'SGD', symbol: 'S$', label: 'Singapore Dollar' },
  { code: 'AUD', symbol: 'A$', label: 'Australian Dollar' },
  { code: 'CAD', symbol: 'C$', label: 'Canadian Dollar' },
  { code: 'JPY', symbol: '¥', label: 'Japanese Yen' },
];

const readCurrency = (): CurrencyCode => {
  const stored = storage.getString(CURRENCY_KEY);
  const match = CURRENCIES.find(item => item.code === stored);
  return match ? match.code : 'INR';
};

type CurrencyContextType = {
  currency: CurrencyCode;
  option: CurrencyOption;
  setCurrency: (currency: CurrencyCode) => void;
  /** Formats an amount using the selected currency's symbol */
  format: (value: number) => string;
};

const CurrencyContext = createContext<CurrencyContextType | undefined>(
  undefined,
);

export const CurrencyProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [currency, setCurrencyState] = useState<CurrencyCode>(readCurrency);

  const option = useMemo(
    () => CURRENCIES.find(item => item.code === currency) ?? CURRENCIES[0],
    [currency],
  );

  const setCurrency = useCallback((next: CurrencyCode) => {
    setCurrencyState(next);
    storage.set(CURRENCY_KEY, next);
  }, []);

  const format = useCallback(
    (value: number) => formatCurrency(value, option.symbol),
    [option.symbol],
  );

  const value = useMemo(
    () => ({ currency, option, setCurrency, format }),
    [currency, option, setCurrency, format],
  );

  return (
    <CurrencyContext.Provider value={value}>
      {children}
    </CurrencyContext.Provider>
  );
};

export const useCurrency = () => {
  const ctx = useContext(CurrencyContext);
  if (!ctx) throw new Error('useCurrency must be used within CurrencyProvider');
  return ctx;
};
