import cds from '@sap/cds';
import { oAuthRouter } from './srv/auth/authRouter';
import { corsMiddleware } from './srv/middlewares/cors';

cds.on('bootstrap', (app) => {
    app.use(corsMiddleware);
    app.use('/auth', oAuthRouter);
});

module.exports = cds.server;