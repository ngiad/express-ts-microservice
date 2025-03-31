import { pagingDTO } from "../../../share/model/paging";
import { BranchType } from "../model";
import { BranchCondType, BranchCreateType, BranchUpdateType } from "../model/dto";


export interface IBranchService {
    create(data : BranchCreateType) : Promise<BranchType>;
    detail(id: string): Promise<BranchType | null>;
    list(query : pagingDTO & BranchCondType): Promise<{data : Array<BranchType>, paging : pagingDTO} >;
    listByCond(cond: BranchCondType, paging: pagingDTO): Promise<{ data: Array<BranchType>; paging: pagingDTO }>;
    update(id: string, data: BranchUpdateType): Promise<BranchType>;
    delete(id: string): Promise<boolean>;
    byCond(cond: BranchCondType): Promise<BranchType | null>;
}


export interface IBranchRepository {
    detail(id: string): Promise<BranchType | null>;
    list(cond: BranchCondType, paging: pagingDTO): Promise<Array<BranchType>>;
    insert(data: BranchType): Promise<BranchType>;
    update(id: string, data: BranchUpdateType): Promise<BranchType>;
    delete(id: string, isHard: boolean): Promise<boolean>;
    byName(name: string): Promise<BranchType | null>;
    byCond(cond: BranchCondType): Promise<BranchType | null>;
    listByCond(cond: BranchCondType, paging: pagingDTO): Promise<Array<BranchType>>;
}



// command query pattern
export interface ICreateBranchService{
    data : BranchCreateType;
}


export interface ICommandHandler<Cmd, Result>{
    execute(command : Cmd): Promise<Result>; 
}



