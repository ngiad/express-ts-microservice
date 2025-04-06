import { Op } from "sequelize";
import { IBaseGetList, IQueryHandler } from "../../../share/interface";
import { pagingDTO, paginSchema } from "../../../share/model/paging";
import { IProductRepository } from "../interface";
import { ProductStatus, ProductType } from "../model";
import { ProductCondSchema, ProductCondType } from "../model/dto";

export class ListProductService
  implements
    IQueryHandler<
      IBaseGetList<ProductCondType, pagingDTO>,
      { data: Array<ProductType>; paging: pagingDTO }
    >
{
  constructor(private readonly _repository: IProductRepository) {}

  query = async (
    command: IBaseGetList<ProductCondType, pagingDTO>
  ): Promise<{ data: Array<ProductType>; paging: pagingDTO }> => {
    const paging = paginSchema.parse(command.query);
    const cond = ProductCondSchema.parse(command.query);

    const whereCondition: any = {
        ...(cond.id && { id: cond.id }),
        ...(cond.name && { name: { [Op.like]: `%${cond.name}%` } }),
        ...(cond.image && { image: cond.image }),
        ...(cond.description && { description: { [Op.like]: `%${cond.description}%` } }),
        ...(cond.location && { location: { [Op.like]: `%${cond.location}%` } }),
        ...(cond.tagLine && { tagLine: { [Op.like]: `%${cond.tagLine}%` } }),
        ...(cond.status
          ? Array.isArray(cond.status)
            ? { status: { [Op.in]: cond.status } }
            : { status: cond.status }
          : { status: { [Op.ne]: ProductStatus.Deleted } }),
        ...(cond.createdAt && { createdAt: { [Op.gte]: cond.createdAt } }),
        ...(cond.updatedAt && { updatedAt: { [Op.lte]: cond.updatedAt } }),
        ...(cond.branchId && { branchId: cond.branchId }),
        ...(cond.categoryId && { categoryId: cond.categoryId }),
        ...(cond.price && { price: cond.price }),
        ...(cond.discount && { discount: cond.discount }),
        ...(cond.stock && { stock: cond.stock }),
        ...(cond.rating && { rating: cond.rating }),
        ...(cond.isFeatured !== undefined && { isFeatured: cond.isFeatured }),
        ...(cond.isBestSeller !== undefined && { isBestSeller: cond.isBestSeller }),
        ...(cond.isNewArrival !== undefined && { isNewArrival: cond.isNewArrival }),
        ...(cond.isOnSale !== undefined && { isOnSale: cond.isOnSale }),
        ...(cond.isTrending !== undefined && { isTrending: cond.isTrending }),
        ...(cond.isRecommended !== undefined && { isRecommended: cond.isRecommended }),
        ...(cond.isPopular !== undefined && { isPopular: cond.isPopular }),
        ...(cond.isLimitedEdition !== undefined && { isLimitedEdition: cond.isLimitedEdition }),
      };

    return await this._repository.list(whereCondition, paging)
  };
}
