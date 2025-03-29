import { Sequelize } from "sequelize";
import { BaseRepoSequelize } from "../../../share/repository/base-repo-sequelize";
import { BranchType, modelBranchName } from "../model";
import { BranchCondType, BranchUpdateType } from "../model/dto";


export class BranchRepository extends BaseRepoSequelize<
  BranchType,
  BranchCondType,
  BranchUpdateType
> {
    constructor(sequalize: Sequelize,modelName: string) {
        super(sequalize, modelName);
    }
}