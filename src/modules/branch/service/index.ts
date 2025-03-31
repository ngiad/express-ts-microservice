import { v7 } from "uuid";
import { IBranchRepository, IBranchService } from "../interface";
import { BranchStatus, BranchType } from "../model";
import {
  BranchCondSchema,
  BranchCondType,
  BranchCreateSchema,
  BranchCreateType,
  BranchUpdateSchema,
  BranchUpdateType,
} from "../model/dto";
import {
  ErrBranchDeleted,
  ErrBranchIdInvalid,
  ErrBranchNameDublicate,
  ErrBranchNotfound,
  ErrBranchValueValidate,
} from "../model/error";
import { pagingDTO, paginSchema } from "../../../share/model/paging";
import { Op } from "sequelize";

export class BranchService implements IBranchService {
  constructor(private readonly _repository: IBranchRepository) {}

  create = async (data: BranchCreateType): Promise<BranchType> => {
    // const validateBranchCreate = BranchCreateSchema.safeParse(data);

    // if (validateBranchCreate.error) {
    //   throw ErrBranchValueValidate;
    // }

    // const branchExits = await this._repository.byName(data.name);
    // if (branchExits) {
    //   throw ErrBranchNameDublicate;
    // }

    // const branch: BranchType = {
    //   id: v7(),
    //   ...validateBranchCreate.data,
    //   createdAt: new Date(),
    //   updatedAt: new Date(),
    //   status: BranchStatus.Active,
    // };
    // return await this._repository.insert(branch);
    throw new Error("Method not implemented.");
  };

  detail = async (id: string): Promise<BranchType | null> => {
    if (!id) {
      throw ErrBranchIdInvalid;
    }
    return this._repository.detail(id);
  };

  list = async (
    query: pagingDTO & BranchCondType
  ): Promise<{ data: Array<BranchType>; paging: pagingDTO }> => {
    const paging = paginSchema.parse(query);
    const cond = BranchCondSchema.parse(query);

    const whereCondition: any = {
      ...(cond.id && { id: cond.id }),
      ...(cond.name && { name: { [Op.like]: `%${cond.name}%` } }),
      ...(cond.description && {
        description: { [Op.like]: `%${cond.description}%` },
      }),
      ...(cond.status
        ? Array.isArray(cond.status)
          ? { status: { [Op.in]: cond.status } }
          : { status: cond.status }
        : { status: { [Op.ne]: BranchStatus.Deleted } }),
      ...(cond.createdAt && { createdAt: { [Op.gte]: cond.createdAt } }),
      ...(cond.updatedAt && { updatedAt: { [Op.lte]: cond.updatedAt } }),
    };

    return {
      data: await this._repository.list(whereCondition, paging),
      paging: paging,
    };
  };

  update = async (id: string, data: BranchUpdateType): Promise<BranchType> => {
    const branchUpdateValidate = BranchUpdateSchema.safeParse(data);
    if (!branchUpdateValidate.success) {
      throw ErrBranchValueValidate;
    }

    if (!id) throw ErrBranchIdInvalid;

    if (branchUpdateValidate.error) {
      throw ErrBranchValueValidate;
    }

    const branch = await this._repository.detail(id);
    if (!branch) throw ErrBranchNotfound;

    if (branch.status === BranchStatus.Deleted) throw ErrBranchDeleted;
    return this._repository.update(id, data);
  };

  delete = async (id: string): Promise<boolean> => {
    if (!id) throw ErrBranchIdInvalid;
    const branch = await this._repository.detail(id);
    if (!branch) throw ErrBranchNotfound;

    if (branch.status === BranchStatus.Deleted) throw ErrBranchDeleted;
    return this._repository.delete(id, false);
  };

  byCond = async (query: BranchCondType): Promise<BranchType | null> => {
    const cond = BranchCondSchema.parse(query);
    const whereCondition: BranchCondType = {
      ...(cond.id && { id: cond.id }),
      ...(cond.name && { name: { [Op.like]: `%${cond.name}%` } }),
      ...(cond.description && {
        description: { [Op.like]: `%${cond.description}%` },
      }),
      ...(cond.status
        ? Array.isArray(cond.status)
          ? { status: { [Op.in]: cond.status } }
          : { status: cond.status }
        : { status: { [Op.ne]: BranchStatus.Deleted } }),
      ...(cond.createdAt && { createdAt: { [Op.gte]: cond.createdAt } }),
      ...(cond.updatedAt && { updatedAt: { [Op.lte]: cond.updatedAt } }),
    };
    return this._repository.byCond(whereCondition);
  };

  listByCond = async (
    query: BranchCondType & pagingDTO
  ): Promise<{ data: Array<BranchType>; paging: pagingDTO }> => {
    const paging = paginSchema.parse(query);
    const cond = BranchCondSchema.parse(query);

    const whereCondition: any = {
      ...(cond.id && { id: cond.id }),
      ...(cond.name && { name: { [Op.like]: `%${cond.name}%` } }),
      ...(cond.description && {
        description: { [Op.like]: `%${cond.description}%` },
      }),
      ...(cond.status
        ? Array.isArray(cond.status)
          ? { status: { [Op.in]: cond.status } }
          : { status: cond.status }
        : { status: { [Op.ne]: BranchStatus.Deleted } }),
      ...(cond.createdAt && { createdAt: { [Op.gte]: cond.createdAt } }),
      ...(cond.updatedAt && { updatedAt: { [Op.lte]: cond.updatedAt } }),
    };

    return {
      data: await this._repository.listByCond(whereCondition, paging),
      paging: paging,
    };
  };

  // byName = async (name: string): Promise<BranchType | null> => {
  //     return this._repository.byName(name);
  // };
}
