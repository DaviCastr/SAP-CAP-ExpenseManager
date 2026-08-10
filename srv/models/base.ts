import Decimal from "decimal.js";

export class BaseModel {

    protected static retrieveDecimal(value: number | null | undefined): Decimal {

        return value ? new Decimal(value).toDecimalPlaces(2) : null as any;

    }


    protected cleanEntity(obj: any): any {
        
        if (Array.isArray(obj)) {
            if (obj.length === 0) return undefined;
            return obj.map((item) => this.cleanEntity(item));
        }

        if (this.isBinaryOrStream(obj)) {
            return obj;
        }

        if (obj && typeof obj === 'object' && !this.isBinaryOrStream(obj)) {
            const entries = Object.entries(obj)
                .filter(([_, v]) => {

                    if (v === undefined || v === null) return false;

                    if (this.isBinaryOrStream(v)) return true;

                    if (typeof v === 'object' && !Array.isArray(v) && Object.keys(v).length === 0) return false;

                    if (Array.isArray(v) && v.length === 0) return false;

                    return true;
                })
                .map(([k, v]) => [k, this.cleanEntity(v)]);

            if (entries.length === 0) return undefined;

            return Object.fromEntries(entries);
        }

        return obj;
    }

    private isBinaryOrStream(value: any): boolean {
        if (!value) return false;

        // Buffer
        if (Buffer.isBuffer(value)) return true;

        // Stream (Readable, Writable, Duplex, Transform)
        if (typeof value === 'object' && typeof value.pipe === 'function') return true;

        // ArrayBuffer
        if (value instanceof ArrayBuffer) return true;

        // TypedArray
        if (ArrayBuffer.isView(value)) return true;

        return false;
    }

}