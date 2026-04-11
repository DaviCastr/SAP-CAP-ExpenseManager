import { AbstractError } from "@/errors";
import { Transactions, Transaction } from "@models/apps/dflc/gestordegastos/entities";
import { Either, right, left } from "@sweet-monads/either";
import { TransactionService } from "./protocols";
import { TransactionModel } from "@/models/transaction";
import { CurrencyModel } from "@/models/currency";
import Decimal from "decimal.js";
import { TransactionRepository } from "@/repositories/transaction";
import { BaseServiceImplementation } from "../base/implementation";
import { PersonRepository } from "@/repositories/person";
import { ShareRepository } from "@/repositories/share";
import { User } from "@sap/cds";
import { InvoiceRepository } from "@/repositories/invoice/protocols";
import { EntityRepository } from '@/repositories/entity';
import { PermissionDenied } from "@/errors/permission-denied";
import { ServiceLocator } from "@/infrastructure/ServiceLocator";

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

            return left(new AbstractError(errorInstance.message, 403, errorInstance.stack as string));

        }

    }


    public async afterRead(Transactions: Transactions, User: User): Promise<Either<AbstractError, Transactions>> {

        try {

            const result = await this.processAfterRead(Transactions, User);
            let oTransactionsFiltered: Transactions = [];
            if(result.isRight()) oTransactionsFiltered = result.value;
            else oTransactionsFiltered = []

            let oTransactionReference: TransactionModel | null = null;

            const oTransactionsData: Transactions = [];

            for (let Transaction of oTransactionsFiltered) {

                const oCurrencyModel = CurrencyModel.with({
                    Code: Transaction.Currency?.code || Transaction?.Currency_code as string,
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

            return left(new AbstractError(errorInstance.message, 403, errorInstance.stack as string));

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

            return left(new AbstractError(errorInstance.message, 403, errorInstance.stack as string));

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

            return left(new AbstractError(errorInstance.message, 403, errorInstance.stack as string));

        }

    }


    protected async checkPermission(Transaction: Transaction, User: User, Permission: number) {

        const cache = ServiceLocator.getPermissionCache();

        const userId = User?.id;

        let personId = cache.personMap.get(Transaction.ID);

        if (!personId) {

            if (!Transaction?.Invoice_ID && !Transaction?.Invoice?.ID) {

                personId =
                    await this.Repository.findPersonIdById(Transaction?.ID as string);

            } else {

                let personIdByInvoice = cache.personMap.get(Transaction?.Invoice_ID || Transaction?.Invoice?.ID);

                personId =
                    personIdByInvoice ||
                    await this.InvoiceRepository.findPersonIdById((Transaction?.Invoice_ID || Transaction?.Invoice?.ID) as string);

            }

            if (personId) {
                cache.personMap.set(Transaction.ID, personId);
            }

        }

        if (!personId) {

            const oStack = new Error().stack as string;

            const message = this.getMessage('error.invalidPersonId', ServiceLocator.getRequest(), this.entityCode()) ||
                'error.invalidPersonId';

            return left(new PermissionDenied(message, 403, oStack));

        }

        const key = ServiceLocator.buildPermissionKey(
            userId,
            personId,
            this.entityCode(),
            Permission
        );

        if (cache.permissionChecked.has(key)) {
            return right(true);
        }

        const result = await this.checkPermissionByPersonId(User, personId, Permission);

        if (result.isRight()) {
            cache.permissionChecked.add(key);
        }

        return result;

    }


    protected personPath(): string[] {

        return ['Invoice', 'Card', 'Person'];

    }


    protected entityCode(): number {

        return 7;

    }


    protected parentField(): string | null {
        return 'Invoice.ID';
    }


}