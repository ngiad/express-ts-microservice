import { ICommandHandler } from "../../../share/interface";
import { IBranchRepository, IUpdateBranchService } from "../interface";
import { BranchStatus, BranchType } from "../model";
import { BranchUpdateSchema } from "../model/dto";
import {
  ErrBranchDeleted,
  ErrBranchIdInvalid,
  ErrBranchNotfound,
  ErrBranchValueValidate,
} from "../model/error";

export class BranchUpdateService
  implements ICommandHandler<IUpdateBranchService, BranchType>
{
  constructor(private readonly _repository: IBranchRepository) {}

  execute = async (command: IUpdateBranchService): Promise<BranchType> => {
    const branchUpdateValidate = BranchUpdateSchema.safeParse(command.data);
    if (!branchUpdateValidate.success) {
      throw ErrBranchValueValidate;
    }

    if (!command.id) throw ErrBranchIdInvalid;

    if (branchUpdateValidate.error) {
      throw ErrBranchValueValidate;
    }

    const branch: BranchType | null = await this._repository.detail(command.id);
    if (!branch) throw ErrBranchNotfound;

    if (branch.status === BranchStatus.Deleted) throw ErrBranchDeleted;
    return this._repository.update(command.id, branchUpdateValidate.data);
  };
}
