/**
 * receiptParser.ts
 *
 * Generic receipt total parser.
 *
 * This parser is designed to work with different types of receipts:
 *
 * - Grocery receipts
 * - Restaurant bills
 * - Petrol receipts
 * - Retail invoices
 * - Pharmacy bills
 * - Utility bills
 * - Service receipts
 *
 * The parser does NOT depend on any specific receipt format.
 *
 * Strategy:
 *
 * 1. Extract monetary candidates.
 * 2. Score candidates based on their surrounding text.
 * 3. Strongly prefer final-total keywords.
 * 4. Penalize subtotal/tax/discount/rate/quantity/ID fields.
 * 5. Prefer candidates near the bottom of the receipt.
 * 6. If no labelled total exists, use the best plausible amount.
 */

export type Confidence = 'high' | 'medium' | 'low';

export interface ParsedTotal {
  total: number | null;
  confidence: Confidence;
  matchedLine: string | null;
  candidates: number[];
}

interface AmountCandidate {
  value: number;
  raw: string;
  line: string;
  lineIndex: number;
  score: number;
}

/**
 * ---------------------------------------------------------
 * Strong total keywords
 * ---------------------------------------------------------
 *
 * These indicate that the amount is likely the final amount.
 *
 * "amount" and "sale" are intentionally included.
 *
 * But they are handled carefully:
 *
 *   Amount: 2926.76        -> positive
 *   Sale: 2273.48          -> positive
 *   Preset Type: Amount    -> not positive
 */
const STRONG_TOTAL_KEYWORDS = [
  'grand total',
  'final total',
  'total amount',
  'total due',
  'amount due',
  'amount payable',
  'payable amount',
  'net payable',
  'net amount',
  'balance due',
  'balance payable',
  'invoice total',
  'bill total',
  'sale',
  'amount',
];

/**
 * Weaker indicators.
 */
const WEAK_TOTAL_KEYWORDS = ['total', 'balance', 'payable', 'due'];

/**
 * ---------------------------------------------------------
 * Negative keywords
 * ---------------------------------------------------------
 *
 * These usually represent components of the bill rather
 * than the final payable amount.
 */
const EXCLUDE_KEYWORDS = [
  'subtotal',
  'sub total',
  'sub-total',

  'tax',
  'gst',
  'cgst',
  'sgst',
  'igst',
  'vat',

  'discount',
  'you saved',
  'saving',
  'savings',

  'shipping',
  'delivery',
  'service charge',

  'round off',
  'rounding',

  'change',
  'cash tendered',
  'cash received',

  'quantity',
  'qty',
  'rate',
  'unit price',
  'price per',

  'invoice no',
  'invoice number',
  'inv no',
  'inv. no',

  'receipt no',
  'receipt number',

  'transaction id',
  'transaction no',
  'trans id',
  'trans. id',

  'order id',
  'order no',
  'order number',

  'reference no',
  'reference number',
  'ref no',

  'phone',
  'mobile',

  'account no',
  'account number',

  'customer id',
  'customer number',

  'meter reading',
  'totalizer',

  'atot',
  'vtot',
];

/**
 * ---------------------------------------------------------
 * Amount regex
 * ---------------------------------------------------------
 *
 * Supports:
 *
 * 123
 * 123.45
 * 1,234.56
 * 1.234,56
 * ₹500
 * ₹ 500
 * Rs 500
 * Rs. 500
 * INR 500
 *
 * Currency is optional because OCR frequently removes
 * currency symbols.
 */
const AMOUNT_REGEX =
  /(?:₹|rs\.?|inr|usd|\$|€|£)?\s*(\d[\d,]*(?:[.,]\d{1,3})?)/gi;

/**
 * ---------------------------------------------------------
 * Normalize OCR line
 * ---------------------------------------------------------
 */
function normalizeLine(line: string): string {
  return line.replace(/\s+/g, ' ').replace(/[|]/g, 'I').trim();
}

/**
 * ---------------------------------------------------------
 * Convert OCR number to number
 * ---------------------------------------------------------
 */
