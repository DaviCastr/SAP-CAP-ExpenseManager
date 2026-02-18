const cds = require('@sap/cds');
const excel = require('exceljs');
const fs = require('fs');
const path = require('path');
const axios = require('axios');
const nodemailer = require("nodemailer");
const handlebars = require("handlebars");
const PDFDocument = require("pdfkit");
const { PassThrough } = require('stream');
const AdmZip = require('adm-zip');
const { Readable } = require('stream');

// Ajuste o limite de tamanho de arquivo permitido (por exemplo, para 50MB)


class GestaoGastos extends cds.ApplicationService {

    init(req) {

        const { Pessoa, Categoria, Cartao, Fatura, Transacao, Backup } = this.entities;

        try {

            this.after("READ", Pessoa, async (req, context) => { return await this.afterReadPessoa(req, context) });

            this.before("READ", Pessoa, async (req, context) => { return await this.beforeReadPessoa(req, context) });

            this.before("UPDATE", Pessoa.drafts, this.beforeUpdatePessoa);

            this.before("UPDATE", Pessoa, this.beforeUpdatePessoa);

            this.before("UPDATE", Cartao.drafts, this.beforeUpdateCartao);

            this.before("CREATE", Cartao.drafts, this.beforeCreateCartao);

            this.before("DELETE", Pessoa, this.beforeDeletePessoa);

            this.before("DELETE", Cartao.drafts, this.beforeDeleteCartao);

            this.after("READ", Cartao, async (req, context) => { return await this.afterReadCartao(req, context) });

            this.after("READ", Fatura, async (req, context) => { return await this.afterReadFatura(req, context) });

            this.after("READ", Transacao, async (req, context) => { return await this.afterReadTransacao(req, context) });

            this.before("CREATE", Transacao, this.beforeCreateUpdateDeleteTransacao);

            this.on("DELETE", Transacao.drafts, this.beforeCreateUpdateDeleteTransacao);

            this.after("UPDATE", Transacao.drafts, this.beforeCreateUpdateDeleteTransacao);

            this.before("UPDATE", Backup, this.beforeUpdateBackup);

            //Ações utilizados no ui5/fiori
            this.on("simulaPorMesAno", this.simulaPorMesAno);

            this.on("adicionarGasto", async (req, context) => { return await this.adicionarGastoPrincipal(req, context) });

            this.on("excluirTransacao", async (req, context) => { return await this.excluirTransacaoPrincipal(req, context) });

            this.on("exportarBackup", async (req, context) => { return await this.exportarBackupPrincipal(req, context) });

            this.on("enviarAviso", this.enviarAviso);

            this.on("enviarPrevisaoDetalhada", this.enviarPrevisaoDetalhadaPrincipal);

            //Ações utilizadas em app ui5 e sapbuild apps
            this.on("inserirCategoria", async (req, next) => await this.inserirCategoriaPrincipal(req, next));

            this.on("modificarCategoria", async (req, context) => await this.modificarCategoriaPrincipal(req, context));

            this.on("inserirCartao", async (req, next) => await this.inserirCartaoPrincipal(req, next));

            this.on("modificarCartao", async (req, context) => await this.modificarCartaoPrincipal(req, context));

            this.on("recuperaCategoriasParaGastoTotal", async (req, next) => await this.recuperaCategoriasParaGastoTotalPrincipal(req, next));

            this.on("recuperaCategorias", async (req, next) => await this.recuperaCategoriasPrincipal(req, next));

            this.on("recuperaTransacoesPorCategoria", async (req, next) => await this.recuperaTransacoesPorCategoriaPrincipal(req, next));

            this.on("recuperaFaturaCompleta", async (req, next) => await this.recuperaFaturaCompletaPrincipal(req, next));

            return super.init();

        } catch (erro) {
            req.error(400, "Erro ao processar a consulta:" + erro);
        }
    }

    async sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    async beforeReadPessoa(req, context) {
        try {
            // Verifica se o usuário está autenticado
            if (req.user && req.user.id && req.user.id.includes('@')) {
                // Se não houver um filtro de where, cria um
                if (!Array.isArray(req.query.SELECT.where)) {
                    req.query.SELECT.where = [];

                    // Adiciona o filtro para o ID do usuário autenticado
                    req.query.SELECT.where.push(
                        { ref: ['createdBy'] },
                        '=',
                        {
                            //val: req.user.id//attr.logonName
                            val: req.user.id//attr.logonName

                        }
                    );

                    req.query.SELECT.where.push(
                        'OR',
                        { ref: ['PartilharCom'] },
                        '=',
                        {
                            //val: req.user.id//attr.logonName
                            val: req.user.id
                        }
                    );

                }
            }

        } catch (error) {
            console.error("Erro ao filtrar registros:", error);
            req.error(400, "Erro ao processar a consulta:" + error);
        }
    }


    async afterReadPessoa(req, context) {

        try {

            const pessoas = Array.isArray(req) ? req : [req];

            for (const pessoa of pessoas) {

                if (!pessoa.Imagem) {

                    const oGastos = await this.selecionaGastosPorPessoa(pessoa.ID);
                    //pessoa.ImagemUrl = context.headers.origin + Gere
                    pessoa.TotalDeGastos = oGastos.totalDeGastos;
                    pessoa.TotalDeGastos = parseFloat((Math.round((pessoa.TotalDeGastos + Number.EPSILON) * 100) / 100));
                    pessoa.TotalDoMes = oGastos.totalDoMes;
                    pessoa.TotalDoMes = parseFloat((Math.round((pessoa.TotalDoMes + Number.EPSILON) * 100) / 100));
                    pessoa.ValorAEconomizar = pessoa.TotalDoMes - pessoa.ObjetivoDeGasto;
                    pessoa.ValorAEconomizar = parseFloat((Math.round((pessoa.ValorAEconomizar + Number.EPSILON) * 100) / 100));
                    pessoa.TotalDoMesEmAberto = oGastos.totalDoMesEmAberto;
                    pessoa.TotalDoMesEmAberto = parseFloat((Math.round((pessoa.TotalDoMesEmAberto + Number.EPSILON) * 100) / 100));
                    pessoa.TotalDoMesFechado = oGastos.totalDoMesFechado;
                    pessoa.TotalDoMesFechado = parseFloat((Math.round((pessoa.TotalDoMesFechado + Number.EPSILON) * 100) / 100));
                    pessoa.TotalDoMesPago = oGastos.totalDoMesPago;
                    pessoa.TotalDoMesPago = parseFloat((Math.round((pessoa.TotalDoMesPago + Number.EPSILON) * 100) / 100));

                    if (pessoa.TotalDoMes > pessoa.ObjetivoDeGasto) {
                        pessoa.CriticidadeDoMes = 1;
                    } else {
                        pessoa.CriticidadeDoMes = 3;
                    }

                    if (pessoa.TotalDoMesEmAberto > pessoa.ObjetivoDeGasto) {
                        pessoa.CriticidadeEmAberto = 1;
                    } else {
                        pessoa.CriticidadeEmAberto = 3;
                    }

                }

            }

        } catch (erro) {
            console.error("Erro ao filtrar registros:", error);
            context.error(400, "Erro ao processar a consulta:" + erro);
        }

    }


    async beforeUpdatePessoa(req, context) {

        const { Pessoa } = this.entities

        let oPessoa = await SELECT.one.from(Pessoa).where({ ID: req.data.ID });

        if (oPessoa) {
            if (req.user && req.user.id) {
                if (oPessoa.createdBy !== req.user.id) {
                    req.reject(400, `Não é possível editar algo que você tem acesso apenas compartilhado`);
                }
            }
        }

        if (oPessoa && req.data.Moeda_code) {

            if (oPessoa.Moeda_code != req.data.Moeda_code) {
                req.reject(400, `O valor do campo Moeda não pode ser mudado, pois o mesmo é usado para converter valores de gastos`, 'Moeda_code')
            }
        }

        if (req.data.Email) {

            const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

            if (!regex.test(req.data.Email)) {
                req.reject(400, `Email inválido.`, 'Email');
            }

        }

        if (req.data.Telefone) {

            const regexTelefone = /^\d{9}$/;

            if (!regexTelefone.test(req.data.Telefone)) {
                req.reject(400, `Telefone inválido: ${req.data.Telefone}`, 'Telefone');
            }

        }

        if (req.data.Renda) {
            if (req.data.Renda < 0) {
                req.reject(400, `O valor da renda não pode ser negativo.`, 'Renda')
            }
        }

        if (req.data.ObjetivoDeGasto) {
            if (req.data.ObjetivoDeGasto < 0) {
                req.reject(400, `O valor do objetivo não pode ser negativo.`, 'ObjetivoDeGasto')
            }
        }

    }

    async beforeUpdateCartao(req) {

        try {

            const { Pessoa, Cartao } = this.entities

            let oCartao = await SELECT.one.from(Cartao).where({ ID: req.data.ID });

            if (oCartao) {
                if (req.user && req.user.id) {
                    if (oCartao.createdBy !== req.user.id) {
                        req.reject(400, `Não é possível editar algo que você tem acesso apenas compartilhado`);
                    }
                }
            }

            if (oCartao) {
                let oPessoa = await SELECT.one.from(Pessoa).where({ ID: oCartao.Pessoa_ID });

                if (oPessoa && req.data.Moeda_code) {

                    if (oPessoa.Moeda_code != req.data.Moeda_code) {
                        req.reject(400, `O valor do campo Moeda não pode ser mudado/diferente da moeda da pessoa.`, 'Moeda_code')
                    }
                }
            }

            if (req.data.Limite) {
                if (req.data.Limite < 0) {
                    req.reject(400, `O valor da renda não pode ser negativo.`, 'Limite')
                }
            }

            if (req.data.DiaFechamento && req.data.DiaVencimento) {
                if (req.data.DiaVencimento - req.data.DiaVencimento < 2) {
                    req.reject(400, `O valor do dia de vencimento tem que ter diferença maior de 1 dia da fatura.`, 'DiaVencimento');
                }
            }

        } catch (erro) {
            console.error("Erro ao filtrar registros:", erro);
            req.error(400, "Erro ao processar a consulta:" + erro);
        }

    }

    async beforeCreateCartao(req) {

        try {

            const { Pessoa } = this.entities;
            const { data } = req;

            if (data) {

                let oPessoa = await SELECT.one.from(Pessoa).where({ ID: data.Pessoa_ID });

                if (oPessoa) {
                    if (req.user && req.user.id) {
                        if (oPessoa.createdBy !== req.user.id) {

                            req.reject(400, `Não é possível editar algo que você tem acesso apenas compartilhado`);

                        }
                    }

                }

            }

        } catch (erro) {
            console.error("Erro ao filtrar registros:", erro);
            req.error(400, "Erro ao processar a consulta:" + erro);
        }

    }


