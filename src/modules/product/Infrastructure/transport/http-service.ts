import { Request, Response } from "express";
import {
  IBaseCreateService,
  IBaseDeleteService,
  IBaseGetByCond,
  IBaseGetDetail,
  IBaseGetList,
  IBaseUpdateService,
  ICommandHandler,
  IQueryHandler,
} from "../../../../share/interface";
import { pagingDTO } from "../../../../share/model/paging";
import { BaseHttpService } from "../../../../share/transport/base-http-service";
import {
  IRPCCategoryQueryRepository,
  IPRCProductBranchQueryRepository,
  IProductHttpService,
} from "../../interface";
import { ProductFullDataType, ProductType } from "../../model";
import {
  ProductCondType,
  ProductCreateType,
  ProductUpdateType,
} from "../../model/dto";
import { ResponseSuccessDetail } from "../../../../share/response/response.success";

export class ProductHttpService
  extends BaseHttpService<
    ProductType,
    ProductCondType,
    ProductCreateType,
    ProductUpdateType
  >
  implements IProductHttpService {
  private readonly productBranchRepo: IPRCProductBranchQueryRepository;
  private readonly productCategoryRepo: IRPCCategoryQueryRepository;

  constructor(handlers: {
    createHandler: ICommandHandler<IBaseCreateService<ProductCreateType>, ProductType>;
    detailQuery: IQueryHandler<IBaseGetDetail, ProductType>;
    updateHandler: ICommandHandler<IBaseUpdateService<ProductUpdateType>, ProductType>;
    listQuery: IQueryHandler<
      IBaseGetList<ProductCondType, pagingDTO>,
      { data: Array<ProductType>; paging: pagingDTO }
    >;
    deleteHandler: ICommandHandler<IBaseDeleteService, boolean>;
    bycondQuery: IQueryHandler<IBaseGetByCond<ProductCondType>, ProductType>;
    productBranchRepo: IPRCProductBranchQueryRepository;
    productCategoryRepo: IRPCCategoryQueryRepository;
  }) {
    super(handlers);
    this.productBranchRepo = handlers.productBranchRepo;
    this.productCategoryRepo = handlers.productCategoryRepo;
  }

  // rpc tầng transport
  detailAPI = async (req: Request, res: Response): Promise<void> => {
    const productId = req.params.id;
    if (!productId) throw new Error("productId not found");

    const product = await this.detailQuery!.query({ id: productId }); // Use non-null assertion here

    const branchId = product?.branchId;
    const categoryId = product?.categoryId;
    if (branchId) {
      const branchData = await this.productBranchRepo.getBranchById(branchId);
      const productWithBranch: ProductFullDataType = {
        ...product,
        ...(branchData !== null ? { branch: branchData } : {}),
      };
      Object.assign(product, productWithBranch);
    }
    if (categoryId) {
      const categoryData = await this.productCategoryRepo.getCategoryById(
        categoryId
      );
      const productWithCategory: ProductFullDataType = {
        ...product,
        ...(categoryData !== null ? { category: categoryData } : {}),
      };

      Object.assign(product, productWithCategory);
    }
    new ResponseSuccessDetail<ProductFullDataType>(product).send(res);
  };
}