export type TransactionType = 'expense' | 'income';

export const EXPENSE_CATEGORY_NAMES = [
  'Food & Dining',
  'Groceries',
  'Shopping',
  'Travel',
  'Entertainment',
  'Apparel',
  'Rent & Housing',
  'Transportation',
  'Fuel',
  'Bills & Utilities',
  'Mobile & Internet',
  'Healthcare',
  'Education',
  'Fitness & Sports',
  'Travel & Vacation',
  'Coffee & Snacks',
  'Subscriptions',
  'Gifts & Donations',
  'Work',
  'Family & Kids',
  'Pets',
  'Other',
] as const;

export type ExpenseCategory = (typeof EXPENSE_CATEGORY_NAMES)[number];

export const INCOME_CATEGORY_NAMES = [
  'Salary',
  'Freelance',
  'Business Income',
  'Interest',
  'Dividends',
  'Rental Income',
  'Gift Received',
  'Refund',
  'Bonus',
  'Other Income',
] as const;

export type IncomeCategory = (typeof INCOME_CATEGORY_NAMES)[number];

export type TransactionCategory = ExpenseCategory | IncomeCategory;

export const TRANSACTION_CATEGORY_NAMES = [
  ...EXPENSE_CATEGORY_NAMES,
  ...INCOME_CATEGORY_NAMES,
] as const;

export const PAYMENT_MODES = [
  'Cash',
  'UPI',
  'Credit Card',
  'Debit Card',
  'Net Banking',
  'Other',
] as const;

export type PaymentMode = (typeof PAYMENT_MODES)[number];

export const categoriesForType = (
  type: TransactionType,
): readonly TransactionCategory[] =>
  type === 'expense' ? EXPENSE_CATEGORY_NAMES : INCOME_CATEGORY_NAMES;

export const isExpenseCategory = (value: string): value is ExpenseCategory =>
  (EXPENSE_CATEGORY_NAMES as readonly string[]).includes(value);

export const isIncomeCategory = (value: string): value is IncomeCategory =>
  (INCOME_CATEGORY_NAMES as readonly string[]).includes(value);

export const isTransactionCategory = (
  value: string,
): value is TransactionCategory =>
  (TRANSACTION_CATEGORY_NAMES as readonly string[]).includes(value);

export const isPaymentMode = (value: string): value is PaymentMode =>
  (PAYMENT_MODES as readonly string[]).includes(value);