    async selecionaGastosPorPessoa(ID) {

        const { Cartao } = this.entities;

        let oTotalDeGastos = 0.0;
        let oTotalDoMes = 0.0;
        let oTotalDoMesEmAberto = 0.0;
        let oTotalDoMesFechado = 0.0;
        let oTotalDoMesPago = 0.0;

        const dadosCartoes = await SELECT.from(Cartao).where({ Pessoa_ID: ID });

        let oDate = new Date().toLocaleString("pt-BR", { timeZone: "America/Sao_Paulo" });
        oDate = oDate.replaceAll(",", " ");
        let [oDia, oMes, oAno] = oDate.split(" ")[0].split("/");

        oDia = Number(oDia);
        oMes = Number(oMes);
        oAno = Number(oAno);

        for (let cartao of dadosCartoes) {

            let oMesFatura = oMes;
            let oAnoFatura = oAno;

            if (cartao.DiaFechamento > cartao.DiaVencimento) {

                if (oMesFatura == 12) {
                    oMesFatura = 1;
                    oAnoFatura += 1;
                } else {
                    oMesFatura += 1;
                }

            }

            try {

                if (cartao.DiaFechamento > 28) {

                    if (!this.validarData(`${oAnoFatura}-${oMesFatura}-${cartao.DiaFechamento}`)) {
                        cartao.DiaFechamento = this.ultimoDiaDoMes(oAnoFatura, oMesFatura - 1);
                    }
                }

            } catch (erro) {

            }

            let oMesSeguinte = oMesFatura;
            let oAnoSeguinte = oAnoFatura;

            if (oMesFatura < 12) {
                oMesSeguinte += 1;
            } else {
                oMesSeguinte = 1
                oAnoSeguinte += 1
            }

            const faturas = await this.selecionaFaturasPorCartao(cartao.ID, oAnoFatura);

            faturas.forEach(fatura => {

                if (fatura.Ano == oAnoFatura && fatura.Mes >= oMesFatura || fatura.Ano > oAnoFatura) {
                    oTotalDeGastos += Number(fatura.ValorTotal)
                    if (fatura.Mes == oMesFatura && fatura.Ano == oAnoFatura) {
                        oTotalDoMes += Number(fatura.ValorTotal);
                        if (cartao.DiaFechamento > oDia)
                            oTotalDoMesEmAberto += Number(fatura.ValorTotal)
                        else if (cartao.DiaFechamento <= oDia && cartao.DiaVencimento >= oDia)
                            oTotalDoMesFechado += Number(fatura.ValorTotal)
                        else
                            oTotalDoMesPago += Number(fatura.ValorTotal)
                    } else if (fatura.Ano == oAnoSeguinte && fatura.Mes == oMesSeguinte && cartao.DiaFechamento <= oDia) {
                        oTotalDoMesEmAberto += Number(fatura.ValorTotal)
                    }
                }

            });

        };

        return {
            totalDeGastos: oTotalDeGastos,
            totalDoMes: oTotalDoMes,
            totalDoMesEmAberto: oTotalDoMesEmAberto,
            totalDoMesFechado: oTotalDoMesFechado,
            totalDoMesPago: oTotalDoMesPago
        };

    }

    async selecionaFaturasPorCartao(ID, Ano) {

        const { Fatura } = this.entities;

        const faturas = await SELECT.from(Fatura).where({
            Cartao_ID: ID,
            Ano: { '>=': Ano }
        });

        return faturas;

    }

    async afterReadCartao(req, context) {

        try {

            const cartoes = Array.isArray(req) ? req : [req];

            let oDate = new Date().toLocaleString("pt-BR", { timeZone: "America/Sao_Paulo" });
            oDate = oDate.replaceAll(",", " ");
            let [oDia, oMes, oAno] = oDate.split(" ")[0].split("/");

            oDia = Number(oDia);
            oMes = Number(oMes);
            oAno = Number(oAno);

            for (let cartao of cartoes) {

                let oMesFatura = oMes;
                let oAnoFatura = oAno;

                if (cartao.DiaFechamento > cartao.DiaVencimento) {

                    if (oMesFatura == 12) {
                        oMesFatura = 1;
                        oAnoFatura += 1;
                    } else {
                        oMesFatura += 1;
                    }

                }

                try {

                    if (cartao.DiaFechamento > 28) {

                        if (!this.validarData(`${oAno}-${oMes}-${cartao.DiaFechamento}`)) {
                            cartao.DiaFechamento = this.ultimoDiaDoMes(oAnoFatura, oMesFatura - 1);
                        }
                    }

                } catch (erro) {

                }

                let oMesSeguinte = oMesFatura;
                let oAnoSeguinte = oAnoFatura;

                if (oMesFatura < 12) {
                    oMesSeguinte += 1;
                } else {
                    oMesSeguinte = 1
                    oAnoSeguinte += 1
                }

                let oTotalDeGastos = 0.0;
                let oTotalDoMes = 0.0;
                let oTotalDoMesEmAberto = 0.0;
                let oTotalDoMesFechado = 0.0;

                const faturas = await this.selecionaFaturasPorCartao(cartao.ID, oAno);

                faturas.forEach(fatura => {

                    if (fatura.Ano == oAnoFatura && fatura.Mes >= oMesFatura || fatura.Ano > oAnoFatura) {

                        if (fatura.Mes == oMesFatura && fatura.Ano == oAnoFatura) {
                            oTotalDoMes += Number(fatura.ValorTotal);
                            if (cartao.DiaFechamento > oDia) {
                                oTotalDoMesEmAberto += Number(fatura.ValorTotal)
                                oTotalDeGastos += Number(fatura.ValorTotal)
                            } else if (cartao.DiaVencimento >= oDia) {
                                oTotalDoMesFechado += Number(fatura.ValorTotal)
                                oTotalDeGastos += Number(fatura.ValorTotal)
                            }
                        } else if (fatura.Ano == oAnoSeguinte && fatura.Mes == oMesSeguinte && cartao.DiaFechamento <= oDia) {
                            oTotalDoMesEmAberto += Number(fatura.ValorTotal)
                            oTotalDeGastos += Number(fatura.ValorTotal)
                        } else {
                            oTotalDeGastos += Number(fatura.ValorTotal)
                        }
                    }

                });

                cartao.LimiteDisponivel = (Math.round(((cartao.Limite - oTotalDeGastos) + Number.EPSILON) * 100) / 100);
                cartao.ValorFaturaEmAberto = oTotalDoMesEmAberto;
                if (cartao.DiaFechamento > oDia) {
                    cartao.ValorFaturaParaPagamento = cartao.ValorFaturaEmAberto
                } else if (cartao.DiaVencimento < oDia) {
                    cartao.ValorFaturaParaPagamento = cartao.ValorFaturaEmAberto
                } else {
                    cartao.ValorFaturaParaPagamento = oTotalDoMesFechado
                }
            }

        } catch (erro) {
            console.error("Erro ao filtrar registros:", erro);
            context.error(400, "Erro ao processar a consulta:" + erro);
        }

    }

    async afterReadFatura(req, context) {

        try {

            const faturas = Array.isArray(req) ? req : [req];

            for (let fatura of faturas) {

                if (!fatura.Descricao) {

                    let oDescription = '';

                    switch (fatura.Mes) {
                        case 1:
                            oDescription = `Janeiro`
                            break;
                        case 2:
                            oDescription = `Fevereiro`
                            break;
                        case 3:
                            oDescription = `Março`
                            break;
                        case 4:
                            oDescription = `Abril`
                            break;
                        case 5:
                            oDescription = `Maio`
                            break;
                        case 6:
                            oDescription = `Junho`
                            break;
                        case 7:
                            oDescription = `Julho`
                            break;
                        case 8:
                            oDescription = `Agosto`
                            break;
                        case 9:
                            oDescription = `Setembro`
                            break;
                        case 10:
                            oDescription = `Outubro`
                            break;
                        case 11:
                            oDescription = `Novembro`
                            break;
                        case 12:
                            oDescription = `Dezembro`
                            break;
                        default:
                            break;
                    }

                    fatura.Descricao = oDescription;

                }

            }

        } catch (erro) {
            console.error("Erro ao filtrar registros:", erro);
            context.error(400, "Erro ao processar a consulta:" + erro);
        }

    }

    async afterReadTransacao(req, context) {

        const { Transacao } = this.entities;

        try {

            const transacoes = Array.isArray(req) ? req : [req];

            for (let transacao of transacoes) {

                if (!transacao.ValorTotal || transacao.ValorTotal == 0) {

                    if (transacao.ParcelasTotais > 1) {

                        let oValorTotal = {};

                        if (transacao.Identificador) {

                            oValorTotal = await SELECT.one`coalesce (sum (Valor),0) as ValorTotal`.from(Transacao).where({ Identificador: transacao.Identificador });

                        } else {

                            let oIdentificador = await SELECT.one.columns('Identificador').from(Transacao).where({ ID: transacao.ID });
                            oValorTotal = await SELECT.one`coalesce (sum (Valor),0) as ValorTotal`.from(Transacao).where({ Identificador: oIdentificador.Identificador });

                        }

                        transacao.ValorTotal = oValorTotal.ValorTotal;

                    } else {
                        transacao.ValorTotal = transacao.Valor;
                    }
                }

            }

        } catch (erro) {
            console.error("Erro ao filtrar registros:", erro);
            context.error(400, "Erro ao processar a consulta:" + erro);
        }

    }

    async beforeCreateUpdateDeleteTransacao(data, req) {

        const transacoes = Array.isArray(data) ? data : [data];

        const { Fatura, Transacao } = this.entities;

        for (const transacao of transacoes) {

            if (req.event == 'UPDATE' && 'Valor' in transacao) {

                const transacao_old = await SELECT.one.from(Transacao).where({ ID: transacao.ID });

                if (transacao_old) {
                    const oSoma = await SELECT.one`coalesce (sum (Valor),0) as Valor`.from(Transacao.drafts).where({ Fatura_ID: transacao_created.Fatura_ID });
                    const oValorTotal = oSoma

                    await UPDATE(Fatura.drafts, transacao_old.Fatura_ID).with({ ValorTotal: oValorTotal })
                } else {

                    const transacao_created = await SELECT.one.from(Transacao.drafts).where({ ID: transacao.ID });

                    const oSoma = await SELECT.one`coalesce (sum (Valor),0) as Valor`.from(Transacao.drafts).where({ Fatura_ID: transacao_created.Fatura_ID });

                    const oValorTotal = oSoma.Valor;

                    await UPDATE(Fatura.drafts, transacao_created.Fatura_ID).with({ ValorTotal: oValorTotal })

                }

            } else if (data.event) {
                const transacao_old = await SELECT.one.from(Transacao.drafts).where({ ID: transacao.data.ID });

                const oSoma = await SELECT.one`coalesce (sum (Valor),0) as Valor`.from(Transacao.drafts).where({ Fatura_ID: transacao_old.Fatura_ID });

                const oValorTotal = oSoma.Valor - transacao_old.Valor;

                await UPDATE(Fatura.drafts, transacao_old.Fatura_ID).with({ ValorTotal: oValorTotal })

                const res = await req();//Avança próxima exclusão caso haja

                return res

            } else if (req.event == 'CREATE' && 'Valor' in transacao) {
                const fatura = await SELECT.one.from(Fatura.drafts).where({ ID: transacao.Fatura_ID });

                if (fatura) {
                    const oValorTotal = 0.0;
                    if (fatura.ValorTotal)
                        oValorTotal = fatura.ValorTotal + transacao.Valor;
                    else
                        oValorTotal = transacao.Valor

                    await UPDATE(Fatura.drafts, fatura.ID).with({ ValorTotal: oValorTotal })
                }
            }

        }

        return true;

    }

    async beforeUpdateBackup(data) {

        try {

            if (data.data.Backup) {

                const oBackupBuffer = await this.ReadableParaBuffer(data.data.Backup);

                if (oBackupBuffer) {
                    return await this.importarBackup(oBackupBuffer);
                }

            }

        } catch (error) {
            data.error('400', 'Erro ao ler conteúdo do arquivo.')
        }

    }

    async beforeDeletePessoa(data, req) {

        const pessoas = Array.isArray(data.data) ? data.data : [data.data];

        const { Pessoa } = this.entities;

        for (const pessoa of pessoas) {

            let oPessoa = await SELECT.one.columns("createdBy").from(Pessoa).where({ ID: pessoa.ID });

            if (oPessoa) {
                if (data.user && data.user.id) {
                    if (oPessoa.createdBy !== data.user.id) {

                        data.error(400, `Não é possível editar algo que você tem acesso apenas compartilhado`);

                    }

                }
            }

        }

    }

