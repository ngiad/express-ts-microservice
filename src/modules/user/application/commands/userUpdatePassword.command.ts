import { ICommandHandler } from "../../../../share/interface";
import { IUserRepository } from "../../domain/repositories/user.repository";
import {
  UserStatus,
  UserUpdatePasswordSchema,
} from "../dto";
import {
  ErrUserBanner,
  ErrUserDeleted,
  ErrUserIdValidateWrong,
  ErrUserNotfound,
  ErrUseUpdatePasswordValidateWrong,
} from "../dto/error";
import { IBcryptService } from "../services/IBcryptService";
import { ITokenService, TokenType } from "../services/ITokenService";
import { IUserUpdatePasswordCommand } from "../services/IUserService";

export class UserUpdatePasswordCommand
  implements ICommandHandler<IUserUpdatePasswordCommand, TokenType>
{
  constructor(
    private readonly _repository: IUserRepository,
    private readonly _bcryptService: IBcryptService,
    private readonly _tokenService: ITokenService
  ) {}

  execute = async (command: IUserUpdatePasswordCommand): Promise<TokenType> => {
    if (!command.id) throw ErrUserIdValidateWrong;
    const validate = UserUpdatePasswordSchema.safeParse(command.data);

    if (validate.error) throw ErrUseUpdatePasswordValidateWrong;

    const userExits = await this._repository.byCond({ id: command.id });
    if (!userExits) throw ErrUserNotfound;
    if (userExits.status === UserStatus.Deleted) throw ErrUserDeleted;
    if (userExits.status === UserStatus.Banner) throw ErrUserBanner;

    const newPassword = {
      password: await this._bcryptService.hash(command.data.password),
    };

    const newUser = await this._repository.update(command.id, newPassword);
    return this._tokenService.generateToken({ sub: newUser.id });
  };
}
