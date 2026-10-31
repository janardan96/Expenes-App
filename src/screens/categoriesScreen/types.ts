import type { TransactionCategory } from '@utils/transactionCategories';

/** One category's share of the month's spending */
export type CategoryBreakdown = {
  category: TransactionCategory;
  amount: number;
  count: number;
  /** Share of the month's total spend, 0 - 100 */
  percentage: number;
};