    async beforeDeleteCartao(data, req) {

        const cartoes = Array.isArray(data.data) ? data.data : [data.data];

        const { Cartao } = this.entities;

        for (const cartao of cartoes) {

            let oCartao = await SELECT.one.columns("createdBy").from(Cartao).where({ ID: cartao.ID });

            if (oCartao) {
                if (data.user && data.user.id) {
                    if (oCartao.createdBy !== data.user.id) {

                        data.error(400, `Não é possível editar algo que você tem acesso apenas compartilhado`);

                    }
                }
            }

        }

    }

    async simulaPorMesAno(IDPessoa, Mes, Ano) {

        const { Cartao, Pessoa } = this.entities;

        let oTotalDeGastos = 0.0;
        let oTotalDoMes = 0.0;

        const dadosCartoes = await SELECT.from(Cartao).where({ Pessoa_ID: IDPessoa });

        for (const cartao of dadosCartoes) {

            const faturas = await this.selecionaFaturasPorCartao(cartao.ID, Ano);

            faturas.forEach(fatura => {

                if (fatura.Ano == Ano && fatura.Mes >= Mes || fatura.Ano > Ano) {
                    oTotalDeGastos += Number(fatura.ValorTotal)
                    if (fatura.Mes == Mes && fatura.Ano == Ano) {
                        oTotalDoMes += Number(fatura.ValorTotal);
                    }
                }

            });

        };

        let oPessoa = await SELECT.one`coalesce (ObjetivoDeGasto,0) as ObjetivoDeGasto, Moeda_code`.from(Pessoa).where({ ID: IDPessoa });

        let oObjetivoDeGasto = 0.0;
        let oMoeda = 'BRL';
        if (oPessoa) {

            oObjetivoDeGasto = oPessoa.ObjetivoDeGasto;
            oMoeda = oPessoa.Moeda_code;

        }

        return {
            TotalDeGastos: (Math.round((oTotalDeGastos + Number.EPSILON) * 100) / 100),
            TotalDoMes: (Math.round((oTotalDoMes + Number.EPSILON) * 100) / 100),
            ValorAEconomizar: (Math.round(((oTotalDoMes - oObjetivoDeGasto) + Number.EPSILON) * 100) / 100),
            Moeda_code: oMoeda
        }
    }

    validarData(data) {
        const d = new Date(data);
        return !isNaN(d.getTime());  // Retorna true se a data for válida, false se não for
    }

    ultimoDiaDoMes(ano, mes) {
        // O mês no JavaScript é zero-indexado, ou seja, janeiro é 0, fevereiro é 1, etc.
        // Então, se queremos o último dia de janeiro, passamos 0 para o mês.

        // Criar uma data no primeiro dia do próximo mês
        const data = new Date(ano, mes, 0);

        // Retorna o último dia do mês
        return data.getDate();
    }

    async adicionarGastoPrincipal(req, context) {

        const { Pessoa, Fatura, Transacao, Cartao } = this.entities

        const { pessoa, descricao, valor, moeda, data, parcelas, gastofixo, categoria, cartao } = req.data

        if (!this.validarData(data)) {

            return {
                erro: `Data inválida ${data}`
            }

        }

        let oDataAtual = new Date().toLocaleString("pt-BR", { timeZone: "America/Sao_Paulo" });
        oDataAtual = oDataAtual.replaceAll(",", " ");
        let [oDiaAtual, oMesAtual, oAnoAtual] = oDataAtual.split(" ")[0].split("/");

        oDiaAtual = Number(oDiaAtual);
        oMesAtual = Number(oMesAtual);
        oAnoAtual = Number(oAnoAtual);

        const oDataGasto = new Date(`${data}T00:00:00`);
        const oAnoGasto = oDataGasto.getFullYear();       // Retorna 2025
        const oMesGasto = Number(String(oDataGasto.getMonth() + 1).padStart(2, "0")); // Retorna 01 (mês é zero-based)
        const oDiaGasto = Number(String(oDataGasto.getDate()).padStart(2, "0"));

        let oAnoFatura = oAnoGasto;
        let oMesFatura = oMesGasto;
        let oCartao = await SELECT.one.from(Cartao).where({ ID: cartao });
        let oPessoa = await SELECT.one.from(Pessoa).where({ ID: pessoa });

        if (!oPessoa) {
            return;
        }

        if (req.user && req.user.id) {
            if (oPessoa.createdBy !== req.user.id) {

                req.reject(400, `Não é possível editar algo que você tem acesso apenas compartilhado`);

            }
        }

        //Realiza cálculo de cotação se necessário
        if (moeda != oPessoa.Moeda_code) {

            try {
                const response = await axios.get(`https://economia.awesomeapi.com.br/json/last/${moeda}-${oPessoa.Moeda_code}`, {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });

                let oCotacao = response.data[`${moeda}${oPessoa.Moeda_code}`];

                valor = valor * oCotacao.bid;

            } catch (err) {
                let a = err
            }

        }

        if (oCartao.DiaFechamento > oCartao.DiaVencimento) {

            if (oMesFatura == 12) {
                oMesFatura = 1;
                oAnoFatura += 1;
            } else {
                oMesFatura += 1;
            }

        }

        try {

            if (oCartao.DiaFechamento > 28) {

                if (!this.validarData(`${oAnoFatura}-${oMesFatura}-${oCartao.DiaFechamento}`)) {
                    oCartao.DiaFechamento = this.ultimoDiaDoMes(oAnoAtual, oMesAtual - 1);
                }
            }

        } catch (erro) {

        }

        if (oCartao.DiaFechamento <= oDiaGasto) {

            if (oMesFatura == 12) {
                oMesFatura = 1;
                oAnoFatura += 1;
            } else {
                oMesFatura += 1;
            }

        }

        let oParcelaGastoFixo = 1;

        if (gastofixo) {

            oParcelaGastoFixo = (12 - oMesFatura) + 1;

        }

        try {

            let oParcela = 0;
            let oValor = (Math.round(((valor / parcelas) + Number.EPSILON) * 100) / 100);
            let oDiferenca = (oValor * parcelas) - valor;
            let oValorPrimeiraParcela = (Math.round(((oValor - oDiferenca) + Number.EPSILON) * 100) / 100);
            let oIdentificadorGasto = this.gerarUUID();
            let oFatura = await this.recuperaFatura(oAnoFatura, oMesFatura, oValorPrimeiraParcela, oPessoa.Moeda_code, cartao);

            do {
                let oValorParcela = oValorPrimeiraParcela;
                oParcela += 1;

                if (oParcela > 1) {

                    oValorParcela = oValor;

                    if (oMesFatura == 12) {
                        oMesFatura = 1;
                        oAnoFatura += 1;
                    } else {
                        oMesFatura += 1;
                    }

                    oFatura = await this.recuperaFatura(oAnoFatura, oMesFatura, oValorParcela, oPessoa.Moeda_code, cartao);
                }

                let oParcelaTransacao = oParcela;

                if (gastofixo) {
                    oParcelaTransacao = 1
                }

                let oNovaTransacao = {
                    Identificador: oIdentificadorGasto,
                    Data: data,
                    ValorTotal: valor,
                    Valor: oValorParcela,
                    Moeda_code: oPessoa.Moeda_code,
                    ParcelasTotais: parcelas,
                    Parcela: oParcelaTransacao,
                    Descricao: descricao,
                    Categoria_ID: categoria,
                    Fatura_ID: oFatura.ID,
                }

                let oTransacao = await this.criaTransacao(oNovaTransacao);

                await this.atualizaValorFatura(oFatura.ID);

            } while (oParcela < parcelas || oParcela < oParcelaGastoFixo);

            return {
                sucesso: true
            }

        } catch (err) {

        }

    }

    async recuperaFatura(Ano, Mes, ValorTotal, Moeda_code, Cartao_ID) {

        const { Fatura } = this.entities

        let oFatura = await SELECT.one.from(Fatura).where({
            Ano: Ano,
            Mes: Mes,
            Cartao_ID: Cartao_ID
        });

        if (!oFatura) {

            oFatura = await this.criaFatura(Ano, Mes, ValorTotal, Moeda_code, Cartao_ID);

        }

        return oFatura;

    }

    async criaFatura(Ano, Mes, ValorTotal, Moeda, Cartao_ID) {

        const { Fatura } = this.entities;

        let oDescription = '';

        switch (Mes) {
            case 1:
                oDescription = `Janeiro`
                break;
            case 2:
                oDescription = `Fevereiro`
                break;
            case 3:
                oDescription = `Março`
                break;
            case 4:
                oDescription = `Abril`
                break;
            case 5:
                oDescription = `Maio`
                break;
            case 6:
                oDescription = `Junho`
                break;
            case 7:
                oDescription = `Julho`
                break;
            case 8:
                oDescription = `Agosto`
                break;
            case 9:
                oDescription = `Setembro`
                break;
            case 10:
                oDescription = `Outubro`
                break;
            case 11:
                oDescription = `Novembro`
                break;
            case 12:
                oDescription = `Dezembro`
                break;
            default:
                break;
        }

        let novaFatura = {
            Ano: Ano,
            Mes: Mes,
            Descricao: oDescription,
            ValorTotal: ValorTotal,
            Moeda_code: Moeda,
            Cartao_ID: Cartao_ID
        }

        const oFaturaCreate = await INSERT.into(Fatura).entries([novaFatura]);

        // Recupera o ID da fatura recém-criada
        const oFatura = await SELECT.one.from(Fatura).where({ Ano: Ano, Mes: Mes, Cartao_ID: Cartao_ID });

        return oFatura;
    }

    async criaTransacao(transacao) {

        const { Transacao } = this.entities;

        const oTransacaoCreate = await INSERT.into(Transacao).entries([transacao]);

        const oTransacao = await SELECT.one.from(Transacao).orderBy({ createdAt: "desc" }).limit(1)

        return oTransacao;
    }

    async atualizaValorFatura(Fatura_ID) {

        const { Fatura, Transacao } = this.entities;

        const oSoma = await SELECT.one`coalesce (sum (Valor),0) as Valor`.from(Transacao).where({ Fatura_ID: Fatura_ID });

        const oValorTotal = parseFloat((Math.round((oSoma.Valor + Number.EPSILON) * 100) / 100));//.toFixed(2)

        await UPDATE(Fatura, Fatura_ID).with({ ValorTotal: oValorTotal })

    }

    async excluirTransacaoPrincipal(req, context) {

        const { Transacao, Fatura } = this.entities

        const { fatura, transacao, identificador, excluirRelacionadas } = req.data;

        try {

            let oTransacao = await SELECT.one.columns("createdBy").from(Transacao).where({ ID: transacao });

            if (req.user && req.user.id) {
                if (oTransacao.createdBy !== req.user.id) {

                    req.reject(400, `Não é possível editar algo que você tem acesso apenas compartilhado`);

                }
            }

            if (!excluirRelacionadas) {

                await DELETE.from(Transacao).where({ ID: transacao });
                await this.atualizaValorFatura(fatura);

            } else {

                let oFaturas = await SELECT`Fatura_ID`.from(Transacao).where({ Identificador: identificador });

                await DELETE.from(Transacao).where({ Identificador: identificador });

                for (const fatura of oFaturas) {

                    await this.atualizaValorFatura(fatura.Fatura_ID);

                }

            }

            return {
                sucesso: true
            }

        } catch (err) {

        }

    }

    // async exportarBackup(req) {
    //     const { Pessoa, Cartao } = this.entities;

    //     const tx = cds.transaction(req);
    //     const workbook = new excel.Workbook();
    //     const zip = new AdmZip();

