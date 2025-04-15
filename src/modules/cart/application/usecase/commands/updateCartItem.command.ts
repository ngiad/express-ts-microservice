import {
  IBaseUpdateService,
  ICommandHandler,
} from "../../../../../share/interface";
import { CartResponseType } from "../../../domain/entities/card.entity";
import { CartUpdateSchema, CartUpdateType } from "../../../domain/object-value";
import { ICartRepository } from "../../../domain/repositories/card.repository";
import { ErrCartIdNotFound, ErrCartIdnotvalidate, ErrCartUserForbidden } from "../../error";
import { IUpdateCartItemCommand } from "../../interface";

export class UpdateCartItemCommand
  implements
    ICommandHandler<IUpdateCartItemCommand, CartResponseType>
{
  constructor(private readonly _repository: ICartRepository) {}

  execute = async (
    command: IUpdateCartItemCommand
  ): Promise<CartResponseType> => {
    if(!command.id) throw ErrCartIdnotvalidate
    if(!command.userId) throw ErrCartUserForbidden

    const validate = CartUpdateSchema.safeParse(command.data)

    if (validate.error) throw validate.error

    const cart = await this._repository.byCond({
        id : command.id
    })

    if(!cart) throw ErrCartIdNotFound
    if(cart.userId !== command.userId) throw ErrCartUserForbidden
    return await this._repository.update(command.id, command.data);
  };
}
