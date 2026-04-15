import { User } from '@sap/cds';
import { AbstractError } from '@/errors';
import { Backup, Card, Category, Invoice, Person, Share, Transaction } from '@models/apps/dflc/gestordegastos/entities';
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

        const result = await this.Repository.deleteEntry(Backup?.ID);

        return right(result);

    }


    public async exportBackup(User: User): Promise<Either<AbstractError, boolean>> {

        const { Pessoa, Categoria, Cartao, Fatura, Transacao, Backup } = this.entities;

        const tx = cds.transaction();
        const zip = new AdmZip();

        try {

            const oCriador = await SELECT.one.columns("createdBy").from(Pessoa).where({ ID: ID });

            // Buscar todas as pessoas
            const pessoas = await tx.run(SELECT.from(Pessoa).columns('ID', 'Nome', 'Renda', 'Moeda_code', 'Email', 'Telefone', 'ObjetivoDeGasto', 'TipoImagem', 'PartilharCom').where({ createdBy: oCriador.createdBy }));

            for (const pessoa of pessoas) {
                const pessoaZip = new AdmZip(); // Cria um ZIP específico para a pessoa
                const workbook = new excel.Workbook();

                // 1. Adicionar dados da pessoa ao Excel
                const pessoaSheet = workbook.addWorksheet('Pessoa');
                pessoaSheet.columns = Object.keys(pessoa).map((key) => ({ header: key, key }));
                pessoaSheet.addRow(pessoa);

                const oImagemPessoa = await tx.run(
                    SELECT.one.from(Pessoa).columns('Imagem', 'TipoImagem').where({ ID: pessoa.ID })
                );

                // 2. Exportar imagem da pessoa (se existir)
                if (oImagemPessoa && oImagemPessoa.Imagem) {
                    const pessoaImagemBuffer = await this.ReadableParaBuffer(oImagemPessoa.Imagem);
                    const pessoaImagemExtensao = oImagemPessoa.TipoImagem.split("/")[1];
                    pessoaZip.addFile(`${pessoa.ID}.${pessoaImagemExtensao}`, pessoaImagemBuffer);
                }

                // 3. Buscar cartões da pessoa
                const cartegorias = await tx.run(
                    SELECT.from(Categoria).columns('ID', 'Nome', 'TipoImagem', 'Pessoa_ID').where({ Pessoa_ID: pessoa.ID })
                );

                if (cartegorias.length > 0) {

                    const categoriaSheet = workbook.addWorksheet('Categoria');
                    categoriaSheet.columns = Object.keys(cartegorias[0]).map((key) => ({ header: key, key }));
                    categoriaSheet.addRows(cartegorias);

                    for (const categoria of cartegorias) {

                        const oImagemCategoria = await tx.run(
                            SELECT.one.from(Categoria).columns('Imagem', 'TipoImagem').where({ ID: categoria.ID })
                        );

                        // Exportar imagem do cartão (se existir)
                        if (oImagemCategoria && oImagemCategoria.Imagem) {
                            const categoriaImagemBuffer = await this.ReadableParaBuffer(oImagemCategoria.Imagem);
                            const categoriaImagemExtensao = oImagemCategoria.TipoImagem.split("/")[1];
                            pessoaZip.addFile(`${categoria.ID}.${categoriaImagemExtensao}`, categoriaImagemBuffer);
                        }
                    }

                }


                // 3. Buscar cartões da pessoa
                const cartoes = await tx.run(
                    SELECT.from(Cartao).columns('ID', 'NomeCartao', 'Limite', 'Moeda_code', 'DiaFechamento', 'DiaVencimento', 'TipoImagem', 'Pessoa_ID').where({ Pessoa_ID: pessoa.ID })
                );

                if (cartoes.length > 0) {

                    const cartaoSheet = workbook.addWorksheet('Cartao');
                    cartaoSheet.columns = Object.keys(cartoes[0]).map((key) => ({ header: key, key }));
                    cartaoSheet.addRows(cartoes);

                    const faturaSheet = workbook.addWorksheet('Fatura');
                    const transacaoSheet = workbook.addWorksheet('Transacao');

                    let oPrimeiraFatura = true;
                    let oPrimeiraTransacao = true;

                    for (const cartao of cartoes) {

                        const oImagemCartao = await tx.run(
                            SELECT.one.from(Cartao).columns('Imagem', 'TipoImagem').where({ ID: cartao.ID })
                        );

                        // Exportar imagem do cartão (se existir)
                        if (oImagemCartao && oImagemCartao.Imagem) {
                            const cartaoImagemBuffer = await this.ReadableParaBuffer(oImagemCartao.Imagem);
                            const cartaoImagemExtensao = oImagemCartao.TipoImagem.split("/")[1];
                            pessoaZip.addFile(`${cartao.ID}.${cartaoImagemExtensao}`, cartaoImagemBuffer);
                        }

                        // 4. Buscar faturas relacionadas ao cartão
                        const faturas = await tx.run(
                            SELECT.from(Fatura).columns('ID', 'Ano', 'Mes', 'ValorTotal', 'Moeda_code', 'Cartao_ID').where({ Cartao_ID: cartao.ID })
                        );

                        if (faturas.length > 0) {

                            if (oPrimeiraFatura) {
                                faturaSheet.columns = Object.keys(faturas[0]).map((key) => ({ header: key, key }));
                                oPrimeiraFatura = false;
                            }
                            faturaSheet.addRows(faturas);

                            for (const fatura of faturas) {

                                // 5. Buscar transações relacionadas à fatura
                                const transacoes = await tx.run(
                                    SELECT.from(Transacao).columns('ID', 'Identificador', 'Data', 'ValorTotal', 'Valor', 'Moeda_code', 'Parcela', 'ParcelasTotais', 'Descricao', 'Fatura_ID', 'Categoria_ID').where({ Fatura_ID: fatura.ID })
                                );

                                if (transacoes.length > 0) {
                                    if (oPrimeiraTransacao) {
                                        transacaoSheet.columns = Object.keys(transacoes[0]).map((key) => ({ header: key, key }));
                                        oPrimeiraTransacao = false;
                                    }
                                    transacaoSheet.addRows(transacoes);
                                }
                            }
                        }
                    }
                }

                // 6. Salvar o Excel em memória e adicionar ao ZIP da pessoa
                const excelBuffer = await workbook.xlsx.writeBuffer();
                pessoaZip.addFile(`Dados_${pessoa.ID}.xlsx`, excelBuffer);

                // 7. Adicionar o ZIP da pessoa ao ZIP principal
                zip.addFile(`${pessoa.Nome}_backup.zip`, pessoaZip.toBuffer());
            }

        } catch (erro) {
            return {
                erro: 'Erro ao exportar Backup: ' + erro
            };
        }

        // Gerar o ZIP final com todos os arquivos de pessoas
        const zipBuffer = zip.toBuffer();

        if (zipBuffer) {

            let oId = this.gerarUUID();

            let novoBackup = {
                ID: oId,
                Backup: zipBuffer,
                TipoBackup: "application/x-zip-compressed"
            }

            const oBackupCreate = await INSERT.into(Backup).entries([novoBackup]);

            return {
                "backup": oId,
            };

        }

        return {
            "erro": "Erro ao exportar Backup"
        };

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

            await Promise.all(
                tables.map(table => this.processTable(table, workbook, binaryFiles))
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

        const ids = rows.map(r => r.ID).filter(Boolean);
        const existing = await service.Repository.findByIds(ids);
        const existingIds = new Set(existing?.map((r: any) => r.Id));
        const inserts: any[] = [];

        for (const row of rows) {

            if (existingIds.has(row.ID)) continue;

            const entity = this.mapRowToEntity(table, row, binaryFiles);
            inserts.push(entity);

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

        return workbook.getWorksheet(table) || workbook.getWorksheet(map[table]);

    }


    private async batchInsert(service: BaseServiceImplementation<any>, inserts: any[]) {

        if (!inserts.length) return;

        const chunkSize = 500;

        for (let i = 0; i < inserts.length; i += chunkSize) {

            const chunk = inserts.slice(i, i + chunkSize);

            await service.Repository.createEntry(chunk);

        }

    }


    private mapRowToEntity(table: string, row: any, binaryFiles: any) {

        const get = (a: any, b: any) => a ?? b;

        switch (table) {

            case 'Persons':

                return {
                    ID: row.ID,
                    Name: get(row.Name, row.Nome),
                    ImageType: get(row.ImageType, row.TipoImagem),
                    Income: get(row.Income, row.Renda),
                    Currency: get(row.Currency, row.Moeda),
                    Currency_code: get(row.Currency_code, row.Moeda_code),
                    Email: row.Email,
                    Phone: get(row.Phone, row.Telefone),
                    ExpenseTarget: get(row.ExpenseTarget, row.ObjetivoDeGasto),
                    createdAt: row.createdAt,
                    createdBy: row.createdBy,
                    modifiedAt: row.modifiedAt,
                    modifiedBy: row.modifiedBy
                } as Person;

            case 'Cards':

                return {
                    ID: row.ID,
                    Name: get(row.Name, row.Nome),
                    Limit: get(row.Limit, row.Limite),
                    Currency: get(row.Currency, row.Moeda),
                    Currency_code: get(row.Currency_code, row.Moeda_code),
                    DueDay: get(row.DueDay, row.DiaVencimento),
                    ClosingDay: get(row.ClosingDay, row.DiaFechamento),
                    Person_ID: get(row.Person_ID, row.Pessoa_ID),
                    createdAt: row.createdAt,
                    createdBy: row.createdBy,
                    modifiedAt: row.modifiedAt,
                    modifiedBy: row.modifiedBy
                } as Card;

            case 'Invoices':

                return {
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
                } as Invoice;

            case 'Transactions':

                return {
                    ID: row.ID,
                    Identifier: get(row.Identifier, row.Identificador),
                    Date: get(row.Date, row.Data),
                    TotalAmount: get(row.TotalAmount, row.ValorTotal),
                    Amount: get(row.Amount, row.Valor),
                    Currency: get(row.Currency, row.Moeda),
                    Currency_code: get(row.Currency_code, row.Moeda_code),
                    TotalInstallments: get(row.TotalInstallments, row.ParcelasTotais),
                    Installment: get(row.Installment, row.Parcela),
                    Description: get(row.Description, row.Descricao),
                    createdAt: row.createdAt,
                    createdBy: row.createdBy,
                    modifiedAt: row.modifiedAt,
                    modifiedBy: row.modifiedBy
                } as Transaction;

            default:
                return row;

        }

    }


}