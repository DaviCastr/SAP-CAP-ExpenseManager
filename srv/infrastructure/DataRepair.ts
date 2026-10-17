import cds from '@sap/cds';

const ENTITIES_NAMESPACE = 'apps.dflc.expensemanager.entities';
const DEFAULT_CURRENCY = 'BRL';

type Row = { ID: string; Liability_ID?: string; Currency_code?: string | null };

/**
 * One-off repairs of data restored from older backups. Safe to run on every
 * start: each repair only touches rows that are still inconsistent.
 */
export class DataRepair {

    public static async run(): Promise<void> {

        try {

            await this.fillMissingDebtMovementCurrencies();

        } catch (error) {

            cds.log('data-repair').error('Data repair failed:', (error as Error).message);

        }

    }


    /**
     * Backups exported before the fix lost the currency of the debt
     * movements, so restored movements (and drafts opened from them) failed
     * the mandatory check on every save. They get the currency of their debt.
     */
    private static async fillMissingDebtMovementCurrencies(): Promise<void> {

        const { LiabilityTransactions, Liabilities } = cds.entities(ENTITIES_NAMESPACE);
        const service = cds.services['ExpenseManager'] as cds.Service | undefined;
        const targets = [
            { movements: LiabilityTransactions, debts: Liabilities },
            { movements: service?.entities.LiabilityTransactions?.drafts, debts: service?.entities.Liabilities?.drafts }
        ];

        let repaired = 0;

        for (const { movements, debts } of targets) {

            if (!movements || !debts) {
                continue;
            }

            const missing = await SELECT.from(movements).columns('ID', 'Liability_ID').where({ Currency_code: null }) as Row[];

            if (!missing.length) {
                continue;
            }

            const debtIds = [...new Set(missing.map((row) => row.Liability_ID).filter((id): id is string => !!id))];
            const currencies = new Map(
                (await SELECT.from(debts).columns('ID', 'Currency_code').where({ ID: { in: debtIds } }) as Row[])
                    .map((debt) => [debt.ID, debt.Currency_code])
            );

            const byCurrency = new Map<string, string[]>();

            missing.forEach((row) => {
                const code = currencies.get(row.Liability_ID ?? '') || DEFAULT_CURRENCY;
                byCurrency.set(code, [...(byCurrency.get(code) ?? []), row.ID]);
            });

            for (const [code, ids] of byCurrency) {
                await UPDATE(movements).set({ Currency_code: code }).where({ ID: { in: ids } });
            }

            repaired += missing.length;

        }

        if (repaired) {
            cds.log('data-repair').info(`Filled the currency of ${repaired} debt movement(s) restored without it`);
        }

    }

}
