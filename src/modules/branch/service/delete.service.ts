import { ICommandHandler } from "../../../share/interface";
import { IBranchRepository, IDeleteBranchService } from "../interface";


export class BranchDeleteService implements ICommandHandler<IDeleteBranchService, boolean> {    
  constructor(private readonly _repository: IBranchRepository) {}

  execute = async (command: IDeleteBranchService): Promise<boolean> => {
    const branch = await this._repository.detail(command.id);
    if (!branch) {
      return false;
    }
    return await this._repository.delete(command.id, false);
  };
}