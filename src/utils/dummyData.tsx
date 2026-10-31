import type { Transaction } from '@stores/reducers/transactionReducers';

/**
 * Toggle this off once real transactions are in place. While it is on, the
 * sample data below is loaded whenever the store starts empty.
 */
export const SEED_SAMPLE_DATA = true;

/** A date inside the current month, moved by `monthOffset` months. */
const inMonth = (monthOffset: number, day: number, hour = 12): string => {
  const now = new Date();
  const lastDay = new Date(
    now.getFullYear(),
    now.getMonth() + monthOffset + 1,
    0,
  ).getDate();

  return new Date(
    now.getFullYear(),
    now.getMonth() + monthOffset,
    Math.min(day, lastDay),
    hour,
  ).toISOString();
};

/** A date `days` days before today, so "Today" / "This week" have data. */
const daysAgo = (days: number, hour = 12): string => {
  const date = new Date();
  date.setDate(date.getDate() - days);
  date.setHours(hour, 0, 0, 0);
  return date.toISOString();
};

const makeTransaction = (
  index: number,
  values: Omit<Transaction, 'id' | 'notes' | 'createdAt'> & {
    notes?: string;
  },
): Transaction => ({
  ...values,
  id: `sample-${String(index).padStart(2, '0')}`,
  notes: values.notes ?? '',
  createdAt: values.date,
});

/**
 * Sample transactions covering today, this week, this month and the two
 * previous months, spread across many expense and income categories.
 */
export const DUMMY_TRANSACTIONS: Transaction[] = [
  // -----------------------------------------
  // Today / this week
  // -----------------------------------------
  makeTransaction(1, {
    type: 'expense',
    title: 'Filter coffee',
    amount: 180,
    category: 'Coffee & Snacks',
    mode: 'UPI',
    date: daysAgo(0, 9),
    notes: 'Third Wave, Indiranagar',
  }),
  makeTransaction(2, {
    type: 'expense',
    title: 'Weekly groceries',
    amount: 2450,
    category: 'Groceries',
    mode: 'Debit Card',
    date: daysAgo(0, 18),
    notes: 'DMart run',
  }),
  makeTransaction(3, {
    type: 'expense',
    title: 'Dinner with friends',
    amount: 640,
    category: 'Food & Dining',
    mode: 'Credit Card',
    date: daysAgo(1, 20),
    notes: 'Truffles',
  }),
  makeTransaction(4, {
    type: 'expense',
    title: 'Auto to office',
    amount: 260,
    category: 'Transportation',
    mode: 'UPI',
    date: daysAgo(2, 9),
  }),
  makeTransaction(5, {
    type: 'expense',
    title: 'Movie tickets',
    amount: 450,
    category: 'Entertainment',
    mode: 'Credit Card',
    date: daysAgo(3, 19),
    notes: 'PVR, two tickets',
  }),
  makeTransaction(6, {
    type: 'income',
    title: 'Freelance landing page',
    amount: 22000,
    category: 'Freelance',
    mode: 'UPI',
    date: daysAgo(4, 15),
    notes: 'Balance payment',
  }),
  makeTransaction(7, {
    type: 'expense',
    title: 'Petrol top-up',
    amount: 1200,
    category: 'Fuel',
    mode: 'Debit Card',
    date: daysAgo(5, 8),
  }),

  // -----------------------------------------
  // Earlier this month
  // -----------------------------------------
  makeTransaction(8, {
    type: 'income',
    title: 'Monthly salary',
    amount: 85000,
    category: 'Salary',
    mode: 'Net Banking',
    date: inMonth(0, 1, 9),
    notes: 'October payroll',
  }),
  makeTransaction(9, {
    type: 'expense',
    title: 'House rent',
    amount: 18000,
    category: 'Rent & Housing',
    mode: 'Net Banking',
    date: inMonth(0, 1, 11),
  }),
  makeTransaction(10, {
    type: 'expense',
    title: 'Electricity bill',
    amount: 1450,
    category: 'Bills & Utilities',
    mode: 'Net Banking',
    date: inMonth(0, 2, 10),
  }),
  makeTransaction(11, {
    type: 'expense',
    title: 'Mobile recharge',
    amount: 799,
    category: 'Mobile & Internet',
    mode: 'UPI',
    date: inMonth(0, 3, 12),
  }),
  makeTransaction(12, {
    type: 'expense',
    title: 'Pharmacy',
    amount: 520,
    category: 'Healthcare',
    mode: 'Cash',
    date: inMonth(0, 4, 17),
  }),

  // -----------------------------------------
  // Last month
  // -----------------------------------------
  makeTransaction(13, {
    type: 'income',
    title: 'Monthly salary',
    amount: 85000,
    category: 'Salary',
    mode: 'Net Banking',
    date: inMonth(-1, 1, 9),
  }),
  makeTransaction(14, {
    type: 'expense',
    title: 'Streaming bundles',
    amount: 649,
    category: 'Subscriptions',
    mode: 'Credit Card',
    date: inMonth(-1, 5, 8),
    notes: 'Music + video',
  }),
  makeTransaction(15, {
    type: 'expense',
    title: 'Winter jacket',
    amount: 2100,
    category: 'Apparel',
    mode: 'Credit Card',
    date: inMonth(-1, 8, 14),
  }),
  makeTransaction(16, {
    type: 'expense',
    title: 'Sneakers',
    amount: 3200,
    category: 'Shopping',
    mode: 'Credit Card',
    date: inMonth(-1, 14, 16),
  }),
  makeTransaction(17, {
    type: 'expense',
    title: 'Dentist visit',
    amount: 850,
    category: 'Healthcare',
    mode: 'UPI',
    date: inMonth(-1, 19, 11),
  }),
  makeTransaction(18, {
    type: 'expense',
    title: 'Birthday gift',
    amount: 1500,
    category: 'Gifts & Donations',
    mode: 'UPI',
    date: inMonth(-1, 22, 18),
  }),

  // -----------------------------------------
  // Two months ago
  // -----------------------------------------
  makeTransaction(19, {
    type: 'income',
    title: 'Monthly salary',
    amount: 85000,
    category: 'Salary',
    mode: 'Net Banking',
    date: inMonth(-2, 1, 9),
  }),
  makeTransaction(20, {
    type: 'income',
    title: 'Quarterly dividend',
    amount: 3200,
    category: 'Dividends',
    mode: 'Net Banking',
    date: inMonth(-2, 12, 10),
  }),
  makeTransaction(21, {
    type: 'expense',
    title: 'Goa trip',
    amount: 12500,
    category: 'Travel & Vacation',
    mode: 'Credit Card',
    date: inMonth(-2, 17, 7),
    notes: 'Flights and stay',
  }),
  makeTransaction(22, {
    type: 'expense',
    title: 'Online course',
    amount: 4500,
    category: 'Education',
    mode: 'Net Banking',
    date: inMonth(-2, 8, 21),
  }),
  makeTransaction(23, {
    type: 'expense',
    title: 'Vet checkup',
    amount: 900,
    category: 'Pets',
    mode: 'Cash',
    date: inMonth(-2, 26, 12),
  }),
  makeTransaction(24, {
    type: 'income',
    title: 'Amazon refund',
    amount: 1299,
    category: 'Refund',
    mode: 'UPI',
    date: inMonth(-2, 28, 15),
  }),
];
