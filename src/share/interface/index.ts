import { pagingDTO } from "../model/paging";

export interface IRepository<Entity, CondType, UpdateDTO> 
  extends IQueryRepository<Entity, CondType>, ICommandRepository<Entity, UpdateDTO> {}

export interface IQueryRepository<Entity, CondType> {
  detail(id: string): Promise<Entity | null>;
  list(cond: CondType, paging: pagingDTO): Promise<{data : Array<Entity>, paging : pagingDTO}>;
  byName(name: string): Promise<Entity | null>;
  byCond(cond: CondType): Promise<Entity | null>;
}

export interface ICommandRepository<Entity, UpdateDTO> {
  insert(data: Entity): Promise<Entity>;
  update(id: string, data: UpdateDTO): Promise<Entity>;
  delete(id: string, isHard: boolean): Promise<boolean>;
}

export interface IBaseCreateService<EntityCreateType>{
    data : EntityCreateType;
}

export interface IBaseUpdateService<EntityUpdateType>{
    id : string;
    data : EntityUpdateType;
}


export interface IBaseDeleteService{
  id : string;
}

export interface ICommandHandler<Cmd, Result>{
  execute(command : Cmd): Promise<Result>; 
}


export interface IBaseGetDetail{
    id : string;
}

export interface IBaseGetList<CondType,pagingType>{
    query : CondType & pagingType;
}

export interface IBaseGetByCond<CondType>{
    query : CondType;
}

export interface IQueryHandler<Query, Result>{
  query(command : Query): Promise<Result>; 
}