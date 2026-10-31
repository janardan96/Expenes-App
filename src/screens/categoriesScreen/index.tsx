import React, { useMemo, useRef, useState } from 'react';
import { ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSelector } from 'react-redux';

import Layout from '@components/common/Layout';
import PageHeader from '@components/common/PageHeader';
import MonthSwitcher from '@components/month/MonthSwitcher';
import MonthYearPicker from '@components/month/MonthYearPicker';
import { selectTransactions } from '@stores/reducers/transactionReducers';
import { addMonths, isSameMonth, startOfMonth } from '@utils/date';
import type { TransactionCategory } from '@utils/transactionCategories';
import CategoryList from './CategoryList';
import EmptyState from './EmptyState';
import MonthOverview from './MonthOverview';

const CategoriesScreen = () => {
  const transactions = useSelector(selectTransactions);
  const scrollRef = useRef<ScrollView>(null);

  const [month, setMonth] = useState(() => startOfMonth(new Date()));
  const [pickerVisible, setPickerVisible] = useState(false);

  const monthItems = useMemo(
    () =>
      transactions.filter(item => isSameMonth(new Date(item.date), month)),
    [transactions, month],
  );

  const summary = useMemo(() => {
    let income = 0;
    let expense = 0;

    monthItems.forEach(item => {
      if (item.type === 'income') {
        income += item.amount;
      } else {
        expense += item.amount;
      }
    });

    const flow = income + expense;
    const incomeShare = flow ? Math.round((income / flow) * 100) : 0;
    const expenseShare = flow ? 100 - incomeShare : 0;

    return {
      income,
      expense,
      net: income - expense,
      incomeShare,
      expenseShare,
      netShare: flow ? incomeShare - expenseShare : 0,
    };
  }, [monthItems]);

  const { categories, totalSpent } = useMemo(() => {
    const totals = new Map<
      TransactionCategory,
      { amount: number; count: number }
    >();

    monthItems.forEach(item => {
      if (item.type !== 'expense') {
        return;
      }

      const current = totals.get(item.category) ?? { amount: 0, count: 0 };
      current.amount += item.amount;
      current.count += 1;
      totals.set(item.category, current);
    });

    const total = Array.from(totals.values()).reduce(
      (sum, value) => sum + value.amount,
      0,
    );

    const rows = Array.from(totals.entries())
      .map(([category, value]) => ({
        category,
        amount: value.amount,
        count: value.count,
        percentage: total ? (value.amount / total) * 100 : 0,
      }))
      .sort((a, b) => b.amount - a.amount);

    return { categories: rows, totalSpent: total };
  }, [monthItems]);

  const goToMonth = (next: Date) => {
    setMonth(startOfMonth(next));
    scrollRef.current?.scrollTo({ y: 0, animated: false });
  };

  const changeMonth = (amount: number) => goToMonth(addMonths(month, amount));

  const selectMonth = (next: Date) => {
    goToMonth(next);
    setPickerVisible(false);
  };

  return (
    <Layout>
      <SafeAreaView className="flex-1" edges={['top', 'left', 'right']}>
        <ScrollView
          ref={scrollRef}
          className="flex-1"
          contentContainerClassName="px-4 pb-24"
          showsVerticalScrollIndicator={false}
        >
          <PageHeader
            title="Categories"
            subtitle="Where your money went"
          />

          <MonthSwitcher
            month={month}
            caption={`${categories.length} ${
              categories.length === 1 ? 'category' : 'categories'
            }`}
            canGoNext={!isSameMonth(month, new Date())}
            onChangeMonth={changeMonth}
            onOpenPicker={() => setPickerVisible(true)}
          />

          <MonthOverview {...summary} />

          {categories.length === 0 ? (
            <EmptyState month={month} />
          ) : (
            <CategoryList categories={categories} totalSpent={totalSpent} />
          )}
        </ScrollView>
      </SafeAreaView>

      <MonthYearPicker
        visible={pickerVisible}
        month={month}
        onClose={() => setPickerVisible(false)}
        onSelect={selectMonth}
      />
    </Layout>
  );
};

export default CategoriesScreen;
