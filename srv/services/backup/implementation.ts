import cds, { User } from '@sap/cds';
import { AbstractError } from '@/errors';
import { Backup, Card, Category, Entity, Invoice, Person, Share, Transaction } from '@models/apps/dflc/gestordegastos/entities';
import { Either, left, right } from '@sweet-monads/either';
import { BackupService } from './protocols';
import { BaseServiceImplementation } from '../base/implementation';
import { ShareRepository } from '@/repositories/share';
import { PersonRepository } from '@/repositories/person';
import { BackupRepository } from '@/repositories/backup';
import { EntityRepository } from '@/repositories/entity';
import AdmZip from 'adm-zip';
import excel from 'exceljs';
import { ServiceRegistry } from '@/infrastructure/ServiceRegistry';
import { ServiceLocator } from '@/infrastructure/ServiceLocator';
import { InvoiceRepository } from '@/repositories/invoice';
import { PersonModel } from '@/models/person';
import { Readable } from 'stream';
import { CategoryServiceImplementation } from '../category/implementation';
import { CategoryModel } from '@/models/category';
import { PersonServiceImplementation } from '../person/implementation';
import { CardServiceImplementation } from '../card/implementation';
import { CardModel } from '@/models/card';
import { InvoiceServiceImplementation } from '../invoice/implementation';
import { InvoiceModel } from '@/models/invoice';
import { TransactionServiceImplementation } from '../transaction/implementation';
import { TransactionModel } from '@/models/transaction';
import { ShareServiceImplementation } from '../share/implementation';
import { ShareModel } from '@/models/share';
import { EntityServiceImplementation } from '../entity/implementation';
import { EntityModel } from '@/models/entity';

export class BackupServiceImplementation extends BaseServiceImplementation<Backup> implements BackupService {

    public Repository: BackupRepository;
    private InvoiceRepository: InvoiceRepository;

    constructor(
        PersonRepository: PersonRepository,
        ShareRepository: ShareRepository,
        EntityRepository: EntityRepository,
        InvoiceRepository: InvoiceRepository,
        Repository: BackupRepository,
    ) {

        super(PersonRepository, ShareRepository, EntityRepository);

        this.Repository = Repository;
        this.InvoiceRepository = InvoiceRepository;

    }


    public async beforeCreate(Backup: Backup, User: User): Promise<Either<AbstractError, boolean>> {

        return this.processImport(Backup);

    }


    public async beforeUpdate(Backup: Backup, User: User): Promise<Either<AbstractError, boolean>> {

        return this.processImport(Backup);

    }


    public async beforeEdit(Backup: Backup, User: User): Promise<Either<AbstractError, boolean>> {

        return this.processImport(Backup);

    }


    public async processBackupDelete(Backup: Backup): Promise<Either<AbstractError, boolean>> {

        try {

            const result = await this.Repository.deleteEntry(Backup?.ID);

            return right(result);

        } catch (error) {

            const errorInstance: Error = error as Error;
            return left(new AbstractError(errorInstance.message, 403, errorInstance.stack as string));

        }

    }


