import { TransactionModel } from "@/models/transaction";
import { Transaction, Transactions } from "@models/GestorDeGastos";
import { TransactionRepository } from "./protocols";
import cds, { entity } from "@sap/cds";
import { oTransactionRouteFactory } from "@/factories/routes/transaction";
import { CurrencyModel } from "@/models/currency";
import Decimal from "decimal.js";


export class TransactionRepositoryImplementation implements TransactionRepository {

    public async findByCategoryID(CategoryID: Transaction["Category_ID"], Limit: number): Promise<TransactionModel[] | null> {

        const oSql = this.getReportBaseSql();

        oSql.where({ Category_ID: CategoryID });

        if (Limit != 0 && Limit) {

            oSql.limit(Limit);

        }

        const oTransactions = await cds.run(oSql);

        const oTransactionsModel = this.mapTransactionResult(oTransactions);

        return oTransactionsModel;

    }


    private getReportBaseSql(): cds.ql.SELECT<unknown, unknown> {

        const oTransactionEntity = oTransactionRouteFactory.getEntity();

        return SELECT.from(oTransactionEntity);

    }


    private mapTransactionResult(Transactions: Transactions): TransactionModel[] | null {

        if (Transactions.length === 0) {

            return null;

        }

        return Transactions.map((Transaction: Transaction) => {

            return TransactionModel.with({
                Id: Transaction.ID as string,
                Identifier: Transaction.Identifier as string,
                Date: Transaction.Date as string,
                TotalAmount: Transaction.TotalAmount as unknown as Decimal,
                Amount: Transaction.Amount as unknown as Decimal,
                Currency: Transaction.Currency as CurrencyModel,
                TotalInstallments: Transaction.TotalInstallments as number,
                Installment: Transaction.Installment as number,
                Description: Transaction.Description as string,
                CreatedAt: Transaction.createdAt as string,
                CreatedBy: Transaction.createdBy as string,
                ModifiedAt: Transaction.modifiedAt as string,
                ModifiedBy: Transaction.modifiedBy as string
            });

        });

    }

}