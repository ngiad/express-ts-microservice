import { v7 } from "uuid";
import { ICommandHandler } from "../../../../../share/interface";
import { CartResponseType } from "../../../domain/entities/card.entity";
import {
  CartCreateSchema,
  CartUpdateSchema,
} from "../../../domain/object-value";
import { ICartRepository } from "../../../domain/repositories/card.repository";
import { ICreateCartItemCommand } from "../../interface";

export class CreateCartItemCommand
  implements ICommandHandler<ICreateCartItemCommand, CartResponseType>
{
  constructor(private readonly _repository: ICartRepository) {}

  execute = async (
    command: ICreateCartItemCommand
  ): Promise<CartResponseType> => {
    const validate = CartCreateSchema.safeParse(command.data);

    if (validate.error) throw validate.error;
    const cartExist = await this._repository.byCond({
      userId: validate.data.userId,
      productId: validate.data.productId,
      branchId: validate.data.branchId,
    });

    if (cartExist) {
      const update = CartUpdateSchema.parse(cartExist);
      return await this._repository.update(cartExist.id, {
        ...update,
        quantity: (update.quantity ?? 0) + validate.data.quantity,
      });
    }



    return await this._repository.insert({
        id : v7(),
        ...validate.data
    })
  };
}
