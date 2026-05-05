import { Cards } from "@models/apps/dflc/expensemanager/entities";
import { BaseController, BaseControllerResponse } from "../base/";
import { Card } from "@models/apps/dflc/expensemanager/entities";

export interface CardController extends BaseController<Card> {
}