    public async exportBackup(): Promise<Either<AbstractError, string>> {

        const zip = new AdmZip();

        const user = ServiceLocator.getRequest()?.user;

        try {

            const personService = ServiceRegistry.get('Persons') as PersonServiceImplementation;

            const persons = await personService?.Repository?.findByUser(user?.id) || [] as PersonModel[];

            if (!persons.length) {
                return left(new AbstractError('error.dataToGenerateBackupNotFound', 403, new Error().stack as string));
            }

            const personIds = persons.map(p => p.Id);

            const shareRepo = (ServiceRegistry.get('Shares') as ShareServiceImplementation).Repository;
            const categoryRepo = (ServiceRegistry.get('Categories') as CategoryServiceImplementation).Repository;
            const cardRepo = (ServiceRegistry.get('Cards') as CardServiceImplementation).Repository;
            const entityRepo = (ServiceRegistry.get('Entities') as EntityServiceImplementation).Repository;
            const invoiceRepo = (ServiceRegistry.get('Invoices') as InvoiceServiceImplementation).Repository;
            const transactionRepo = (ServiceRegistry.get('Transactions') as TransactionServiceImplementation).Repository;

            const [
                shares,
                categories,
                cards
            ] = await Promise.all([
                shareRepo.findByPersonIds(personIds),
                categoryRepo.findByPersonIds(personIds),
                cardRepo.findByPersonIds(personIds)
            ]);

            const shareIds = shares?.map(s => s.Id);
            const cardIds = cards?.map(c => c.Id);

            const [
                entities,
                invoices
            ] = await Promise.all([
                entityRepo.findByShareIds(shareIds || []),
                invoiceRepo.findByCardIDs(cardIds || [])
            ]);

            const invoiceIds = invoices?.map(i => i.Id);

            const transactions = await transactionRepo.findByInvoiceIds(invoiceIds);

            const [
                personImages,
                categoryImages,
                cardImages
            ] = await Promise.all([
                this.PersonRepository.findImageByIds(personIds),
                categoryRepo.findImageByIds(categories?.map(c => c.Id) || []),
                cardRepo.findImageByIds(cards?.map(c => c.Id) || [])
            ]);

            const groupBy = <T>(arr: T[], key: keyof T) =>
                arr.reduce((acc, item) => {
                    const k = item[key] as any;
                    if (!acc[k]) acc[k] = [];
                    acc[k].push(item);
                    return acc;
                }, {} as Record<string, T[]>);

            const sharesByPerson = groupBy(shares || [], 'PersonId');
            const categoriesByPerson = groupBy(categories || [], 'PersonId');
            const cardsByPerson = groupBy(cards || [], 'PersonId');
            const entitiesByShare = groupBy(entities || [], 'ShareId');
            const invoicesByCard = groupBy(invoices || [], 'CardId');
            const transactionsByInvoice = groupBy(transactions || [], 'InvoiceId');

            const mapById = <T extends { ID: string, Image: Readable }>(arr: T[]) =>
                arr?.reduce((acc, item) => {
                    acc[item.ID] = item;
                    return acc;
                }, {} as Record<string, T>);

            const personImageMap = mapById(personImages as any);
            const categoryImageMap = mapById(categoryImages as any);
            const cardImageMap = mapById(cardImages as any);

            await Promise.all(persons.map(async (person) => {

                const personZip = new AdmZip();
                const workbook = new excel.Workbook();

                const personSheet = workbook.addWorksheet('Persons');
                const personData = person.toEntityObject();

                personSheet.columns = Object.keys(personData).map(key => ({ header: key, key })) as any;
                personSheet.addRow(personData);

                const pImg = personImageMap[person.Id];
                if (pImg?.Image) {
                    const buffer = await this.readableToBuffer(pImg.Image as Readable) as Buffer;
                    const ext = person.ImageType?.split("/")[1];
                    personZip.addFile(`${person.Id}.${ext}`, buffer);
                }

                const personShares = sharesByPerson[person.Id] || [];

                if (personShares.length) {

                    const shareSheet = workbook.addWorksheet('Shares');
                    shareSheet.columns = Object.keys(personShares[0].toEntityObject()).map(k => ({ header: k, key: k })) as any;
                    shareSheet.addRows(personShares.map(s => s.toEntityObject()));

                    const allEntities = personShares.flatMap(s => entitiesByShare[s.Id] || []);

                    if (allEntities.length) {
                        const entitySheet = workbook.addWorksheet('Entities');
                        entitySheet.columns = Object.keys(allEntities[0].toEntityObject()).map(k => ({ header: k, key: k })) as any;
                        entitySheet.addRows(allEntities.map(e => e.toEntityObject()));
                    }
                }

                const personCategories = categoriesByPerson[person.Id] || [];

                if (personCategories.length) {

                    const categorySheet = workbook.addWorksheet('Categories');
                    categorySheet.columns = Object.keys(personCategories[0].toEntityObject()).map(k => ({ header: k, key: k })) as any;
                    categorySheet.addRows(personCategories.map(c => c.toEntityObject()));

                    await Promise.all(personCategories.map(async (category) => {
                        const img = categoryImageMap[category.Id];
                        if (img?.Image) {
                            const buffer = await this.readableToBuffer(img.Image as Readable) as Buffer;
                            const ext = category.ImageType?.split("/")[1];
                            personZip.addFile(`${category.Id}.${ext}`, buffer);
                        }
                    }));
                }

                const personCards = cardsByPerson[person.Id] || [];

                if (personCards.length) {

                    const cardSheet = workbook.addWorksheet('Cards');
                    cardSheet.columns = Object.keys(personCards[0].toEntityObject()).map(k => ({ header: k, key: k })) as any;
                    cardSheet.addRows(personCards.map(c => c.toEntityObject()));

                    const allInvoices = personCards.flatMap(c => invoicesByCard[c.Id] || []);

                    if (allInvoices.length) {

                        const invoiceSheet = workbook.addWorksheet('Invoices');
                        invoiceSheet.columns = Object.keys(allInvoices[0].toEntityObject()).map(k => ({ header: k, key: k })) as any;
                        invoiceSheet.addRows(allInvoices.map(i => i.toEntityObject()));

                        const allTransactions = allInvoices.flatMap(i => transactionsByInvoice[i.Id] || []);

                        if (allTransactions.length) {
                            const transactionSheet = workbook.addWorksheet('Transactions');
                            transactionSheet.columns = Object.keys(allTransactions[0].toEntityObject()).map(k => ({ header: k, key: k })) as any;
                            transactionSheet.addRows(allTransactions.map(t => t.toEntityObject()));
                        }
                    }

                    await Promise.all(personCards.map(async (card) => {
                        const img = cardImageMap[card.Id];
                        if (img?.Image) {
                            const buffer = await this.readableToBuffer(img.Image as Readable) as Buffer;
                            const ext = card.ImageType?.split("/")[1];
                            personZip.addFile(`${card.Id}.${ext}`, buffer);
                        }
                    }));
                }

                const excelBuffer = await workbook.xlsx.writeBuffer() as any;
                personZip.addFile(`Dados_${person.Id}.xlsx`, excelBuffer);

                zip.addFile(`${person.Name}_backup.zip`, personZip.toBuffer());

            }));

            const zipBuffer = zip.toBuffer();

            const id = this.generateUUID();

            await this.Repository.createEntry({
                ID: id,
                Backup: zipBuffer as any,
                BackupType: "application/x-zip-compressed"
            });

            return right(id);

        } catch (error) {

            const err = error as Error;
            return left(new AbstractError(err.message, 403, err.stack as string));

        }
    }


