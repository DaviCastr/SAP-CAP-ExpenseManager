import { Persons } from "@models/apps/dflc/gestordegastos/entities";
import { BaseController, BaseControllerResponse } from "../base/";
import { Person } from "@models/apps/dflc/gestordegastos/entities";

export interface PersonController extends BaseController<Person> {
}