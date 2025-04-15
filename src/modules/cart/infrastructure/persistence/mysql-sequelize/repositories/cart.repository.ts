import { Sequelize } from "sequelize";
import { BaseCommandRepository } from "../../../../../../share/repository/base-command-sequelize";
import { BaseQueryRepository } from "../../../../../../share/repository/base-query-sequelize";
import { BaseRepoSequelize } from "../../../../../../share/repository/base-repo-sequelize";
import { CartType } from "../../../../domain/entities/card.entity";
import { CartCondType, CartUpdateType } from "../../../../domain/object-value";
import { ICartRepository } from "../../../../domain/repositories/card.repository";
import { ICommandRepository, IQueryRepository, IRPCBaseQueryRepository } from "../../../../../../share/interface";
import { RPCBaseRepository } from "../../../../../../share/repository/base-rpc-sequelize";

export class CartRepository
  extends BaseRepoSequelize<CartType, CartCondType, CartUpdateType>
  implements ICartRepository
{
  constructor(
    cartQueryRepo: IQueryRepository<CartType, CartCondType>,
    cartCommandRepo: ICommandRepository<CartType, CartUpdateType>
  ) {
    super(cartQueryRepo, cartCommandRepo);
  }
}

export class CartQueryRepository
  extends BaseQueryRepository<CartType, CartCondType>
  implements IQueryRepository<CartType, CartCondType>
{
  constructor(sequelize: Sequelize, modelName: string) {
    super(sequelize, modelName);
  }
}

export class CartCommandRepository
  extends BaseCommandRepository<CartType, CartUpdateType>
  implements ICommandRepository<CartType, CartUpdateType>
{
  constructor(sequelize: Sequelize, modelName: string) {
    super(sequelize, modelName);
  }
}


// rpc 

export class RPCCartRepository
  extends RPCBaseRepository<CartType, CartCondType>
  implements IRPCBaseQueryRepository<CartType, CartCondType>
{
  constructor(sequelize: Sequelize, modelName: string) {
    super(sequelize, modelName);
  }
}

