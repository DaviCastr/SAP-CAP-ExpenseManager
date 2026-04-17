import Decimal from "decimal.js";

export class BaseModel {

    protected static retrieveDecimal(value: number | null | undefined): Decimal {

        return value ? new Decimal(value) : null as any;

    }


    protected cleanEntity(obj: any): any {

        if (Array.isArray(obj)) {
            if (obj.length == 0) return;
            return obj.map((item) => this.cleanEntity(item));
        }

        if (obj && typeof obj === 'object') {
            return Object.fromEntries(
                Object.entries(obj)
                    .filter(([_, v]) => v !== undefined && v !== null && JSON.stringify(v) != '{}' && (v as any)?.length !== 0)
                    .map(([k, v]) => [k, this.cleanEntity(v)])
            );
        }

        return obj;

    }

}