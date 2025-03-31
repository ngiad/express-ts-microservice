import { Op } from "sequelize";
import { IQueryHandler } from "../../../share/interface";
import { pagingDTO, paginSchema } from "../../../share/model/paging";
import { IBranchRepository, IGetListBranch } from "../interface";
import { BranchStatus, BranchType } from "../model";
import { BranchCondSchema } from "../model/dto";


export class GetListBranch implements IQueryHandler<IGetListBranch, { data: Array<BranchType>; paging: pagingDTO }> {
  constructor(private readonly _repository: IBranchRepository) {}

  query = async (command: IGetListBranch): Promise<{ data: Array<BranchType>; paging: pagingDTO }> => {
    const paging = paginSchema.parse(command.query);
    const cond = BranchCondSchema.parse(command.query);

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
    
}