import { ICommandHandler } from "../../../../share/interface";
import { UserStatus } from "../../domain/entities/user.entity";
import { IUserRepository } from "../../domain/repositories/user.repository";
import { ErrUserBanner, ErrUserDeleted, ErrUserIdValidateWrong } from "../dto/error";
import { IUserDeleteCommand } from "../services/IUserService";

export class UserDeleteCommand
  implements ICommandHandler<IUserDeleteCommand, boolean>
{
  constructor(private readonly _repository: IUserRepository) {}

  execute = async (command: IUserDeleteCommand): Promise<boolean> => {
    const user = await this._repository.detail(command.id);
    if (!user) {
      throw ErrUserIdValidateWrong;
    }

    if (user.status === "deleted") {
      throw ErrUserDeleted;
    }

    if(user.status === UserStatus.Banner) throw ErrUserBanner
    return await this._repository.delete(command.id, false);
  };
}
