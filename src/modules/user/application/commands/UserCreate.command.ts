import { v7 } from "uuid";
import { ICommandHandler } from "../../../../share/interface";
import { IUserRepository } from "../../domain/repositories/user.repository";
import { ErrRegisterValidation, ErrUserCreated } from "../dto/error";
import { IBcryptService } from "../services/IBcryptService";
import { UserStatus } from "../../domain/entities/user.entity";
import { UserCreateSchema, UserResponseSchema, UserResponseType, UserRole } from "../dto";
import { IUserCreateCommand } from "../services/IUserService";

export class UserCreateCommand
  implements ICommandHandler<IUserCreateCommand, UserResponseType>
{
  constructor(
    private readonly _repository: IUserRepository,
    private readonly _bcryptService : IBcryptService,
  ) {}
  execute = async (command: IUserCreateCommand): Promise<UserResponseType> => {
    const { data } = command;
    const dataValidate = UserCreateSchema.safeParse(data);

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
    
    return UserResponseSchema.parse(await this._repository.insert(newUser))
  };
}
