import { AbstractError } from "@/errors";
import { Invoices, Invoice } from "@models/apps/dflc/gestordegastos/entities";
import { Either, right, left } from "@sweet-monads/either";
import { InvoiceService } from "./protocols";
import { InvoiceModel } from "@/models/invoice";
import { CurrencyModel } from "@/models/currency";
import Decimal from "decimal.js";
import { InvoiceRepository } from "@/repositories/invoice";
import { BaseServiceImplementation } from "../base/implementation";
import { PersonRepository } from "@/repositories/person";
import { ShareRepository } from "@/repositories/share";
import { User } from "@sap/cds";
import { EntityRepository } from '@/repositories/entity';
import { PermissionDenied } from "@/errors/permission-denied";
import { ServiceLocator } from "@/infrastructure/ServiceLocator";
import { TransactionModel } from "@/models/transaction";
import { CardRepository } from "@/repositories/card";

export class InvoiceServiceImplementation extends BaseServiceImplementation<Invoice> implements InvoiceService {

    protected Repository: InvoiceRepository;

    constructor(
        PersonRepository: PersonRepository,
        ShareRepository: ShareRepository,
        EntityRepository: EntityRepository,
        Repository: InvoiceRepository,
        private readonly CardRepository: CardRepository,
    ) {

        super(PersonRepository, ShareRepository, EntityRepository);

        this.Repository = Repository;

    }


    public async afterRead(Invoices: Invoices, User: User): Promise<Either<AbstractError, Invoices>> {

        try {

            const result = await this.processAfterRead(Invoices, User);
            let oInvoicesFiltered: Invoices = [];
            if (result.isRight()) oInvoicesFiltered = result.value;
            else oInvoicesFiltered = []

            const oInvoicesData: Invoices = [];

            for (let Invoice of oInvoicesFiltered) {

                const oCurrencyModel = CurrencyModel.with({
                    Code: Invoice.Currency?.code as string,
                    Name: Invoice.Currency?.name as string,
                    Description: Invoice.Currency?.descr as string,
                    Symbol: Invoice.Currency?.symbol as string,
                    MinorUnit: Invoice.Currency?.minorUnit as number
                });

                const oInvoiceModel = InvoiceModel.with({
                    Id: Invoice.ID as string,
                    Year: Invoice.Year as number,
                    Month: Invoice.Month as number,
                    Description: Invoice.Description as string,
                    TotalAmount: new Decimal(Invoice.TotalAmount ?? 0),
                    Currency: oCurrencyModel,
                    InvoiceSent: Invoice.InvoiceSent as boolean,
                    Transactions: Invoice.Transactions?.map((item) => TransactionModel.with({
                        Id: item.ID as string,
                        Identifier: item.Identifier as string,
                        Date: item.Date as string,
                        TotalAmount: new Decimal(item.TotalAmount ?? 0),
                        Amount: new Decimal(item.Amount ?? 0),
                        Currency: oCurrencyModel,
                        TotalInstallments: item.TotalInstallments as number,
                        Installment: item.Installment as number,
                        Description: item.Description as string,
                        CreatedAt: item.createdAt as string,
                        CreatedBy: item.createdBy as string,
                        ModifiedAt: item.modifiedAt as string,
                        ModifiedBy: item.modifiedBy as string
                    })) as TransactionModel[],
                    CreatedAt: Invoice.createdAt as string,
                    CreatedBy: Invoice.createdBy as string,
                    ModifiedAt: Invoice.modifiedAt as string,
                    ModifiedBy: Invoice.modifiedBy as string
                });


                if (!oInvoiceModel.Description && oInvoiceModel.Month) {

                    oInvoiceModel.Description = this.getMessage(`month.${oInvoiceModel.Month}`, ServiceLocator.getRequest());

                }

                const oInvoiceData = oInvoiceModel.toEntityObject();

                oInvoicesData.push({
                    ...Invoice,
                    Description: oInvoiceData.Description
                });

            };

            return right(oInvoicesData);

        } catch (error) {

            const errorInstance: Error = error as Error;

            return left(new AbstractError(errorInstance.message, 403, errorInstance.stack as string));

        }

    }


    protected async checkPermission(Invoice: Invoice, User: User, Permission: number) {

        const cache = ServiceLocator.getPermissionCache();

        const userId = User?.id;

        let personId = cache.personMap.get(Invoice.ID);

        if (!personId) {

            if (!Invoice?.Card_ID && !Invoice?.Card?.ID) {

                personId =
                    await this.Repository.findPersonIdById(Invoice?.ID as string);

            } else {

                let personIdByCard = cache.personMap.get(Invoice?.Card_ID || Invoice?.Card?.ID);

                personId =
                    personIdByCard ||
                    await this.CardRepository.findPersonIdById((Invoice?.Card_ID || Invoice?.Card?.ID) as string);

            }

            if (personId) {
                cache.personMap.set(Invoice.ID, personId);
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

        return ['Card', 'Person'];

    }


    protected entityCode(): number {

        return 6;

    }

    protected parentField(): string | null {
        return 'Card.ID';
    }


}