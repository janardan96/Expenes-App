import { View, SectionList } from 'react-native';
import React, { useMemo } from 'react';
import Animated, {
  Extrapolation,
  interpolate,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
} from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSelector } from 'react-redux';
import { Receipt } from 'lucide-react-native';

import CustomText from '@components/common/CustomText';
import { useTheme } from '@context/ThemeContext';
import MainCard from '@components/homeScreen/MainCard';
import Card from '@components/homeScreen/Card';
import TopCategories from '@components/homeScreen/TopCategories';
import RecentExpense from '@components/homeScreen/RecentExpense';
import Layout from '@components/common/Layout';
import { profile as profileSelector } from '@stores/reducers/userReducers';
import { selectTransactions } from '@stores/reducers/transactionReducers';
import { isSameDay, isSameMonth, startOfDay } from '@utils/date';
import { useCurrency } from '@context/CurrencyContext';

const AnimatedSectionList = Animated.createAnimatedComponent(SectionList);

const COLLAPSE_START = 0;
const COLLAPSE_END = 200;

const MONTHS = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

const EmptyState = () => (
  <View className="items-center rounded-2xl border border-BDPrimary bg-white px-6 py-10 dark:border-BDPrimary-dark dark:bg-dark-card">
    <View className="h-14 w-14 items-center justify-center rounded-full bg-[#539e98]/10">
      <Receipt size={26} color="#539e98" />
    </View>

    <CustomText
      variant="h5"
      className="mt-4 font-semibold text-gray-700 dark:text-gray-200"
    >
      No transactions yet
    </CustomText>

    <CustomText
      variant="h7"
      className="mt-1 text-center text-gray-500 dark:text-gray-400"
    >
      Tap the + button to add your first expense or income.
    </CustomText>
  </View>
);

