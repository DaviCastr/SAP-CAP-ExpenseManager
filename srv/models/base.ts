export class BaseModel {

    protected cleanEntity(obj: any): any {

        if (Array.isArray(obj)) {
            if (obj.length == 0) return;
            return obj.map((item) => this.cleanEntity(item));
        }

        if (obj && typeof obj === 'object') {
            return Object.fromEntries(
                Object.entries(obj)
                    .filter(([_, v]) => v !== undefined && v !== null && (v as any)?.length !== 0)
                    .map(([k, v]) => [k, this.cleanEntity(v)])
            );
        }

        return obj;

    }

}