    //     // Adicionar tabelas no Excel
    //     const tables = ['Pessoa', 'Cartao', 'Fatura', 'Transacao'];
    //     const camposDeControle = ['createdAt', 'createdBy', 'modifiedAt', 'modifiedBy'];

    //     for (const table of tables) {
    //         const sheet = workbook.addWorksheet(table);

    //         // Usar SELECT direto com CDS
    //         const data = await tx.run(SELECT.from(`app.entidades.${table}`));

    //         if (data.length > 0) {
    //             if (table === 'Pessoa') {
    //                 for (const oPessoa of data) {
    //                     try {
    //                         const oImagemPessoa = await tx.run(
    //                             SELECT.one.from(Pessoa).columns('Imagem').where({ ID: oPessoa.ID })
    //                         );

    //                         if (oImagemPessoa && oImagemPessoa.Imagem) {

    //                             const oImagemBuffer = await this.ReadableParaBuffer(oImagemPessoa.Imagem);
    //                             const oExtensao = oPessoa.TipoImagem.split("/")[1];
    //                             // Salvar o arquivo binário no zip
    //                             zip.addFile(`${oPessoa.ID}.${oExtensao}`, oImagemBuffer);

    //                         }
    //                     } catch (error) {
    //                     }
    //                 }
    //             }

    //             if (table === 'Cartao') {
    //                 for (const oCartao of data) {
    //                     try {
    //                         const oImagemCartao = await tx.run(
    //                             SELECT.one.from(Cartao).columns('Imagem').where({ ID: oCartao.ID })
    //                         );

    //                         if (oImagemCartao && oImagemCartao.Imagem) {

    //                             const oImagemBuffer = await this.ReadableParaBuffer(oImagemCartao.Imagem);
    //                             const oExtensao = oCartao.TipoImagem.split("/")[1];
    //                             // Salvar o arquivo binário no zip
    //                             zip.addFile(`${oCartao.ID}.${oExtensao}`, oImagemBuffer);

    //                         }

    //                     } catch (error) {
    //                     }
    //                 }
    //             }

    //             const filteredData = data.map((record) => {
    //                 const filteredRecord = { ...record };
    //                 camposDeControle.forEach((campo) => delete filteredRecord[campo]);
    //                 return filteredRecord;
    //             });

    //             sheet.columns = Object.keys(filteredData[0]).map((key) => ({ header: key, key }));
    //             sheet.addRows(filteredData);
    //         }
    //     }

    //     const oCaminhoArquivoExcel = path.join(__dirname, 'backup.xlsx');
    //     await workbook.xlsx.writeFile(oCaminhoArquivoExcel);

    //     // Adicionar o Excel ao ZIP
    //     zip.addLocalFile(oCaminhoArquivoExcel);
    //     fs.unlinkSync(oCaminhoArquivoExcel); // Apagar o Excel temporário

    //     // Gerar o ZIP
    //     const zipBuffer = zip.toBuffer();

    //     return {
    //         headers: {
    //             'Content-Type': 'application/zip',
    //             'Content-Disposition': 'attachment; filename=backup.zip',
    //         },
    //         body: zipBuffer,
    //     };
    // }

