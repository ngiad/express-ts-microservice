import { IRPCBaseQueryRepository } from "../interface";
import { BaseQueryRepository } from "./base-query-sequelize";
import { Sequelize } from "sequelize";

export class RPCBaseRepository<
    Entity extends { [key: string]: any },
    CondType extends { [key: string]: any }
  >
  extends BaseQueryRepository<Entity, CondType>
  implements IRPCBaseQueryRepository<Entity, CondType>
{
  constructor(sequelize: Sequelize, modelName: string) {
    super(sequelize, modelName);
  }

  getById = async (id: string): Promise<Entity | null> => {
    return await this.detail(id);
  };

  getByCond = async (cond: CondType): Promise<Entity | null> => {
    return await this.byCond(cond);
  };

  getByList = async (whereCondition: CondType): Promise<Array<Entity>> => {
    const { rows } = await this.model.findAndCountAll({
      where: whereCondition,
    });

    return rows.map(
      (item) => item.get({ plain: true }) as Entity
    ) as Array<Entity>;
  };
}
