import { Sequelize } from "sequelize";
import { ICommandRepository, IQueryRepository } from "../../../share/interface";
import { BaseQueryRepository } from "../../../share/repository/base-query-sequelize";
import { BaseRepoSequelize } from "../../../share/repository/base-repo-sequelize";
import { IProductCommandRepository, IProductQueryRepository, IProductRepository } from "../interface";
import { ProductType } from "../model";
import { ProductCondType, ProductUpdateType } from "../model/dto";
import { BaseCommandRepository } from "../../../share/repository/base-command-sequelize";



export class ProductRepository extends BaseRepoSequelize<
  ProductType,
  ProductCondType,
  ProductUpdateType
  > implements IProductRepository {
  constructor(
    productQueryRepo: IQueryRepository<ProductType, ProductCondType>,
    productCommandRepo: ICommandRepository<ProductType, ProductUpdateType>
  ) {
    super(productQueryRepo, productCommandRepo);
  }
}


export class ProductQueryRepository extends BaseQueryRepository<ProductType, ProductCondType> implements IProductQueryRepository {
    constructor(sequelize: Sequelize, modelName: string) {
        super(sequelize, modelName);
    }
} 

export class ProductCommandRepository extends BaseCommandRepository<ProductType, ProductUpdateType> implements IProductCommandRepository {
    constructor(sequelize: Sequelize, modelName: string) {
        super(sequelize, modelName);
    }
}