export class ServiceRepository {

    private static repositories = new Map<string, any>();

    static register(entityName: string, repository: any) {
        this.repositories.set(entityName, repository);
    }

    static get(entityName: string) {
        return this.repositories.get(entityName);
    }

}