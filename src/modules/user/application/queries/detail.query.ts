import { IQueryHandler } from "../../../../share/interface";
import { ErrBranchDeleted } from "../../../branch/model/error";
import { UserType } from "../../domain/entities/user.entity";
import { IUserRepository } from "../../domain/repositories/user.repository";
import { UserResponseSchema, UserResponseType, UserRole, UserStatus } from "../dto";
import { ErrUserBanner, ErrUserIdValidateWrong, ErrUserNotfound } from "../dto/error";
import { IUserDetailQuery } from "../services/IUserService";
import { userErrCheck } from "../utils";


export class UserDetailQuery implements IQueryHandler<IUserDetailQuery,UserResponseType>{
    constructor(
            private readonly _repository: IUserRepository,
    ){}

    query = async(command: IUserDetailQuery): Promise<UserResponseType> => {
        if(!command.id) throw ErrUserIdValidateWrong
        const user = await this._repository.detail(command.id)
        userErrCheck(user as UserType)
        return UserResponseSchema.parse(user)
    }
}