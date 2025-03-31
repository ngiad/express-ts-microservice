import { Request, Response } from "express";
import { IBranchService, ICommandHandler, ICreateBranchService } from "../../interface";
import {
  ResponseSuccess,
  ResponseSuccessCreate,
  ResponseSuccessDelete,
  ResponseSuccessDetail,
  ResponseSuccessList,
  ResponseSuccessUpdate,
} from "../../../../share/response/response.success";
import { BranchType } from "../../model";
import { pagingDTO } from "../../../../share/model/paging";
import { BranchCondType } from "../../model/dto";

export class BranchHttpService {
  constructor(
    private readonly service: IBranchService,
    private readonly createHandler : ICommandHandler<ICreateBranchService, BranchType>,
  ) {}

  createAPI = async (req: Request, res: Response) => {
    new ResponseSuccessCreate<BranchType>(
      await this.createHandler.execute({data : req.body})
    ).send(res);
  };

  detailAPI = async (req: Request, res: Response) => {
    new ResponseSuccessDetail<BranchType>(
      await this.service.detail(req.params.id)
    ).send(res);
  };

  listAPI = async (req: Request, res: Response) => {
    new ResponseSuccessList<{ data: Array<BranchType>; paging: pagingDTO }>(
      await this.service.list(
        req.query as unknown as pagingDTO & BranchCondType
      )
    ).send(res);
  };

  updateAPI = async (req: Request, res: Response) => {
    new ResponseSuccessUpdate<BranchType>(
      await this.service.update(req.params.id, req.body)
    ).send(res);
  };

  deleteAPI = async (req: Request, res: Response) => {
    new ResponseSuccessDelete<boolean>(
      await this.service.delete(req.params.id)
    ).send(res);
  };

  byCond = async(req: Request, res: Response) => {
    new ResponseSuccess<BranchType>(
      await this.service.byCond(
        req.query as unknown as pagingDTO & BranchCondType
      )
    ).send(res);
  }
}