    async exportarBackupPrincipal(req, context) {
        const { Pessoa, Categoria, Cartao, Fatura, Transacao, Backup } = this.entities;
        const { ID } = req.data;
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

    // async importarBackup(req) {

    //     const tx = cds.transaction(req); // Usar transação
    //     const fileBuffer = req;

    //     const workbook = new excel.Workbook();
    //     await workbook.xlsx.load(fileBuffer);

    //     let oFaturas = [];
    //     let oTransacoesTotais = []
    //     let oTransacoesInseridas = []

    //     const tables = ['Pessoa', 'Cartao', 'Fatura', 'Transacao'];
    //     for (const table of tables) {
    //         const sheet = workbook.getWorksheet(table);
    //         if (!sheet) continue;

    //         const rows = [];
    //         let rowHeader = {};
    //         sheet.eachRow((row, rowNumber) => {
    //             if (rowNumber === 1) { rowHeader = row; return }; // Ignorar cabeçalhos
    //             const rowData = {};
    //             sheet.columns.forEach((col, i) => {
    //                 rowData[rowHeader.getCell(i + 1).value] = row.getCell(i + 1).value;
    //             });
    //             rows.push(rowData);
    //         });

    //         // Processar cada linha da tabela
    //         for (const row of rows) {
    //             // Verificar existência com SELECT
    //             const exists = await tx.run(
    //                 SELECT.from(`app.entidades.${table}`).where({ ID: row.ID })
    //             );

    //             if (table == 'Transacao') {
    //                 oTransacoesTotais.push(row.ID)
    //             }

    //             if (exists.length === 0) {
    //                 // Inserir se não existir
    //                 await tx.run(
    //                     INSERT.into(`app.entidades.${table}`).entries(row)
    //                 );

    //                 if (table == 'Transacao') {
    //                     oTransacoesInseridas.push(row.ID);
    //                     oFaturas.push(row.Fatura_ID);
    //                 }

    //             } else {
    //                 // Retornar mensagem de erro se o backup já existir
    //                 //return `Backup já importado para a tabela ${table}.`;
    //             }
    //         }
    //     }

    //     await tx.commit();

    //     if (oTransacoesTotais.length > oTransacoesInseridas.length) {
    //         let oFaturasParaAtualizarValor = [...new Set(oFaturas)];

    //         for (const oFatura of oFaturasParaAtualizarValor) {

    //             await this.atualizaValorFatura(oFatura)

    //         }
    //     }

    //     return 'Backup importado com sucesso!';
    // }

    async importarBackup(req) {

        const tx = cds.transaction(req); // Iniciar transação

        const zipBuffer = req;

        // Descompactar o ZIP
        const zip = new AdmZip(zipBuffer);
        const zipEntries = zip.getEntries();

        // Localizar o arquivo Excel e os arquivos binários
        let excelFile;
        const binaryFiles = {};

        zipEntries.forEach((entry) => {
            if (entry.entryName.endsWith('.xlsx')) {
                excelFile = entry.getData(); // Ler o conteúdo do arquivo Excel
            } else {
                binaryFiles[entry.entryName] = entry.getData(); // Salvar os arquivos binários no dicionário
            }
        });

        if (!excelFile) {
            throw new Error('Arquivo Excel não encontrado no backup!');
        }

        // Ler o arquivo Excel
        const workbook = new excel.Workbook();
        await workbook.xlsx.load(excelFile);

        let oFaturas = [];
        let oTransacoesTotais = [];
        let oTransacoesInseridas = [];

        const tables = ['Pessoa', 'Categoria', 'Cartao', 'Fatura', 'Transacao'];

        for (const table of tables) {
            const sheet = workbook.getWorksheet(table);
            if (!sheet) continue;

            const rows = [];
            let rowHeader = {};
            sheet.eachRow((row, rowNumber) => {
                if (rowNumber === 1) {
                    rowHeader = row; // Cabeçalhos
                    return;
                }
                const rowData = {};
                sheet.columns.forEach((col, i) => {
                    rowData[rowHeader.getCell(i + 1).value] = row.getCell(i + 1).value;
                });
                rows.push(rowData);
            });

            // Processar cada linha da tabela
            for (const row of rows) {
                // Verificar se o registro já existe no banco
                const exists = await tx.run(
                    SELECT.from(`app.entidades.${table}`).where({ ID: row.ID })
                );

                if (table === 'Transacao') {
                    oTransacoesTotais.push(row.ID);
                }

                if (exists.length === 0) {
                    // Verificar se há binários para o registro atual (por exemplo, Pessoa.Imagem)
                    if (table === 'Pessoa') {

                        if (row.TipoImagem) {

                            const oExtensao = row.TipoImagem.split("/")[1];

                            const binaryFileName = `${row.ID}.${oExtensao}`; // Nome do arquivo armazenado no Excel

                            if (binaryFiles[binaryFileName]) {
                                row.Imagem = binaryFiles[binaryFileName]; // Substituir pelo conteúdo binário
                            } else {
                                row.Imagem = null; // Caso o binário não exista no ZIP
                            }
                        }
                    }

                    // Verificar se há binários para o registro atual (por exemplo, Pessoa.Imagem)
                    if (table === 'Categoria') {

                        if (row.TipoImagem) {

                            const oExtensao = row.TipoImagem.split("/")[1];

                            const binaryFileName = `${row.ID}.${oExtensao}`; // Nome do arquivo armazenado no Excel

                            if (binaryFiles[binaryFileName]) {
                                row.Imagem = binaryFiles[binaryFileName]; // Substituir pelo conteúdo binário
                            } else {
                                row.Imagem = null; // Caso o binário não exista no ZIP
                            }
                        }
                    }

                    // Verificar se há binários para o registro atual (por exemplo, Pessoa.Imagem)
                    if (table === 'Cartao') {

                        if (row.TipoImagem) {

                            const oExtensao = row.TipoImagem.split("/")[1];

                            const binaryFileName = `${row.ID}.${oExtensao}`; // Nome do arquivo armazenado no Excel

                            if (binaryFiles[binaryFileName]) {
                                row.Imagem = binaryFiles[binaryFileName]; // Substituir pelo conteúdo binário
                            } else {
                                row.Imagem = null; // Caso o binário não exista no ZIP
                            }
                        }
                    }

                    // Inserir no banco se não existir
                    await tx.run(
                        INSERT.into(`app.entidades.${table}`).entries(row)
                    );

                    if (table === 'Transacao') {
                        oTransacoesInseridas.push(row.ID);
                        oFaturas.push(row.Fatura_ID);
                    }
                } else {
                    let teste = 1;
                }
            }
        }

        await tx.commit();

        // Atualizar valores das faturas, se necessário
        if (oTransacoesTotais.length > oTransacoesInseridas.length) {
            let oFaturasParaAtualizarValor = [...new Set(oFaturas)];

            for (const oFatura of oFaturasParaAtualizarValor) {
                await this.atualizaValorFatura(oFatura);
            }
        }

    }

    async atualizaAvisoEnviadoFatura(Fatura_ID) {

        const { Fatura } = this.entities;

        await UPDATE(Fatura, Fatura_ID).with({ AvisoEnviado: true })

    }

    async enviarAviso(req) {

        if (!process.env.SMTPAddres) {
            return
        }

        let oDate = new Date().toLocaleString("pt-BR", { timeZone: "America/Sao_Paulo" });
        oDate = oDate.replaceAll(",", " ");
        let [oDia, oMes, oAno] = oDate.split(" ")[0].split("/");

        oDia = Number(oDia);
        oMes = Number(oMes);
        oAno = Number(oAno);

        try {

            const { Pessoa, Cartao, Fatura, Transacao } = this.entities

            const oPessoas = await SELECT.from(Pessoa).columns('ID', 'Nome', 'Email').where({ Email: { '!=': null } });

            if (!oPessoas.length > 0) {
                return;
            }

            const oCartoes = await SELECT.from(Cartao).columns('ID', 'NomeCartao', 'DiaVencimento', 'Pessoa_ID').where({
                DiaVencimento: { '>=': oDia }
            });

            if (!oCartoes.length > 0) {
                return;
            }

            let oFaturas = await SELECT.from(Fatura).where({
                Ano: oAno,
                Mes: oMes
            });

            oFaturas = oFaturas.filter(fatura => fatura.AvisoEnviado === false || fatura.AvisoEnviado === null);

            if (!oFaturas.length > 0) {
                return;
            }

            for (let oPessoa of oPessoas) {

                let oCartoesDaPessoa = oCartoes.filter(cartao => cartao.Pessoa_ID == oPessoa.ID);

                for (let oCartao of oCartoesDaPessoa) {

                    let oFaturasCartao = oFaturas.filter(fatura => fatura.Cartao_ID == oCartao.ID);

                    for (let oFatura of oFaturasCartao) {

                        oCartao.DiaVencimento = Number(oCartao.DiaVencimento);

                        if ((oCartao.DiaVencimento - oDia) <= 3) {

                            let oTransacoes = await SELECT.from(Transacao).where({ Fatura_ID: oFatura.ID });

                            if (oTransacoes.length > 0) {

                                try {

                                    if (!oPessoa.Imagem) {

                                        const tx = cds.transaction();

                                        let oImagemPessoa = await tx.run(SELECT.one.from(Pessoa).columns('Imagem', 'TipoImagem').where({
                                            ID: oPessoa.ID
                                        }));

                                        if (oImagemPessoa.Imagem) {

                                            let oImagemBuffer = await this.ReadableParaBuffer(oImagemPessoa.Imagem);

                                            const oExtensao = oImagemPessoa.TipoImagem.split("/")[1];

                                            //const oCaminhoImagem = path.join(__dirname, `${oPessoa.Nome}_.${oExtensao}`);

                                            // Salva o buffer no disco como um arquivo de imagem
                                            //fs.writeFileSync(oCaminhoImagem, oImagemBuffer);

                                            oPessoa.Imagem = oImagemBuffer;
                                            //oPessoa.CaminhoImagem = oCaminhoImagem;
                                            oPessoa.ExtensaoImagem = oExtensao;

                                        }

                                    }

                                } catch (error) {
                                    console.log("erro: " + error);
                                    return error;
                                }

                                try {

                                    const tx = cds.transaction();

                                    let oImagemCartao = await tx.run(SELECT.one.from(Cartao).columns('Imagem', 'TipoImagem').where({
                                        ID: oCartao.ID
                                    }));

                                    if (oImagemCartao.Imagem) {

                                        let oImagemBuffer = await this.ReadableParaBuffer(oImagemCartao.Imagem);

                                        oCartao.Imagem = oImagemBuffer;

                                    }

                                } catch (error) {
                                    console.log("erro: " + error);
                                }

                                let erro = await this.enviarEmail(oPessoa, oCartao, oFatura, oTransacoes, true);


                                if (erro) {
                                    return erro;
                                }

                            }

                        }

                    }

                }

            }

        } catch (erro) {
            console.log("Erro:" + erro)
            return erro;
        }

    }

    async enviarPrevisaoDetalhadaPrincipal(req) {

        const { pessoa, mes, ano } = req.data;

        if (!process.env.SMTPAddres) {
            return
        }

        try {

            const { Pessoa, Cartao, Fatura, Transacao } = this.entities

            const oPessoa = await SELECT.one.from(Pessoa).columns('ID', 'Nome', 'Email').where({
                Email: { '!=': null },
                ID: pessoa
            });

            if (!oPessoa) {
                return;
            }

            const oCartoes = await SELECT.from(Cartao).columns('ID', 'NomeCartao', 'DiaVencimento', 'Pessoa_ID').where({
                Pessoa_ID: pessoa
            });

            if (!oCartoes) {
                return;
            }

            const oCartoesIds = oCartoes.map((oCartao) => oCartao.ID);

            let oFaturas = await SELECT.from(Fatura).where({
                Ano: ano,
                Mes: mes,
                Cartao_ID: oCartoesIds
            });

            if (!oFaturas.length > 0) {
                return;
            }


            let oCartoesDaPessoa = oCartoes.filter(cartao => cartao.Pessoa_ID == oPessoa.ID);

            for (let oCartao of oCartoesDaPessoa) {

                let oFaturasCartao = oFaturas.filter(fatura => fatura.Cartao_ID == oCartao.ID);

                for (let oFatura of oFaturasCartao) {

                    oCartao.DiaVencimento = Number(oCartao.DiaVencimento);

                    let oTransacoes = await SELECT.from(Transacao).where({ Fatura_ID: oFatura.ID });

                    if (oTransacoes.length > 0) {

                        try {

                            if (!oPessoa.Imagem) {

                                const tx = cds.transaction();

                                let oImagemPessoa = await tx.run(SELECT.one.from(Pessoa).columns('Imagem', 'TipoImagem').where({
                                    ID: oPessoa.ID
                                }));

                                if (oImagemPessoa.Imagem) {

                                    let oImagemBuffer = await this.ReadableParaBuffer(oImagemPessoa.Imagem);

                                    const oExtensao = oImagemPessoa.TipoImagem.split("/")[1];
                                    oPessoa.Imagem = oImagemBuffer;
                                    oPessoa.ExtensaoImagem = oExtensao;

                                }

                            }

                        } catch (error) {
                            console.log("erro: " + error);
                            return error;
                        }

                        try {

                            const tx = cds.transaction();

                            let oImagemCartao = await tx.run(SELECT.one.from(Cartao).columns('Imagem', 'TipoImagem').where({
                                ID: oCartao.ID
                            }));

                            if (oImagemCartao.Imagem) {

                                let oImagemBuffer = await this.ReadableParaBuffer(oImagemCartao.Imagem);

                                oCartao.Imagem = oImagemBuffer;

                            }

                        } catch (error) {
                            console.log("erro: " + error);
                        }

                        let erro = await this.enviarEmail(oPessoa, oCartao, oFatura, oTransacoes, false);

                        if (erro) {
                            return erro;
                        }

                    }

                }

            }

        } catch (erro) {
            console.log("Erro:" + erro)
            return erro;
        }

    }


    async inserirCategoriaPrincipal(req, next) {

        try {
            const { Pessoa, Categoria } = this.entities;
            const { ID, Pessoa_ID, Nome, Usuario } = req.data;

            if (!Usuario) {
                req.reject(400, `Campo [Usuario] é necessário`);
            }

            let oPessoa = await SELECT.one.columns("ID", "createdBy").from(Pessoa).where({ ID: Pessoa_ID });

            // Verifica se a pessoa existe
            if (!oPessoa) {
                req.reject(400, `Pessoa não encontrada.`);
            }

            //Verifica se o usuário está autenticado e se ele é o criador da pessoa
            if (oPessoa.createdBy !== Usuario) {
                req.reject(400, `Não é possível editar algo que você tem acesso apenas compartilhado`);
            }

            // Cria um novo cartão com os dados fornecidos
            const novaCategoria = {
                ID: ID,
                Pessoa_ID: Pessoa_ID,
                Nome: Nome,
            };

            // Insere o novo cartão no banco de dados
            await INSERT.into(Categoria).entries([novaCategoria]);

            return {
                sucesso: true
            }

        } catch (erro) {
            return {
                "erro": erro
            }
        }

    }


    async modificarCategoriaPrincipal(req, next) {

        try {
            const { Categoria } = this.entities;
            const { ID, Nome, Usuario } = req.data;

            if (!Usuario) {
                req.reject(400, `Campo [Usuario] é necessário`);
            }

            let oCategoria = await SELECT.one.columns("ID", "createdBy").from(Categoria).where({ ID: ID });

            // Verifica se a pessoa existe
            if (!oCategoria) {
                // Reject the request with a 400 status code and an error message indicating that the category was not found.
                req.reject(400, `Categoria não encontrada.`);

            };

            if (oCategoria.createdBy !== Usuario) {
                req.reject(400, `Não é possível editar algo que você tem acesso apenas compartilhado`);
            }

            const ajusteCategoria = {
                ID: ID,
                Nome: Nome,
            };

            // Insere o novo cartão no banco de dados
            await UPDATE(Categoria, ajusteCategoria.ID).with(ajusteCategoria);

            return {
                sucesso: true
            }

        } catch (erro) {
            return {
                "erro": erro
            }
        }

    }


    async inserirCartaoPrincipal(req, next) {

        try {
            const { Pessoa, Cartao } = this.entities;
            const { ID, Pessoa_ID, NomeCartao, Limite, Moeda, DiaVencimento, DiaFechamento, Usuario } = req.data;

            if (!Usuario) {
                req.reject(400, `Campo [Usuario] é necessário`);
            }

            let oPessoa = await SELECT.one.columns("ID", "createdBy", "Moeda_code").from(Pessoa).where({ ID: Pessoa_ID });

            // Verifica se a pessoa existe
            if (!oPessoa) {
                req.reject(400, `Pessoa não encontrada.`);
            }

            //Verifica se o usuário está autenticado e se ele é o criador da pessoa
            if (oPessoa.createdBy !== Usuario) {
                req.reject(400, `Não é possível editar algo que você tem acesso apenas compartilhado`);
            }

            // Valida se o limite do cartão é maior que zero
            if (Limite <= 0) {
                req.reject(400, `O limite do cartão deve ser maior que zero.`);
            }

            // Verifica se a moeda do cartão é diferente da moeda fornecida
            // Se for diferente, rejeita a requisição com um erro informando que a moeda não pode ser modificada
            if (oPessoa.Moeda_code != Moeda) {
                req.reject(400, `Moeda não pode ser diferente da moeda definida em pessoa.`);
            }

            // Cria um novo cartão com os dados fornecidos
            const novoCartao = {
                ID: ID,
                Pessoa_ID: Pessoa_ID,
                NomeCartao: NomeCartao,
                Limite: Limite,
                Moeda_code: Moeda,
                DiaVencimento: DiaVencimento,
                DiaFechamento: DiaFechamento,
            };

            // Insere o novo cartão no banco de dados
            await INSERT.into(Cartao).entries([novoCartao]);

            return {
                sucesso: true
            }

        } catch (erro) {
            return {
                "erro": erro
            }
        }

    }

    async modificarCartaoPrincipal(req, context) {

        try {
            // Removed the try block and added error handling directly in the function
            const { Cartao } = this.entities;
            const { ID, NomeCartao, Limite, Moeda, DiaVencimento, DiaFechamento, Usuario } = req.data;

            let oCartao = await SELECT.one.columns("ID", "createdBy", "Moeda_code").from(Cartao).where({ ID: ID });

            if (!Usuario) {
                req.reject(400, `Campo [Usuario] é necessário`);
            }

            // Verifica se a pessoa existe
            if (!oCartao) {
                req.reject(400, `Cartão não encontrada.`);
            }

            // Verifica se o usuário está autenticado e se ele é o criador da pessoa
            if (oCartao.createdBy !== Usuario) {
                req.reject(400, `Não é possível editar algo que você tem acesso apenas compartilhado`);
            }

            // Valida se o limite do cartão é maior que zero
            if (Limite <= 0) {
                req.reject(400, `O limite do cartão deve ser maior que zero.`);
            }

            // Verifica se a moeda do cartão é diferente da moeda fornecida
            // Se for diferente, rejeita a requisição com um erro informando que a moeda não pode ser modificada
            if (oCartao.Moeda_code != Moeda) {
                req.reject(400, `Moeda não pode ser modificada.`);
            }

            // Cria um novo cartão com os dados fornecidos
            const ajusteCartao = {
                ID: ID,
                NomeCartao: NomeCartao,
                Limite: Limite,
                Moeda_code: Moeda,
                DiaVencimento: DiaVencimento,
                DiaFechamento: DiaFechamento,
            };

            // Insere o novo cartão no banco de dados
            await UPDATE(Cartao, ajusteCartao.ID).with(ajusteCartao);

            return {
                sucesso: true
            }

        } catch (erro) {
            return {
                "erro": erro
            }
        }

    }

    criarInstanciaEmail() {

        return nodemailer.createTransport({
            host: process.env.SMTPHost,
            port: 587, // TLS
            secure: false, // Use false para TLS
            auth: {
                user: process.env.SMTPAddres,
                pass: process.env.SMTPKey
            }
        });

    }

    async enviarEmail(pessoa, cartao, fatura, transacoes, atualizaFatura) {

        try {

            let oCaminhoHTML;

            if (atualizaFatura) {
                oCaminhoHTML = path.join(__dirname, 'template.html');
            } else {
                oCaminhoHTML = path.join(__dirname, 'templatePrevisao.html');
            }

            const oHtmlTemplate = fs.readFileSync(oCaminhoHTML, "utf-8");

            const oLogoCaminho = path.join(__dirname, 'logo.png');
            const oLogo = fs.readFileSync(oLogoCaminho);

            const oTemplateHTML = handlebars.compile(oHtmlTemplate);
            const oConteudohtml = oTemplateHTML({
                nome: pessoa.Nome,
                nomecartao: cartao.NomeCartao,
                ano: fatura.Ano,
                mes: fatura.Mes,
                valor: fatura.ValorTotal,
                moeda: fatura.Moeda_code,
                datavencimento: `${this.adicionarZeroEsquerda(cartao.DiaVencimento)}/${this.adicionarZeroEsquerda(fatura.Mes)}/${fatura.Ano}`,
            });

            let oCategoriasDescricao = await this.recuperaCategoriasPrincipal({ data: { fatura: fatura.ID } });

            let oPDFBuffer = await this.gerarPDF(oLogo, pessoa, fatura, cartao, transacoes, oCategoriasDescricao);

            let oArquivos = []

            if (oLogo) {
                oArquivos.push({ conteudo: oLogo, nome: `logo.png`, cid: 'logo' })
            }

            if (oPDFBuffer) {
                oArquivos.push({ conteudo: oPDFBuffer, nome: `${cartao.NomeCartao}.pdf`, cid: '' })
            }

            if (pessoa.Imagem) {
                oArquivos.push({ conteudo: pessoa.Imagem, nome: `${pessoa.Nome}_.${pessoa.ExtensaoImagem}`, cid: 'imagemPessoa' })
            }

            oArquivos = oArquivos.map((arquivo) => (
                {
                    filename: arquivo.nome,
                    content: arquivo.conteudo,
                    cid: arquivo.cid
                }));

            let oSubject;

            if (atualizaFatura) {
                oSubject = `Fatura do Cartão ${cartao.NomeCartao} - ${this.adicionarZeroEsquerda(fatura.Mes)}/${fatura.Ano}`;
            } else {
                oSubject = `Previsão/Detalhamento da fatura do Cartão ${cartao.NomeCartao} - ${this.adicionarZeroEsquerda(fatura.Mes)}/${fatura.Ano}`
            }

            const oOpcoesEmail = {
                from: `"Gestor de Gastos" <${process.env.SMTPAddres}>`,
                to: pessoa.Email,
                subject: oSubject,
                html: oConteudohtml,
                attachments: oArquivos
            };

            try {

                await this.processaEnviarEmail(oOpcoesEmail, fatura.ID, atualizaFatura);

            } catch (error) {
                console.log("Erro" + error)
                return error;
            }

        } catch (error) {
            console.error("Erro ao enviar e-mail:", error);
            return error;
        }

    }

    async processaEnviarEmail(conteudo, fatura, atualizaFatura) {

        try {

            if (!process.EmailAviso) {
                process.EmailAviso = this.criarInstanciaEmail();
                await process.EmailAviso.verify();
                console.log('Conexão com o servidor SMTP bem-sucedida.');
            }

            return new Promise((resolve, reject) => {
                process.EmailAviso.sendMail(conteudo).then(async function (ok) {
                    console.log('Email enviado com sucesso:');

                    if (atualizaFatura) {
                        await this.atualizaAvisoEnviadoFatura(fatura);
                    }

                    await this.sleep(5000);

                    resolve(ok)
                }.bind(this)).catch(function (erro) {
                    console.log('Erro ao enviar email:' + erro);
                    reject(erro)
                }.bind(this));
            });

        } catch (erro) {

            console.log('Erro ao enviar email:' + erro);

        }
    }

    async gerarPDF(logo, pessoa, fatura, cartao, transacoes, categoriasDescricao) {
        return await new Promise((resolve, reject) => {
            try {
                const doc = new PDFDocument({
                    size: "A4",
                    margin: 40,
                });

                const oCorPrimaria = "#085caf";
                const oCorDoTexto = "#333333";

                const oBufferArray = [];
                const oBufferStream = new PassThrough();

                oBufferStream.on('data', (chunk) => oBufferArray.push(chunk));
                oBufferStream.on('end', () => resolve(Buffer.concat(oBufferArray)));
                oBufferStream.on('error', (err) => reject(`Erro no stream: ${err}`));

                doc.pipe(oBufferStream);

                const desenharCabecalho = (paginaInicial = false) => {
                    if (!paginaInicial) doc.addPage();

                    // Cabeçalho estilizado com imagem à esquerda
                    doc
                        .rect(0, 0, doc.page.width, 80)
                        .fill(oCorPrimaria);

                    if (logo) {
                        const diamentro = 60;
                        const x = 40;
                        const y = 10;
                        doc
                            .save()
                            .circle(x + diamentro / 2, y + diamentro / 2, diamentro / 2)
                            .clip()
                            .image(logo, x, y, { width: diamentro, height: diamentro })
                            .restore();
                    }

                    doc
                        .fillColor("white")
                        .fontSize(30)
                        .text("Gestor de Gastos", 40, 30, { align: "center" });

                    doc.moveDown(2);
                };

                const desenharRodape = () => {

                    let posicaoVertical = doc.page.height - 70;

                    doc
                        .rect(0, posicaoVertical, doc.page.width, 80)
                        .fill(oCorPrimaria)

                };

                const desenharResumoFatura = () => {
                    const meses = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];
                    const mesDescricao = meses[fatura.Mes - 1];

                    if (cartao.Imagem) {
                        const diamentro = 120;
                        const x = (doc.page.width - diamentro) / 2;
                        const y = 100;
                        doc
                            .save()
                            .circle(x + diamentro / 2, y + diamentro / 2, diamentro / 2)
                            .clip()
                            .image(cartao.Imagem, x, y, { width: diamentro, height: diamentro })
                            .restore();
                    }

                    doc.moveDown(3);
                    doc
                        .fillColor(oCorDoTexto)
                        .fontSize(22)
                        .text(`${pessoa.Nome}, a sua fatura do cartão ${cartao.NomeCartao}`, { align: "center" });

                    doc.moveDown(2);
                    doc
                        .rect(40, doc.y, doc.page.width - 80, 100)
                        .strokeColor(oCorPrimaria)
                        .lineWidth(2)
                        .stroke();

                    doc
                        .fillColor(oCorDoTexto)
                        .fontSize(20)
                        .text("Total da sua fatura:", 60, doc.y + 10, { align: "left" });

                    doc
                        .fillColor(oCorPrimaria)
                        .fontSize(45)
                        .text(`${fatura.ValorTotal} ${fatura.Moeda_code}`, { align: "center" });

                    doc.moveDown(2);

                    doc
                        .fillColor(oCorDoTexto)
                        .fontSize(20)
                        .text(`Este é o valor que você precisa pagar nesse mês.`, 60, doc.y, { align: "left" });

                    doc
                        .fillColor(oCorDoTexto)
                        .fontSize(16)
                        .text(`Mês: ${mesDescricao}`, { align: "left" })
                        .text(`Ano: ${fatura.Ano}`, { align: "left" })
                        .text(`Data de Vencimento: ${this.adicionarZeroEsquerda(cartao.DiaVencimento)}/${this.adicionarZeroEsquerda(fatura.Mes)}/${fatura.Ano}`, { align: "left" });

                    doc
                        .moveDown(2)
                        .fillColor("black")
                        .fontSize(20)
                        .text("Fatura gerada automaticamente", 45, doc.y, { align: "center" });;

                };

                const desenharResumoCategorias = () => {

                    doc
                        .fillColor(oCorPrimaria)
                        .fontSize(20)
                        .text("Gastos por categoria", doc.page.width / 2 - 100, doc.y, { width: 200, align: "center", underline: false });

                    // Define as posições fixas das colunas
                    const posicoes = {
                        imagem: 60,
                        nome: 90,
                        totalcategoria: 280,
                        porcentagem: 440,
                    };

                    doc.moveDown(2);

                    // Cabeçalho da tabela
                    let posicaoVertical = doc.y;

                    doc
                        .fontSize(16)
                        .text("", posicoes.imagem, posicaoVertical, { width: 100 })
                        .text("Nome", posicoes.nome, posicaoVertical, { width: 200 })
                        .text("Total da Categoria", posicoes.totalcategoria, posicaoVertical, { width: 150 })
                        .text("Porcentagem", posicoes.porcentagem, posicaoVertical, { width: 100 });

                    posicaoVertical += 25; // Espaço após o cabeçalho

                    // Adiciona uma linha horizontal abaixo do cabeçalho
                    doc
                        .moveTo(60, posicaoVertical - 6)
                        .lineTo(560, posicaoVertical - 6)
                        .strokeColor(oCorPrimaria)
                        .lineWidth(1)
                        .stroke();

                    // Renderiza as transações em formato de tabela
                    categoriasDescricao.Categorias.forEach((categoria, index) => {

                        doc.moveDown(2);

                        posicaoVertical += 15

                        if (categoria.Imagem) {
                            const diamentro = 26;
                            const x = posicoes.imagem;
                            const y = posicaoVertical - 10;
                            doc
                                .save()
                                .circle(x + diamentro / 2, y + diamentro / 2, diamentro / 2)
                                .clip()
                                .image(categoria.Imagem, x, y, { width: diamentro, height: diamentro })
                                .restore();
                        }

                        doc
                            .fillColor(oCorDoTexto)
                            .fontSize(12)
                            .text(categoria.Nome, posicoes.nome, posicaoVertical, { width: 200 })
                            .text(`${categoria.TotalCategoria} ${categoriasDescricao.Moeda}`, posicoes.totalcategoria, posicaoVertical, { width: 130, align: "right" })
                            .text(`${Number(categoria.Porcentagem).toFixed(2)}%`, posicoes.porcentagem, posicaoVertical, { width: 95, align: "right" });

                        // Adiciona uma linha horizontal abaixo de cada transação
                        posicaoVertical += 25;
                        doc
                            .moveTo(60, posicaoVertical - 5)
                            .lineTo(560, posicaoVertical - 5)
                            .strokeColor("#CCCCCC")
                            .lineWidth(0.5)
                            .stroke();

                        if ((index + 1) % 15 === 0) { // Adiciona nova página se necessário
                            desenharRodape();
                            desenharCabecalho();
                            posicaoVertical = doc.y + 20; // Reinicia a posição vertical na nova página
                        }
                    });

                };

                const desenharTransacoes = () => {
                    // Centraliza o título
                    doc
                        .fillColor(oCorPrimaria)
                        .fontSize(20)
                        .text("Gastos da Fatura", doc.page.width / 2 - 100, doc.y, { width: 200, align: "center", underline: false });

                    doc.moveDown(1);

                    // Centraliza o título
                    doc
                        .fillColor(oCorPrimaria)
                        .fontSize(18)
                        .text(`Quantidade de gastos totais: ${transacoes.length}`, doc.page.width / 2 - 100, doc.y, { width: 200, align: "center", underline: false });

                    doc.moveDown(1);

                    // Ordena as transações pela data
                    transacoes.sort((a, b) => new Date(a.Data) - new Date(b.Data));

                    // Define as posições fixas das colunas
                    const posicoes = {
                        data: 60,
                        descricao: 140,
                        categoria: 340,
                        parcela: 440,
                        valor: 460,
                    };

                    // Cabeçalho da tabela
                    let posicaoVertical = doc.y;

                    doc
                        .fontSize(16)
                        .text("Data", posicoes.data, posicaoVertical, { width: 100 })
                        .text("Descrição", posicoes.descricao, posicaoVertical, { width: 200 })
                        .text("Categoria", posicoes.categoria, posicaoVertical, { width: 100 })
                        .text("Parcela", posicoes.parcela, posicaoVertical, { width: 100 })
                        .text("Valor", posicoes.valor, posicaoVertical, { width: 100, align: "right" });

                    posicaoVertical += 20; // Espaço após o cabeçalho

                    // Adiciona uma linha horizontal abaixo do cabeçalho
                    doc
                        .moveTo(60, posicaoVertical - 6)
                        .lineTo(560, posicaoVertical - 6)
                        .strokeColor(oCorPrimaria)
                        .lineWidth(1)
                        .stroke();

                    // Renderiza as transações em formato de tabela
                    transacoes.forEach((transacao, index) => {
                        doc.moveDown(2);
                        const oDataGasto = new Date(`${transacao.Data}T00:00:00`);
                        const oAnoTransacao = oDataGasto.getFullYear();
                        const oMesTransacao = String(oDataGasto.getMonth() + 1).padStart(2, "0");
                        const oDiaTransacao = String(oDataGasto.getDate()).padStart(2, "0");

                        let oCategoria = categoriasDescricao.Categorias.filter(categoria => categoria.ID == transacao.Categoria_ID);

                        if (oCategoria.length > 0) {
                            oCategoria = oCategoria[0].Nome;
                        } else {
                            oCategoria = "Sem categoria";
                        }

                        doc
                            .fillColor(oCorDoTexto)
                            .fontSize(12)
                            .text(`${oDiaTransacao}/${oMesTransacao}/${oAnoTransacao}`, posicoes.data, posicaoVertical, { width: 100 })
                            .text(transacao.Descricao, posicoes.descricao, posicaoVertical, { width: 200 })
                            .text(oCategoria, posicoes.categoria, posicaoVertical, { width: 100 })
                            .text(`${transacao.Parcela} de ${transacao.ParcelasTotais}`, posicoes.parcela, posicaoVertical, { width: 100 })
                            .text(`${transacao.Valor} ${transacao.Moeda_code}`, posicoes.valor, posicaoVertical, { width: 100, align: "right" });

                        // Adiciona uma linha horizontal abaixo de cada transação
                        posicaoVertical += 15;
                        doc
                            .moveTo(60, posicaoVertical - 5)
                            .lineTo(560, posicaoVertical - 5)
                            .strokeColor("#CCCCCC")
                            .lineWidth(0.5)
                            .stroke();

                        if ((index + 1) % 30 === 0) { // Adiciona nova página se necessário
                            desenharRodape();
                            desenharCabecalho();
                            posicaoVertical = doc.y + 20; // Reinicia a posição vertical na nova página
                        }
                    });

                };

                desenharCabecalho(true);
                desenharResumoFatura();
                desenharRodape();

                if (categoriasDescricao.Categorias.length > 0) {
                    desenharCabecalho();
                    desenharResumoCategorias();
                    desenharRodape();
                }

                desenharCabecalho();
                desenharTransacoes();
                desenharRodape();

                doc.end();

            } catch (erro) {
                console.log(erro);
                reject(`Erro ao gerar PDF: ${erro}`);
            }
        });
    }

