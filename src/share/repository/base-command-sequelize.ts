import { Model, ModelStatic, Sequelize } from "sequelize";
import { ICommandRepository } from "../interface";
import { BaseStatus } from "../model/base-status";

export abstract class BaseCommandRepository<
  Entity extends { [key: string]: any },
  UpdateType extends { [key: string]: any }
> implements ICommandRepository<Entity, UpdateType>
{
  protected model: ModelStatic<Model<any, any>>;

  constructor(
    protected readonly sequelize: Sequelize,
    protected readonly modelName: string
  ) {
    this.model = this.sequelize.models[this.modelName];
    if (!this.model) {
      throw new Error(`Model ${modelName} not found in Sequelize instance.`);
    }
  }

  insert = async (data: Entity): Promise<Entity> => {
    const result = await this.model.create(data as Entity);
    return result.get({ plain: true }) as Entity;
  };

  update = async (id: string, data: UpdateType): Promise<Entity> => {
    const [affectedCount] = await this.model.update(data as UpdateType, {
      where: { id } as {id: string },
    });

    if (affectedCount === 0) {
      throw new Error(`Record with id ${id} not found or not updated.`);
    }
    const updatedRecord = await this.model.findByPk(id);
    if (!updatedRecord) {
      throw new Error(
        `Record with id ${id} not found after successful update check.`
      );
    }
    return updatedRecord.get({ plain: true }) as Entity;
  };

  delete = async (id: string, isHard: boolean): Promise<boolean> => {
    if (isHard) {
      const affectedCount = await this.model.destroy({ where: { id } as {id : string} });
      return affectedCount > 0;
    } else {
      const [affectedCount] = await this.model.update(
        { status: BaseStatus.Deleted } as any,
        { where: { id } as any }
      );
      return affectedCount > 0;
    }
  };
}
