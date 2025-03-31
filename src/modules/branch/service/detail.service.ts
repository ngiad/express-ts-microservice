import { IQueryHandler } from "../../../share/interface";
import { IBranchRepository, IGetDetailBranch } from "../interface";
import { BranchType } from "../model";
import { ErrBranchDeleted, ErrBranchIdInvalid, ErrBranchNotfound } from "../model/error";


export class BranchDetailService implements IQueryHandler<IGetDetailBranch,BranchType>{
        constructor(private readonly _repository: IBranchRepository) {}

        query = async(command: IGetDetailBranch): Promise<BranchType> => {
            if (!command.id) {
                throw ErrBranchIdInvalid;
              }

            const data = await this._repository.detail(command.id);  
            if(!data) {
                throw ErrBranchNotfound;
            }

            if(data.status === "deleted") {
                throw ErrBranchDeleted;
            }
            return data
        }
}