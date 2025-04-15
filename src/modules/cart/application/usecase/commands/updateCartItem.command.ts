import {
  IBaseUpdateService,
  ICommandHandler,
} from "../../../../../share/interface";
import { CartResponseType } from "../../../domain/entities/card.entity";
import { CartUpdateSchema, CartUpdateType } from "../../../domain/object-value";
import { ICartRepository } from "../../../domain/repositories/card.repository";
import { ErrCartIdNotFound, ErrCartIdnotvalidate } from "../../error";

export class UpdateCartItemCommand
  implements
    ICommandHandler<IBaseUpdateService<CartUpdateType>, CartResponseType>
{
  constructor(private readonly _repository: ICartRepository) {}

  execute = async (
    command: IBaseUpdateService<CartUpdateType>
  ): Promise<CartResponseType> => {
    if(!command.id) throw ErrCartIdnotvalidate

    const validate = CartUpdateSchema.safeParse(command.data)

    if (validate.error) throw validate.error

    const cart = await this._repository.byCond({
        id : command.id
    })

    if(cart) throw ErrCartIdNotFound
    return await this._repository.update(command.id, command.data);
  };
}
