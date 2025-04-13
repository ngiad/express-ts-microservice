import { IBaseDeleteService, ICommandHandler } from "../../../share/interface";
import { IBranchRepository } from "../interface";
import { ErrBranchDeleted, ErrBranchIdInvalid, ErrBranchIdNotFound } from "../model/error";


export class BranchDeleteService implements ICommandHandler<IBaseDeleteService, boolean> {    
  constructor(private readonly _repository: IBranchRepository) {}

  execute = async (command: IBaseDeleteService): Promise<boolean> => {
    if(command.id) throw ErrBranchIdInvalid
    const branch = await this._repository.detail(command.id);
    if (!branch) {
      throw ErrBranchIdNotFound
    }

    if(branch.status === "deleted") {
      throw ErrBranchDeleted
    }
    return await this._repository.delete(command.id, false);
  };
}