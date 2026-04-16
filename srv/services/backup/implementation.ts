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


    // public async exportBackup(User: User): Promise<Either<AbstractError, string>> {

    // const zip = new AdmZip();

    // try {

    //     // Buscar todas as persons
    //     const personService = ServiceRegistry.get('Persons') as PersonServiceImplementation;

    //     const persons = await personService?.Repository?.findByUser(User?.id) || [] as PersonModel[];

    //     if (!persons?.length) {

    //         const errorInstance: Error = new Error;
    //         return left(new AbstractError('error.dataToGenerateBackupNotFound', 403, errorInstance.stack as string));

    //     }

    //     for (const person of persons) {
    //         const personZip = new AdmZip(); // Cria um ZIP específico para a person
    //         const workbook = new excel.Workbook();

    //         // 1. Adicionar dados da person ao Excel
    //         const personSheet = workbook.addWorksheet('Persons');
    //         personSheet.columns = Object.keys(person?.toEntityObject()).map((key) => ({ header: key, key })) as any;
    //         personSheet.addRow(person.toEntityObject());

    //         if (person?.ImageType) {

    //             const oPersonImage = await this.PersonRepository.findImageByIds([person?.Id]);

    //             const oImage = oPersonImage?.[0];

    //             person.Image = oImage?.Image as Readable;

    //             // 2. Exportar imagem da person (se existir)
    //             if (person.Image) {
    //                 const personImageBuffer = await this.readableToBuffer(person.Image) as Buffer;
    //                 const personImageExtension = person.ImageType?.split("/")?.[1];
    //                 personZip.addFile(`${person.Id}.${personImageExtension}`, personImageBuffer);
    //             }

    //         }

    //         const shareService = ServiceRegistry.get('Shares') as ShareServiceImplementation;
    //         const shares = await shareService?.Repository?.findByPersonIds([person?.Id]) as ShareModel[];

    //         if (shares?.length > 0) {

    //             const shareSheet = workbook.addWorksheet('Shares');
    //             shareSheet.columns = Object.keys(shares[0]?.toEntityObject()).map((key) => ({ header: key, key })) as any;
    //             shareSheet.addRows(shares.map((item) => item.toEntityObject()));

    //             for (const share of shares) {

    //                 const entityService = ServiceRegistry.get('Entities') as EntityServiceImplementation;
    //                 const entities = await entityService?.Repository?.findByShareIds([share?.Id]) as EntityModel[];

    //                 if (entities?.length > 0) {

    //                     const entitySheet = workbook.addWorksheet('Entities');
    //                     entitySheet.columns = Object.keys(entities[0]?.toEntityObject()).map((key) => ({ header: key, key })) as any;
    //                     entitySheet.addRows(entities.map((item) => item.toEntityObject()));

    //                 }

    //             }

    //         }

    //         const categoryService = ServiceRegistry.get('Categories') as CategoryServiceImplementation;
    //         const categories = await categoryService?.Repository?.findByPersonIds([person?.Id]) as CategoryModel[];

    //         if (categories?.length > 0) {

    //             const categorySheet = workbook.addWorksheet('Categories');
    //             categorySheet.columns = Object.keys(categories[0]?.toEntityObject()).map((key) => ({ header: key, key })) as any;
    //             categorySheet.addRows(categories.map((item) => item.toEntityObject()));

    //             for (const category of categories) {

    //                 if (category?.ImageType) {

    //                     const oCategoryImage = await categoryService.Repository.findImageByIds([category?.Id]);

    //                     const oImage = oCategoryImage?.[0];

    //                     category.Image = oImage?.Image as Readable;

    //                     if (category.Image) {
    //                         const categoryImageBuffer = await this.readableToBuffer(category.Image) as any;
    //                         const categoryImageExtension = category?.ImageType?.split("/")?.[1];
    //                         personZip.addFile(`${category.Id}.${categoryImageExtension}`, categoryImageBuffer);
    //                     }

    //                 }

    //             }

    //         }


    //         const cardService = ServiceRegistry.get('Cards') as CardServiceImplementation;
    //         const cards = await cardService?.Repository?.findByPersonIds([person?.Id]) as CardModel[];

    //         if (cards?.length > 0) {

    //             const cardSheet = workbook.addWorksheet('Cards');
    //             cardSheet.columns = Object.keys(cards[0].toEntityObject()).map((key) => ({ header: key, key })) as any;
    //             cardSheet.addRows(cards?.map((item) => item.toEntityObject()));

    //             const invoiceSheet = workbook.addWorksheet('Invoices');
    //             const transactionSheet = workbook.addWorksheet('Transactions');

    //             let oFirstInvoice = true;
    //             let oFirstTransaction = true;

    //             for (const card of cards) {

    //                 if (card?.ImageType) {

    //                     const oCardImage = await cardService.Repository.findImageByIds([card?.Id]);

    //                     const oImage = oCardImage?.[0];

    //                     card.Image = oImage?.Image as Readable;

    //                     if (card.Image) {

    //                         const cardImageBuffer = await this.readableToBuffer(card.Image) as any;
    //                         const cardImageExtension = card.ImageType?.split("/")?.[1];
    //                         personZip.addFile(`${card.Id}.${cardImageExtension}`, cardImageBuffer);

    //                     }

    //                 }

    //                 // 4. Buscar invoices relacionadas ao card
    //                 const invoiceService = ServiceRegistry.get('Invoices') as InvoiceServiceImplementation;
    //                 const invoices = await invoiceService?.Repository?.findByCardIDs([card?.Id]) as InvoiceModel[];

    //                 if (invoices?.length > 0) {

    //                     if (oFirstInvoice) {
    //                         invoiceSheet.columns = Object.keys(invoices[0].toEntityObject()).map((key) => ({ header: key, key })) as any;
    //                         oFirstInvoice = false;
    //                     }
    //                     invoiceSheet.addRows(invoices?.map((item) => item.toEntityObject()));

    //                     for (const invoice of invoices) {

    //                         // 5. Buscar transactions relacionadas à invoice
    //                         const transactionService = ServiceRegistry.get('Transactions') as TransactionServiceImplementation;
    //                         const transactions = await transactionService?.Repository?.findByInvoiceIds([invoice?.Id]) as TransactionModel[];

    //                         if (transactions?.length > 0) {
    //                             if (oFirstTransaction) {
    //                                 transactionSheet.columns = Object.keys(transactions[0].toEntityObject()).map((key) => ({ header: key, key })) as any;
    //                                 oFirstTransaction = false;
    //                             }
    //                             transactionSheet.addRows(transactions?.map((item) => item.toEntityObject()));
    //                         }

    //                     }

    //                 }

    //             }

    //         }

    //         // 6. Salvar o Excel em memória e adicionar ao ZIP da person
    //         const excelBuffer = await workbook.xlsx.writeBuffer() as any;
    //         personZip.addFile(`Dados_${person.Id}.xlsx`, excelBuffer);

    //         // 7. Adicionar o ZIP da person ao ZIP principal
    //         zip.addFile(`${person.Name}_backup.zip`, personZip.toBuffer());
    //     }

    // } catch (error) {

    //     const errorInstance: Error = error as Error;
    //     return left(new AbstractError(errorInstance.message, 403, errorInstance.stack as string));

    // }

    // // Gerar o ZIP final com todos os arquivos de persons
    // const zipBuffer = zip.toBuffer();

    // if (zipBuffer) {

    //     let oId = this.generateUUID();

    //     let newBackup: Backup = {
    //         ID: oId,
    //         Backup: zipBuffer as any,
    //         BackupType: "application/x-zip-compressed"
    //     }

    //     await this.Repository.createEntry(newBackup);

    //     return right(oId);

    // } else {

    //     const errorInstance: Error = new Error;
    //     return left(new AbstractError('error.generateZipFile', 403, errorInstance.stack as string));

    // }

    // }


    public async exportBackup(User: User): Promise<Either<AbstractError, string>> {

        const zip = new AdmZip();

        try {

            const personService = ServiceRegistry.get('Persons') as PersonServiceImplementation;

            const persons = await personService?.Repository?.findByUser(User?.id) || [] as PersonModel[];

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


    private mapRowToEntity(table: string, row: any, binaryFiles: any[]) {

        const get = (a: any, b?: any) => {

            if (Array.isArray(a)) {
                return a.length == 0 ? b : a;
            }

            return a ?? b;

        };

        switch (table) {

            case 'Persons':

                const resultPerson: Person = {
                    ID: row.ID,
                    Name: get(row.Name, row.Nome),
                    ImageType: get(row.ImageType, row.TipoImagem),
                    Income: get(row.Income, row.Renda),
                    Currency: get(JSON.parse(row.Currency || '[]'), { code: row.Moeda_code }),
                    Email: row.Email,
                    Phone: get(row.Phone, row.Telefone),
                    ExpenseTarget: get(row.ExpenseTarget, row.ObjetivoDeGasto),
                    createdAt: row.createdAt,
                    createdBy: row.createdBy,
                    modifiedAt: row.modifiedAt,
                    modifiedBy: row.modifiedBy
                };

                if (resultPerson?.ImageType) {

                    const file = binaryFiles[`${resultPerson?.ID}.${resultPerson.ImageType?.split("/")?.[1]}`];

                    if (file) {
                        resultPerson.Image = Buffer.isBuffer(file)
                            ? file.toString('base64')
                            : Buffer.from(file).toString('base64') as any;
                    }

                }

                return this.cleanEntity(resultPerson);

            case 'Shares':

                const resultShare: Share = {
                    ID: row.ID,
                    User: row.User,
                    Person: JSON.parse(row.Person || '[]'),
                    createdAt: row.createdAt,
                    createdBy: row.createdBy,
                    modifiedAt: row.modifiedAt,
                    modifiedBy: row.modifiedBy
                };

                return this.cleanEntity(resultShare);

            case 'Entities':

                const resultEntity: Entity = {
                    ID: row.ID,
                    Entity: row.Entity,
                    Permission: row.Permission,
                    Share: JSON.parse(row.Share || '[]'),
                    createdAt: row.createdAt,
                    createdBy: row.createdBy,
                    modifiedAt: row.modifiedAt,
                    modifiedBy: row.modifiedBy
                };

                return this.cleanEntity(resultEntity);

            case 'Categories':

                const resultCategory: Category = {
                    ID: row.ID,
                    Name: get(row.Name, row.Nome),
                    ImageType: get(row.ImageType, row.TipoImagem),
                    Person: get(JSON.parse(row.Person || '[]'), { ID: row.Pessoa_ID }),
                    createdAt: row.createdAt,
                    createdBy: row.createdBy,
                    modifiedAt: row.modifiedAt,
                    modifiedBy: row.modifiedBy
                };

                if (resultCategory?.ImageType) {

                    const file = binaryFiles[`${resultCategory?.ID}.${resultCategory.ImageType?.split("/")?.[1]}`];

                    if (file) {
                        resultCategory.Image = Buffer.isBuffer(file)
                            ? file.toString('base64')
                            : Buffer.from(file).toString('base64') as any;
                    }

                }

                return this.cleanEntity(resultCategory);

            case 'Cards':

                const resultCard: Card = {
                    ID: row.ID,
                    Name: get(row.Name, row.NomeCartao),
                    ImageType: get(row.ImageType, row.TipoImagem),
                    Limit: get(row.Limit, row.Limite),
                    Currency: get(JSON.parse(row.Currency || '[]'), { code: row.Moeda_code }),
                    DueDay: get(row.DueDay, row.DiaVencimento),
                    ClosingDay: get(row.ClosingDay, row.DiaFechamento),
                    Person: get(JSON.parse(row.Person || '[]'), { ID: row.Pessoa_ID }),
                    createdAt: row.createdAt,
                    createdBy: row.createdBy,
                    modifiedAt: row.modifiedAt,
                    modifiedBy: row.modifiedBy
                };

                if (resultCard?.ImageType) {

                    const file = binaryFiles[`${resultCard?.ID}.${resultCard.ImageType?.split("/")?.[1]}`];

                    if (file) {
                        resultCard.Image = Buffer.isBuffer(file)
                            ? file.toString('base64')
                            : Buffer.from(file).toString('base64') as any;
                    }

                }

                return this.cleanEntity(resultCard);

            case 'Invoices':

                const resultInvoice: Invoice = {
                    ID: row?.ID,
                    Year: row?.Year || row?.Ano,
                    Month: row?.Month || row?.Mes,
                    TotalAmount: row?.TotalAmount || row?.ValorTotal,
                    Description: row?.Description || row?.Descricao,
                    Currency: get(JSON.parse(row.Currency || '[]'), { code: row?.Moeda_code }),
                    InvoiceSent: row?.InvoiceSient || row?.AvisoEnviado,
                    Card: get(JSON.parse(row?.Card || '[]'), { ID: row?.Cartao_ID }),
                    createdAt: row?.createdAt,
                    createdBy: row?.createdBy,
                    modifiedAt: row?.modifiedAt,
                    modifiedBy: row?.modifiedBy
                };

                return this.cleanEntity(resultInvoice);

            case 'Transactions':

                const resultTransaction: Transaction = {
                    ID: row.ID,
                    Identifier: get(row.Identifier, row.Identificador),
                    Date: get(row.Date, row.Data),
                    TotalAmount: get(row.TotalAmount, row.ValorTotal),
                    Amount: get(row.Amount, row.Valor),
                    Currency: get(JSON.parse(row.Currency || '[]'), { code: row.Moeda_code }),
                    TotalInstallments: get(row.TotalInstallments, row.ParcelasTotais),
                    Installment: get(row.Installment, row.Parcela),
                    Description: get(row.Description, row.Descricao),
                    Invoice: get(JSON.parse(row.Invoice || '[]'), { ID: row.Fatura_ID }),
                    createdAt: row.createdAt,
                    createdBy: row.createdBy,
                    modifiedAt: row.modifiedAt,
                    modifiedBy: row.modifiedBy
                };

                return this.cleanEntity(resultTransaction);

            default:
                return this.cleanEntity(row);

        }

    }


}