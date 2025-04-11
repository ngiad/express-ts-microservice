import { ICommandHandler } from "../../../../share/interface";
import { IUserRepository } from "../../domain/repositories/user.repository";
import {
    UserResponseSchema,
  UserResponseType,
  UserRole,
  UserStatus,
  UserUpdateSchema,
} from "../dto";
import {
  ErrUserIdValidateWrong,
  ErrUserUpdateProfileValidate,
} from "../dto/error";
import { IUserUpdateCommand } from "../services/IUserService";

export class UserUpdateCommand
  implements ICommandHandler<IUserUpdateCommand, UserResponseType>
{
  constructor(private readonly _repository: IUserRepository) {}

  execute = async (command: IUserUpdateCommand): Promise<UserResponseType> => {
    if (command.id) throw ErrUserIdValidateWrong;
    const userUpdateValidate = UserUpdateSchema.safeParse(command.data);

    if (userUpdateValidate.error) throw ErrUserUpdateProfileValidate;
    return UserResponseSchema.parse(await this._repository.update(command.id, userUpdateValidate.data));
  };
}
