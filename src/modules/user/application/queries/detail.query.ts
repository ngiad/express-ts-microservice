import { Redis } from "../../../../share/component/redis";
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

export class ProxyUserDetailQuery implements IQueryHandler<IUserDetailQuery,UserResponseType>{
    private cacheKey = 'user_detail'
    private lvTTL = 5
    private getRedis = () => Redis.init()
    private strategy = Redis.strategy<UserResponseType>
    private invalidate = Redis.invalidate
    constructor(
        private readonly origin: IQueryHandler<IUserDetailQuery,UserResponseType>,
    ){}

    query = async(command: IUserDetailQuery): Promise<UserResponseType> => {
        return await this.strategy({
            keyParts: [this.cacheKey, command.id],
            prefix: 'api',
            ttlLevel: this.lvTTL,
            fetch: async () => {
                return await this.origin.query(command);
        }})
    }
}
