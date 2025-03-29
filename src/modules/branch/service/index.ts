import { v7 } from "uuid";
import { IRepository } from "../../../share/interface";
import { IBranchService } from "../interface";
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

export class BranchService implements IBranchService {
  constructor(
    private readonly _repository: IRepository<
      BranchType,
      BranchCondType,
      BranchUpdateType
    >
  ) {}

  create = async (data: BranchCreateType): Promise<BranchType> => {
    const validateBranchCreate = BranchCreateSchema.safeParse(data);

    if (validateBranchCreate.error) {
      throw ErrBranchValueValidate;
    }

    const branchExits = await this._repository.byName(data.name);
    if (branchExits) {
      throw ErrBranchNameDublicate;
    }

    const branch: BranchType = {
      id: v7(),
      ...data,
      createdAt: new Date(),
      updatedAt: new Date(),
      status: BranchStatus.Active,
    };
    return await this._repository.insert(branch);
  };

  detail = async (id: string): Promise<BranchType | null> => {
    if (!id) {
      throw ErrBranchIdInvalid;
    }
    return this._repository.detail(id);
  };

  list = async (
    query: pagingDTO & BranchCondType
  ): Promise<Array<BranchType>> => {
    const pagingValidation = paginSchema.safeParse(query);
    if (!pagingValidation.success) {
    }

    const condValidation = BranchCondSchema.safeParse(query);
    if (!condValidation.success) {
    }

    const paging = pagingValidation.data ?? {
      page: 1,
      limit: 20,
    };
    const cond = condValidation.data ?? {};
    return this._repository.list(cond, paging);
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

  // byName = async (name: string): Promise<BranchType | null> => {
  //     return this._repository.byName(name);
  // };
}
