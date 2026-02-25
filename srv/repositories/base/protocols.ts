import { Request } from "@sap/cds";

export interface BaseRepository {
    findPersonIdById(Id: string): Promise<string | null>
}