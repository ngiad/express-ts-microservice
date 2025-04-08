import { IRPCBaseQueryRepository, IRPCBaseService } from "../../../../share/interface";
import { RPCBaseService } from "../../../../share/rpc/rpc-base";
import { CategoryType } from "../../model";
import { CategoryCondType } from "../../model/dto";


export class RPCCategoryService extends RPCBaseService<CategoryType, CategoryCondType> implements IRPCBaseService {
  constructor(
    _rpcCategoryQueryRepo:  IRPCBaseQueryRepository<CategoryType, CategoryCondType>
  ) {
    super(_rpcCategoryQueryRepo);
  }
}