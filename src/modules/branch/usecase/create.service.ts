import { v7 } from "uuid";
import { IBranchRepository } from "../interface";
import { BranchStatus, BranchType } from "../model";
import { BranchCreateSchema, BranchCreateType } from "../model/dto";
import { ErrBranchNameDublicate } from "../model/error";
import { IBaseCreateService, ICommandHandler } from "../../../share/interface";


export class CreateBranchService implements ICommandHandler<IBaseCreateService<BranchCreateType>, BranchType> {
    constructor(private readonly _repository: IBranchRepository) {}

    execute = async(command: IBaseCreateService<BranchCreateType>): Promise<BranchType> => {
        const validateBranchCreate = BranchCreateSchema.safeParse(command.data);

        if (validateBranchCreate.error) {
          throw validateBranchCreate.error;
        }
    
        const branchExits = await this._repository.byName(validateBranchCreate.data.name);
        if (branchExits) {
          throw ErrBranchNameDublicate;
        }
    
        const branch: BranchType = {
          id: v7(),
          ...validateBranchCreate.data,
          createdAt: new Date(),
          updatedAt: new Date(),
          status: BranchStatus.Active,
        };
        return await this._repository.insert(branch);
    }
}