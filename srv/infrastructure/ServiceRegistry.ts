export class ServiceRegistry {

    private static services = new Map<string, any>();

    static register(entityName: string, service: any) {
        this.services.set(entityName, service);
    }

    static get(entityName: string) {
        return this.services.get(entityName);
    }

}