import { BranchCondType, BranchCreateType, BranchUpdateType } from "../../model/dto";
import { BranchType } from "../../model";
import { BaseHttpService } from "../../../../share/transport/base-http-service";
import { IBaseCreateService, IBaseDeleteService, IBaseGetByCond, IBaseGetDetail, IBaseGetList, IBaseUpdateService, ICommandHandler, IQueryHandler } from "../../../../share/interface";
import { pagingDTO } from "../../../../share/model/paging";

export class BranchHttpService extends BaseHttpService<
  BranchType,      
  BranchCondType,  
  BranchCreateType,  
  BranchUpdateType  
> {
  constructor(
    createBranchHandler: ICommandHandler<IBaseCreateService<BranchCreateType>, BranchType>,
    detailBranchQuery: IQueryHandler<IBaseGetDetail, BranchType>, 
    updateBranchHandler: ICommandHandler<IBaseUpdateService<BranchUpdateType>, BranchType>,
    listBranchQuery: IQueryHandler<IBaseGetList<BranchCondType,pagingDTO>, { data: Array<BranchType>; paging: pagingDTO }>,
    deleteBranchHandler: ICommandHandler<IBaseDeleteService, boolean>,
    byCondBranchQuery: IQueryHandler<IBaseGetByCond<BranchCondType>, BranchType> 
  ) {
    super(
      createBranchHandler,
      detailBranchQuery,
      updateBranchHandler,
      listBranchQuery,
      deleteBranchHandler,
      byCondBranchQuery
    );
  }
}