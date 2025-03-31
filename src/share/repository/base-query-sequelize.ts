import { FindOptions, Model, ModelStatic, Sequelize } from "sequelize";
import { pagingDTO } from "../model/paging";
import { IQueryRepository } from "../interface";

export abstract class BaseQueryRepository<
  Entity extends { [key: string]: any },
  CondType,
> implements IQueryRepository<Entity, CondType>
{
  protected model: ModelStatic<Model<any, any>>;

  constructor(
    private readonly sequelize: Sequelize,
    private readonly modelName: string
  ) {
    this.model = this.sequelize.models[this.modelName];
    if (!this.model) {
      throw new Error(`Model ${modelName} not found in Sequelize instance.`);
    }
  }

  detail = async (id: string): Promise<Entity | null> => {
    const result = await this.model.findByPk(id);
    if (!result) return null;
    return result.get({ plain: true }) as Entity;
  };

  list = async (cond: CondType, paging: pagingDTO): Promise<{data : Array<Entity>, paging : pagingDTO}> => {
    const { page = 1, limit = 10 } = paging;
    const options: FindOptions = {
      where: cond as any,
      order: [["id", "DESC"]],
      limit: limit,
      offset: (page - 1) * limit,
    };
    const { rows, count } = await this.model.findAndCountAll(options);
    paging.total = count;
    return {
        data: rows.map((item) => item.get({ plain: true }) as Entity),
        paging: paging
    } as {data : Array<Entity>, paging : pagingDTO};
  };

  byName = async (name: string): Promise<Entity | null> => {
    const result = await this.model.findOne({
      where: { name } as any,
    });
    if (!result) return null;
    return result.get({ plain: true }) as Entity;
  };

  byCond = async (cond: CondType): Promise<Entity | null> => {
    const result = await this.model.findOne({
      where: cond as any,
    });
    if (!result) return null;
    return result.get({ plain: true }) as Entity;
  };
}
