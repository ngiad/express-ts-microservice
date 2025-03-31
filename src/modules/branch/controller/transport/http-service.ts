import { Request, Response } from "express";
import { IBranchService, ICreateBranchService, IDeleteBranchService, IGetByCondBranch, IGetDetailBranch, IGetListBranch, IUpdateBranchService } from "../../interface";
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
import { ICommandHandler, IQueryHandler } from "../../../../share/interface";

export class BranchHttpService {
  constructor(
    private readonly createHandler : ICommandHandler<ICreateBranchService, BranchType>,
    private readonly detailQuery : IQueryHandler<IGetDetailBranch, BranchType>,
    private readonly updateHandler : ICommandHandler<IUpdateBranchService, BranchType>,
    private readonly listQuery : IQueryHandler<IGetListBranch, { data: Array<BranchType>; paging: pagingDTO }>,
    private readonly deleteHandler : ICommandHandler<IDeleteBranchService, boolean>,
    private readonly bycondQuery : IQueryHandler<IGetByCondBranch, BranchType>,
  ) {}

  createAPI = async (req: Request, res: Response) => {
    new ResponseSuccessCreate<BranchType>(
      await this.createHandler.execute({data : req.body})
    ).send(res);
  };

  detailAPI = async (req: Request, res: Response) => {
    new ResponseSuccessDetail<BranchType>(
      await this.detailQuery.query({id : req.params.id})
    ).send(res);
  };

  listAPI = async (req: Request, res: Response) => {
    new ResponseSuccessList<{ data: Array<BranchType>; paging: pagingDTO }>(
      await this.listQuery.query(
        {query : req.query as unknown as pagingDTO & BranchCondType}  
      )
    ).send(res);
  };

  updateAPI = async (req: Request, res: Response) => {
    new ResponseSuccessUpdate<BranchType>(
      await this.updateHandler.execute({id : req.params.id, data : req.body})
    ).send(res);
  };

  deleteAPI = async (req: Request, res: Response) => {
    new ResponseSuccessDelete<boolean>(
      await this.deleteHandler.execute({id : req.params.id})
    ).send(res);
  };

  byCond = async(req: Request, res: Response) => {
    new ResponseSuccess<BranchType>(
      await this.bycondQuery.query(
       {query : req.query as unknown as pagingDTO & BranchCondType} 
      )
    ).send(res);
  }
}
