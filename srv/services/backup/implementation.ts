import cds, { User } from '@sap/cds';
import { AbstractError } from '@/errors';
import { Backup, Card, Category, Invoices, Person, Share, Transactions } from '@models/apps/dflc/gestordegastos/entities';
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
import { BaseService } from '../base';
import { ServiceLocator } from '@/infrastructure/ServiceLocator';
import { InvoiceRepository } from '@/repositories/invoice';
import { Entity } from '@models/_';

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

        try {

            if (Backup?.Backup) {

                const oBackupBuffer = await this.readableToBuffer(Backup?.Backup);

                if (oBackupBuffer) {
                    return this.importarBackup(oBackupBuffer as Buffer);
                }

            }

            return right(true);

        } catch (error) {

            const errorInstance: Error = error as Error;

            return left(new AbstractError(errorInstance.message, 403, errorInstance.stack as string));

        }

    }


    public async beforeUpdate(Backup: Backup, User: User): Promise<Either<AbstractError, boolean>> {

        return right(true);

    }


    public async beforeEdit(Backup: Backup, User: User): Promise<Either<AbstractError, boolean>> {

        return right(true);

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


    private async importarBackup(file: Buffer): Promise<Either<AbstractError, boolean>> {

        try {

            const zipBuffer = file;

            // Descompactar o ZIP
            const zip = new AdmZip(zipBuffer);
            const zipEntries = zip.getEntries();

            // Localizar o arquivo Excel e os arquivos binários
            let excelFile: any;
            const binaryFiles = {};

            zipEntries.forEach((entry) => {
                if (entry.entryName.endsWith('.xlsx')) {
                    excelFile = entry.getData(); // Ler o conteúdo do arquivo Excel
                } else {
                    binaryFiles[entry.entryName] = entry.getData(); // Salvar os arquivos binários no dicionário
                }
            });

            if (!excelFile) {

                const oStack = new Error().stack as string;

                const message = this.getMessage('error.excelNotFound', ServiceLocator.getRequest(), this.entityCode())

                return left(new AbstractError(message, 403, oStack));

            }

            // Ler o arquivo Excel
            const workbook = new excel.Workbook();
            await workbook.xlsx.load(excelFile);

            let oInvoiceIDs: string[] = [];
            let oTotalTransactions: number = 0;
            let oTransactionsEntered: number = 0;

            const tables = ['Persons', 'Shares', 'Entities', 'Categories', 'Cards', 'Invoices', 'Transactions'];

            for (const table of tables) {

                const sheet = workbook.getWorksheet(table);

                if (!sheet) continue;

                const rows = [] as any[];
                let rowHeader = {};
                sheet.eachRow((row, rowNumber) => {

                    if (rowNumber === 1) {
                        rowHeader = row; // Cabeçalhos
                        return;
                    }

                    const rowData = {};
                    sheet.columns.forEach((col, i) => {
                        rowData[(rowHeader as any)?.getCell(i + 1).value] = row.getCell(i + 1).value;
                    });
                    rows.push(rowData as never);

                });

                const service = ServiceRegistry.get(table) as BaseServiceImplementation<any>;

                if (!service) continue;

                // Processar cada linha da tabela
                for (const row of rows) {

                    // Verificar se o regi stro já existe no banco
                    const exists = await service?.Repository?.findById(row.ID);

                    if (table === 'Transactions') {
                        oTotalTransactions++;
                    }

                    if (exists) continue;

                    if (row?.ImageType) {

                        const oExtensao = row.ImageType.split("/")[1];

                        const binaryFileName = `${row.ID}.${oExtensao}`; // Nome do arquivo armazenado no Excel

                        if (binaryFiles[binaryFileName]) {
                            row.Image = binaryFiles[binaryFileName]; // Substituir pelo conteúdo binário
                        } else {
                            row.Image = null; // Caso o binário não exista no ZIP
                        }

                    }

                    let rowInsert;

                    if (table === 'Persons') {

                        rowInsert = {

                            ID: row?.ID,
                            Name: row?.Name || row?.Nome,
                            ImageType: row?.ImageType || row?.TipoImagem,
                            Income: row?.Income || row?.Renda,
                            Currency: row?.Currency || row?.Moeda,
                            Currency_code: row?.Currency_code || row?.Moeda_code,
                            Email: row?.Email,
                            Phone: row?.Phone || row?.Telefone,
                            ExpenseTarget: row?.ExpenseTarget || row?.ObjetivoDeGasto,
                            createdAt: row?.createdAt,
                            createdBy: row?.createdBy,
                            modifiedAt: row?.modifiedAt,
                            modifiedBy: row?.modifiedBy

                        } as Person

                    } else if (table === 'Shares') {

                        rowInsert = row as Share;

                    } else if (table === 'Entities') {

                        rowInsert = row as Entity

                    } else if (table === 'Categories') {

                        rowInsert = {

                            ID: row?.ID,
                            Name: row?.Name || row?.Nome,
                            ImageType: row?.ImageType || row?.TipoImagem,
                            createdAt: row?.createdAt,
                            createdBy: row?.createdBy,
                            modifiedAt: row?.modifiedAt,
                            modifiedBy: row?.modifiedBy

                        } as Category

                    } else if (table === 'Cards') {

                        rowInsert = {

                            ID: row?.ID,
                            Name: row?.Name || row?.Nome,
                            ImageType: row?.ImageType || row?.TipoImagem,
                            Limit: row?.Limit || row?.Limite,
                            Currency: row?.Currency || row?.Moeda,
                            Currency_code: row?.Currency_code || row?.Moeda_code,
                            DueDay: row?.DueDay || row?.DiaVencimento,
                            ClosingDay: row?.ClosingDay || row?.DiaFechamento,
                            Person_ID: row?.Person_ID || row?.Pessoa_ID,
                            createdAt: row?.createdAt,
                            createdBy: row?.createdBy,
                            modifiedAt: row?.modifiedAt,
                            modifiedBy: row?.modifiedBy

                        } as Card

                    } else if (table === 'Invoices') {

                        rowInsert = {

                            ID: row?.ID,
                            Year: row?.Year || row?.Ano,
                            Month: row?.Month || row?.Mes,
                            TotalAmount: row?.TotalAmount || row?.ValorTotal,
                            Description: row?.Description || row?.Descricao,
                            Currency: row?.Currency || row?.Moeda,
                            Currency_code: row?.Currency_code || row?.Moeda_code,
                            InvoiceSent: row?.InvoiceSent || row?.AvisoEnviado,
                            Card_ID: row?.Card_ID || row?.Cartao_ID,
                            createdAt: row?.createdAt,
                            createdBy: row?.createdBy,
                            modifiedAt: row?.modifiedAt,
                            modifiedBy: row?.modifiedBy

                        } as Card

                    } else if (table === 'Transactions') {

                        rowInsert = {

                            ID: row?.ID,
                            Identifier: row?.Identifier || row?.Identificador,
                            Date: row?.Date || row?.Data,
                            TotalAmount: row?.TotalAmount || row?.ValorTotal,
                            Amount: row?.Amount || row?.Valor,
                            Currency: row?.Currency || row?.Moeda,
                            Currency_code: row?.Currency_code || row?.Moeda_code,
                            TotalInstallments: row?.TotalInstallments || row?.ParcelasTotais,
                            Installment: row?.Installment || row?.Parcela,
                            Description: row?.Description || row?.Descricao,
                            createdAt: row?.createdAt,
                            createdBy: row?.createdBy,
                            modifiedAt: row?.modifiedAt,
                            modifiedBy: row?.modifiedBy

                        } as Card

                    }

                    // Inserir no banco se não existir
                    await service.Repository.createEntry(rowInsert);

                    if (table === 'Transactions') {
                        oTransactionsEntered++;
                        oInvoiceIDs.push(row.Invoice_ID);
                    }

                }

            }

            // Atualizar valores das faturas, se necessário
            if (oTotalTransactions > oTransactionsEntered) {

                let oInvoiceIDsToUpdateValue = [...new Set(oInvoiceIDs)];

                for (const oInvoiceId of oInvoiceIDsToUpdateValue) {
                    await this.InvoiceRepository.updateTotalAmountById(oInvoiceId);
                }

            }

            return right(true);


        } catch (error) {

            const errorInstance: Error = error as Error;

            return left(new AbstractError(errorInstance?.message, 403, errorInstance?.stack as string));

        }

    }


}