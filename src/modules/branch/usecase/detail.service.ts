import { IBaseGetDetail, IQueryHandler } from "../../../share/interface";
import { IBranchRepository } from "../interface";
import { BranchType } from "../model";
import { ErrBranchDeleted, ErrBranchIdInvalid, ErrBranchNotfound } from "../model/error";


export class BranchDetailService implements IQueryHandler<IBaseGetDetail,BranchType>{
        constructor(private readonly _repository: IBranchRepository) {}

        query = async(command: IBaseGetDetail): Promise<BranchType> => {
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