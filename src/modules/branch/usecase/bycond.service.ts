import { Op } from "sequelize";
import { IBaseGetByCond, IQueryHandler } from "../../../share/interface";
import { IBranchRepository } from "../interface";
import { BranchStatus, BranchType } from "../model";
import { BranchCondSchema, BranchCondType } from "../model/dto";
import { ErrBranchDeleted, ErrBranchNotfound } from "../model/error";


export class GetByCondBranchService implements IQueryHandler<IBaseGetByCond<BranchCondType>, BranchType> {
  constructor(private readonly _repository: IBranchRepository) {}

  query = async (command: IBaseGetByCond<BranchCondType>): Promise<BranchType> => {
    const cond = BranchCondSchema.parse(command.query);
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

    const branch = await this._repository.byCond(whereCondition);
    if (!branch) {
        throw ErrBranchNotfound
    }

    if(branch.status === BranchStatus.Deleted) {
        throw ErrBranchDeleted
    }

    return branch
  };
}