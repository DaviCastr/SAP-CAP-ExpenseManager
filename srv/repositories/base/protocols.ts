import { Readable } from "stream";

export interface BaseRepository {
    findById(Id: any): Promise<any | null>;
    findByIds(Ids: any[]): Promise<any[] | null>;
    findPersonIdById(Id: string): Promise<string | null>;
    findImageByIds(Ids: any[]): Promise<{Image: Readable, ImageType: string}[] | null>;
    createEntry(data: any | any[]): Promise<any[] | null>;
}