    ReadableParaBuffer(readableStream) {
        return new Promise((resolve, reject) => {
            const chunks = [];
            readableStream.on('data', chunk => chunks.push(chunk));
            readableStream.on('end', (ok) => resolve(Buffer.concat(chunks)));
            readableStream.on('error', error => reject(error));
        });
    };

    async recuperaCategoriasParaGastoTotalPrincipal(req, next) {

        const { Categoria, Cartao, Fatura, Transacao } = this.entities;

        try {

            let { pessoa, ano, mes } = req.data

            let oDate = new Date().toLocaleString("pt-BR", { timeZone: "America/Sao_Paulo" });
            oDate = oDate.replaceAll(",", " ");
            let [oDia, oMes, oAno] = oDate.split(" ")[0].split("/");

            oDia = Number(oDia);
            oMes = Number(oMes);
            oAno = Number(oAno);

            if (ano) {
                oAno = Number(ano);
                oMes = Number(mes)
            }

            let oCategorias = []
            let oCartoes = []
            let oFaturas = []
            let oTotalDeGastos = {}

            if (pessoa) {

                oCategorias = await SELECT.columns('ID', 'Nome', 'Imagem', 'TipoImagem').from(Categoria).where({ Pessoa_ID: pessoa });

                oCartoes = await SELECT.columns('ID').from(Cartao).where({ Pessoa_ID: pessoa });

                // Primeira consulta: Buscando todas as faturas para o ano >= oAno
                oFaturas = await SELECT.columns('ID', 'Ano', 'Mes', 'ValorTotal', 'Moeda_code', 'Cartao_ID')
                    .from(Fatura)
                    .where({
                        Ano: { '>=': oAno },
                        Cartao_ID: { 'IN': oCartoes.map(f => f.ID) }
                    });

                // Agora, fazemos a filtragem e a soma no código
                oTotalDeGastos = {
                    ValorTotal: 0,
                    Moeda_code: null
                };

                oFaturas = oFaturas.filter(fatura => fatura.Ano > oAno || fatura.Ano == oAno && fatura.Mes >= oMes);

                // Usando reduce para calcular o total de gastos
                oTotalDeGastos = oFaturas.reduce((acc, fatura) => {
                    // Soma o ValorTotal
                    acc.ValorTotal = Number(acc.ValorTotal);
                    acc.ValorTotal += Number(fatura.ValorTotal);

                    // Atribui Moeda_code caso ainda não tenha sido atribuído
                    if (!acc.Moeda_code) {
                        acc.Moeda_code = fatura.Moeda_code;
                    }

                    return acc;
                }, { ValorTotal: 0, Moeda_code: null });

            }

            const totalPessoa = oTotalDeGastos?.ValorTotal || 0;
            const oMoeda = oTotalDeGastos?.Moeda_code || 'BRL';

            for (let categoria of oCategorias) {

                if (categoria.Imagem) {
                    let oBuffer = await this.ReadableParaBuffer(categoria.Imagem);
                    categoria.Imagem = `data:${categoria.TipoImagem};base64,${oBuffer.toString("base64")}`
                }

                categoria.TotalCategoria = await
                    SELECT.one('coalesce(sum(Valor), 0) as TotalCategoria') // Soma dos valores das transações
                        .from(Transacao)
                        .where({ Fatura_ID: { 'IN': oFaturas.map(f => f.ID) }, Categoria_ID: categoria.ID });

                categoria.TotalCategoria = categoria.TotalCategoria.TotalCategoria;

                categoria.Total = totalPessoa;

            }

            // Calculando a porcentagem de cada categoria em relação ao total de gastos
            let result = oCategorias.map(categoria => {
                const totalCategoria = categoria.TotalCategoria || 0;

                return {
                    ID: categoria.ID,
                    Nome: categoria.Nome,
                    Imagem: categoria.Imagem,
                    TotalCategoria: totalCategoria,
                    Porcentagem: totalPessoa > 0 ? (totalCategoria / totalPessoa) * 100 : 0
                };

            });

            result = result.filter(categoria => categoria.TotalCategoria != 0);

            return {
                Total: totalPessoa,
                Moeda: oMoeda,
                Categorias: result
            };

        } catch (erro) {
            return {
                erro: erro
            }
        }

    }

