import { AbstractError } from '@/errors/abstract';

export class DuplicityError extends AbstractError {
    constructor(stack: string, message = 'error.duplicity') {
        super(message, 403, stack);
    }

    public get message(): string {
        return this.message;
    }
}