    protected personPath(): string[] {

        return [];

    }


    protected entityCode(): number {

        return 8;

    }


    protected parentField(): string | null {
        return '';
    }

    private async processImport(Backup: Backup): Promise<Either<AbstractError, boolean>> {

        try {

            if (Backup?.Backup) {

                const oBackupBuffer = await this.readableToBuffer(Backup?.Backup);

                if (oBackupBuffer) {
                    return this.importBackup(oBackupBuffer as Buffer);
                }

            }

            return right(true);

        } catch (error) {

            const errorInstance: Error = error as Error;

            return left(new AbstractError(errorInstance.message, 403, errorInstance.stack as string));

        }

    }


    private async importBackup(file: Buffer): Promise<Either<AbstractError, boolean>> {

        try {

            const result = await this.loadZip(file);

            if (result.isLeft()) return result as any;

            const { workbook, binaryFiles } = result.value;

            const tables = ['Persons', 'Shares', 'Entities', 'Categories', 'Cards', 'Invoices', 'Transactions'];

            const promises: Promise<any>[] = [];

            for (const table of tables) {

                promises.push(this.processTable(table, workbook, binaryFiles));

            }

            await Promise.all(
                promises
            );

            return right(true);

        } catch (error) {

            const err = error as Error;
            return left(new AbstractError(err.message, 403, err.stack as string));

        }

    }


