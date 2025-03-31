import { v7 } from "uuid";
import { IBranchRepository, ICommandHandler, ICreateBranchService } from "../interface";
import { BranchStatus, BranchType } from "../model";
import { BranchCreateSchema } from "../model/dto";
import { ErrBranchNameDublicate, ErrBranchValueValidate } from "../model/error";


export class CreateBranchService implements ICommandHandler<ICreateBranchService, BranchType> {
    constructor(private readonly _repository: IBranchRepository) {}

    execute = async(command: ICreateBranchService): Promise<BranchType> => {
        const validateBranchCreate = BranchCreateSchema.safeParse(command.data);

        if (validateBranchCreate.error) {
          throw ErrBranchValueValidate;
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