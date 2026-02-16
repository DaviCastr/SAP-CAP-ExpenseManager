import { Either, left, right } from '@sweet-monads/either';

const test = (variavelA: boolean): Either<Error, { email: string }> => {
    try {
        if (!variavelA) {
            return left(new Error('The variable A is invalid.'));
        }

        // Logic correct
        return right({ email: 'davifgeo@gmail.com' });
    } catch (error) {
        return left(error as Error);
    }
};

(() => {
    const result = test(false);

    if (result.isLeft()) {
        console.log('Inside left');
        console.log(result.value.message);
        return;
    }

    const valorDaVariavel = result.value;

    console.log(valorDaVariavel);
})();
