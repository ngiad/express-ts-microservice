import {
  BranchCondType,
  BranchCreateType,
  BranchUpdateType,
} from "../../model/dto";
import { BranchType } from "../../model";
import { BaseHttpService } from "../../../../share/transport/base-http-service";
import {
  IBaseCreateService,
  IBaseDeleteService,
  IBaseGetByCond,
  IBaseGetDetail,
  IBaseGetList,
  IBaseUpdateService,
  ICommandHandler,
  IQueryHandler,
} from "../../../../share/interface";
import { pagingDTO } from "../../../../share/model/paging";

export class BranchHttpService extends BaseHttpService<
  BranchType,
  BranchCondType,
  BranchCreateType,
  BranchUpdateType
> {
  constructor(handlers: {
    createHandler: ICommandHandler<IBaseCreateService<BranchCreateType>, BranchType>;
    detailQuery: IQueryHandler<IBaseGetDetail, BranchType>;
    updateHandler: ICommandHandler<IBaseUpdateService<BranchUpdateType>, BranchType>;
    listQuery: IQueryHandler<
      IBaseGetList<BranchCondType, pagingDTO>,
      { data: Array<BranchType>; paging: pagingDTO }
    >;
    deleteHandler: ICommandHandler<IBaseDeleteService, boolean>;
    bycondQuery: IQueryHandler<IBaseGetByCond<BranchCondType>, BranchType>;
  }) {
    super(handlers);
  }
}