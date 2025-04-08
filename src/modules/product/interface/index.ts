import {
  IBaseHttpService,
  ICommandRepository,
  IQueryRepository,
  IRepository,
  IUseCase,
} from "../../../share/interface";
import { ProductBranchType, ProductCategoryType, ProductType } from "../model";
import {
  ProductCondType,
  ProductCreateType,
  ProductUpdateType,
} from "../model/dto";

export interface IProductUseCase
  extends IUseCase<
    ProductCreateType,
    ProductUpdateType,
    ProductCondType,
    ProductType
  > {}

export interface IProductHttpService
  extends IBaseHttpService<
    ProductType,
    ProductCondType,
    ProductCreateType,
    ProductUpdateType
  > {
  }

export interface IProductRepository
  extends IRepository<ProductType, ProductCondType, ProductUpdateType> {}

export interface IProductQueryRepository
  extends IQueryRepository<ProductType, ProductCondType> {}

export interface IProductCommandRepository
  extends ICommandRepository<ProductType, ProductCondType> {}



  
export interface IPRCProductBranchQueryRepository {
  getBranchById: (id: string) => Promise<ProductBranchType | null>;
  getBranchByIds: (ids: string[]) => Promise<ProductBranchType[]>;
} 

export interface IRPCCategoryQueryRepository {
  getCategoryById: (id: string) => Promise<ProductCategoryType | null>;
  getCategoryByIds: (ids: string[]) => Promise<ProductCategoryType[]>;
} 
