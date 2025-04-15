import { IRPCBaseQueryRepository, IRPCBaseService } from "../../../../share/interface";
import { RPCBaseService } from "../../../../share/rpc/rpc-base";
import { ProductType } from "../../model";
import { ProductCondType } from "../../model/dto";

export class ProductRPCService
  extends RPCBaseService<ProductType, ProductCondType>
  implements IRPCBaseService
{
  constructor(
    protected readonly _rpcQueryRepo: IRPCBaseQueryRepository<ProductType, ProductCondType>
  ) {
    super(_rpcQueryRepo);
  }
}
