import { z } from 'zod';
import {
  categoriesForType,
  PAYMENT_MODES,
  type TransactionType,
} from '@utils/transactionCategories';

const MAX_AMOUNT = 10_000_000;
const MAX_TITLE_LENGTH = 60;
const MAX_NOTES_LENGTH = 200;

const endOfToday = (): number => {
  const now = new Date();
  now.setHours(23, 59, 59, 999);
  return now.getTime();
};

const amountField = z
  .string()
  .trim()
  .min(1, 'Amount is required')
  .regex(
    /^\d+(\.\d{1,2})?$/,
    'Enter a valid amount, for example 250 or 250.50',
  )
  .refine(value => Number(value) > 0, 'Amount must be greater than zero')
  .refine(value => Number(value) <= MAX_AMOUNT, 'Amount looks too large');

const titleField = z
  .string()
  .trim()
  .min(2, 'Title must be at least 2 characters')
  .max(MAX_TITLE_LENGTH, `Title must be ${MAX_TITLE_LENGTH} characters or less`);

const dateField = z
  .date({ error: 'Pick a valid date' })
  .refine(
    date => date.getTime() <= endOfToday(),
    'Date cannot be in the future',
  );

/**
 * The payment mode accepts an empty string while the user is still filling the
 * form, so the union keeps the "nothing picked yet" state valid for the type
 * system while the refinement turns it into an error.
 */
const modeField = z
  .union([z.enum(PAYMENT_MODES), z.literal('')], {
    error: 'Select a payment mode',
  })
  .refine(value => value !== '', 'Select a payment mode');

const notesField = z
  .string()
  .trim()
  .max(MAX_NOTES_LENGTH, `Notes must be ${MAX_NOTES_LENGTH} characters or less`)
  .optional();

/**
 * One schema serves both forms. The only difference between an expense and an
 * income is the list of allowed categories, which is checked against the
 * selected transaction type.
 */
export const createTransactionSchema = (type: TransactionType) =>
  z
    .object({
      amount: amountField,
      title: titleField,
      category: z.string(),
      date: dateField,
      mode: modeField,
      notes: notesField,
    })
    .superRefine((values, ctx) => {
      const allowed = categoriesForType(type);

      if (
        !values.category ||
        !(allowed as readonly string[]).includes(values.category)
      ) {
        ctx.addIssue({
          code: 'custom',
          path: ['category'],
          message: 'Select a category',
        });
      }
    });

export type TransactionFormValues = z.infer<
  ReturnType<typeof createTransactionSchema>
>;
