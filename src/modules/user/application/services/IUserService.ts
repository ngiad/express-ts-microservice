import { pagingDTO } from "../../../../share/model/paging"
import { UserCondType, UserCreateType, UserUpdatePasswordType, UserUpdateProfileType, UserUpdateType } from "../dto"

export interface IUserUpdateProfileCommand {
    id : string
    data : UserUpdateProfileType
}

export interface IUserUpdateCommand {
    id : string
    data : UserUpdateType
}

export interface IUserDeleteCommand{
    id : string
}

export interface IUserUpdatePasswordCommand{
    id : string
    data : UserUpdatePasswordType
}

export interface IUserDetailQuery{
    id : string
}

export interface IUserListQuery{
    query : UserCondType & pagingDTO
}

export interface IUserByCondQuery{
    query : UserCondType
}

export interface IUserCreateCommand{
    data : UserCreateType
}
