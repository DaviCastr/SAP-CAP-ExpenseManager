import cds from '@sap/cds';
import type { Request, Response } from 'express';

const PROBE_ENTITY = 'apps.dflc.expensemanager.entities.Persons';

export async function databaseHealth(_request: Request, response: Response): Promise<void> {

    try {

        await cds.db.run(SELECT.one.from(PROBE_ENTITY).columns('count(1) as total'));
        response.json({ status: 'UP' });

    } catch {

        response.status(503).json({ status: 'DOWN' });

    }

}
