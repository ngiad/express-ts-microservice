import { pagingDTO } from "../../../share/model/paging";
import { BranchType } from "../model";
import { BranchCondType, BranchCreateType, BranchUpdateType } from "../model/dto";


export interface IBranchService {
    create(data : BranchCreateType) : Promise<BranchType>;
    detail(id: string): Promise<BranchType | null>;
    list(query : pagingDTO & BranchCondType): Promise<Array<BranchType>>;
    update(id: string, data: BranchUpdateType): Promise<BranchType>;
    // byName(name: string) : Promise<BranchType | null>;
    delete(id: string): Promise<boolean>;
}



