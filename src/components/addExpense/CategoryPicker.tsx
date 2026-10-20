import React from 'react';
import { ScrollView, TouchableOpacity, View } from 'react-native';
import CustomText from '@components/common/CustomText';
import { TRANSACTION_CATEGORY_META } from '@utils/transactionCategoryIcons';
import type { TransactionCategory } from '@utils/transactionCategories';

interface CategoryPickerProps {
  categories: readonly TransactionCategory[];
  value: TransactionCategory | '';
  onChange: (value: TransactionCategory) => void;
}

const CategoryPicker = ({
  categories,
  value,
  onChange,
}: CategoryPickerProps) => {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerClassName="pr-2"
    >
      <View className="flex-row gap-2 pr-2">
        {categories.map(category => {
          const meta = TRANSACTION_CATEGORY_META[category];
          const Icon = meta.icon;
          const selected = category === value;

          return (
            <TouchableOpacity
              key={category}
              onPress={() => onChange(category)}
              activeOpacity={0.7}
              className={`flex-row items-center gap-2 px-3 py-2 rounded-xl border ${
                selected
                  ? 'border-primary bg-primary/10'
                  : 'border-BDPrimary dark:border-BDPrimary-dark bg-white dark:bg-dark-card'
              }`}
            >
              <View
                className="h-8 w-8 rounded-full items-center justify-center"
                style={{ backgroundColor: `${meta.color}20` }}
              >
                <Icon size={16} color={meta.color} />
              </View>

              <CustomText
                variant="h7"
                className={
                  selected
                    ? 'font-semibold text-gray-800 dark:text-gray-100'
                    : 'font-medium text-gray-600 dark:text-gray-300'
                }
              >
                {category}
              </CustomText>
            </TouchableOpacity>
          );
        })}
      </View>
    </ScrollView>
  );
};

export default CategoryPicker;
