import {
  Award,
  Baby,
  Banknote,
  BriefcaseBusiness,
  Bus,
  Car,
  Coffee,
  Dumbbell,
  Fuel,
  Gift,
  GraduationCap,
  HeartPulse,
  Home,
  Laptop,
  MoreHorizontal,
  PawPrint,
  Percent,
  PieChart,
  Plane,
  Receipt,
  Shirt,
  ShoppingBag,
  Smartphone,
  Store,
  TrendingUp,
  Tv,
  Undo2,
  UtensilsCrossed,
  WalletCards,
} from 'lucide-react-native';
import type { ComponentType } from 'react';
import type { TransactionCategory } from './transactionCategories';

/**
 * Icons coming from lucide-react-native are typed with a big SVG props object.
 * The form only needs a tiny subset of them, so the categories are typed with
 * this narrower shape to keep the picker components simple.
 */
export type CategoryIcon = ComponentType<{
  size?: number;
  color?: string;
  strokeWidth?: number;
}>;

export const TRANSACTION_CATEGORY_META: Record<
  TransactionCategory,
  { color: string; icon: CategoryIcon }
> = {
  // -----------------------------------------
  // Expense categories
  // -----------------------------------------

  'Food & Dining': { color: '#2ac783', icon: UtensilsCrossed },
  Groceries: { color: '#27ae60', icon: ShoppingBag },
  Shopping: { color: '#ff6b6b', icon: ShoppingBag },
  Travel: { color: '#f1c40f', icon: Bus },
  Entertainment: { color: '#9b59b6', icon: Tv },
  Apparel: { color: '#e67e22', icon: Shirt },
  'Rent & Housing': { color: '#3498db', icon: Home },
  Transportation: { color: '#1abc9c', icon: Car },
  Fuel: { color: '#e74c3c', icon: Fuel },
  'Bills & Utilities': { color: '#8e44ad', icon: Receipt },
  'Mobile & Internet': { color: '#2980b9', icon: Smartphone },
  Healthcare: { color: '#e84393', icon: HeartPulse },
  Education: { color: '#16a085', icon: GraduationCap },
  'Fitness & Sports': { color: '#d35400', icon: Dumbbell },
  'Travel & Vacation': { color: '#00b894', icon: Plane },
  'Coffee & Snacks': { color: '#795548', icon: Coffee },
  Subscriptions: { color: '#6c5ce7', icon: WalletCards },
  'Gifts & Donations': { color: '#fd79a8', icon: Gift },
  Work: { color: '#636e72', icon: BriefcaseBusiness },
  'Family & Kids': { color: '#74b9ff', icon: Baby },
  Pets: { color: '#a55eea', icon: PawPrint },
  Other: { color: '#95a5a6', icon: MoreHorizontal },

  // -----------------------------------------
  // Income categories
  // -----------------------------------------

  Salary: { color: '#2ac783', icon: Banknote },
  Freelance: { color: '#3498db', icon: Laptop },
  'Business Income': { color: '#e67e22', icon: Store },
  Interest: { color: '#f1c40f', icon: Percent },
  Dividends: { color: '#6c5ce7', icon: PieChart },
  'Rental Income': { color: '#00b894', icon: Home },
  'Gift Received': { color: '#fd79a8', icon: Gift },
  Refund: { color: '#2980b9', icon: Undo2 },
  Bonus: { color: '#e84393', icon: Award },
  'Other Income': { color: '#16a085', icon: TrendingUp },
};