function toNumber(raw: string | undefined | null): number | null {
  if (!raw) {
    return null;
  }

  let cleaned = raw.trim().replace(/\s/g, '');

  const lastComma = cleaned.lastIndexOf(',');
  const lastDot = cleaned.lastIndexOf('.');

  if (lastComma !== -1 && lastDot !== -1) {
    if (lastComma > lastDot) {
      /**
       * European:
       *
       * 1.234,56
       */
      cleaned = cleaned.replace(/\./g, '').replace(',', '.');
    } else {
      /**
       * US / Indian:
       *
       * 1,234.56
       */
      cleaned = cleaned.replace(/,/g, '');
    }
  } else if (lastComma !== -1) {
    /**
     * Only comma exists.
     *
     * 1234,56 -> 1234.56
     * 1,234   -> 1234
     */
    const digitsAfterComma = cleaned.length - lastComma - 1;

    if (digitsAfterComma >= 1 && digitsAfterComma <= 2) {
      cleaned = cleaned.replace(',', '.');
    } else {
      cleaned = cleaned.replace(/,/g, '');
    }
  }

  cleaned = cleaned.replace(/[^\d.]/g, '');

  const value = Number(cleaned);

  return Number.isFinite(value) ? value : null;
}

/**
 * ---------------------------------------------------------
 * Check excluded line
 * ---------------------------------------------------------
 */
function isExcludedLine(line: string): boolean {
  const lower = line.toLowerCase();

  return EXCLUDE_KEYWORDS.some(keyword => lower.includes(keyword));
}

/**
 * ---------------------------------------------------------
 * Extract numbers from a line
 * ---------------------------------------------------------
 */
function extractAmounts(line: string, lineIndex: number): AmountCandidate[] {
  const candidates: AmountCandidate[] = [];

  AMOUNT_REGEX.lastIndex = 0;

  let match: RegExpExecArray | null;

  while ((match = AMOUNT_REGEX.exec(line)) !== null) {
    const raw = match[1];

    const value = toNumber(raw);

    if (value === null) {
      continue;
    }

    /**
     * Ignore zero.
     */
    if (value <= 0) {
      continue;
    }

    /**
     * Extremely long numbers are usually IDs,
     * not monetary values.
     */
    const digitsOnly = raw.replace(/\D/g, '');

    if (digitsOnly.length > 9) {
      continue;
    }

    candidates.push({
      value,
      raw,
      line,
      lineIndex,
      score: 0,
    });
  }

  return candidates;
}

/**
 * ---------------------------------------------------------
 * Find keyword immediately related to an amount.
 * ---------------------------------------------------------
 *
 * Example:
 *
 * "Grand Total: 1,250.00"
 *
 * keyword = "grand total"
 *
 * Example:
 *
 * "Rate: 102.12"
 *
 * keyword = "rate"
 */
function getKeywordScore(line: string): number {
  const lower = line.toLowerCase();

  let score = 0;

  /**
   * Strong positive keywords.
   */
  for (let i = 0; i < STRONG_TOTAL_KEYWORDS.length; i++) {
    const keyword = STRONG_TOTAL_KEYWORDS[i];

    if (!lower.includes(keyword)) {
      continue;
    }

    /**
     * "amount" alone is weaker than:
     *
     * "grand total"
     * "amount due"
     * "amount payable"
     */
    if (keyword === 'amount') {
      score += 70;
    } else if (keyword === 'sale') {
      score += 80;
    } else if (keyword === 'total') {
      score += 120;
    } else {
      score += 150;
    }
  }

  /**
   * Weak keywords.
   */
  for (const keyword of WEAK_TOTAL_KEYWORDS) {
    if (lower.includes(keyword)) {
      score += 50;
    }
  }

  /**
   * Negative keywords.
   *
   * These are deliberately strong penalties.
   */
  for (const keyword of EXCLUDE_KEYWORDS) {
    if (!lower.includes(keyword)) {
      continue;
    }

    /**
     * These almost certainly aren't the final total.
     */
    if (
      keyword === 'subtotal' ||
      keyword === 'sub total' ||
      keyword === 'sub-total' ||
      keyword === 'rate' ||
      keyword === 'quantity' ||
      keyword === 'qty' ||
      keyword === 'invoice no' ||
      keyword === 'invoice number' ||
      keyword === 'transaction id' ||
      keyword === 'transaction no' ||
      keyword === 'order id' ||
      keyword === 'order no' ||
      keyword === 'receipt no' ||
      keyword === 'reference no' ||
      keyword === 'atot' ||
      keyword === 'vtot'
    ) {
      score -= 200;
    } else {
      score -= 80;
    }
  }

  /**
   * Special case:
   *
   * "Preset Type : Amount"
   *
   * contains "amount", but it isn't a total.
   */
  if (/preset\s+type/i.test(lower)) {
    score -= 250;
  }

  return score;
}

