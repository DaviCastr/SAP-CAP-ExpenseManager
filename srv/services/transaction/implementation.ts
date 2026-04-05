import { AbstractError, ServerError } from "@/errors";
import { Transactions, Transaction } from "@models/GestorDeGastos";
import { Either, right, left } from "@sweet-monads/either";
import { TransactionService } from "./protocols";
import { TransactionModel } from "@/models/transaction";
import { CurrencyModel } from "@/models/currency";
import Decimal from "decimal.js";
import { TransactionRepository } from "@/repositories/transaction";
import { BaseServiceImplementation } from "../base/implementation";
import { PersonRepository } from "@/repositories/person";
import { ShareRepository } from "@/repositories/share";
import { Request, User } from "@sap/cds";
import { InvoiceRepository } from "@/repositories/invoice/protocols";
import { EntityRepository } from '@/repositories/entity';
import { PermissionDenied } from "@/errors/permission-denied";

export class TransactionServiceImplementation extends BaseServiceImplementation<Transaction> implements TransactionService {

    protected Repository: TransactionRepository;

    constructor(
        PersonRepository: PersonRepository,
        ShareRepository: ShareRepository,
        EntityRepository: EntityRepository,
        Repository: TransactionRepository,
        private readonly InvoiceRepository: InvoiceRepository,
    ) {

        super(PersonRepository, ShareRepository, EntityRepository);

        this.Repository = Repository;

    }


    public async onDelete(Transaction: Transaction): Promise<Either<AbstractError, void>> {

        try {

            await this.InvoiceRepository.updateTotalAmountByTransactionId(Transaction?.ID);

            return right(undefined);

        } catch (error) {

            const errorInstance: Error = error as Error;

            return left(new ServerError(errorInstance.stack as string, errorInstance.message));

        }

    }


    public async afterRead(Transactions: Transactions): Promise<Either<AbstractError, Transactions>> {

        try {

            let oTransactionReference: TransactionModel | null = null;

            const oTransactionsData: Transactions = [];

            for (let Transaction of Transactions) {

                const oCurrencyModel = CurrencyModel.with({
                    Code: Transaction.Currency?.code as string,
                    Name: Transaction.Currency?.name as string,
                    Description: Transaction.Currency?.descr as string,
                    Symbol: Transaction.Currency?.symbol as string,
                    MinorUnit: Transaction.Currency?.minorUnit as number
                });

                const oTransactionModel = TransactionModel.with({
                    Id: Transaction.ID as string,
                    Identifier: Transaction.Identifier as string,
                    Date: Transaction.Date as string,
                    TotalAmount: new Decimal(Transaction.TotalAmount ?? 0),
                    Amount: new Decimal(Transaction.Amount ?? 0),
                    Currency: oCurrencyModel,
                    TotalInstallments: Transaction.TotalInstallments as number,
                    Installment: Transaction.Installment as number,
                    Description: Transaction.Description as string,
                    CreatedAt: Transaction.createdAt as string,
                    CreatedBy: Transaction.createdBy as string,
                    ModifiedAt: Transaction.modifiedAt as string,
                    ModifiedBy: Transaction.modifiedBy as string
                });

                if (oTransactionModel.TotalAmount.isZero() && 'TotalAmount' in Transaction) {

                    if (!oTransactionReference) {

                        oTransactionReference = await this.Repository.findByID(oTransactionModel.Id);

                    } else {

                        if (oTransactionModel.Identifier != oTransactionReference.Identifier) {

                            oTransactionReference = await this.Repository.findByID(oTransactionModel.Id);

                        }

                    }

                    oTransactionModel.TotalAmount = oTransactionReference?.TotalAmount
                        ? oTransactionReference.TotalAmount
                        : new Decimal(0);

                }

                const oTransactionData = oTransactionModel.toEntityObject();

                oTransactionsData.push({
                    ...Transaction,
                    Identifier: 'Identifier' in Transaction ? oTransactionData.Identifier : undefined,
                    TotalAmount: 'TotalAmount' in Transaction ? oTransactionData.TotalAmount : undefined
                });

            };

            return right(oTransactionsData);

        } catch (error) {

            const errorInstance: Error = error as Error;

            return left(new ServerError(errorInstance.stack as string, errorInstance.message));

        }

    }


    public async afterCreate(Transactions: Transactions): Promise<Either<AbstractError, void>> {

        try {

            let oInvoiceID: string | undefined | null;

            for (const Transaction of Transactions) {

                if (oInvoiceID != Transaction?.Invoice_ID) {

                    await this.InvoiceRepository.updateTotalAmountByTransactionId(Transaction?.ID);

                    oInvoiceID = Transaction?.Invoice_ID;

                }

            }

            return right(undefined);

        } catch (error) {

            const errorInstance: Error = error as Error;

            return left(new ServerError(errorInstance.stack as string, errorInstance.message));

        }

    }


    public async afterUpdate(Transactions: Transactions): Promise<Either<AbstractError, void>> {

        try {

            for (const Transaction of Transactions) {

                if ('TotalAmount' in Transaction || 'Amount' in Transaction) {

                    await this.InvoiceRepository.updateTotalAmountByTransactionId(Transaction?.ID);

                }

            }

            return right(undefined);

        } catch (error) {

            const errorInstance: Error = error as Error;

            return left(new ServerError(errorInstance.stack as string, errorInstance.message));

        }

    }


    protected async checkPermission(Transaction: Transaction, LoggedUser: User, Permision: number): Promise<Either<AbstractError, boolean>> {

        try {

            let oPersonID: string | null;

            if (!Transaction.Invoice_ID) {

                oPersonID = await this.Repository.findPersonIdById(Transaction.ID as string);

            } else {

                oPersonID = await this.InvoiceRepository.findPersonIdById(Transaction.Invoice_ID as string);

            }

            if (oPersonID) {

                const oCheckPermission = await this.checkPermissionByPersonId(LoggedUser, oPersonID as string, Permision);

                if (oCheckPermission.isLeft()) {

                    return left(oCheckPermission.value);

                }

            } else {

                const oStack = new Error().stack as string;

                return left(new PermissionDenied('error.invalidPersonId', 403, oStack));

            }

            return right(true);

        } catch (oError) {

            const errorInstance: Error = oError as Error;

            return left(new AbstractError(errorInstance.message, 400, errorInstance.stack as string));

        }

    }


    protected personPath(): string[] {

        return ['Invoice', 'Card', 'Person'];

    }


    protected entityCode(): number {

        return 7;

    }


}