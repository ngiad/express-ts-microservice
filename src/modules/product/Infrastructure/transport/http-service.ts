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
import { IProductHttpService } from "../../interface";
import { ProductType } from "../../model";
import {
  ProductCondType,
  ProductCreateType,
  ProductUpdateType,
} from "../../model/dto";

export class ProductHttpService
  extends BaseHttpService<
    ProductType,
    ProductCondType,
    ProductCreateType,
    ProductUpdateType
  >
  implements IProductHttpService
{
  constructor(
    createHandler: ICommandHandler<
      IBaseCreateService<ProductCreateType>,
      ProductType
    >,
    detailQuery: IQueryHandler<IBaseGetDetail, ProductType>,
    updateHandler: ICommandHandler<
      IBaseUpdateService<ProductUpdateType>,
      ProductType
    >,
    listQuery: IQueryHandler<
      IBaseGetList<ProductCondType, pagingDTO>,
      { data: Array<ProductType>; paging: pagingDTO }
    >,
    deleteHandler: ICommandHandler<IBaseDeleteService, boolean>,
    bycondQuery: IQueryHandler<IBaseGetByCond<ProductCondType>, ProductType>
  ) {
    super(
      createHandler,
      detailQuery,
      updateHandler,
      listQuery,
      deleteHandler,
      bycondQuery
    );
  }
}
