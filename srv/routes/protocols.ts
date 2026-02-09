import { Request } from '@sap/cds';

export type FullRequestParams<ExpectedResults> = Request & {
    results: ExpectedResults;
};
