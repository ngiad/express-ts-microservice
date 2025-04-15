import {
    IBaseDeleteService,
    IBaseUpdateService,
    ICommandHandler,
  } from "../../../../../share/interface";
  import { ICartRepository } from "../../../domain/repositories/card.repository";
  import { ErrCartIdNotFound, ErrCartIdnotvalidate, ErrCartUserForbidden } from "../../error";
import { IDeleteCartItemCommand } from "../../interface";
  
  export class DeleteCartItemCommand
    implements
      ICommandHandler<IDeleteCartItemCommand, boolean>
  {
    constructor(private readonly _repository: ICartRepository) {}
  
    execute = async (
      command: IDeleteCartItemCommand
    ): Promise<boolean> => {
      if(!command.id) throw ErrCartIdnotvalidate
      if(!command.userId) throw ErrCartUserForbidden
      const cart = await this._repository.byCond({
          id : command.id
      })
  
      if(!cart) throw ErrCartIdNotFound

      if(cart.userId !== command.userId) throw ErrCartUserForbidden
      return await this._repository.delete(command.id,false);
    };
  }
  