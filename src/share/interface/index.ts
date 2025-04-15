import { Request, Response } from "express";
import { pagingDTO } from "../model/paging";
import { z } from "zod";

export interface IBaseHttpService<Entity, CondType, CreateDTO, UpdateDTO> {
  createAPI(req: Request, res: Response): Promise<void>;
  detailAPI(req: Request, res: Response): Promise<void>;
  listAPI(req: Request, res: Response): Promise<void>;
  updateAPI(req: Request, res: Response): Promise<void>;
  deleteAPI(req: Request, res: Response): Promise<void>;
  byCondAPI(req: Request, res: Response): Promise<void>;
}



export interface IUseCase<CreateType, UpdateType, CondType, Entity> {
  create(data: CreateType): Promise<Entity>;
  update(id: string, data: UpdateType): Promise<Entity>;
  delete(id: string, isHard: boolean): Promise<boolean>;
  detail(id: string): Promise<Entity | null>;
  list(query: pagingDTO & CondType): Promise<{data : Array<Entity>, paging : pagingDTO}>;
  byCond(cond: CondType): Promise<Entity | null>;
  byName(name: string): Promise<Entity | null>;
}

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

export interface IRPCBaseService {
    getByIdRPC(req: Request, res: Response): void;
    getbylistRPC(req: Request, res: Response): void;
    getByCondRPC(req: Request, res: Response): void;
  }

export interface IRPCBaseQueryRepository<Entity, CondType> {
    getById(id: string): Promise<Entity | null>;
    getByCond(cond: CondType): Promise<Entity | null>;
    getByList(cond: CondType): Promise<Array<Entity>>;
}




export interface IVerifyGlobalCommand {
  data : string
}


export enum UserRole{
  BRANCH = "branch",
  ADMIN = "admin",
  USER = "user"
}

export enum UserStatus {
    Active = "active",
    Inactive = "inactive",
    Deleted = "deleted",
    Banner = "banner",
    Featured = "featured",
}

export const UserGlobalResponseSchema = z.object({
  name: z.string().min(1).optional(),
  image: z.string().nullable().optional(),
  email: z.string().email().optional().nullable(),
  username: z.string().min(6),
  role: z.nativeEnum(UserRole).optional(),
  location: z.string().optional().nullable(),
  bio: z.string().optional().nullable(),
  id: z.string().uuid(),
  status: z.nativeEnum(UserStatus),
});

export type UserResponseGlobalType = z.infer<typeof UserGlobalResponseSchema>;


export interface IIntrospect{
  verify(token : string):Promise<UserResponseGlobalType>
}
