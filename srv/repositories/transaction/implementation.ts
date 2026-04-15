import cds, { entity } from "@sap/cds";

import { TransactionModel } from "@/models/transaction";
import { Transaction, Transactions } from "@models/apps/dflc/gestordegastos/entities";
import { TransactionRepository } from "./protocols";
import { CurrencyModel } from "@/models/currency";
import Decimal from "decimal.js";
import { BaseRepositoryImplementation } from "../base/implementation";
import { ServiceLocator } from "@/infrastructure/ServiceLocator";


export class TransactionRepositoryImplementation extends BaseRepositoryImplementation implements TransactionRepository {


    public async findById(Id: Transaction["ID"]): Promise<TransactionModel | null> {

        let oSql = this.getReportBaseSql();

        oSql.where({ ID: Id });

        let oTransactions: Transactions = await cds.run(oSql);

        if ((this.getEntity() as any)?.isDraft) {

            oSql = this.getReportBaseSql(true);

            oSql.where({ ID: Id });

            const additionalTransactions: Transactions = await cds.run(oSql) || [];

            oTransactions = [...(oTransactions || []), ...additionalTransactions];

        }

        const oTransactionsModel = await this.mapTransactionResult(oTransactions);

        if (Array.isArray(oTransactionsModel)) {

            return oTransactionsModel[0];

        }

        return null;

    }


    public async findByIds(Ids: Transaction['ID'][]): Promise<TransactionModel[] | null> {

        let oTransactionEntity = this.getEntity();

        let oSql = SELECT.from(oTransactionEntity).where({ ID: { in: Ids } });

        let oTransactions = await cds.run(oSql);

        if ((oTransactionEntity as any)?.isDraft) {

            oTransactionEntity = this.getEntity(true);

            oSql = SELECT.from(oTransactionEntity).where({ ID: { in: Ids } });

            const additionalTransactionts = await cds.run(oSql) || [];
            oTransactions = [...(oTransactions || []), ...additionalTransactionts];

        }

        const oTransactionsModel = this.mapTransactionResult(oTransactions);

        return oTransactionsModel;

    }


    public async findByCategoryID(CategoryID: Transaction["Category_ID"], Limit: number): Promise<TransactionModel[] | null> {

        let oSql = this.getReportBaseSql();

        oSql.where({ Category_ID: CategoryID });

        if (Limit != 0 && Limit) {

            oSql.limit(Limit);

        }

        let oTransactions = await cds.run(oSql);

        if ((this.getEntity() as any)?.isDraft) {

            oSql = this.getReportBaseSql(true);

            oSql.where({ Category_ID: CategoryID });

            if (Limit != 0 && Limit) {

                oSql.limit(Limit);

            }

            const additionalTransactions: Transactions = await cds.run(oSql) || [];

            oTransactions = [...(oTransactions || []), ...additionalTransactions];

        }

        const oTransactionsModel = await this.mapTransactionResult(oTransactions);

        return oTransactionsModel;

    }


    public async createEntry(data: Transaction | Transactions): Promise<TransactionModel[] | null> {

        let oTransactionEntity = this.getEntity();

        let oSql = INSERT.into(oTransactionEntity).entries(data);

        await cds.run(oSql);

        return this.mapTransactionResult(Array.isArray(data) ? data : [data]);

    }


    private getReportBaseSql(ignoreDraft?: boolean): cds.ql.SELECT<unknown, unknown> {

        const oTransactionEntity = this.getEntity(ignoreDraft);

        return SELECT.from(oTransactionEntity);

    }


    protected getEntity(ignoreDraft?: boolean): entity {

        return ServiceLocator.getEntity('Transactions', ignoreDraft);

    }


    protected personPath(): string {

        return 'Invoice.Transaction.Person';

    }


    private async mapTransactionResult(Transactions: Transactions): Promise<TransactionModel[] | null> {

        if (Transactions.length === 0) {

            return null;

        }

        const oTransactionsModel: TransactionModel[] = [];

        for (let Transaction of Transactions) {

            if (!Transaction.TotalAmount || Transaction.TotalAmount == 0) {

                const oTotalAmountData = await this.selectTotalAmount(Transaction);

                Transaction.Identifier = oTotalAmountData.Identifier;
                Transaction.TotalAmount = oTotalAmountData.TotalAmount;

            }

            oTransactionsModel.push(
                TransactionModel.singleModel(Transaction)
            );

        };

        return oTransactionsModel;

    }


    private async selectTotalAmount(Transaction: Transaction): Promise<{
        Identifier: Transaction['Identifier'],
        TotalAmount: Transaction['TotalAmount']
    }> {

        const oTransactionEntity = this.getEntity();

        const returnTotalAmount = async (Identifier: Transaction['Identifier']) => {

            const oTotalAmount = await cds.run(
                SELECT.one`coalesce(sum(TotalAmount),0) as TotalAmount`
                    .from(oTransactionEntity)
                    .where({ Identifier: Identifier })
            );

            return {
                Identifier: Identifier,
                TotalAmount: oTotalAmount?.TotalAmount ?? 0
            }

        }


        if (Transaction.Identifier) {

            return returnTotalAmount(Transaction.Identifier);

        } else {

            const oIdentifier = await cds
                .run(
                    SELECT.one
                        .from(oTransactionEntity)
                        .columns('Identifier')
                        .where({ ID: Transaction.ID })
                );

            return returnTotalAmount(oIdentifier?.Identifier);

        }

    }

}