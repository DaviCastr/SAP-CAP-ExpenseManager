"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BackupServiceImplementation = void 0;
const errors_1 = require("@/errors");
const either_1 = require("@sweet-monads/either");
const implementation_1 = require("../base/implementation");
const adm_zip_1 = __importDefault(require("adm-zip"));
const exceljs_1 = __importDefault(require("exceljs"));
const ServiceRegistry_1 = require("@/infrastructure/ServiceRegistry");
const ServiceLocator_1 = require("@/infrastructure/ServiceLocator");
class BackupServiceImplementation extends implementation_1.BaseServiceImplementation {
    Repository;
    constructor(PersonRepository, ShareRepository, EntityRepository, Repository) {
        super(PersonRepository, ShareRepository, EntityRepository);
        this.Repository = Repository;
    }
    async beforeCreate(Backup, User) {
        return this.processImport(Backup);
    }
    async beforeUpdate(Backup, User) {
        return this.processImport(Backup);
    }
    async beforeEdit(Backup, User) {
        return this.processImport(Backup);
    }
    async processBackupDelete(Backup) {
        try {
            const result = await this.Repository.deleteEntry(Backup?.ID);
            return (0, either_1.right)(result);
        }
        catch (error) {
            const errorInstance = error;
            return (0, either_1.left)(new errors_1.AbstractError(errorInstance.message, 403, errorInstance.stack));
        }
    }
    async exportBackup() {
        const zip = new adm_zip_1.default();
        const user = ServiceLocator_1.ServiceLocator.getRequest()?.user;
        try {
            const personService = ServiceRegistry_1.ServiceRegistry.get('Persons');
            const persons = await personService?.Repository?.findByUser(user?.id) || [];
            if (!persons.length) {
                return (0, either_1.left)(new errors_1.AbstractError('error.dataToGenerateBackupNotFound', 403, new Error().stack));
            }
            const personIds = persons.map(p => p.Id);
            const shareRepo = ServiceRegistry_1.ServiceRegistry.get('Shares').Repository;
            const categoryRepo = ServiceRegistry_1.ServiceRegistry.get('Categories').Repository;
            const cardRepo = ServiceRegistry_1.ServiceRegistry.get('Cards').Repository;
            const entityRepo = ServiceRegistry_1.ServiceRegistry.get('Entities').Repository;
            const invoiceRepo = ServiceRegistry_1.ServiceRegistry.get('Invoices').Repository;
            const transactionRepo = ServiceRegistry_1.ServiceRegistry.get('Transactions').Repository;
            const [shares, categories, cards] = await Promise.all([
                shareRepo.findByPersonIds(personIds),
                categoryRepo.findByPersonIds(personIds),
                cardRepo.findByPersonIds(personIds)
            ]);
            const shareIds = shares?.map(s => s.Id);
            const cardIds = cards?.map(c => c.Id);
            const [entities, invoices] = await Promise.all([
                entityRepo.findByShareIds(shareIds || []),
                invoiceRepo.findByCardIDs(cardIds || [])
            ]);
            const invoiceIds = invoices?.map(i => i.Id);
            const transactions = await transactionRepo.findByInvoiceIds(invoiceIds);
            const [personImages, categoryImages, cardImages] = await Promise.all([
                this.PersonRepository.findImageByIds(personIds),
                categoryRepo.findImageByIds(categories?.map(c => c.Id) || []),
                cardRepo.findImageByIds(cards?.map(c => c.Id) || [])
            ]);
            const groupBy = (arr, key) => arr.reduce((acc, item) => {
                const k = item[key];
                if (!acc[k])
                    acc[k] = [];
                acc[k].push(item);
                return acc;
            }, {});
            const sharesByPerson = groupBy(shares || [], 'PersonId');
            const categoriesByPerson = groupBy(categories || [], 'PersonId');
            const cardsByPerson = groupBy(cards || [], 'PersonId');
            const entitiesByShare = groupBy(entities || [], 'ShareId');
            const invoicesByCard = groupBy(invoices || [], 'CardId');
            const transactionsByInvoice = groupBy(transactions || [], 'InvoiceId');
            const mapById = (arr) => arr?.reduce((acc, item) => {
                acc[item.ID] = item;
                return acc;
            }, {});
            const personImageMap = mapById(personImages);
            const categoryImageMap = mapById(categoryImages);
            const cardImageMap = mapById(cardImages);
            await Promise.all(persons.map(async (person) => {
                const personZip = new adm_zip_1.default();
                const workbook = new exceljs_1.default.Workbook();
                const personSheet = workbook.addWorksheet('Persons');
                const personData = person.toEntityObject();
                personSheet.columns = Object.keys(personData).map(key => ({ header: key, key }));
                personSheet.addRow(personData);
                const pImg = personImageMap[person.Id];
                if (pImg?.Image) {
                    const buffer = await this.readableToBuffer(pImg.Image);
                    const ext = person.ImageType?.split("/")[1];
                    personZip.addFile(`${person.Id}.${ext}`, buffer);
                }
                const personShares = sharesByPerson[person.Id] || [];
                if (personShares.length) {
                    const shareSheet = workbook.addWorksheet('Shares');
                    shareSheet.columns = Object.keys(personShares[0].toEntityObject()).map(k => ({ header: k, key: k }));
                    shareSheet.addRows(personShares.map(s => s.toEntityObject()));
                    const allEntities = personShares.flatMap(s => entitiesByShare[s.Id] || []);
                    if (allEntities.length) {
                        const entitySheet = workbook.addWorksheet('Entities');
                        entitySheet.columns = Object.keys(allEntities[0].toEntityObject()).map(k => ({ header: k, key: k }));
                        entitySheet.addRows(allEntities.map(e => e.toEntityObject()));
                    }
                }
                const personCategories = categoriesByPerson[person.Id] || [];
                if (personCategories.length) {
                    const categorySheet = workbook.addWorksheet('Categories');
                    categorySheet.columns = Object.keys(personCategories[0].toEntityObject()).map(k => ({ header: k, key: k }));
                    categorySheet.addRows(personCategories.map(c => c.toEntityObject()));
                    await Promise.all(personCategories.map(async (category) => {
                        const img = categoryImageMap[category.Id];
                        if (img?.Image) {
                            const buffer = await this.readableToBuffer(img.Image);
                            const ext = category.ImageType?.split("/")[1];
                            personZip.addFile(`${category.Id}.${ext}`, buffer);
                        }
                    }));
                }
                const personCards = cardsByPerson[person.Id] || [];
                if (personCards.length) {
                    const cardSheet = workbook.addWorksheet('Cards');
                    cardSheet.columns = Object.keys(personCards[0].toEntityObject()).map(k => ({ header: k, key: k }));
                    cardSheet.addRows(personCards.map(c => c.toEntityObject()));
                    const allInvoices = personCards.flatMap(c => invoicesByCard[c.Id] || []);
                    if (allInvoices.length) {
                        const invoiceSheet = workbook.addWorksheet('Invoices');
                        invoiceSheet.columns = Object.keys(allInvoices[0].toEntityObject()).map(k => ({ header: k, key: k }));
                        invoiceSheet.addRows(allInvoices.map(i => i.toEntityObject()));
                        const allTransactions = allInvoices.flatMap(i => transactionsByInvoice[i.Id] || []);
                        if (allTransactions.length) {
                            const transactionSheet = workbook.addWorksheet('Transactions');
                            transactionSheet.columns = Object.keys(allTransactions[0].toEntityObject()).map(k => ({ header: k, key: k }));
                            transactionSheet.addRows(allTransactions.map(t => t.toEntityObject()));
                        }
                    }
                    await Promise.all(personCards.map(async (card) => {
                        const img = cardImageMap[card.Id];
                        if (img?.Image) {
                            const buffer = await this.readableToBuffer(img.Image);
                            const ext = card.ImageType?.split("/")[1];
                            personZip.addFile(`${card.Id}.${ext}`, buffer);
                        }
                    }));
                }
                const excelBuffer = await workbook.xlsx.writeBuffer();
                personZip.addFile(`Dados_${person.Id}.xlsx`, excelBuffer);
                zip.addFile(`${person.Name}_backup.zip`, personZip.toBuffer());
            }));
            const zipBuffer = zip.toBuffer();
            const id = this.generateUUID();
            await this.Repository.createEntry({
                ID: id,
                Backup: zipBuffer,
                BackupType: "application/x-zip-compressed"
            });
            return (0, either_1.right)(id);
        }
        catch (error) {
            const err = error;
            return (0, either_1.left)(new errors_1.AbstractError(err.message, 403, err.stack));
        }
    }
    personPath() {
        return [];
    }
    entityCode() {
        return 8;
    }
    parentField() {
        return '';
    }
    async processImport(Backup) {
        try {
            if (Backup?.Backup) {
                const oBackupBuffer = await this.readableToBuffer(Backup?.Backup);
                if (oBackupBuffer) {
                    return this.importBackup(oBackupBuffer);
                }
            }
            return (0, either_1.right)(true);
        }
        catch (error) {
            const errorInstance = error;
            return (0, either_1.left)(new errors_1.AbstractError(errorInstance.message, 403, errorInstance.stack));
        }
    }
    async importBackup(file) {
        try {
            const result = await this.loadZip(file);
            if (result.isLeft())
                return result;
            const { workbook, binaryFiles } = result.value;
            const tables = ['Persons', 'Shares', 'Entities', 'Categories', 'Cards', 'Invoices', 'Transactions'];
            const promises = [];
            for (const table of tables) {
                promises.push(this.processTable(table, workbook, binaryFiles));
            }
            await Promise.all(promises);
            return (0, either_1.right)(true);
        }
        catch (error) {
            const err = error;
            return (0, either_1.left)(new errors_1.AbstractError(err.message, 403, err.stack));
        }
    }
    async loadZip(file) {
        const zip = new adm_zip_1.default(file);
        const entries = zip.getEntries();
        let excelFile;
        const binaryFiles = {};
        for (const entry of entries) {
            if (entry.entryName.endsWith('.xlsx')) {
                excelFile = entry.getData();
            }
            else {
                binaryFiles[entry.entryName] = entry.getData();
            }
        }
        if (!excelFile) {
            const oStack = new Error().stack;
            const message = this.getMessage('error.excelNotFound', ServiceLocator_1.ServiceLocator.getRequest(), this.entityCode());
            return (0, either_1.left)(new errors_1.AbstractError(message, 403, oStack));
        }
        const workbook = new exceljs_1.default.Workbook();
        await workbook.xlsx.load(excelFile);
        return (0, either_1.right)({ workbook, binaryFiles });
    }
    async processTable(table, workbook, binaryFiles) {
        const sheet = this.getWorksheet(workbook, table);
        if (!sheet)
            return;
        const rows = this.extractRows(sheet);
        if (!rows.length)
            return;
        const service = ServiceRegistry_1.ServiceRegistry.get(table);
        if (!service)
            return;
        const ids = rows?.map(r => r.ID).filter(Boolean);
        const existing = await service.Repository.findByIds(ids);
        const existingIds = new Set(existing?.map((r) => r.Id));
        const inserts = [];
        for (const row of rows) {
            if (existingIds.has(row.ID))
                continue;
            const entity = this.mapRowToEntity(table, row, binaryFiles);
            inserts.push(this.cleanEntity(entity));
        }
        await this.batchInsert(service, inserts);
    }
    extractRows(sheet) {
        const rows = [];
        let header;
        sheet.eachRow((row, rowNumber) => {
            if (rowNumber === 1) {
                header = row;
                return;
            }
            const obj = {};
            sheet.columns.forEach((col, i) => {
                const key = header.getCell(i + 1).value;
                obj[key] = row.getCell(i + 1).value;
            });
            rows.push(obj);
        });
        return rows;
    }
    getWorksheet(workbook, table) {
        const map = {
            Persons: 'Pessoa',
            Categories: 'Categoria',
            Cards: 'Cartao',
            Invoices: 'Fatura',
            Transactions: 'Transacao'
        };
        const sheet = workbook.getWorksheet(table) || workbook.getWorksheet(map[table]);
        if (sheet?.name != table && sheet?.name != map[table])
            return null;
        return sheet;
    }
    async batchInsert(service, inserts) {
        if (!inserts.length)
            return;
        const chunkSize = 1;
        for (let i = 0; i < inserts.length; i += chunkSize) {
            const chunk = inserts.slice(i, i + chunkSize);
            await service.Repository.createEntry(chunk);
        }
    }
    get(...values) {
        for (const value of values) {
            if (Array.isArray(value)) {
                if (value.length > 0)
                    return value;
                continue;
            }
            if (value !== undefined && value !== null && value !== '') {
                return value;
            }
        }
        return undefined;
    }
    parseJson(value, fallback = null) {
        if (!value)
            return fallback;
        if (typeof value === 'object') {
            return value;
        }
        try {
            return JSON.parse(value);
        }
        catch {
            return fallback;
        }
    }
    audit(row) {
        return {
            createdAt: row.createdAt,
            createdBy: row.createdBy,
            modifiedAt: row.modifiedAt,
            modifiedBy: row.modifiedBy
        };
    }
    attachImage(entity, binaryFiles) {
        if (!entity?.ID || !entity?.ImageType)
            return;
        const extension = entity.ImageType.split('/')?.[1];
        if (!extension)
            return;
        const file = binaryFiles[`${entity.ID}.${extension}`];
        if (!file)
            return;
        const buffer = Buffer.isBuffer(file)
            ? file
            : Buffer.from(file);
        entity.Image = buffer.toString('base64');
    }
    relation(value, fallback = null) {
        return this.get(this.parseJson(value, null), fallback);
    }
    buildPersons(row, binaryFiles) {
        const result = {
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
    buildShares(row) {
        return {
            ID: row.ID,
            User: row.User,
            Person: this.relation(row.Person, { ID: row?.Pessoa_ID }),
            ...this.audit(row)
        };
    }
    buildEntities(row) {
        return {
            ID: row.ID,
            Entity: row.Entity,
            Permission: row.Permission,
            Share: this.relation(row.Share),
            ...this.audit(row)
        };
    }
    buildCategories(row, binaryFiles) {
        const result = {
            ID: row.ID,
            Name: this.get(row.Name, row.Nome),
            ImageType: this.get(row.ImageType, row.TipoImagem),
            Person: this.relation(row.Person, { ID: row.Pessoa_ID }),
            ...this.audit(row)
        };
        this.attachImage(result, binaryFiles);
        return result;
    }
    buildCards(row, binaryFiles) {
        const result = {
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
    buildInvoices(row) {
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
    buildTransactions(row) {
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
            Category: this.relation(row.Category, { ID: row.Categoria_ID }),
            ...this.audit(row)
        };
    }
    rowMappers = {
        Persons: (row, binaryFiles) => this.buildPersons(row, binaryFiles),
        Shares: (row) => this.buildShares(row),
        Entities: (row) => this.buildEntities(row),
        Categories: (row, binaryFiles) => this.buildCategories(row, binaryFiles),
        Cards: (row, binaryFiles) => this.buildCards(row, binaryFiles),
        Invoices: (row) => this.buildInvoices(row),
        Transactions: (row) => this.buildTransactions(row)
    };
    mapRowToEntity(table, row, binaryFiles) {
        const mapper = this.rowMappers[table];
        const result = mapper
            ? mapper(row, binaryFiles)
            : row;
        return this.cleanEntity(result);
    }
}
exports.BackupServiceImplementation = BackupServiceImplementation;
//# sourceMappingURL=implementation.js.map