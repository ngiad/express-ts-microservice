import { v7 } from "uuid";
import {
  ProductBranchSchema,
  ProductCategorySchema,
  ProductStatus,
  ProductType,
} from "../model";
import {
  ErrProductBranchId,
  ErrProductBranchIdNotFound,
  ErrProductCategoryId,
  ErrProductValueValidate,
} from "../model/error";
import { ProductCreateSchema, ProductCreateType } from "../model/dto";
import { IBaseCreateService, ICommandHandler } from "../../../share/interface";
import {
  IPRCProductBranchQueryRepository,
  IProductRepository,
  IRPCCategoryQueryRepository,
} from "../interface";

export class CreateProductService
  implements
    ICommandHandler<IBaseCreateService<ProductCreateType>, ProductType>
{
  constructor(
    private readonly _repository: IProductRepository,
    private readonly _RPCProductBranch: IPRCProductBranchQueryRepository,
    private readonly _RPCProductCategory: IRPCCategoryQueryRepository
  ) {}
  // rpc tầng usecase
  execute = async (
    command: IBaseCreateService<ProductCreateType>
  ): Promise<ProductType> => {
    const validateProductCreate = ProductCreateSchema.safeParse(command.data);

    if (validateProductCreate.error) {
      throw ErrProductValueValidate;
    }

    if (!validateProductCreate.data.branchId) throw ErrProductBranchId;
    if (!validateProductCreate.data.categoryId) throw ErrProductCategoryId;

    const checkBranch = await this._RPCProductBranch.getBranchById(
      validateProductCreate.data.branchId
    );
    if (!checkBranch) throw ErrProductBranchIdNotFound;

    const checkCategory = await this._RPCProductCategory.getCategoryById(
      validateProductCreate.data.categoryId
    );
    if (!checkCategory) throw ErrProductBranchIdNotFound;

    const product: ProductType = {
      id: v7(),
      ...validateProductCreate.data,
      createdAt: new Date(),
      updatedAt: new Date(),
      status: ProductStatus.Active,
    };
    return await this._repository.insert(product);
  };
}
