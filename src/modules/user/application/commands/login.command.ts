import { ICommandHandler } from "../../../../share/interface";
import { UserStatus } from "../../domain/entities/user.entity";
import { IUserRepository } from "../../domain/repositories/user.repository";
import { ErrLoginValidation, ErrUserBanner, ErrUserDeleted, ErrUserNotfound } from "../dto/error";
import { ILoginCommand, loginSchema } from "../services/IAuthService";
import { IBcryptService } from "../services/IBcryptService";
import { ITokenService, TokenType } from "../services/ITokenService";

export class LoginCommand
  implements ICommandHandler<ILoginCommand, TokenType>
{
  constructor(
    private readonly _repository: IUserRepository,
    private readonly _bcryptService: IBcryptService,
    private readonly _tokenService: ITokenService
  ){}

  execute = async(command: ILoginCommand): Promise<TokenType> => {
       const dataValidate = loginSchema.safeParse(command.data)
        if(dataValidate.error) throw ErrLoginValidation

        const userExits = await this._repository.byCond({
            username : dataValidate.data.username
        })

        if(!userExits) throw ErrUserNotfound
        if(userExits.status === UserStatus.Deleted) throw ErrUserDeleted
        if(userExits.status === UserStatus.Banner) throw ErrUserBanner
        if(!this._bcryptService.compare(dataValidate.data.password,userExits.password)) throw ErrLoginValidation

        return this._tokenService.generateToken({sub : userExits.id})
  }
}
