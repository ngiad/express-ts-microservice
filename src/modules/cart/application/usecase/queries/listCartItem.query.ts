import { IBaseGetList, IQueryHandler } from "../../../../../share/interface";
import { pagingDTO, paginSchema } from "../../../../../share/model/paging";
import { CartResponseType } from "../../../domain/entities/card.entity";
import { CartCondSchema, CartCondType } from "../../../domain/object-value";
import { ICartRepository } from "../../../domain/repositories/card.repository";


export  class ListCartItemQuery implements IQueryHandler<IBaseGetList<CartCondType,pagingDTO>,{data : Array<CartResponseType>,paging : pagingDTO}>{
    constructor(private readonly _repository : ICartRepository){}

    async query(query: IBaseGetList<CartCondType,pagingDTO>): Promise<{data : Array<CartResponseType>,paging : pagingDTO}> {
        const paging = paginSchema.parse(query.query);
        const cond = CartCondSchema.parse(query.query);

        const whereCondition: any = {
            ...(cond.userId && { userId: cond.userId }),
          };
        return await this._repository.list(whereCondition,paging)
    }
}
