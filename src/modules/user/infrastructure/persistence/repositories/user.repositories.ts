import { Sequelize } from "sequelize";
import {
  ICommandRepository,
  IQueryRepository,
  IRepository,
} from "../../../../../share/interface";
import { BaseCommandRepository } from "../../../../../share/repository/base-command-sequelize";
import { BaseRepoSequelize } from "../../../../../share/repository/base-repo-sequelize";
import {
  UserCondType,
  UserUpdatePasswordType,
  UserUpdateProfileType,
  UserUpdateType,
} from "../../../application/dto";
import { UserType } from "../../../domain/entities/user.entity";
import { BaseQueryRepository } from "../../../../../share/repository/base-query-sequelize";
import { RPCBaseRepository } from "../../../../../share/repository/base-rpc-sequelize";
import { IRPCUserRepository } from "../../../domain/repositories/user.repository";

export class UserRepository
  extends BaseRepoSequelize<
    UserType,
    UserCondType,
    UserUpdateType | UserUpdatePasswordType | UserUpdateProfileType
  >
  implements
    IRepository<
      UserType,
      UserCondType,
      UserUpdateType | UserUpdatePasswordType | UserUpdateProfileType
    >
{
  constructor(
    protected readonly queryRepo: IQueryRepository<UserType, UserCondType>,
    protected readonly commandRepo: ICommandRepository<
      UserType,
      UserUpdateType | UserUpdatePasswordType | UserUpdateProfileType
    >
  ) {
    super(queryRepo, commandRepo);
  }
}

export class UserCommandRepository
  extends BaseCommandRepository<
    UserType,
    UserUpdateType | UserUpdatePasswordType | UserUpdateProfileType
  >
  implements
    ICommandRepository<
      UserType,
      UserUpdateType | UserUpdatePasswordType | UserUpdateProfileType
    >
{
  constructor(sequelize: Sequelize, modelName: string) {
    super(sequelize, modelName);
  }
}

export class UserQueryRepository
  extends BaseQueryRepository<UserType, UserCondType>
  implements IQueryRepository<UserType, UserCondType>
{
  constructor(sequelize: Sequelize, modelName: string) {
    super(sequelize, modelName);
  }
}

export class RPCUserRepository
  extends RPCBaseRepository<UserType, UserCondType>
  implements IRPCUserRepository {
    constructor(sequelize: Sequelize, modelName: string) {
      super(sequelize, modelName);
    }
}
