import {
    ICommandHandler,
    IIntrospect,
    IVerifyGlobalCommand,
    UserResponseGlobalType,
} from "../../interface";

export class VerifyGlobalCommand
    implements ICommandHandler<IVerifyGlobalCommand, UserResponseGlobalType> {
    constructor(private readonly tntrospect: IIntrospect) { }
    execute = async (
        command: IVerifyGlobalCommand
    ): Promise<UserResponseGlobalType> => {
        return await this.tntrospect.verify(command.data)
    };
}
