import {
    IBaseDeleteService,
    IBaseUpdateService,
    ICommandHandler,
  } from "../../../../../share/interface";
  import { ICartRepository } from "../../../domain/repositories/card.repository";
  import { ErrCartIdNotFound, ErrCartIdnotvalidate } from "../../error";
  
  export class DeleteCartItemCommand
    implements
      ICommandHandler<IBaseDeleteService, boolean>
  {
    constructor(private readonly _repository: ICartRepository) {}
  
    execute = async (
      command: IBaseDeleteService
    ): Promise<boolean> => {
      if(!command.id) throw ErrCartIdnotvalidate
      const cart = await this._repository.byCond({
          id : command.id
      })
  
      if(cart) throw ErrCartIdNotFound
      return await this._repository.delete(command.id,false);
    };
  }
  