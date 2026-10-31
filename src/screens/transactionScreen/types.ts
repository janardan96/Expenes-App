import type { Transaction } from '@stores/reducers/transactionReducers';

/** Transactions of a single day, with their running totals */
export type DayGroup = {
  key: string;
  date: Date;
  items: Transaction[];
  expense: number;
  income: number;
};
