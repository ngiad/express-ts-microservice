import { Request, Response } from "express";
import { ICategoryService } from "../../interface";
import {
  CategoryCondSchema,
  CategoryCreateSchema,
  CategoryCreateType,
  CategoryUpdateSchema,
} from "../../model/dto";
import { paginSchema } from "../../../../share/model/paging";

export class CategoryHttpService {
  constructor(private readonly service: ICategoryService) {}

  createAPI = async (req: Request, res: Response) => {
    const { success, data, error } = CategoryCreateSchema.safeParse(req.body);

    if (!success) {
      res.status(400).json({ error: error.format() });
      return;
    }
    const result = await this.service.create(data as CategoryCreateType);
    res.status(201).json({
      success: true,
      data: result,
    });
  };

  detailAPI = async (req: Request, res: Response) => {
    const { id } = req.params;

    if (!id) {
      res.status(400).json({ error: "id not found" });
      return;
    }

    const result = await this.service.detail(id);
    res.status(200).json({
      success: true,
      data: result,
    });
    return;
  };

  listAPI = async (req: Request, res: Response) => {
    const pagingValidation = paginSchema.safeParse(req.query);
    if (!pagingValidation.success) {
      res
        .status(400)
        .json({ success: false, error: pagingValidation.error.format() });
      return;
    }

    const condValidation = CategoryCondSchema.safeParse(req.query);
    if (!condValidation.success) {
      res
        .status(400)
        .json({ success: false, error: condValidation.error.format() });
      return;
    }

    const paging = pagingValidation.data;
    const cond = condValidation.data;

    const data = await this.service.list(cond, paging);

    res.json({
      success: true,
      paging: { ...paging, total: paging.total },
      data,
    });
    return;
  };

  updateAPI = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { success, data, error } = CategoryUpdateSchema.safeParse(req.body);
    if (!success) {
      res.status(400).json({ error: error.format() });
      return;
    }

    const result = await this.service.update(id, data);
    res.status(200).json({
      success: true,
      data: result,
    });
    return;
  };

  deleteAPI = async (req: Request, res: Response) => {
    const { id } = req.params;
    if (!id) {
      res.status(400).json({ error: "id not found" });
      return;
    }

    const result = await this.service.delete(id);
    res.status(200).json({
      success: true,
      data: result,
    });
    return;
  };
}
