import { ICommandHandler } from "../../../../share/interface";
import { IUserRepository } from "../../domain/repositories/user.repository";
import { UserResponseSchema, UserResponseType, UserRole, UserStatus } from "../dto";
import { ErrTokenNotfound } from "../dto/error";
import { IVerifyTokenCommand } from "../services/IAuthService";
import { ITokenService } from "../services/ITokenService";

export class VerifyTokenCommand implements ICommandHandler<IVerifyTokenCommand,UserResponseType>{
    constructor(
            private readonly _repository: IUserRepository,
            private readonly _tokenService: ITokenService
    ){}

    execute = async(command: IVerifyTokenCommand): Promise<UserResponseType> => {
         const tokenValidate = command.data 
         if(!tokenValidate) throw ErrTokenNotfound
         const payload = this._tokenService.verifyToken(tokenValidate)
         
         const user = await this._repository.byCond({id : payload.sub})
         return UserResponseSchema.parse(user)
    }
}