    private async loadZip(file: Buffer): Promise<Either<AbstractError, { workbook, binaryFiles }>> {

        const zip = new AdmZip(file);
        const entries = zip.getEntries();

        let excelFile: Buffer | undefined;
        const binaryFiles: Record<string, Buffer> = {};

        for (const entry of entries) {

            if (entry.entryName.endsWith('.xlsx')) {
                excelFile = entry.getData();
            } else {
                binaryFiles[entry.entryName] = entry.getData();
            }

        }

        if (!excelFile) {

            const oStack = new Error().stack as string;

            const message = this.getMessage('error.excelNotFound', ServiceLocator.getRequest(), this.entityCode())

            return left(new AbstractError(message, 403, oStack));

        }

        const workbook = new excel.Workbook();
        await workbook.xlsx.load(excelFile as any);

        return right({ workbook, binaryFiles });

    }


    private async processTable(table: string, workbook: excel.Workbook, binaryFiles: any) {

        const sheet = this.getWorksheet(workbook, table);
        if (!sheet) return;

        const rows = this.extractRows(sheet);
        if (!rows.length) return;

        const service = ServiceRegistry.get(table) as BaseServiceImplementation<any>;
        if (!service) return;

        const ids = rows?.map(r => r.ID).filter(Boolean);
        const existing = await service.Repository.findByIds(ids);
        const existingIds = new Set(existing?.map((r: any) => r.Id));
        const inserts: any[] = [];

        for (const row of rows) {

            if (existingIds.has(row.ID)) continue;

            const entity = this.mapRowToEntity(table, row, binaryFiles);
            inserts.push(this.cleanEntity(entity));

        }

        await this.batchInsert(service, inserts);

    }


    private extractRows(sheet: excel.Worksheet): any[] {

        const rows: any[] = [];
        let header: any;

        sheet.eachRow((row, rowNumber) => {

            if (rowNumber === 1) {
                header = row;
                return;
            }

            const obj: any = {};

            sheet.columns.forEach((col, i) => {
                const key = header.getCell(i + 1).value;
                obj[key] = row.getCell(i + 1).value;
            });

            rows.push(obj);

        });

        return rows;

    }


    private getWorksheet(workbook: excel.Workbook, table: string) {

        const map: Record<string, string> = {
            Persons: 'Pessoa',
            Categories: 'Categoria',
            Cards: 'Cartao',
            Invoices: 'Fatura',
            Transactions: 'Transacao'
        };

        const sheet = workbook.getWorksheet(table) || workbook.getWorksheet(map[table]);

        if (sheet?.name != table && sheet?.name != map[table]) return null;

        return sheet;
    }


    private async batchInsert(service: BaseServiceImplementation<any>, inserts: any[]) {

        if (!inserts.length) return;

        const chunkSize = 1;

        for (let i = 0; i < inserts.length; i += chunkSize) {

            const chunk = inserts.slice(i, i + chunkSize);

            await service.Repository.createEntry(chunk);

        }

    }


    private get(...values: any[]) {

        for (const value of values) {

            if (Array.isArray(value)) {
                if (value.length > 0) return value;
                continue;
            }

            if (value !== undefined && value !== null && value !== '') {
                return value;
            }

        }

        return undefined;

    }


    private parseJson(value: any, fallback: any = null) {

        if (!value) return fallback;

        if (typeof value === 'object') {
            return value;
        }

        try {
            return JSON.parse(value);
        } catch {
            return fallback;
        }

    }


    private audit(row: any) {

        return {
            createdAt: row.createdAt,
            createdBy: row.createdBy,
            modifiedAt: row.modifiedAt,
            modifiedBy: row.modifiedBy
        };

    }


    private attachImage(entity: any, binaryFiles: Record<string, any>) {

        if (!entity?.ID || !entity?.ImageType) return;

        const extension = entity.ImageType.split('/')?.[1];

        if (!extension) return;

        const file = binaryFiles[`${entity.ID}.${extension}`];

        if (!file) return;

        const buffer = Buffer.isBuffer(file)
            ? file
            : Buffer.from(file);

        entity.Image = buffer.toString('base64');

    }


    private relation(value: any, fallback: any = null) {

        return this.get(
            this.parseJson(value, null),
            fallback
        );

    }


