import { Sequelize } from "sequelize";
import { ICommandRepository, IQueryRepository, IRepository } from "../interface";
import { pagingDTO } from "../model/paging";
import { BaseStatus } from "../model/base-status";


export abstract class BaseRepoSequelize<
  Entity extends {[key: string]: any},
  CondType,
  UpdateType extends {[key: string]: any}
> implements IRepository<Entity, CondType, UpdateType> {
  constructor(
    private readonly queryRepo :IQueryRepository<Entity, CondType>,
    private readonly commandRepo: ICommandRepository<Entity, UpdateType>,
  ) {}

  detail = async (id: string): Promise<Entity | null> => {
    return this.queryRepo.detail(id);
  };

  list = async (cond: CondType, paging: pagingDTO): Promise<{data : Array<Entity>, paging : pagingDTO}> => {
    return this.queryRepo.list(cond, paging);
  };

  insert = async (data: Entity): Promise<Entity> => {
    return this.commandRepo.insert(data);
  };

  update = async (id: string, data: UpdateType): Promise<Entity> => {
    return this.commandRepo.update(id, data);
  };

  delete = async (id: string, isHard: boolean): Promise<boolean> => {
    return this.commandRepo.delete(id, isHard);
  };

  byName = async (name: string): Promise<Entity | null> => {
    return this.queryRepo.byName(name);
  };

  byCond = async (cond: CondType): Promise<Entity | null> => {
    return this.queryRepo.byCond(cond);
  }
}