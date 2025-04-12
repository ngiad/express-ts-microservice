import { Request, Response } from "express";
import { ICommandHandler, IRPCBaseQueryRepository } from "../../../../../share/interface";
import { RPCBaseService } from "../../../../../share/rpc/rpc-base";
import { UserCondType, UserResponseType } from "../../../application/dto";
import { IRPCUserService } from "../../interface";
import { IVerifyTokenCommand } from "../../../application/services/IAuthService";
import { ResponseSuccess } from "../../../../../share/response/response.success";

export class RPCUserService
  extends RPCBaseService<UserResponseType, UserCondType>
  implements IRPCUserService
{
  constructor(
    _rpcQueryRepo: IRPCBaseQueryRepository<
      UserResponseType,
      UserCondType
    >,
    private readonly verify : ICommandHandler<IVerifyTokenCommand,UserResponseType>
  ) {
    super(_rpcQueryRepo)
  }

  verifytoken = async(req: Request, res: Response): Promise<void> => {
    const user : UserResponseType = await this.verify.execute({data : req.headers.token ?? req.cookies.token ?? req.body.token ?? ""})
    new ResponseSuccess<UserResponseType>(user).send(res)
  }
}
