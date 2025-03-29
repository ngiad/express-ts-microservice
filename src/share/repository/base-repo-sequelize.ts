import { Sequelize, Optional, Op } from "sequelize";
import { IRepository } from "../interface";
import { pagingDTO } from "../model/paging";
import { BaseStatus } from "../model/base-status";


export abstract class BaseRepoSequelize<
  Entity extends {[key: string]: any},
  CondType,
  UpdateType extends {[key: string]: any}
> implements IRepository<Entity, CondType, UpdateType> {
  constructor(
    private readonly sequalize: Sequelize,
    private readonly modelName: string
  ) {}

  detail = async (id: string): Promise<Entity | null> => {
    const result = await this.sequalize.models[this.modelName].findByPk(id);
    if (!result) return null;

    return result.get({ plain: true }) as unknown as Entity;
  };

  list = async (cond: CondType, paging: pagingDTO): Promise<Array<Entity>> => {
    const { page, limit } = paging;

    const { rows, count } = await this.sequalize.models[this.modelName].findAndCountAll({
      where: cond as any,
      order: [["id", "DESC"]],
      limit,
      offset: (page - 1) * limit,
    });

    paging.total = count;
    return rows.map((item) => item.get({ plain: true }) as Entity);
  };

  insert = async (data: Entity): Promise<Entity> => {
    const result = await this.sequalize.models[this.modelName].create(data as any);
    return result as unknown as Entity;
  };

  update = async (id: string, data: UpdateType): Promise<Entity> => {
    await this.sequalize.models[this.modelName].update(data as any, { where: { id } });
    const updatedRecord = await this.sequalize.models[this.modelName].findByPk(id);
    if (!updatedRecord) {
      throw new Error(`Record with id ${id} not found after update`);
    }
    return updatedRecord.get({ plain: true }) as unknown as Entity;
  };

  delete = async (id: string, isHard: boolean): Promise<boolean> => {
    if (isHard) {
      await this.sequalize.models[this.modelName].destroy({ where: { id } });
      return true;
    }
    await this.sequalize.models[this.modelName].update(
      { status: BaseStatus.Deleted } as any,
      { where: { id } }
    );
    return true;
  };

  byName = async (name: string): Promise<Entity | null> => {
    const result = await this.sequalize.models[this.modelName].findOne({
      where: {
        name,
      },
    });
    return result as unknown as Entity | null;
  };
}