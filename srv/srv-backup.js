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

            this.on("recuperaFaturaCompleta", async (req, next) => await this.recuperaFaturaCompletaPrincipal(req, next));

            return super.init();

        } catch (erro) {
            req.error(400, "Erro ao processar a consulta:" + erro);
        }
    }

    async sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    ReadableParaBuffer(readableStream) {
        return new Promise((resolve, reject) => {
            const chunks = [];
            readableStream.on('data', chunk => chunks.push(chunk));
            readableStream.on('end', (ok) => resolve(Buffer.concat(chunks)));
            readableStream.on('error', error => reject(error));
        });
    };


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