const HomeScreen = () => {
  const { theme } = useTheme();
  const { format } = useCurrency();

  const transactions = useSelector(selectTransactions);
  const user = useSelector(profileSelector);
  console.log({ transactions });
  const stats = useMemo(() => {
    const today = new Date();
    const weekStart = startOfDay(today);
    weekStart.setDate(weekStart.getDate() - 6);

    let income = 0;
    let expense = 0;
    let todaySpent = 0;
    let weekSpent = 0;
    let monthSpent = 0;

    transactions.forEach(item => {
      const date = new Date(item.date);

      if (item.type === 'income') {
        income += item.amount;
        return;
      }

      expense += item.amount;

      if (isSameDay(date, today)) {
        todaySpent += item.amount;
      }
      if (date >= weekStart) {
        weekSpent += item.amount;
      }
      if (isSameMonth(date, today)) {
        monthSpent += item.amount;
      }
    });

    return {
      income,
      expense,
      balance: income - expense,
      todaySpent,
      weekSpent,
      monthSpent,
    };
  }, [transactions]);

  const hour = new Date().getHours();
  const greeting =
    hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';
  const firstName = user.name.trim().split(/\s+/)[0] ?? '';
  const monthLabel = MONTHS[new Date().getMonth()];

  const scrollY = useSharedValue(0);

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: event => {
      scrollY.value = event.contentOffset.y;
    },
  });

  // ==========================================
  // NORMALIZED COLLAPSE PROGRESS
  // ==========================================

  const collapseProgress = useDerivedValue(() => {
    return interpolate(
      scrollY.value,
      [COLLAPSE_START, COLLAPSE_END],
      [0, 1],
      Extrapolation.CLAMP,
    );
  });

  // ==========================================
  // BACKGROUND
  // ==========================================

  const backgroundAnimatedStyle = useAnimatedStyle(() => {
    const translateY = interpolate(
      scrollY.value,
      [-100, 0, COLLAPSE_END],
      [0, 0, -280],
      Extrapolation.CLAMP,
    );

    const scale = interpolate(
      scrollY.value,
      [-100, 0],
      [1.08, 1],
      Extrapolation.CLAMP,
    );

    return {
      transform: [
        {
          translateY,
        },
        {
          scale,
        },
      ],
    };
  });

  // ==========================================
  // LARGE HEADER
  // ==========================================

  const largeHeaderAnimatedStyle = useAnimatedStyle(() => {
    const opacity = interpolate(
      collapseProgress.value,
      [0, 0.55, 1],
      [1, 0.4, 0],
      Extrapolation.CLAMP,
    );

    const translateY = interpolate(
      collapseProgress.value,
      [0, 1],
      [0, -45],
      Extrapolation.CLAMP,
    );

    return {
      opacity,
      transform: [
        {
          translateY,
        },
      ],
    };
  });

  // ==========================================
  // MAIN CARD
  // ==========================================

  const mainCardAnimatedStyle = useAnimatedStyle(() => {
    const translateY = interpolate(
      collapseProgress.value,
      [0, 1],
      [0, -40],
      Extrapolation.CLAMP,
    );

    const scale = interpolate(
      collapseProgress.value,
      [0, 0.7, 1],
      [1, 0.97, 0.94],
      Extrapolation.CLAMP,
    );

    const opacity = interpolate(
      collapseProgress.value,
      [0, 0.75, 1],
      [1, 0.85, 0],
      Extrapolation.CLAMP,
    );

    return {
      opacity,
      transform: [
        {
          translateY,
        },
        {
          scale,
        },
      ],
    };
  });

  // ==========================================
  // COMPACT HEADER
  // ==========================================

  const compactHeaderAnimatedStyle = useAnimatedStyle(() => {
    const height = interpolate(
      scrollY.value,
      [60, 230],
      [0, 72],
      Extrapolation.CLAMP,
    );

    // Don't start fading until height is complete
    const opacity = interpolate(
      scrollY.value,
      [200, 240],
      [0, 1],
      Extrapolation.CLAMP,
    );

    const translateY = interpolate(
      scrollY.value,
      [140, 200],
      [-20, 0],
      Extrapolation.CLAMP,
    );

    return {
      height,
      opacity,
      overflow: 'hidden',
      transform: [{ translateY }],
    };
  });

  // ==========================================
  // STICKY CARDS
  // ==========================================

  const stickyCardsAnimatedStyle = useAnimatedStyle(() => {
    const marginTop = interpolate(
      collapseProgress.value,
      [0.55, 1],
      [20, 0],
      Extrapolation.CLAMP,
    );

    return {
      marginTop,
      // transform: [
      //   {
      //     translateY,
      //   },
      // ],
    };
  });

  return (
    <Layout>
      {/* ========================================
          BACKGROUND
      ======================================== */}

      <Animated.Image
        source={
          theme === 'dark'
            ? require('@assets/images/BackgroundCard-Dark.png')
            : require('@assets/images/BackgroundCard.png')
        }
        className="absolute top-0 w-full max-h-80"
        resizeMode="cover"
        style={backgroundAnimatedStyle}
      />

      <SafeAreaView className="flex-1" edges={['top', 'left', 'right']}>
        <AnimatedSectionList
          sections={[
            {
              title: 'Top Categories',
              data: ['top-categories'],
            } as { title: string; data: string[] },
          ]}
          keyExtractor={(item: unknown) => String(item)}
          onScroll={scrollHandler}
          scrollEventThrottle={16}
          stickySectionHeadersEnabled
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            paddingHorizontal: 18,
            // keeps the last rows clear of the floating glass tab bar
            paddingBottom: 0,
          }}
          // ========================================
          // LARGE HEADER + MAIN CARD
          // ========================================

          ListHeaderComponent={
            <View>
              {/* Large Greeting */}

              <Animated.View style={largeHeaderAnimatedStyle} className="pt-4">
                <CustomText variant="h4" className="font-regular text-white">
                  {firstName ? `${greeting}, ${firstName}` : greeting}
                </CustomText>

                <CustomText variant="h6" className="mt-1 text-white">
                  Here's your overview
                </CustomText>
              </Animated.View>

              {/* Main Balance Card */}

              <Animated.View style={mainCardAnimatedStyle}>
                <MainCard
                  balance={stats.balance}
                  income={stats.income}
                  expense={stats.expense}
                />
              </Animated.View>
            </View>
          }
          // ========================================
          // STICKY HEADER
          // ========================================

          renderSectionHeader={() => (
            <View className="bg-[#F0F6F5] dark:bg-dark-bg">
              {/* ==================================
                  COMPACT BALANCE HEADER
              ================================== */}

              <Animated.View style={compactHeaderAnimatedStyle}>
                <View className="rounded-2xl bg-[#296e69] px-4 py-3 dark:bg-primaryDark">
                  <View className="flex-row items-center justify-between">
                    <View>
                      <CustomText variant="h7" className="text-white/70">
                        Total spending
                      </CustomText>

                      <CustomText
                        variant="h5"
                        className="font-semibold text-white"
                      >
                        {format(stats.monthSpent)}
                      </CustomText>
                    </View>

                    <View className="items-end">
                      <CustomText variant="h7" className="text-white/70">
                        This month
                      </CustomText>

                      <CustomText
                        variant="h7"
                        className="font-medium text-white"
                      >
                        {monthLabel}
                      </CustomText>
                    </View>
                  </View>
                </View>
              </Animated.View>

              {/* ==================================
                  STICKY TODAY / WEEK CARDS
              ================================== */}

              <Animated.View
                style={stickyCardsAnimatedStyle}
                className="flex w-full flex-row justify-between gap-5 mb-5"
              >
                <Card amount={stats.todaySpent} time="Today" />

                <Card amount={stats.weekSpent} time="This week" />
              </Animated.View>
            </View>
          )}
          // ========================================
          // TOP CATEGORIES
          // ========================================

          renderItem={() =>
            transactions.length === 0 ? (
              <EmptyState />
            ) : (
              <View className="flex flex-col gap-6">
                <TopCategories />
                <RecentExpense />
              </View>
            )
          }
        />
      </SafeAreaView>
    </Layout>
  );
};

export default HomeScreen;
