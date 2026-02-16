import { BaseController, BaseControllerResponse } from './protocols';

export class BaseControllerImplementation implements BaseController {
    public success(code: number, data: unknown): BaseControllerResponse {
        return {
            data,
            status: code
        };
    }

    public error(code: number, message: string): BaseControllerResponse {
        return {
            status: code,
            data: message
        };
    }
}