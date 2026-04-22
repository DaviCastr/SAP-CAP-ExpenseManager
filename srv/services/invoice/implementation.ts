import { AbstractError } from "@/errors";
import { Invoices, Invoice } from "@models/apps/dflc/gestordegastos/entities";
import { Either, right, left } from "@sweet-monads/either";
import { InvoiceService } from "./protocols";
import { InvoiceModel } from "@/models/invoice";
import { InvoiceRepository } from "@/repositories/invoice";
import { BaseServiceImplementation } from "../base/implementation";
import { PersonRepository } from "@/repositories/person";
import { ShareRepository } from "@/repositories/share";
import { User } from "@sap/cds";
import { EntityRepository } from '@/repositories/entity';
import { PermissionDenied } from "@/errors/permission-denied";
import { ServiceLocator } from "@/infrastructure/ServiceLocator";
import { CardRepository } from "@/repositories/card";

export class InvoiceServiceImplementation extends BaseServiceImplementation<Invoice> implements InvoiceService {

    public Repository: InvoiceRepository;

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

                const oInvoiceModel = InvoiceModel.singleModel(Invoice);

                if (!oInvoiceModel.Description && oInvoiceModel.Month) {

                    oInvoiceModel.Description = this.getMessage(`month.${oInvoiceModel.Month}`, ServiceLocator.getRequest());

                }

                const oInvoiceData = oInvoiceModel.toEntityObject();

                oInvoicesData.push({
                    ...oInvoiceData
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


    public entityCode(): number {

        return 6;

    }

    protected parentField(): string | null {
        return 'Card.ID';
    }


}