    async recuperaCategoriasPrincipal(req, next) {

        const { Categoria, Cartao, Fatura, Transacao } = this.entities;

        try {

            let { pessoa, cartao, fatura, mes, ano } = req.data

            let oDate = new Date().toLocaleString("pt-BR", { timeZone: "America/Sao_Paulo" });
            oDate = oDate.replaceAll(",", " ");
            let [oDia, oMes, oAno] = oDate.split(" ")[0].split("/");

            oDia = Number(oDia);
            oMes = Number(oMes);
            oAno = Number(oAno);

            if (mes) {
                oMes = Number(mes);
                oAno = Number(ano);
            }

            let oCategorias = []
            let oCartoes = []
            let oFaturas = []
            let oTotalDeGastos = {}

            if (pessoa) {

                oCategorias = await SELECT.columns('ID', 'Nome', 'Imagem', 'TipoImagem').from(Categoria).where({ Pessoa_ID: pessoa });

                if (cartao) {
                    oCartoes.push({ ID: cartao });
                } else {
                    oCartoes = await SELECT.columns('ID').from(Cartao).where({ Pessoa_ID: pessoa });
                }

                oFaturas = await SELECT.columns('ID').from(Fatura).where({
                    Ano: oAno,
                    Mes: oMes,
                    Cartao_ID: { 'IN': oCartoes.map(f => f.ID) }
                })

                oTotalDeGastos = await SELECT.one`coalesce (sum (ValorTotal),0) as ValorTotal, Moeda_code`.from(Fatura)
                    .where({
                        Ano: oAno,
                        Mes: oMes,
                        Cartao_ID: { 'IN': oCartoes.map(f => f.ID) }
                    }).groupBy("Moeda_code");

            } else if (cartao) {

                let oCartao = await SELECT.one.columns("Pessoa_ID").from(Cartao).where({ ID: cartao });

                if (oCartao) {

                    oCategorias = await SELECT.columns('ID', 'Nome', 'Imagem', 'TipoImagem').from(Categoria).where({ Pessoa_ID: oCartao.Pessoa_ID });

                    oCartoes.push({ ID: cartao });

                    oFaturas = await SELECT.columns('ID').from(Fatura).where({
                        Ano: oAno,
                        Mes: oMes,
                        Cartao_ID: { 'IN': oCartoes.map(f => f.ID) }
                    })

                    oTotalDeGastos = await SELECT.one`coalesce (sum (ValorTotal),0) as ValorTotal, Moeda_code`.from(Fatura)
                        .where({
                            Ano: oAno,
                            Mes: oMes,
                            Cartao_ID: { 'IN': oCartoes.map(f => f.ID) }
                        }).groupBy("Moeda_code");

                }

            } else {

                let oFatura = await SELECT.one.columns("ID", "ValorTotal", "Moeda_code", "Cartao_ID").from(Fatura).where({ ID: fatura });

                if (oFatura) {

                    oFaturas.push(oFatura)

                    oTotalDeGastos.ValorTotal = oFatura.ValorTotal;
                    oTotalDeGastos.Moeda_code = oFatura.Moeda_code;

                    let oCartao = await SELECT.one.columns("Pessoa_ID").from(Cartao).where({ ID: oFatura.Cartao_ID });

                    if (oCartao) {

                        oCategorias = await SELECT.columns('ID', 'Nome', 'Imagem', 'TipoImagem').from(Categoria).where({ Pessoa_ID: oCartao.Pessoa_ID });

                    }
                }

            }

            const totalPessoa = oTotalDeGastos?.ValorTotal || 0;
            const oMoeda = oTotalDeGastos?.Moeda_code || 'BRL';

            for (let categoria of oCategorias) {

                if (categoria.Imagem) {
                    let oBuffer = await this.ReadableParaBuffer(categoria.Imagem);
                    categoria.Imagem = `data:${categoria.TipoImagem};base64,${oBuffer.toString("base64")}`
                }

                categoria.TotalCategoria = await
                    SELECT.one('coalesce(sum(Valor), 0) as TotalCategoria') // Soma dos valores das transações
                        .from(Transacao)
                        .where({ Fatura_ID: { 'IN': oFaturas.map(f => f.ID) }, Categoria_ID: categoria.ID });

                categoria.TotalCategoria = categoria.TotalCategoria.TotalCategoria;

                categoria.Total = totalPessoa;

            }

            // Calculando a porcentagem de cada categoria em relação ao total de gastos
            let result = oCategorias.map(categoria => {
                const totalCategoria = categoria.TotalCategoria || 0;

                return {
                    ID: categoria.ID,
                    Nome: categoria.Nome,
                    Imagem: categoria.Imagem,
                    TotalCategoria: totalCategoria,
                    Porcentagem: totalPessoa > 0 ? (totalCategoria / totalPessoa) * 100 : 0
                };

            });

            result = result.filter(categoria => categoria.TotalCategoria != 0);

            return {
                Total: totalPessoa,
                Moeda: oMoeda,
                Categorias: result
            };

        } catch (erro) {
            return {
                erro: erro
            }
        }

    }

