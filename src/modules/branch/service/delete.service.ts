import { ICommandHandler } from "../../../share/interface";
import { IBranchRepository, IDeleteBranchService } from "../interface";
import { ErrBranchDeleted, ErrBranchIdNotFound } from "../model/error";


export class BranchDeleteService implements ICommandHandler<IDeleteBranchService, boolean> {    
  constructor(private readonly _repository: IBranchRepository) {}

  execute = async (command: IDeleteBranchService): Promise<boolean> => {
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