import { Request, Response } from "express";
import { IBaseCreateService, IBaseDeleteService, IBaseGetByCond, IBaseGetDetail, IBaseGetList, IBaseHttpService, IBaseUpdateService, ICommandHandler, IQueryHandler } from "../interface";
import { pagingDTO } from "../model/paging";
import {
  ResponseSuccess,
  ResponseSuccessCreate,
  ResponseSuccessDelete,
  ResponseSuccessDetail,
  ResponseSuccessList,
  ResponseSuccessUpdate,
} from "../response/response.success";
import { ResponseErrorNotFound } from "../response/response.error";

export abstract class BaseHttpService<Entity, CondType, CreateDTO, UpdateDTO> implements IBaseHttpService<Entity, CondType, CreateDTO, UpdateDTO> {
  protected readonly createHandler?: ICommandHandler<IBaseCreateService<CreateDTO>, Entity>;
  protected readonly detailQuery?: IQueryHandler<IBaseGetDetail, Entity>;
  protected readonly updateHandler?: ICommandHandler<IBaseUpdateService<UpdateDTO>, Entity>;
  protected readonly listQuery?: IQueryHandler<
    IBaseGetList<CondType, pagingDTO>,
    { data: Array<Entity>; paging: pagingDTO }
  >;
  protected readonly deleteHandler?: ICommandHandler<IBaseDeleteService, boolean>;
  protected readonly bycondQuery?: IQueryHandler<IBaseGetByCond<CondType>, Entity>;

  constructor(handlers: {
    createHandler?: ICommandHandler<IBaseCreateService<CreateDTO>, Entity>;
    detailQuery?: IQueryHandler<IBaseGetDetail, Entity>;
    updateHandler?: ICommandHandler<IBaseUpdateService<UpdateDTO>, Entity>;
    listQuery?: IQueryHandler<IBaseGetList<CondType, pagingDTO>, { data: Array<Entity>; paging: pagingDTO }>;
    deleteHandler?: ICommandHandler<IBaseDeleteService, boolean>;
    bycondQuery?: IQueryHandler<IBaseGetByCond<CondType>, Entity>;
  }) {
    this.createHandler = handlers.createHandler;
    this.detailQuery = handlers.detailQuery;
    this.updateHandler = handlers.updateHandler;
    this.listQuery = handlers.listQuery;
    this.deleteHandler = handlers.deleteHandler;
    this.bycondQuery = handlers.bycondQuery;
  }

  createAPI = async (req: Request, res: Response) => {
    if (!this.createHandler) throw new ResponseErrorNotFound("Create handler not found");
    new ResponseSuccessCreate<Entity>(await this.createHandler.execute({ data: req.body })).send(res);
  };

  detailAPI = async (req: Request, res: Response) => {
    if (!this.detailQuery) throw new ResponseErrorNotFound("Detail query not found");
    new ResponseSuccessDetail<Entity>(await this.detailQuery.query({ id: req.params.id })).send(res);
  };

  listAPI = async (req: Request, res: Response) => {
    if (!this.listQuery) throw new ResponseErrorNotFound("List query not found");
    new ResponseSuccessList<{ data: Array<Entity>; paging: pagingDTO }>(
      await this.listQuery.query({
        query: req.query as unknown as pagingDTO & CondType,
      })
    ).send(res);
  };

  updateAPI = async (req: Request, res: Response) => {
    if (!this.updateHandler) throw new ResponseErrorNotFound("Update handler not found");
    new ResponseSuccessUpdate<Entity>(await this.updateHandler.execute({ id: req.params.id, data: req.body })).send(res);
  };

  deleteAPI = async (req: Request, res: Response) => {
    if (!this.deleteHandler) throw new ResponseErrorNotFound("Delete handler not found");
    new ResponseSuccessDelete<boolean>(await this.deleteHandler.execute({ id: req.params.id })).send(res);
  };

  byCondAPI = async (req: Request, res: Response) => {
    if (!this.bycondQuery) throw new ResponseErrorNotFound("Bycond query not found");
    new ResponseSuccess<Entity>(
      await this.bycondQuery.query({
        query: req.query as unknown as CondType,
      })
    ).send(res);
  };
}
