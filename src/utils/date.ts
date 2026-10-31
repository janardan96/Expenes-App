export const startOfDay = (date: Date): Date => {
  const copy = new Date(date);
  copy.setHours(0, 0, 0, 0);
  return copy;
};

export const endOfDay = (date: Date): Date => {
  const copy = new Date(date);
  copy.setHours(23, 59, 59, 999);
  return copy;
};

export const isSameDay = (first: Date, second: Date): boolean =>
  first.getFullYear() === second.getFullYear() &&
  first.getMonth() === second.getMonth() &&
  first.getDate() === second.getDate();

export const isSameMonth = (first: Date, second: Date): boolean =>
  first.getFullYear() === second.getFullYear() &&
  first.getMonth() === second.getMonth();

export const addMonths = (date: Date, amount: number): Date => {
  const copy = new Date(date);
  copy.setMonth(copy.getMonth() + amount);
  return copy;
};

export const startOfMonth = (date: Date): Date =>
  new Date(date.getFullYear(), date.getMonth(), 1);

export const getMonthLabel = (date: Date): string =>
  date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

/**
 * Builds a 6 x 7 grid of days covering the given month, padded with the
 * neighbouring months so every row is complete.
 */
export const getMonthGrid = (month: Date): Date[] => {
  const first = startOfMonth(month);
  const gridStart = new Date(first);
  gridStart.setDate(first.getDate() - first.getDay());

  return Array.from({ length: 42 }, (_, index) => {
    const day = new Date(gridStart);
    day.setDate(gridStart.getDate() + index);
    return day;
  });
};

export const formatDisplayDate = (date: Date): string => {
  const today = startOfDay(new Date());
  const target = startOfDay(date);

  if (isSameDay(target, today)) {
    return 'Today';
  }

  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  if (isSameDay(target, yesterday)) {
    return 'Yesterday';
  }

  return date.toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
};
