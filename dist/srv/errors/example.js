"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const either_1 = require("@sweet-monads/either");
const test = (variavelA) => {
    try {
        if (!variavelA) {
            return (0, either_1.left)(new Error('The variable A is invalid.'));
        }
        // Logic correct
        return (0, either_1.right)({ email: 'davifgeo@gmail.com' });
    }
    catch (error) {
        return (0, either_1.left)(error);
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
//# sourceMappingURL=example.js.map