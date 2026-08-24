import cds from '@sap/cds';
import { oAuthRouter } from './srv/auth/authRouter';
import { corsMiddleware } from './srv/middlewares/cors';
import { ServiceLocator } from './srv/infrastructure/ServiceLocator';

cds.on('bootstrap', (app) => {
    app.use(corsMiddleware);
    app.use('/auth', oAuthRouter);
});

// Agendador do SendInvoices automático: executa ao iniciar o serviço
// e depois a cada 4 horas. Sem mês/ano informados, a ação opera no
// modo automático (faturas não enviadas + dívidas ainda não remetidas
// no mês corrente).
cds.on('listening', async () => {

    try {

        const service = ServiceLocator.getExpenseManagerService() as any;

        cds.spawn({ user: cds.User.privileged, every: 4 * 60 * 60 * 1000 }, async () => {

            try {

                console.log('[scheduler] Executando SendInvoices automático...');
                await service.SendInvoices({});
                console.log('[scheduler] SendInvoices concluído.');

            } catch (error: any) {

                console.error(
                    '[scheduler] Falha no SendInvoices automático:',
                    error?.message || error
                );

            }

        });

    } catch (error: any) {

        console.error(
            '[scheduler] Não foi possível inicializar o SendInvoices:',
            error?.message || error
        );

    }

});

module.exports = cds.server;