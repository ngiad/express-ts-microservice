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

export abstract class BaseHttpService<Entity, CondType, CreateDTO, UpdateDTO> implements IBaseHttpService<Entity, CondType, CreateDTO, UpdateDTO> {
  constructor(
    protected readonly createHandler: ICommandHandler<IBaseCreateService<CreateDTO>,Entity>,
    protected readonly detailQuery: IQueryHandler<IBaseGetDetail, Entity>,
    protected readonly updateHandler: ICommandHandler<IBaseUpdateService<UpdateDTO>, Entity>,
    protected readonly listQuery: IQueryHandler<
      IBaseGetList<CondType, pagingDTO>,
      { data: Array<Entity>; paging: pagingDTO }
    >,
    protected readonly deleteHandler: ICommandHandler<IBaseDeleteService, boolean>,
    protected readonly bycondQuery: IQueryHandler<IBaseGetByCond<CondType>, Entity>
  ) {}

  createAPI = async (req: Request, res: Response) => {
    new ResponseSuccessCreate<Entity>(
      await this.createHandler.execute({ data: req.body })
    ).send(res);
  };

  detailAPI = async (req: Request, res: Response) => {
    new ResponseSuccessDetail<Entity>(
      await this.detailQuery.query({ id: req.params.id })
    ).send(res);
  };

  listAPI = async (req: Request, res: Response) => {
    new ResponseSuccessList<{ data: Array<Entity>; paging: pagingDTO }>(
      await this.listQuery.query({
        query: req.query as unknown as pagingDTO & CondType,
      })
    ).send(res);
  };

  updateAPI = async (req: Request, res: Response) => {
    new ResponseSuccessUpdate<Entity>(
      await this.updateHandler.execute({ id: req.params.id, data: req.body })
    ).send(res);
  };

  deleteAPI = async (req: Request, res: Response) => {
    new ResponseSuccessDelete<boolean>(
      await this.deleteHandler.execute({ id: req.params.id })
    ).send(res);
  };

  byCondAPI = async (req: Request, res: Response) => {
    new ResponseSuccess<Entity>(
      await this.bycondQuery.query({
        query: req.query as unknown as CondType,
      })
    ).send(res);
  };
}
