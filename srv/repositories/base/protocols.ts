export interface BaseRepository {
    findById(Id: any): Promise<any | null>
    findPersonIdById(Id: string): Promise<string | null>
    createEntry(data: any | any[]): Promise<any[] | null>
}