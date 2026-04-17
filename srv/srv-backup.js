const cds = require('@sap/cds');
const fs = require('fs');
const path = require('path');
const axios = require('axios');
const nodemailer = require("nodemailer");
const handlebars = require("handlebars");
const PDFDocument = require("pdfkit");
const { PassThrough } = require('stream');
const { Readable } = require('stream');

// Ajuste o limite de tamanho de arquivo permitido (por exemplo, para 50MB)


class GestaoGastos extends cds.ApplicationService {

    init(req) {

        try {

            //Ações utilizados no ui5/fiori
            this.on("simulaPorMesAno", this.simulaPorMesAno);

            this.on("adicionarGasto", async (req, context) => { return await this.adicionarGastoPrincipal(req, context) });

            this.on("enviarAviso", this.enviarAviso);

            this.on("enviarPrevisaoDetalhada", this.enviarPrevisaoDetalhadaPrincipal);

            //Ações utilizadas em app ui5 e sapbuild apps
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


    async selecionaFaturasPorCartao(ID, Ano) {

        const { Fatura } = this.entities;

        const faturas = await SELECT.from(Fatura).where({
            Cartao_ID: ID,
            Ano: { '>=': Ano }
        });

        return faturas;

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

                                        const tx = cds.tx();

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

                                    const tx = cds.tx();

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

                                const tx = cds.tx();

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

                            const tx = cds.tx();

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