    private buildPersons(row: any, binaryFiles: Record<string, any>): Person {

        const result: Person = {
            ID: row.ID,
            Name: this.get(row.Name, row.Nome),
            ImageType: this.get(row.ImageType, row.TipoImagem),
            Income: this.get(row.Income, row.Renda),
            Currency: this.relation(row.Currency, { code: row.Moeda_code }),
            Email: row.Email,
            Phone: this.get(row.Phone, row.Telefone),
            ExpenseTarget: this.get(row.ExpenseTarget, row.ObjetivoDeGasto),
            ...this.audit(row)
        };

        this.attachImage(result, binaryFiles);

        return result;

    }


    private buildShares(row: any): Share {

        return {
            ID: row.ID,
            User: row.User,
            Person: this.relation(row.Person, { ID: row?.Pessoa_ID }),
            ...this.audit(row)
        };

    }


    private buildEntities(row: any): Entity {

        return {
            ID: row.ID,
            Entity: row.Entity,
            Permission: row.Permission,
            Share: this.relation(row.Share),
            ...this.audit(row)
        };

    }


    private buildCategories(row: any, binaryFiles: Record<string, any>): Category {

        const result: Category = {
            ID: row.ID,
            Name: this.get(row.Name, row.Nome),
            ImageType: this.get(row.ImageType, row.TipoImagem),
            Person: this.relation(row.Person, { ID: row.Pessoa_ID }),
            ...this.audit(row)
        };

        this.attachImage(result, binaryFiles);

        return result;

    }


    private buildCards(row: any, binaryFiles: Record<string, any>): Card {

        const result: Card = {
            ID: row.ID,
            Name: this.get(row.Name, row.NomeCartao),
            ImageType: this.get(row.ImageType, row.TipoImagem),
            Limit: this.get(row.Limit, row.Limite),
            Currency: this.relation(row.Currency, { code: row.Moeda_code }),
            DueDay: this.get(row.DueDay, row.DiaVencimento),
            ClosingDay: this.get(row.ClosingDay, row.DiaFechamento),
            Person: this.relation(row.Person, { ID: row.Pessoa_ID }),
            ...this.audit(row)
        };

        this.attachImage(result, binaryFiles);

        return result;

    }


    private buildInvoices(row: any): Invoice {

        return {
            ID: row.ID,
            Year: this.get(row.Year, row.Ano),
            Month: this.get(row.Month, row.Mes),
            TotalAmount: this.get(row.TotalAmount, row.ValorTotal),
            Description: this.get(row.Description, row.Descricao),
            Currency: this.relation(row.Currency, { code: row.Moeda_code }),
            InvoiceSent: this.get(row.InvoiceSent, row.AvisoEnviado),
            Card: this.relation(row.Card, { ID: row.Cartao_ID }),
            ...this.audit(row)
        };

    }


    private buildTransactions(row: any): Transaction {

        return {
            ID: row.ID,
            Identifier: this.get(row.Identifier, row.Identificador),
            Date: this.get(row.Date, row.Data),
            TotalAmount: this.get(row.TotalAmount, row.ValorTotal),
            Amount: this.get(row.Amount, row.Valor),
            Currency: this.relation(row.Currency, { code: row.Moeda_code }),
            TotalInstallments: this.get(row.TotalInstallments, row.ParcelasTotais),
            Installment: this.get(row.Installment, row.Parcela),
            Description: this.get(row.Description, row.Descricao),
            Invoice: this.relation(row.Invoice, { ID: row.Fatura_ID }),
            ...this.audit(row)
        };

    }


    private readonly rowMappers: Record<string, (row: any, binaryFiles: Record<string, any>) => any> = {

        Persons: (row, binaryFiles) => this.buildPersons(row, binaryFiles),

        Shares: (row) => this.buildShares(row),

        Entities: (row) => this.buildEntities(row),

        Categories: (row, binaryFiles) => this.buildCategories(row, binaryFiles),

        Cards: (row, binaryFiles) => this.buildCards(row, binaryFiles),

        Invoices: (row) => this.buildInvoices(row),

        Transactions: (row) => this.buildTransactions(row)

    };


    private mapRowToEntity(
        table: string,
        row: any,
        binaryFiles: Record<string, any>
    ) {

        const mapper = this.rowMappers[table];

        const result = mapper
            ? mapper(row, binaryFiles)
            : row;

        return this.cleanEntity(result);

    }


}