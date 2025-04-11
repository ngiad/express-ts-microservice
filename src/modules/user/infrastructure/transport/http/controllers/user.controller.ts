import { Request, Response } from "express";
import {
  ICommandHandler,
  IQueryHandler,
} from "../../../../../../share/interface";
import { pagingDTO } from "../../../../../../share/model/paging";
import { BaseHttpService } from "../../../../../../share/transport/base-http-service";
import {
  UserCondType,
  UserCreateType,
  UserResponseType,
  UserUpdatePasswordType,
  UserUpdateProfileType,
  UserUpdateType,
} from "../../../../application/dto";
import {
  ILoginCommand,
  IResisterCommand,
  RegisterType,
} from "../../../../application/services/IAuthService";
import { TokenType } from "../../../../application/services/ITokenService";
import {
  IUserByCondQuery,
  IUserCreateCommand,
  IUserDeleteCommand,
  IUserDetailQuery,
  IUserListQuery,
  IUserUpdateCommand,
} from "../../../../application/services/IUserService";
import { IUserHttpService } from "../../../interface";
import { ResponseSuccess } from "../../../../../../share/response/response.success";

export class UserHttpService
  extends BaseHttpService<
    UserResponseType,
    UserCondType,
    UserCreateType | RegisterType,
    UserUpdateType | UserUpdateProfileType | UserUpdatePasswordType
  >
  implements IUserHttpService
{
  constructor(
    createHandler: ICommandHandler<IUserCreateCommand, UserResponseType>,
    detailQuery: IQueryHandler<IUserDetailQuery, UserResponseType>,
    updateHandler: ICommandHandler<IUserUpdateCommand, UserResponseType>,
    listQuery: IQueryHandler<
      IUserListQuery,
      { data: Array<UserResponseType>; paging: pagingDTO }
    >,
    deleteHandler: ICommandHandler<IUserDeleteCommand, boolean>,
    byCondQuery: IQueryHandler<IUserByCondQuery, UserResponseType>,
    private readonly login: ICommandHandler<ILoginCommand, TokenType>,
    private readonly resister: ICommandHandler<IResisterCommand, TokenType>
  ) {
    super(
      createHandler,
      detailQuery,
      updateHandler,
      listQuery,
      deleteHandler,
      byCondQuery
    );
  }

  loginAPI = async (req: Request, res: Response) => {
    new ResponseSuccess<TokenType>(await this.login.execute({
        data : req.body
     })).send(res)
  };

  registerAPI = async(req: Request, res: Response): Promise<void> =>{
    new ResponseSuccess<TokenType>(await this.resister.execute({
        data : req.body
     })).send(res)
  }
}
