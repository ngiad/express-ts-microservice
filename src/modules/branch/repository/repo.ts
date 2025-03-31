import { Sequelize } from "sequelize";
import { BaseRepoSequelize } from "../../../share/repository/base-repo-sequelize";
import { BranchType } from "../model";
import { BranchCondType, BranchUpdateType } from "../model/dto";
import { IBranchRepository } from "../interface";


export class BranchRepository extends BaseRepoSequelize<
  BranchType,
  BranchCondType,
  BranchUpdateType
> implements IBranchRepository {
    constructor(sequalize: Sequelize,modelName: string) {
        super(sequalize, modelName);
    }
}