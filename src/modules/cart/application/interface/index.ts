import { IBaseDeleteService, IBaseUpdateService } from "../../../../share/interface";
import { CartResponseType } from "../../domain/entities/card.entity";
import { CartCreateType, CartUpdateType } from "../../domain/object-value";


export interface ICreateCartItemCommand {
    data : CartCreateType
}


export interface IUpdateCartItemCommand extends IBaseUpdateService<CartUpdateType> {
 userId : string
}

export interface IDeleteCartItemCommand extends IBaseDeleteService {
    userId : string
}
