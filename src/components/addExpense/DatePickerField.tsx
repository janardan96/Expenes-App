import React, { useMemo, useState } from 'react';
import { Modal, Pressable, TouchableOpacity, View } from 'react-native';
import { CalendarDays, ChevronLeft, ChevronRight } from 'lucide-react-native';
import CustomText from '@components/common/CustomText';
import FormError from './FormError';
import {
  addMonths,
  endOfDay,
  formatDisplayDate,
  getMonthGrid,
  getMonthLabel,
  isSameDay,
  startOfMonth,
} from '@utils/date';

const WEEKDAYS = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

interface DatePickerFieldProps {
  label: string;
  value: Date;
  onChange: (date: Date) => void;
  error?: string;
  /** Dates after this are not selectable, defaults to the end of today */
  maxDate?: Date;
}

const DatePickerField = ({
  label,
  value,
  onChange,
  error,
  maxDate = endOfDay(new Date()),
}: DatePickerFieldProps) => {
  const [visible, setVisible] = useState(false);
  const [month, setMonth] = useState(() => startOfMonth(value));

  const grid = useMemo(() => getMonthGrid(month), [month]);

  const close = () => setVisible(false);

  const selectDay = (day: Date) => {
    onChange(day);
    close();
  };

  const canGoNext = useMemo(
    () => addMonths(month, 1).getTime() <= maxDate.getTime(),
    [month, maxDate],
  );

  return (
    <View className="w-full">
      <CustomText
        variant="h7"
        className="font-medium text-gray-600 dark:text-gray-300 mb-1.5"
      >
        {label}
      </CustomText>

      <Pressable
        onPress={() => {
          setMonth(startOfMonth(value));
          setVisible(true);
        }}
        className={`flex-row items-center justify-between rounded-xl border bg-white dark:bg-dark-card px-3 py-3 ${
          error
            ? 'border-red-500'
            : 'border-BDPrimary dark:border-BDPrimary-dark'
        }`}
      >
        <CustomText variant="h6" className="text-gray-800 dark:text-gray-100">
          {formatDisplayDate(value)}
        </CustomText>

        <CalendarDays size={18} color="#539e98" />
      </Pressable>

      <FormError message={error} />

      <Modal
        visible={visible}
        transparent
        animationType="fade"
        onRequestClose={close}
      >
        <Pressable
          className="flex-1 bg-black/40 justify-center px-5"
          onPress={close}
        >
          <Pressable
            className="bg-white dark:bg-dark-card rounded-2xl p-4"
            onPress={event => event.stopPropagation()}
          >
            {/* Month navigation */}
            <View className="flex-row items-center justify-between mb-3">
              <TouchableOpacity
                onPress={() => setMonth(current => addMonths(current, -1))}
                className="h-9 w-9 items-center justify-center rounded-full bg-gray-100 dark:bg-white/10"
              >
                <ChevronLeft size={18} color="#539e98" />
              </TouchableOpacity>

              <CustomText
                variant="h6"
                className="font-semibold text-gray-800 dark:text-gray-100"
              >
                {getMonthLabel(month)}
              </CustomText>

              <TouchableOpacity
                disabled={!canGoNext}
                onPress={() => setMonth(current => addMonths(current, 1))}
                className={`h-9 w-9 items-center justify-center rounded-full bg-gray-100 dark:bg-white/10 ${
                  canGoNext ? '' : 'opacity-40'
                }`}
              >
                <ChevronRight size={18} color="#539e98" />
              </TouchableOpacity>
            </View>

            {/* Weekday headers */}
            <View className="flex-row mb-1">
              {WEEKDAYS.map((day, index) => (
                <CustomText
                  key={`${day}-${index}`}
                  variant="h8"
                  className="w-[14.28%] text-center text-gray-400 font-medium"
                >
                  {day}
                </CustomText>
              ))}
            </View>

            {/* Days */}
            <View className="flex-row flex-wrap">
              {grid.map(day => {
                const inMonth = day.getMonth() === month.getMonth();
                const selected = isSameDay(day, value);
                const isToday = isSameDay(day, new Date());
                const disabled = day.getTime() > maxDate.getTime();

                return (
                  <TouchableOpacity
                    key={day.toISOString()}
                    disabled={disabled}
                    onPress={() => selectDay(day)}
                    className="w-[14.28%] h-10 items-center justify-center"
                  >
                    <View
                      className={`h-9 w-9 items-center justify-center rounded-full ${
                        selected
                          ? 'bg-primary'
                          : isToday
                          ? 'border border-primary'
                          : ''
                      } ${disabled ? 'opacity-30' : ''}`}
                    >
                      <CustomText
                        variant="h7"
                        className={
                          selected
                            ? 'text-white font-semibold'
                            : inMonth
                            ? 'text-gray-700 dark:text-gray-200'
                            : 'text-gray-300 dark:text-gray-600'
                        }
                      >
                        {day.getDate()}
                      </CustomText>
                    </View>
                  </TouchableOpacity>
                );
              })}
            </View>

            {/* Footer */}
            <View className="flex-row justify-end mt-2">
              <TouchableOpacity onPress={close} className="px-4 py-2">
                <CustomText variant="h7" className="font-medium text-gray-500">
                  Cancel
                </CustomText>
              </TouchableOpacity>
            </View>
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
};

export default DatePickerField;
