import { ApplicationService, entity, Request } from "@sap/cds";
import { TransactionRoute } from "./protocols";
import { oTransactionControllerFactory } from "@/factories/controllers/transaction";
import { Transaction, Transactions } from "@models/GestorDeGastos";
import { TransactionController } from "@/controllers/transaction";
import { BaseRouteImplementation } from "../base/implementation";
import { ServiceLocator } from "@/infrastructure/ServiceLocator";

export class TransactionRouteImplementation extends BaseRouteImplementation<Transaction> implements TransactionRoute {

    protected Controller: TransactionController;

    constructor(Controller: TransactionController) {

        super();
        this.Controller = Controller;

    }


    main(Service: ApplicationService): void {

        const { Transactions } = Service.entities;

        //Before
        Service.before("READ", Transactions?.drafts as entity, this.beforeRead.bind(this));
        Service.before("READ", Transactions as entity, this.beforeRead.bind(this));
        Service.before("CREATE", Transactions?.drafts as entity, this.beforeCreate.bind(this));
        Service.before("UPDATE", Transactions as entity, this.beforeUpdate.bind(this));
        Service.before("EDIT", Transactions as entity, this.beforeEdit.bind(this));
        Service.before("DELETE", Transactions as entity, this.beforeEdit.bind(this));

        //On
        Service.on("DELETE", Transactions as entity, this.onDelete.bind(this));

        //After
        Service.after("READ", Transactions as entity, this.afterRead.bind(this));
        Service.after("READ", Transactions?.drafts as entity, this.afterRead.bind(this));
        Service.after("CREATE", Transactions as entity, this.afterCreate.bind(this));
        Service.after("UPDATE", Transactions as entity, this.afterUpdate.bind(this));

    }


    private async afterRead(Transactions: Transactions | Transaction, Request: Request): Promise<void> {

        ServiceLocator.setRequest(Request);

        const oTransactions = Array.isArray(Transactions)
            ? Transactions
            : [Transactions];

        const oResult = await oTransactionControllerFactory.afterRead(oTransactions);

        if (oResult.status >= 400) {
            return this.returnRejectMessage(Request, oResult);
        }

        const oResultData = oResult.data as Transactions;

        oTransactions.forEach((row, i) => {
            Object.assign(row, oResultData[i]);
        });

    }


    private async afterCreate(Transactions: Transactions | Transaction, Request: Request): Promise<void> {

        ServiceLocator.setRequest(Request);

        const oTransactions = Array.isArray(Transactions)
            ? Transactions
            : [Transactions];

        const oResult = await oTransactionControllerFactory.afterCreate(oTransactions);

        if (oResult.status != 201) {
            return this.returnRejectMessage(Request, oResult);
        }

    }


    private async afterUpdate(Transactions: Transactions | Transaction, Request: Request): Promise<void> {

        ServiceLocator.setRequest(Request);

        const oTransactions = Array.isArray(Transactions)
            ? Transactions
            : [Transactions];

        const oResult = await oTransactionControllerFactory.afterUpdate(oTransactions);

        if (oResult.status != 204) {
            return this.returnRejectMessage(Request, oResult);
        }

    }


    private async onDelete(Request: Request, Next: Function): Promise<void> {

        ServiceLocator.setRequest(Request);

        const oTransaction: Transaction = {
            ...Request.data,
            ID: Request.data?.ID ?? Request.params[0]?.ID
        };

        const oResult = await this.Controller.onDelete(oTransaction);

        if (oResult.status != 204) {

            return this.returnRejectMessage(Request, oResult);

        }

        await Next();

    }


    // async beforeCreateUpdateDeleteTransacao(data, req) {

    //     const transacoes = Array.isArray(data) ? data : [data];

    //     const { Fatura, Transacao } = this.entities;

    //     for (const transacao of transacoes) {

    //         if (req.event == 'UPDATE' && 'Valor' in transacao) {

    //             const transacao_old = await SELECT.one.from(Transacao).where({ ID: transacao.ID });

    //             if (transacao_old) {
    //                 const oSoma = await SELECT.one`coalesce (sum (Valor),0) as hhValor`.from(Transacao.drafts).where({ Fatura_ID: transacao_created.Fatura_ID });
    //                 const oValorTotal = oSoma

    //                 await UPDATE(Fatura.drafts, transacao_old.Fatura_ID).with({ ValorTotal: oValorTotal })
    //             } else {

    //                 const transacao_created = await SELECT.one.from(Transacao.drafts).where({ ID: transacao.ID });

    //                 const oSoma = await SELECT.one`coalesce (sum (Valor),0) as Valor`.from(Transacao.drafts).where({ Fatura_ID: transacao_created.Fatura_ID });

    //                 const oValorTotal = oSoma.Valor;

    //                 await UPDATE(Fatura.drafts, transacao_created.Fatura_ID).with({ ValorTotal: oValorTotal })

    //             }

    //         } else if (data.event) {
    //             const transacao_old = await SELECT.one.from(Transacao.drafts).where({ ID: transacao.data.ID });

    //             const oSoma = await SELECT.one`coalesce (sum (Valor),0) as Valor`.from(Transacao.drafts).where({ Fatura_ID: transacao_old.Fatura_ID });

    //             const oValorTotal = oSoma.Valor - transacao_old.Valor;

    //             await UPDATE(Fatura.drafts, transacao_old.Fatura_ID).with({ ValorTotal: oValorTotal })

    //             const res = await req();//Avança próxima exclusão caso haja

    //             return res

    //         } else if (req.event == 'CREATE' && 'Valor' in transacao) {
    //             const fatura = await SELECT.one.from(Fatura.drafts).where({ ID: transacao.Fatura_ID });

    //             if (fatura) {
    //                 const oValorTotal = 0.0;
    //                 if (fatura.ValorTotal)
    //                     oValorTotal = fatura.ValorTotal + transacao.Valor;
    //                 else
    //                     oValorTotal = transacao.Valor

    //                 await UPDATE(Fatura.drafts, fatura.ID).with({ ValorTotal: oValorTotal })
    //             }
    //         }

    //     }

    //     return true;

    // }

}