import { CartResponseType } from "../../domain/entities/card.entity";
import { CartCreateType } from "../../domain/object-value";


export interface ICreateCartItemCommand {
    data : CartCreateType
}
