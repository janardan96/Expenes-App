import type { ReactNode } from 'react';

export type OpenSheet =
  | 'language'
  | 'appearance'
  | 'currency'
  | 'clear'
  | 'logout'
  | null;

export type SheetOption<T extends string> = {
  value: T;
  label: string;
  description?: string;
  icon?: ReactNode;
};