    async recuperaTransacoesPorCategoriaPrincipal(req, next) {

        try {

            const { Fatura, Cartao, Transacao } = this.entities

            const { pessoa, categoria, total, mes, ano } = req.data;

            if (!pessoa) {
                return {
                    erro: "Sem Id de pessoa para verificar categoria"
                }
            }

            let oCartoes = await SELECT.columns('ID', 'NomeCartao', 'Imagem', 'TipoImagem', "Moeda_code").from(Cartao).where({ Pessoa_ID: pessoa });

            let oFaturas = []

            if (oCartoes.length > 0) {

                let oDate = new Date().toLocaleString("pt-BR", { timeZone: "America/Sao_Paulo" });
                oDate = oDate.replaceAll(",", " ");
                let [oDia, oMes, oAno] = oDate.split(" ")[0].split("/");

                oDia = Number(oDia);
                oMes = Number(oMes);
                oAno = Number(oAno);

                if (!total) {

                    if (mes) {
                        oMes = Number(mes);
                        oAno = Number(ano);
                    }

                    oFaturas = await SELECT.columns("ID", "Ano", "Mes", "Descricao", "Cartao_ID").from(Fatura).where({
                        Ano: oAno,
                        Mes: oMes,
                        Cartao_ID: { 'IN': oCartoes.map(f => f.ID) }
                    });

                } else {

                    if (mes) {
                        oMes = Number(mes);
                        oAno = Number(ano);
                    }

                    oFaturas = await SELECT.columns("ID", "Ano", "Mes", "Descricao", "Cartao_ID").from(Fatura).where({
                        Ano: { '>=': oAno },
                        Cartao_ID: { 'IN': oCartoes.map(f => f.ID) }
                    });

                    oFaturas = oFaturas.filter(fatura => fatura.Ano > oAno || fatura.Ano == oAno && fatura.Mes >= oMes);

                }

                let oTransacoes = await SELECT.columns("ID", "Data", "ValorTotal", "Valor", "ParcelasTotais", "Parcela", "Descricao", "Fatura_ID").from(Transacao).where({
                    Fatura_ID: { 'IN': oFaturas.map(f => f.ID) },
                    Categoria_ID: categoria
                })

                let oIDsFatura = oTransacoes.map(transacao => transacao.Fatura_ID);

                oIDsFatura = [...new Set(oIDsFatura)];

                oFaturas = oFaturas.filter(fatura => oIDsFatura.includes(fatura.ID));

                let oRetorno = {
                    ID: categoria,
                    Moeda: oCartoes[0].Moeda_code,
                    Cartoes: []
                }
                for (const cartao of oCartoes) {

                    let oFaturasCartao = oFaturas.filter(fatura => fatura.Cartao_ID == cartao.ID);

                    if (oFaturasCartao.length > 0) {

                        if (cartao.Imagem) {
                            let oBuffer = await this.ReadableParaBuffer(cartao.Imagem);
                            cartao.Imagem = `data:${cartao.TipoImagem};base64,${oBuffer.toString("base64")}`
                        }

                        let oCartaoRetorno = {
                            ID: cartao.ID,
                            NomeCartao: cartao.NomeCartao,
                            Imagem: cartao.Imagem,
                            Faturas: []
                        };

                        for (const fatura of oFaturasCartao) {

                            let oDescription = fatura.Descricao;

                            if (!fatura.Descricao) {
                                switch (fatura.Mes) {
                                    case 1:
                                        oDescription = `Janeiro`
                                        break;
                                    case 2:
                                        oDescription = `Fevereiro`
                                        break;
                                    case 3:
                                        oDescription = `Março`
                                        break;
                                    case 4:
                                        oDescription = `Abril`
                                        break;
                                    case 5:
                                        oDescription = `Maio`
                                        break;
                                    case 6:
                                        oDescription = `Junho`
                                        break;
                                    case 7:
                                        oDescription = `Julho`
                                        break;
                                    case 8:
                                        oDescription = `Agosto`
                                        break;
                                    case 9:
                                        oDescription = `Setembro`
                                        break;
                                    case 10:
                                        oDescription = `Outubro`
                                        break;
                                    case 11:
                                        oDescription = `Novembro`
                                        break;
                                    case 12:
                                        oDescription = `Dezembro`
                                        break;
                                    default:
                                        break;
                                }
                            }

                            let oFaturaRetorno = {
                                ID: fatura.ID,
                                Ano: fatura.Ano,
                                Mes: fatura.Mes,
                                Descricao: oDescription,
                                ValorTotal: 0.0,
                                Transacoes: []
                            }

                            let oTransacoesFatura = oTransacoes.filter(transacao => transacao.Fatura_ID == fatura.ID);

                            for (const transacao of oTransacoesFatura) {

                                oFaturaRetorno.ValorTotal += Number(transacao.Valor);
                                oFaturaRetorno.Transacoes.push(transacao);

                            }

                            oCartaoRetorno.Faturas.push(oFaturaRetorno);

                        }

                        oRetorno.Cartoes.push(oCartaoRetorno);

                    }

                }

                if (oRetorno.Cartoes.length > 0) {
                    return oRetorno;
                } else {
                    return {
                        erro: "Não há gastos para essa categoria"
                    }
                }

            }

        } catch (erro) {
            return {
                erro: erro
            }
        }

    }

    async recuperaFaturaCompletaPrincipal(req, next) {

        try {

            const { Cartao, Categoria } = this.entities

            const { pessoa, mes, ano } = req.data;

            if (!pessoa || !mes || !ano) {
                return {
                    erro: "Preencher campos obrigatórios"
                }
            }

            let oCartoes = await SELECT.columns(
                'ID',
                'NomeCartao',
                'Imagem',
                'TipoImagem').from(Cartao).where(
                    {
                        'Pessoa_ID': pessoa
                    }
                );

            let oCategorias = await SELECT.columns(
                'ID',
                'Imagem',
                'TipoImagem').from(Categoria).where(
                    {
                        'Pessoa_ID': pessoa 
                    } 
                ); 
  

            let oTransacoes = await SELECT.columns(
                'Fatura.Transacoes.ID as ID',
                'Fatura.Transacoes.Identificador as Identificador', 
                'Pessoa_ID', 
                'ID as Cartao_ID',
                'Fatura.ID as Fatura_ID',
                'Fatura.Transacoes.Categoria_ID as Categoria_ID',
                'Fatura.Transacoes.Data as Data',
                'Fatura.Transacoes.Valor as Valor',
                'Fatura.Transacoes.ValorTotal as ValorTotal',
                'Moeda',
                'Fatura.Transacoes.Parcela as Parcela',
                'Fatura.Transacoes.ParcelasTotais as ParcelasTotais',
                'Fatura.Transacoes.Descricao as Descricao').from(Cartao).where(
                    {
                        'Pessoa_ID': pessoa, 
                        'Fatura.Ano': ano,
                        'Fatura.Mes': mes
                    }
                ).orderBy([
                    { ref: ['ID'], sort: 'asc' },
                    { ref: ['Fatura', 'Transacoes', 'Categoria_ID'], sort: 'asc' }
                ]);

            oTransacoes.sort((a, b) => { 
                // 1️⃣ Ordena por Cartao_ID
                if (a.Cartao_ID < b.Cartao_ID) return -1;
                if (a.Cartao_ID > b.Cartao_ID) return 1;

                // 2️⃣ Se Cartao_ID for igual, ordena por Categoria_ID
                if (a.Categoria_ID < b.Categoria_ID) return -1;
                if (a.Categoria_ID > b.Categoria_ID) return 1;

                return 0;
            });

            let oRetorno;

            if (oTransacoes.length > 0) {


                let oDescription = '';

                switch (mes) {
                    case 1:
                        oDescription = `Janeiro`
                        break;
                    case 2:
                        oDescription = `Fevereiro`
                        break;
                    case 3:
                        oDescription = `Março`
                        break;
                    case 4:
                        oDescription = `Abril`
                        break;
                    case 5:
                        oDescription = `Maio`
                        break;
                    case 6:
                        oDescription = `Junho`
                        break;
                    case 7:
                        oDescription = `Julho`
                        break;
                    case 8:
                        oDescription = `Agosto`
                        break;
                    case 9:
                        oDescription = `Setembro`
                        break;
                    case 10:
                        oDescription = `Outubro`
                        break;
                    case 11:
                        oDescription = `Novembro`
                        break;
                    case 12:
                        oDescription = `Dezembro`
                        break;
                    default:
                        break;
                }

                // Usando reduce para calcular o total de gastos
                const oTotalDeGastos = oTransacoes.reduce((acc, transacao) => {

                    // Soma o ValorTotal
                    //acc.ValorTotal = Number(acc.Valor);
                    acc.ValorTotal += Number(transacao.Valor);

                    // Atribui Moeda_code caso ainda não tenha sido atribuído
                    if (!acc.Moeda_code) {
                        acc.Moeda_code = transacao.Moeda_code;
                    }

                    return acc;
                }, { ValorTotal: 0, Moeda_code: null });

                let oCartao = { ID: "" },
                    oCategoria = { ID: "" };

                for (let oTransacao of oTransacoes) {

                    if (oCartao?.ID != oTransacao.Cartao_ID) {

                        oCartao = oCartoes.filter(cartao => cartao.ID == oTransacao.Cartao_ID)[0];

                        if (oCartao?.Imagem instanceof Readable) {

                            let oImagemBuffer = await this.ReadableParaBuffer(oCartao.Imagem);

                            oCartao.Imagem = `data:${oCartao.TipoImagem};base64,${oImagemBuffer.toString("base64")}`

                        }

                    }

                    oTransacao.ImagemCartao = oCartao?.Imagem;
                    oTransacao.NomeCartao = oCartao.NomeCartao;

                    if (oCategoria?.ID != oTransacao.Categoria_ID) {

                        oCategoria = oCategorias.filter(categoria => categoria.ID == oTransacao.Categoria_ID)[0];

                        if (oCategoria?.Imagem instanceof Readable) {

                            let oImagemBuffer = await this.ReadableParaBuffer(oCategoria.Imagem);

                            oCategoria.Imagem = `data:${oCategoria.TipoImagem};base64,${oImagemBuffer.toString("base64")}`

                        }

                    }

                    oTransacao.ImagemCategoria = oCategoria?.Imagem;

                }

                oRetorno = {
                    Ano: ano,
                    Mes: mes,
                    DescricaoFatura: oDescription,
                    ValorTotal: oTotalDeGastos.ValorTotal.toFixed(2),
                    Moeda_code: oTotalDeGastos.Moeda_code,
                    Transacoes: oTransacoes.filter(transacao => transacao.ID != null)
                }

            }

            return oRetorno;

        } catch (erro) {
            return {
                erro
            }
        }

    }

    adicionarZeroEsquerda(numero) {
        // Converte o número para string e adiciona um zero à esquerda se necessário
        return numero >= 1 && numero <= 9 ? String(numero).padStart(2, '0') : String(numero);
    }

    gerarUUID() {
        return cds.utils.uuid();
    }
}

module.exports = GestaoGastos