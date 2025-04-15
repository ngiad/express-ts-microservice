import { IBaseGetList, IQueryHandler } from "../../../../../share/interface";
import { pagingDTO, paginSchema } from "../../../../../share/model/paging";
import { CartResponseType } from "../../../domain/entities/card.entity";
import { CartCondSchema, CartCondType } from "../../../domain/object-value";
import { IBranchCartItemRPCRepository } from "../../../domain/repositories/branch.rpc.repository";
import { ICartRepository } from "../../../domain/repositories/card.repository";
import { IProductRPCRepository } from "../../../domain/repositories/product.rpc.repository";

export class ListCartItemQuery
  implements
    IQueryHandler<
      IBaseGetList<CartCondType, pagingDTO>,
      { data: Array<CartResponseType>; paging: pagingDTO }
    >
{
  constructor(
    private readonly _repository: ICartRepository,
    private readonly _rpcProductRepository: IProductRPCRepository,
    private readonly _rpcBranchRepository: IBranchCartItemRPCRepository
  ) {}

  async query(
    query: IBaseGetList<CartCondType, pagingDTO>
  ): Promise<{ data: Array<CartResponseType>; paging: pagingDTO }> {
    const paging = paginSchema.parse(query.query);
    const cond = CartCondSchema.parse(query.query);
  
    const whereCondition: any = {
      ...(cond.userId && { userId: cond.userId }),
    };
  
    const cartItems = await this._repository.list(whereCondition, paging);
  
    const productIds = cartItems.data.map((item) => item.productId);
    const products = await this._rpcProductRepository.getByList(productIds);
  
    const branchIds = products
      .map((item) => item.branchId)
      .filter((id) => id !== undefined);
  
    const branches = await this._rpcBranchRepository.getByList(branchIds);
    const branchMap = new Map(branches.map((b) => [b.id, b]));
  
    const productMap = new Map(
      products.map((p) => [
        p.id,
        {
          ...p,
          branch: p.branchId ? branchMap.get(p.branchId) : undefined,
        },
      ])
    );
  
    const result: CartResponseType[] = cartItems.data.map((item) => {
      const product = productMap.get(item.productId);
  
      return {
        ...item,
        product,
      };
    });
  
    return {
      data: result,
      paging: cartItems.paging,
    };
  }
}