/**
 * ---------------------------------------------------------
 * Score amount candidate
 * ---------------------------------------------------------
 */
function scoreCandidate(
  candidate: AmountCandidate,
  totalLines: number,
): number {
  let score = 0;

  /**
   * -------------------------------------------------------
   * Keyword score
   * -------------------------------------------------------
   */
  score += getKeywordScore(candidate.line);

  /**
   * -------------------------------------------------------
   * Position score
   * -------------------------------------------------------
   *
   * Receipts generally put totals toward the bottom.
   *
   * Maximum bonus: 40
   */
  if (totalLines > 1) {
    const position = candidate.lineIndex / (totalLines - 1);

    score += Math.round(position * 40);
  }

  /**
   * -------------------------------------------------------
   * Currency indicator
   * -------------------------------------------------------
   *
   * Explicit currency makes an amount more likely to be
   * an actual monetary value.
   */
  if (/₹|rs\.?|inr|\$|€|£/i.test(candidate.line)) {
    score += 30;
  }

  /**
   * -------------------------------------------------------
   * Decimal amount
   * -------------------------------------------------------
   *
   * Receipt totals commonly have two decimal places.
   */
  if (/\d+[.,]\d{2}\b/.test(candidate.raw)) {
    score += 15;
  }

  /**
   * -------------------------------------------------------
   * Amount size
   * -------------------------------------------------------
   *
   * Larger monetary values get a SMALL bonus.
   *
   * This is intentional.
   *
   * We do NOT want a large invoice ID to dominate.
   */
  score += Math.min(Math.log10(candidate.value) * 5, 30);

  return score;
}

/**
 * ---------------------------------------------------------
 * Extract candidate amounts from all lines.
 * ---------------------------------------------------------
 */
function getAllCandidates(lines: string[]): AmountCandidate[] {
  const candidates: AmountCandidate[] = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    const lineCandidates = extractAmounts(line, i);

    for (const candidate of lineCandidates) {
      candidate.score = scoreCandidate(candidate, lines.length);

      candidates.push(candidate);
    }
  }

  return candidates;
}

/**
 * ---------------------------------------------------------
 * Find explicit total candidate.
 * ---------------------------------------------------------
 *
 * This is useful when OCR gives:
 *
 * Total
 * 1,250.00
 *
 * instead of:
 *
 * Total: 1,250.00
 */
function findLabelledAmountOnNextLine(lines: string[]): AmountCandidate | null {
  for (let i = 0; i < lines.length - 1; i++) {
    const current = lines[i].toLowerCase();

    /**
     * Don't treat excluded labels as totals.
     */
    if (EXCLUDE_KEYWORDS.some(keyword => current.includes(keyword))) {
      /**
       * Exception:
       *
       * "Amount" and "Sale" are valid labels.
       */
      if (!/\bamount\b/i.test(current) && !/\bsale\b/i.test(current)) {
        continue;
      }
    }

    const isTotalLabel = STRONG_TOTAL_KEYWORDS.some(keyword =>
      current.includes(keyword),
    );

    if (!isTotalLabel) {
      continue;
    }

    const nextCandidates = extractAmounts(lines[i + 1], i + 1);

    if (nextCandidates.length === 0) {
      continue;
    }

    /**
     * Choose largest amount on next line.
     */
    nextCandidates.sort((a, b) => b.value - a.value);

    const candidate = nextCandidates[0];

    candidate.score += 150;

    return candidate;
  }

  return null;
}

/**
 * ---------------------------------------------------------
 * Parse total
 * ---------------------------------------------------------
 */
