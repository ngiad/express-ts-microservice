import { pagingDTO } from "../../../share/model/paging";
import { CategoryType } from "../model";
import { CategoryCondType, CategoryCreateType, CategoryUpdateType } from "../model/dto";

export interface ICategoryService {
    create(data : CategoryCreateType) : Promise<CategoryType>;
    detail(id: string): Promise<CategoryType | null>;
    list(cond: CategoryCondType, paging: pagingDTO): Promise<Array<CategoryType>>;
    update(id: string, data: CategoryUpdateType): Promise<CategoryType>;
    // byName(name: string) : Promise<CategoryType | null>;
    delete(id: string): Promise<boolean>;
}

export interface ICategoryRepository extends ICommandRepository, IQueryRepository {}

export interface IQueryRepository{
    detail(id: string): Promise<CategoryType | null>;
    list(cond: CategoryCondType, paging: pagingDTO): Promise<Array<CategoryType>>;
    byName(name: string) : Promise<CategoryType | null>
}

export interface ICommandRepository{
    insert(data: CategoryType): Promise<CategoryType>;
    update(id: string, data: CategoryUpdateType): Promise<CategoryType>;
    delete(id: string,isHard : boolean): Promise<boolean>;
}

