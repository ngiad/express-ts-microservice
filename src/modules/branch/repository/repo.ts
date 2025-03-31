import { Sequelize } from "sequelize";
import { ICommandRepository, IQueryRepository } from "../../../share/interface";
import { BaseQueryRepository } from "../../../share/repository/base-query-sequelize";
import { BaseRepoSequelize } from "../../../share/repository/base-repo-sequelize";
import { IBranchRepository } from "../interface";
import { BranchType } from "../model";
import { BranchCondType, BranchUpdateType } from "../model/dto";
import { BaseCommandRepository } from "../../../share/repository/base-command-sequelize";


export class BranchRepository extends BaseRepoSequelize<
  BranchType,
  BranchCondType,
  BranchUpdateType
> implements IBranchRepository { 
  constructor(
    branchQueryRepo: IQueryRepository<BranchType, BranchCondType>,
    branchCommandRepo: ICommandRepository<BranchType, BranchUpdateType>
  ) {
    super(branchQueryRepo, branchCommandRepo);
  }
}

export class BranchQueryRepository extends BaseQueryRepository<
  BranchType,
  BranchCondType
> implements IQueryRepository<BranchType, BranchCondType> {
  constructor(sequelize: Sequelize, modelName: string) {
    super(sequelize, modelName);
  }
} 

export class BranchCommandRepository extends BaseCommandRepository<
  BranchType,
  BranchUpdateType
> implements ICommandRepository<BranchType, BranchUpdateType> {
  constructor(sequelize: Sequelize, modelName: string) {
    super(sequelize, modelName);
  }
}