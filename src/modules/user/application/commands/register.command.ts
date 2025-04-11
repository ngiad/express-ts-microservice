import { v7 } from "uuid";
import { ICommandHandler } from "../../../../share/interface";
import { IUserRepository } from "../../domain/repositories/user.repository";
import { ErrRegisterValidation, ErrUserCreated } from "../dto/error";
import { IResisterCommand, registerSchema } from "../services/IAuthService";
import { IBcryptService } from "../services/IBcryptService";
import { ITokenService } from "../services/ITokenService";
import { UserStatus, UserType } from "../../domain/entities/user.entity";
import { UserRole } from "../dto";

export class RegisterCommand
  implements ICommandHandler<IResisterCommand, {token : string}>
{
  constructor(
    private readonly _repository: IUserRepository,
    private readonly _bcryptService : IBcryptService,
    private readonly _tokenService : ITokenService
  ) {}
  execute = async (command: IResisterCommand): Promise<{token : string}> => {
    const { data } = command;
    const dataValidate = registerSchema.safeParse(data);

    if (dataValidate.error) {
      throw ErrRegisterValidation;
    }

    const userExits = await this._repository.byCond({
      username: dataValidate.data.username,
    });

    if (userExits) {
      throw ErrUserCreated;
    }

    const passwordHasd = await this._bcryptService.hash(dataValidate.data.password)

    const newUser = {
      id: v7(),
      ...dataValidate.data,
      password : passwordHasd,
      status: UserStatus.Active,
      role : UserRole.USER,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    await this._repository.insert(newUser);
    return this._tokenService.generateToken({sub : newUser.id})
  };
}
