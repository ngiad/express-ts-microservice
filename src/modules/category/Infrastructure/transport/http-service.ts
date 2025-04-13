import { Request, Response } from "express";
import { ICategoryService } from "../../interface";
import {
  CategoryCondSchema,
  CategoryCreateSchema,
  CategoryCreateType,
  CategoryUpdateSchema,
} from "../../model/dto";
import { pagingDTO, paginSchema } from "../../../../share/model/paging";
import { ResponseSuccess, ResponseSuccessDelete, ResponseSuccessUpdate } from "../../../../share/response/response.success";
import { CategoryType } from "../../model";
import { ErrCategoryIdValidate } from "../../model/error";

export class CategoryHttpService {
  constructor(private readonly service: ICategoryService) {}

  createAPI = async (req: Request, res: Response) => {
    const { success, data, error } = CategoryCreateSchema.safeParse(req.body);

    if (!success) {
      throw error
    }
    const result = await this.service.create(data as CategoryCreateType);
    new ResponseSuccess<CategoryType>(result).send(res)
  };

  detailAPI = async (req: Request, res: Response) => {
    const { id } = req.params;

    if (!id) {
      throw ErrCategoryIdValidate
    }

    const result = await this.service.detail(id);
    new ResponseSuccess<CategoryType>(result).send(res)
  };

  listAPI = async (req: Request, res: Response) => {
    const pagingValidation = paginSchema.safeParse(req.query);
    if (!pagingValidation.success) {
      throw pagingValidation.error
    }

    const condValidation = CategoryCondSchema.safeParse(req.query);
    if (!condValidation.success) {
      throw condValidation.error
    }

    const paging = pagingValidation.data;
    const cond = condValidation.data;

    const data = await this.service.list(cond, paging);


    new ResponseSuccess<{data : Array<CategoryType>; paging : pagingDTO}>({
      paging: { ...paging, total: paging.total },
      data,
    }).send(res)
  };

  updateAPI = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { success, data, error } = CategoryUpdateSchema.safeParse(req.body);
    if (!success) {
      throw error
    }

    const result = await this.service.update(id, data);
    new ResponseSuccessUpdate<CategoryType>(result).send(res)
  };

  deleteAPI = async (req: Request, res: Response) => {
    const { id } = req.params;
    if (!id) {
      throw ErrCategoryIdValidate
    }

    const result = await this.service.delete(id);
    new ResponseSuccessDelete(result).send(res)
  };
}
