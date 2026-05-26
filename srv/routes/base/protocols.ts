import { BaseControllerResponse } from "@/controllers/base"
import { Request } from "@sap/cds"

export type FullRequestParams<ExpectedResults> = Request & {
    results: ExpectedResults;
};

export interface BaseRoute {
    returnRejectMessage(Request: Request, Result: BaseControllerResponse): any
    returnErrorMessage(Request: Request, Result: BaseControllerResponse): Error
}