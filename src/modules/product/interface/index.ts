import {
  IBaseHttpService,
  ICommandRepository,
  IQueryRepository,
  IRepository,
  IUseCase,
} from "../../../share/interface";
import { ProductType } from "../model";
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

export interface IProductHttpService extends IBaseHttpService<ProductType,ProductCondType,ProductCreateType,ProductUpdateType> {}

export interface IProductRepository
  extends IRepository<ProductType, ProductCondType, ProductUpdateType> {}

export interface IProductQueryRepository
  extends IQueryRepository<ProductType, ProductCondType> {}

export interface IProductCommandRepository
  extends ICommandRepository<ProductType, ProductCondType> {}
