import Decimal from "decimal.js";

/**
 * Single source of truth for the business rules of debts (Liabilities) and
 * their movements (LiabilityTransactions).
 *
 * A liability is a simple value pair:
 * - `TotalAmount`: the original total of the debt (editable);
 * - transactions move the outstanding balance, never the total;
 * - `IN` reduces the balance (payment, discount, positive adjustment);
 * - `OUT` increases the balance (interest, fee, negative adjustment).
 *
 * The derived values (OutstandingBalance, PaymentPercentage, Status) are
 * always recomputed from ALL persisted transactions of the liability, never
 * incrementally and never from the client payload.
 */

export interface LiabilityTransactionView {
    Id?: string;
    Type?: string | null;
    Amount?: Decimal | number | null;
    Date?: string | null;
}

export interface LiabilityTransactionSummary {
    TotalIn: Decimal;
    TotalOut: Decimal;
}

const IN = "IN";
const OUT = "OUT";

/**
 * Aggregates the transactions of a liability into the total amount that
 * reduces (`IN`) and increases (`OUT`) the outstanding balance. Unknown
 * transaction types are ignored so a bad value never breaks the fold.
 *
 * @param {LiabilityTransactionView[] | null | undefined} transactions
 * @returns {LiabilityTransactionSummary} the aggregated totals
 */
export function summarizeTransactions(
    transactions?: LiabilityTransactionView[] | null
): LiabilityTransactionSummary {

    let totalIn =
        new Decimal(0);

    let totalOut =
        new Decimal(0);

    for (const transaction of transactions || []) {

        const amount =
            transaction?.Amount == null
                ? new Decimal(0)
                : new Decimal(Number(transaction.Amount));

        if (transaction?.Type === IN) {

            totalIn =
                totalIn.plus(amount);

        } else if (transaction?.Type === OUT) {

            totalOut =
                totalOut.plus(amount);

        }

    }

    return { TotalIn: totalIn, TotalOut: totalOut };

}

/**
 * Computes the outstanding balance of a liability:
 * `TotalAmount + TotalOut - TotalIn`.
 *
 * @param {number | Decimal | null | undefined} totalAmount the total amount
 * @param {LiabilityTransactionSummary} summary the aggregated transactions
 * @returns {Decimal} the outstanding balance, never negative
 */
export function outstandingBalance(
    totalAmount: number | Decimal | null | undefined,
    summary: LiabilityTransactionSummary
): Decimal {

    const base =
        totalAmount == null
            ? new Decimal(0)
            : new Decimal(Number(totalAmount));

    const balance =
        base
            .plus(summary.TotalOut)
            .minus(summary.TotalIn);

    return balance
        .lessThan(0)
        ? new Decimal(0)
        : balance.toDecimalPlaces(2);

}

/**
 * Computes the payment progress percentage of a liability:
 * `(TotalIn / (TotalAmount + TotalOut)) * 100`, clamped between 0 and 100.
 *
 * @param {number | Decimal | null | undefined} totalAmount the total amount
 * @param {LiabilityTransactionSummary} summary the aggregated transactions
 * @returns {Decimal} the percentage
 */
export function paymentPercentage(
    totalAmount: number | Decimal | null | undefined,
    summary: LiabilityTransactionSummary
): Decimal {

    const base =
        totalAmount == null
            ? new Decimal(0)
            : new Decimal(Number(totalAmount));

    const denominator =
        base.plus(summary.TotalOut);

    let percentage =
        new Decimal(0);

    if (denominator.greaterThan(0)) {

        percentage =
            summary
                .TotalIn
                .div(denominator)
                .mul(100);

    }

    percentage =
        percentage.toDecimalPlaces(2);

    if (percentage.lessThan(0)) {
        percentage = new Decimal(0);
    }

    if (percentage.greaterThan(100)) {
        percentage = new Decimal(100);
    }

    return percentage;

}

/**
 * Derives the status from the outstanding balance: OPEN while there is any
 * balance left, PAID once it reaches zero.
 *
 * @param {number | Decimal} balance the outstanding balance
 * @returns {string} "OPEN" or "PAID"
 */
export function statusFromBalance(
    balance: number | Decimal
): string {

    const value =
        balance instanceof Decimal
            ? balance
            : new Decimal(Number(balance || 0));

    return value.greaterThan(0) ? "OPEN" : "PAID";

}

/**
 * Normalizes a date value into the `yyyy-MM-dd` form CAP expects. Accepts an
 * ISO date, a JS Date and the Brazilian-style formats `dd/MM/yyyy`,
 * `dd-MM-yyyy` and `dd.MM.yyyy` sent by the UI.
 *
 * @param {string | Date | null | undefined} value the date value
 * @returns {string | null} the normalized date, or `null` when the value is
 * empty or cannot be parsed as a valid date
 */
export function normalizeDate(
    value?: string | Date | null
): string | null {

    if (!value) {
        return null;
    }

    if (value instanceof Date) {

        return Number.isNaN(value.getTime())
            ? null
            : value.toISOString().slice(0, 10);

    }

    const text =
        String(value).trim();

    if (!text) {
        return null;
    }

    if (/^\d{4}-\d{2}-\d{2}$/.test(text)) {
        return text;
    }

    const dayFirst =
        text.match(/^(\d{1,2})[/\-.](\d{1,2})[/\-.](\d{4})$/);

    if (dayFirst) {
        return buildDate(
            Number(dayFirst[3]),
            Number(dayFirst[2]),
            Number(dayFirst[1])
        );
    }

    const yearFirst =
        text.match(/^(\d{4})[/\-.](\d{1,2})[/\-.](\d{1,2})$/);

    if (yearFirst) {
        return buildDate(
            Number(yearFirst[1]),
            Number(yearFirst[2]),
            Number(yearFirst[3])
        );
    }

    return null;

}

/**
 * Builds a `yyyy-MM-dd` string from a year/month/day triplet, validating that
 * the combination is a real calendar date.
 *
 * @param {number} year
 * @param {number} month
 * @param {number} day
 * @returns {string | null} the normalized date, or `null` when invalid
 */
function buildDate(
    year: number,
    month: number,
    day: number
): string | null {

    const date =
        new Date(
            Date.UTC(
                year,
                month - 1,
                day
            )
        );

    const valid =
        date.getUTCFullYear() === year &&
        date.getUTCMonth() === month - 1 &&
        date.getUTCDate() === day;

    return valid
        ? date.toISOString().slice(0, 10)
        : null;

}