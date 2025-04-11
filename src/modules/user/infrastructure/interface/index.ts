import { Request, Response } from "express";
import { IBaseHttpService } from "../../../../share/interface";
import {
  UserCondType,
  UserCreateType,
  UserResponseType,
  UserUpdatePasswordType,
  UserUpdateProfileType,
  UserUpdateType,
} from "../../application/dto";
import { RegisterType } from "../../application/services/IAuthService";

export interface IUserHttpService
  extends IBaseHttpService<
    UserResponseType,
    UserCondType,
    UserCreateType | RegisterType,
    UserUpdateType | UserUpdateProfileType | UserUpdatePasswordType
  > {
  loginAPI(req: Request, res: Response): Promise<void>;
  registerAPI(req: Request, res: Response): Promise<void>;
}
