import { pagingDTO } from "../model/paging";

export interface IRepository<Entity, CondType, UpdateDTO> 
  extends IQueryRepository<Entity, CondType>, ICommandRepository<Entity, UpdateDTO> {}

export interface IQueryRepository<Entity, CondType> {
  detail(id: string): Promise<Entity | null>;
  list(cond: CondType, paging: pagingDTO): Promise<Array<Entity>>;
  byName(name: string): Promise<Entity | null>;
}

export interface ICommandRepository<Entity, UpdateDTO> {
  insert(data: Entity): Promise<Entity>;
  update(id: string, data: UpdateDTO): Promise<Entity>;
  delete(id: string, isHard: boolean): Promise<boolean>;
}
