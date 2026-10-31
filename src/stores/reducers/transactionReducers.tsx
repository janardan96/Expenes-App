import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from './store';
import type {
  PaymentMode,
  TransactionCategory,
  TransactionType,
} from '@utils/transactionCategories';

export interface Transaction {
  id: string;
  type: TransactionType;
  title: string;
  amount: number;
  category: TransactionCategory;
  /** ISO date string so the entry stays serialisable for redux-persist */
  date: string;
  mode: PaymentMode;
  notes: string;
  createdAt: string;
}

interface TransactionsState {
  items: Transaction[];
}

const initialState: TransactionsState = {
  items: [],
};

export const transactionsSlice = createSlice({
  name: 'transactions',
  initialState,
  reducers: {
    addTransaction: (state, action: PayloadAction<Transaction>) => {
      state.items.unshift(action.payload);
    },
    removeTransaction: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter(item => item.id !== action.payload);
    },
    /** Replaces the list, used by the sample data loader */
    seedTransactions: (state, action: PayloadAction<Transaction[]>) => {
      state.items = action.payload;
    },
    clearTransactions: state => {
      state.items = [];
    },
  },
});

export const {
  addTransaction,
  removeTransaction,
  seedTransactions,
  clearTransactions,
} = transactionsSlice.actions;

export const selectTransactions = (state: RootState) => state.transactions.items;

export const selectTotalByType = (
  state: RootState,
  type: TransactionType,
): number =>
  state.transactions.items
    .filter(item => item.type === type)
    .reduce((total, item) => total + item.amount, 0);

export default transactionsSlice.reducer;
