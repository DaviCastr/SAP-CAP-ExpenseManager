import { AbstractError } from '@/errors/abstract';

export class PermissionDenied extends AbstractError {

    constructor(message: string, errorCode: number = 403, stack: string) {

        super(message, errorCode, stack);

    }

    public get message(): string {
        return this.message;
    }
}