export function parseTotalFromText(
  ocrText: string | null | undefined,
): ParsedTotal {
  if (!ocrText || !ocrText.trim()) {
    return {
      total: null,
      confidence: 'low',
      matchedLine: null,
      candidates: [],
    };
  }

  /**
   * -------------------------------------------------------
   * Normalize OCR text
   * -------------------------------------------------------
   */
  const lines = ocrText.split(/\r?\n/).map(normalizeLine).filter(Boolean);

  if (lines.length === 0) {
    return {
      total: null,
      confidence: 'low',
      matchedLine: null,
      candidates: [],
    };
  }

  /**
   * -------------------------------------------------------
   * PASS 1
   *
   * Look for labelled total on the NEXT line.
   *
   * Example:
   *
   * Total
   * 1,250.00
   *
   * Amount
   * 2,926.76
   * -------------------------------------------------------
   */
  const nextLineCandidate = findLabelledAmountOnNextLine(lines);

  if (nextLineCandidate && nextLineCandidate.value > 0) {
    return {
      total: nextLineCandidate.value,
      confidence: 'high',
      matchedLine: nextLineCandidate.line,
      candidates: [nextLineCandidate.value],
    };
  }

  /**
   * -------------------------------------------------------
   * PASS 2
   *
   * Extract all monetary candidates.
   * -------------------------------------------------------
   */
  const candidates = getAllCandidates(lines);

  if (candidates.length === 0) {
    return {
      total: null,
      confidence: 'low',
      matchedLine: null,
      candidates: [],
    };
  }

  /**
   * -------------------------------------------------------
   * PASS 3
   *
   * Check whether there is a strong labelled total.
   *
   * Example:
   *
   * Grand Total: 2926.76
   * Sale: 2273.48
   * Amount: 2926.76
   * -------------------------------------------------------
   */

  const strongCandidates = candidates.filter(candidate => {
    const lower = candidate.line.toLowerCase();

    /**
     * Strong semantic signals.
     */
    const hasStrongKeyword = STRONG_TOTAL_KEYWORDS.some(keyword =>
      lower.includes(keyword),
    );

    if (!hasStrongKeyword) {
      return false;
    }

    /**
     * "Preset Type : Amount" should not
     * be considered a total.
     */
    if (/preset\s+type/i.test(lower)) {
      return false;
    }

    /**
     * Explicitly reject obvious non-total
     * fields.
     */
    if (/subtotal|sub\s+total|tax|discount|rate|quantity|qty/i.test(lower)) {
      return false;
    }

    return true;
  });

  if (strongCandidates.length > 0) {
    /**
     * The highest monetary candidate among
     * strongly labelled lines is normally the
     * final amount.
     *
     * Score first.
     * Amount second.
     */
    strongCandidates.sort((a, b) => {
      if (b.score !== a.score) {
        return b.score - a.score;
      }

      return b.value - a.value;
    });

    const best = strongCandidates[0];

    return {
      total: best.value,
      confidence: 'high',
      matchedLine: best.line,
      candidates: strongCandidates.map(candidate => candidate.value),
    };
  }

  /**
   * -------------------------------------------------------
   * PASS 4
   *
   * Weak "Total" / "Balance" candidates.
   * -------------------------------------------------------
   */
  const weakCandidates = candidates.filter(candidate => {
    const lower = candidate.line.toLowerCase();

    return WEAK_TOTAL_KEYWORDS.some(keyword => lower.includes(keyword));
  });

  if (weakCandidates.length > 0) {
    /**
     * Sort by score and then amount.
     */
    weakCandidates.sort((a, b) => {
      if (b.score !== a.score) {
        return b.score - a.score;
      }

      return b.value - a.value;
    });

    const best = weakCandidates[0];

    return {
      total: best.value,
      confidence: 'medium',
      matchedLine: best.line,
      candidates: weakCandidates.map(candidate => candidate.value),
    };
  }

  /**
   * -------------------------------------------------------
   * PASS 5
   *
   * No explicit total label.
   *
   * Use the highest-scoring plausible amount.
   *
   * This is NOT simply Math.max().
   *
   * For example:
   *
   * Invoice No: 982734982
   * Rate: 102.12
   * Item: 500
   * Item: 800
   *
   * We don't want 982734982.
   * -------------------------------------------------------
   */
  candidates.sort((a, b) => {
    if (b.score !== a.score) {
      return b.score - a.score;
    }

    return b.value - a.value;
  });

  const best = candidates[0];

  /**
   * -------------------------------------------------------
   * Confidence
   * -------------------------------------------------------
   */
  let confidence: Confidence = 'low';

  if (best.score >= 180) {
    confidence = 'high';
  } else if (best.score >= 80) {
    confidence = 'medium';
  }

  return {
    total: best.value,
    confidence,
    matchedLine: best.line,
    candidates: candidates.map(candidate => candidate.value),
  };
}
