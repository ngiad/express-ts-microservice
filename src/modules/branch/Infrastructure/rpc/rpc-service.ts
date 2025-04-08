import { IRPCBranchQueryRepository, IRPCBranchService } from "../../interface";
import { BranchType } from "../../model";
import { RPCBaseService } from "../../../../share/rpc/rpc-base";
import { BranchCondType } from "../../model/dto";

export class RPCBranchService extends RPCBaseService<BranchType,BranchCondType> implements IRPCBranchService {
  constructor(
    _rpcBranchQueryRepo: IRPCBranchQueryRepository
  ) {
    super(_rpcBranchQueryRepo);
  }
}
