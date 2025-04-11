import { ICommandHandler } from "../../../../share/interface";
import { IUserRepository } from "../../domain/repositories/user.repository";
import { UserResponseSchema, UserResponseType, UserUpdateProfileSchema } from "../dto";
import { ErrUserIdValidateWrong, ErrUserUpdateProfileValidate } from "../dto/error";
import { IUserUpdateProfileCommand } from "../services/IUserService";



export class UserUpdateProfileCommand implements ICommandHandler<IUserUpdateProfileCommand,UserResponseType>  {
    constructor(
        private readonly _repository: IUserRepository,
    ){}

    execute = async(command: IUserUpdateProfileCommand): Promise<UserResponseType> => {
        if(command.id) throw ErrUserIdValidateWrong
        const userUpdateValidate = UserUpdateProfileSchema.safeParse(command.data)

        if(userUpdateValidate.error) throw ErrUserUpdateProfileValidate
        return UserResponseSchema.parse(await this._repository.update(command.id,userUpdateValidate.data))
    }

}