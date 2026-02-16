export type BaseControllerResponse = {

    data: unknown;
    status: number;

};

export interface BaseController {

    success(code: number, data: unknown): BaseControllerResponse;

    error(code: number, message: string): BaseControllerResponse;

}
