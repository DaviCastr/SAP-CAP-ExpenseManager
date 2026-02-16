import { PersonModel } from "@/models/person";
import { Person } from "@models/GestorDeGastos";

export interface PersonRepository {
    findById(Id: Person['ID']): Promise<PersonModel | null>;
}