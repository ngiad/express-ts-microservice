import { IRepository, IRPCBaseQueryRepository } from "../../../../share/interface";
import { UserCondType, UserUpdatePasswordType, UserUpdateProfileType, UserUpdateType } from "../../application/dto";
import { UserType } from "../entities/user.entity";


export interface IUserRepository
  extends IRepository<UserType, UserCondType, UserUpdateType | UserUpdatePasswordType | UserUpdateProfileType> {}



export interface IRPCUserRepository extends IRPCBaseQueryRepository<UserType, UserCondType>{}
