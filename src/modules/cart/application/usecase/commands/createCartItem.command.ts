import { v7 } from "uuid";
import { ICommandHandler } from "../../../../../share/interface";
import { CartResponseType } from "../../../domain/entities/card.entity";
import {
  CartCreateSchema,
  CartUpdateSchema,
} from "../../../domain/object-value";
import { ICartRepository } from "../../../domain/repositories/card.repository";
import { ICreateCartItemCommand } from "../../interface";
import { IProductRPCRepository } from "../../../domain/repositories/product.rpc.repository";
import { ErrProductNotfound } from "../../error";

export class CreateCartItemCommand
  implements ICommandHandler<ICreateCartItemCommand, CartResponseType>
{
  constructor(
    private readonly _repository: ICartRepository,
    private readonly _rpcProductRepository  : IProductRPCRepository
  ) {}

  execute = async (
    command: ICreateCartItemCommand
  ): Promise<CartResponseType> => {
    const validate = CartCreateSchema.safeParse(command.data);

    if (validate.error) throw validate.error;
    const cartExist = await this._repository.byCond({
      userId: validate.data.userId,
      productId: validate.data.productId,
      attributes: validate.data.attributes,
    });

    if (cartExist) {
      const update = CartUpdateSchema.parse(cartExist);
      return await this._repository.update(cartExist.id, {
        ...update,
        quantity: (update.quantity ?? 0) + validate.data.quantity,
      });
    }

    const product = await this._rpcProductRepository.getById(validate.data.productId)
    if(!product) throw ErrProductNotfound

    return await this._repository.insert({
        id : v7(),
        ...validate.data
    })
  };
}
