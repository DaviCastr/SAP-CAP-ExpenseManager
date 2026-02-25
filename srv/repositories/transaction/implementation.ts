import cds, { entity } from "@sap/cds";

import { TransactionModel } from "@/models/transaction";
import { Transaction, Transactions } from "@models/GestorDeGastos";
import { TransactionRepository } from "./protocols";
import { CurrencyModel } from "@/models/currency";
import Decimal from "decimal.js";
import { BaseRepositoryImplementation } from "../base/implementation";
import { ServiceLocator } from "@/infrastructure/ServiceLocator";


export class TransactionRepositoryImplementation extends BaseRepositoryImplementation implements TransactionRepository {


    public async findByID(Id: Transaction["ID"]): Promise<TransactionModel | null> {

        const oSql = this.getReportBaseSql();

        oSql.where({ ID: Id });

        const oTransactions: Transactions = await cds.run(oSql);

        const oTransactionsModel = await this.mapTransactionResult(oTransactions);

        if (Array.isArray(oTransactionsModel)) {

            return oTransactionsModel[0];

        }

        return null;

    }


    public async findByCategoryID(CategoryID: Transaction["Category_ID"], Limit: number): Promise<TransactionModel[] | null> {

        const oSql = this.getReportBaseSql();

        oSql.where({ Category_ID: CategoryID });

        if (Limit != 0 && Limit) {

            oSql.limit(Limit);

        }

        const oTransactions = await cds.run(oSql);

        const oTransactionsModel = await this.mapTransactionResult(oTransactions);

        return oTransactionsModel;

    }


    private getReportBaseSql(Request?: Request): cds.ql.SELECT<unknown, unknown> {

        const oTransactionEntity = this.getEntity(Request);

        return SELECT.from(oTransactionEntity);

    }


    protected getEntity(Request?: Request): entity {

        return ServiceLocator.getEntity('Transactions');

    }


    protected personPath(): string {

        return 'Invoice.Card.Person';

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
                TransactionModel.with({
                    Id: Transaction.ID as string,
                    Identifier: Transaction.Identifier as string,
                    Date: Transaction.Date as string,
                    TotalAmount: new Decimal(Transaction.TotalAmount ?? 0),
                    Amount: new Decimal(Transaction.Amount ?? 0),
                    Currency: Transaction.Currency as CurrencyModel,
                    TotalInstallments: Transaction.TotalInstallments as number,
                    Installment: Transaction.Installment as number,
                    Description: Transaction.Description as string,
                    CreatedAt: Transaction.createdAt as string,
                    CreatedBy: Transaction.createdBy as string,
                    ModifiedAt: Transaction.modifiedAt as string,
                    ModifiedBy: Transaction.modifiedBy as string
                })
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