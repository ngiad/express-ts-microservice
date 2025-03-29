import { pagingDTO } from "../../../share/model/paging";
import { ICategoryRepository, ICategoryService } from "../interface";
import { CategoryStatus, CategoryType } from "../model";
import { CategoryCondType, CategoryCreateType, CategoryUpdateType } from "../model/dto";
import { ErrCategoryDeleted, ErrCategoryNameDublicate, ErrCategoryNotfound } from "../model/error";
import { v7 } from "uuid";


export class CategoryService implements ICategoryService {
  constructor(private readonly repository: ICategoryRepository) {}

  async create(data: CategoryCreateType) : Promise<CategoryType> {
    const categoryExist = await this.repository.byName(data.name);
    if (categoryExist) {
      throw ErrCategoryNameDublicate;
    }

    const category: CategoryType = {
      id: v7(),
      ...data,
      position: 0,
      status: CategoryStatus.Active,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await this.repository.insert(category);
    return result
  }

  async detail(id: string): Promise<CategoryType | null> {
      const category = await this.repository.detail(id);
      if (!category) {
        throw ErrCategoryNotfound
      }
    
      if (category.status === CategoryStatus.Deleted) {
        throw ErrCategoryDeleted
      }
    
      return category
  }

  async list(cond: CategoryCondType, paging: pagingDTO): Promise<Array<CategoryType>> {
    const data = await this.repository.list(cond,paging)
    return data
  }


  async update(id: string, data: CategoryUpdateType): Promise<CategoryType> {
    const category = await this.repository.detail(id)
    if(!category ) throw ErrCategoryNotfound
    if(category.status === CategoryStatus.Deleted) throw ErrCategoryDeleted

    return await this.repository.update(id,data)
  }


  async delete(id: string): Promise<boolean> {
    const category = await this.repository.detail(id)
    if(!category ) throw ErrCategoryNotfound
    if(category.status === CategoryStatus.Deleted) throw ErrCategoryDeleted

    return await this.repository.delete(id,true)
  }
}
