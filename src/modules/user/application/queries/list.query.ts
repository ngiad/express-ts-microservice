import { Op } from "sequelize";
import { IQueryHandler } from "../../../../share/interface";
import { pagingDTO, paginSchema } from "../../../../share/model/paging";
import { IUserRepository } from "../../domain/repositories/user.repository";
import {
  UserCondSchema,
  UserCondType,
  UserResponseSchema,
  UserResponseType,
} from "../dto";
import {  IUserListQuery } from "../services/IUserService";


export class UserListQuery
  implements
    IQueryHandler<
      IUserListQuery,
      { data: UserResponseType[]; paging: pagingDTO }
    >
{
  constructor(private readonly _repository: IUserRepository) {}

  query = async (
    command: IUserListQuery
  ): Promise<{ data: UserResponseType[]; paging: pagingDTO }> => {
    const queryValidate = UserCondSchema.parse(command.query);
    const pagingValidate = paginSchema.parse(command.query);

    const cond = queryValidate;

    const whereCondition: UserCondType = {
      ...(cond.id && {
        id: Array.isArray(cond.id) ? { [Op.in]: cond.id } : cond.id,
      }),
      ...(cond.name && {
        name: Array.isArray(cond.name)
          ? { [Op.or]: cond.name.map((name) => ({ [Op.like]: `%${name}%` })) }
          : { [Op.like]: `%${cond.name}%` },
      }),
      ...(cond.bio && {
        bio: Array.isArray(cond.bio)
          ? { [Op.or]: cond.bio.map((bio) => ({ [Op.like]: `%${bio}%` })) }
          : { [Op.like]: `%${cond.bio}%` },
      }),
      ...(cond.location && {
        location: Array.isArray(cond.location)
          ? {
              [Op.or]: cond.location.map((location) => ({
                [Op.like]: `%${location}%`,
              })),
            }
          : { [Op.like]: `%${cond.location}%` },
      }),
      ...(cond.username && {
        username: Array.isArray(cond.username)
          ? {
              [Op.or]: cond.username.map((username) => ({
                [Op.like]: `%${username}%`,
              })),
            }
          : { [Op.like]: `%${cond.username}%` },
      }),
      ...(cond.email && {
        email: Array.isArray(cond.email)
          ? {
              [Op.or]: cond.email.map((email) => ({ [Op.like]: `%${email}%` })),
            }
          : { [Op.like]: `%${cond.email}%` },
      }),
      ...(cond.status
        ? Array.isArray(cond.status)
          ? { status: { [Op.in]: cond.status } }
          : { status: cond.status }
        : undefined),
      ...(cond.role && {
        role: Array.isArray(cond.role) ? { [Op.in]: cond.role } : cond.role,
      }),
      ...(cond.createdAt && {
        createdAt: Array.isArray(cond.createdAt)
          ? { [Op.between]: cond.createdAt }
          : { [Op.gte]: cond.createdAt },
      }),
      ...(cond.updatedAt && {
        updatedAt: Array.isArray(cond.updatedAt)
          ? { [Op.between]: cond.updatedAt }
          : { [Op.lte]: cond.updatedAt },
      }),
    };
    const { paging, data } = await this._repository.list(
      whereCondition,
      pagingValidate
    );
    return {
      paging,
      data: data.map((item) => UserResponseSchema.parse(item)),
    };
  };
}
