import React, { useMemo, useRef, useState } from 'react';
import { Pressable, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSelector } from 'react-redux';
import { X } from 'lucide-react-native';

import CustomText from '@components/common/CustomText';
import Layout from '@components/common/Layout';
import {
  selectTransactions,
  type Transaction,
} from '@stores/reducers/transactionReducers';
import {
  addMonths,
  getMonthGrid,
  isSameMonth,
  startOfMonth,
} from '@utils/date';
import EmptyState from './EmptyState';
import MonthSummary from './MonthSummary';
import MonthSwitcher from '@components/month/MonthSwitcher';
import MonthYearPicker from '@components/month/MonthYearPicker';
import PageHeader from '@components/common/PageHeader';
import TransactionCalendar from './TransactionCalendar';
import TransactionGroups from './TransactionGroups';
import type { DayGroup } from './types';

const TransactionsScreen = () => {
  const transactions = useSelector(selectTransactions);
  const scrollRef = useRef<ScrollView>(null);

  const [month, setMonth] = useState(() => startOfMonth(new Date()));
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const [pickerVisible, setPickerVisible] = useState(false);

  const grid = useMemo(() => getMonthGrid(month), [month]);

  const monthItems = useMemo(
    () =>
      transactions
        .filter((item: Transaction) => isSameMonth(new Date(item.date), month))
        .sort((a: Transaction, b: Transaction) => {
          const byDate =
            new Date(b.date).getTime() - new Date(a.date).getTime();

          return byDate !== 0 ? byDate : b.createdAt.localeCompare(a.createdAt);
        }),
    [transactions, month],
  );

  // Transactions grouped per day, already newest first
  const groups = useMemo(() => {
    const byDay = new Map<string, DayGroup>();

    monthItems.forEach(item => {
      const date = new Date(item.date);
      const key = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
      const group = byDay.get(key);

      if (group) {
        group.items.push(item);
        if (item.type === 'expense') {
          group.expense += item.amount;
        } else {
          group.income += item.amount;
        }
        return;
      }

      byDay.set(key, {
        key,
        date,
        items: [item],
        expense: item.type === 'expense' ? item.amount : 0,
        income: item.type === 'income' ? item.amount : 0,
      });
    });

    return Array.from(byDay.values());
  }, [monthItems]);

  const dayTotals = useMemo(() => {
    const totals = new Map<number, { expense: number; income: number }>();

    groups.forEach(group => {
      totals.set(group.date.getDate(), {
        expense: group.expense,
        income: group.income,
      });
    });

    return totals;
  }, [groups]);

  const summary = useMemo(
    () =>
      groups.reduce(
        (total, group) => ({
          income: total.income + group.income,
          expense: total.expense + group.expense,
        }),
        { income: 0, expense: 0 },
      ),
    [groups],
  );

  const visibleGroups =
    selectedDay === null
      ? groups
      : groups.filter(group => group.date.getDate() === selectedDay);

  const goToMonth = (next: Date) => {
    setMonth(startOfMonth(next));
    setSelectedDay(null);
    scrollRef.current?.scrollTo({ y: 0, animated: false });
  };

  const changeMonth = (amount: number) => goToMonth(addMonths(month, amount));

  const selectMonth = (next: Date) => {
    goToMonth(next);
    setPickerVisible(false);
  };

  const toggleDay = (day: number) =>
    setSelectedDay(current => (current === day ? null : day));

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
            title="Transactions"
            subtitle="Every rupee, month by month"
          />

          <MonthSwitcher
            month={month}
            caption={`${monthItems.length} ${
              monthItems.length === 1 ? 'transaction' : 'transactions'
            }`}
            canGoNext={!isSameMonth(month, new Date())}
            onChangeMonth={changeMonth}
            onOpenPicker={() => setPickerVisible(true)}
          />

          <MonthSummary
            income={summary.income}
            expense={summary.expense}
          />

          <TransactionCalendar
            month={month}
            grid={grid}
            dayTotals={dayTotals}
            selectedDay={selectedDay}
            onSelectDay={toggleDay}
          />

          {selectedDay !== null && (
            <Pressable
              onPress={() => setSelectedDay(null)}
              className="mt-3 self-start flex-row items-center gap-1.5 rounded-full bg-[#539e98]/15 px-3 py-1.5"
            >
              <CustomText variant="h8" className="font-medium text-primary">
                Showing day {selectedDay} · Tap to see the whole month
              </CustomText>

              <X size={12} color="#539e98" />
            </Pressable>
          )}

          {visibleGroups.length === 0 ? (
            <EmptyState selectedDay={selectedDay} month={month} />
          ) : (
            <TransactionGroups groups={visibleGroups} />
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

export default TransactionsScreen;
