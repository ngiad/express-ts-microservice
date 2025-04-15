import { Request, Response } from "express";
import {
  IBaseDeleteService,
  IBaseGetByCond,
  IBaseGetDetail,
  IBaseGetList,
  IBaseHttpService,
  IBaseUpdateService,
  ICommandHandler,
  IQueryHandler,
} from "../../../../../../share/interface";
import { pagingDTO } from "../../../../../../share/model/paging";
import { BaseHttpService } from "../../../../../../share/transport/base-http-service";
import { CartResponseType } from "../../../../domain/entities/card.entity";
import {
  CartCondType,
  CartCreateType,
  CartUpdateType,
} from "../../../../domain/object-value";
import { ICreateCartItemCommand } from "../../../interface";
import {
  ResponseSuccessCreate,
  ResponseSuccessList,
} from "../../../../../../share/response/response.success";
import { ResponseErrorNotFound } from "../../../../../../share/response/response.error";

export class CartHttpController
  extends BaseHttpService<
    CartResponseType,
    CartCondType,
    CartCreateType,
    CartUpdateType
  >
  implements
    IBaseHttpService<
      CartResponseType,
      CartCondType,
      CartCreateType,
      CartUpdateType
    >
{
  constructor(handlers: {
    createHandler: ICommandHandler<ICreateCartItemCommand, CartResponseType>;
    updateHandler: ICommandHandler<
      IBaseUpdateService<CartUpdateType>,
      CartResponseType
    >;
    listQuery: IQueryHandler<
      IBaseGetList<CartCondType, pagingDTO>,
      { data: Array<CartResponseType>; paging: pagingDTO }
    >;
    deleteHandler: ICommandHandler<IBaseDeleteService, boolean>;
  }) {
    super(handlers);
  }

  createAPI = async (req: Request, res: Response) => {
    new ResponseSuccessCreate<CartResponseType>(
      await this.createHandler!.execute({
        data: { ...req.body, userId: res.locals.user.id },
      })
    ).send(res);
  };

  listAPI = async (req: Request, res: Response) => {
    new ResponseSuccessList<{
      data: Array<CartResponseType>;
      paging: pagingDTO;
    }>(
      await this.listQuery!.query({query : {
        ...req.query,
        userId: res.locals.user.id,
      }} as unknown as IBaseGetList<CartCondType, pagingDTO>)
    ).send(res);
  };
}
