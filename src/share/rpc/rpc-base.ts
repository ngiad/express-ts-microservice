import { Request, Response } from "express";
import { IRPCBaseQueryRepository, IRPCBaseService } from "../interface";
import { ResponseErrorBadRequest, ResponseErrorNotFound } from "../response/response.error";
import { ResponseSuccessDetail, ResponseSuccessList, ResponseSuccessOk } from "../response/response.success";
import { Op } from "sequelize";


export class RPCBaseService<
  Entity extends { [key: string]: any },
  CondType extends { [key: string]: any }
> implements IRPCBaseService
{
  constructor(
    private readonly _rpcQueryRepo: IRPCBaseQueryRepository<Entity, CondType>
  ) {}

  getByIdRPC = async (req: Request, res: Response) => {
    if (!req.params.id) throw new ResponseErrorBadRequest("id is required");

    const entity = await this._rpcQueryRepo.getById(req.params.id);
    if (!entity) throw new ResponseErrorNotFound();

    new ResponseSuccessDetail<Entity>(entity).send(res);
  };

  getbylistRPC = async (req: Request, res: Response) => {
    const query = req.query;
    const whereCondition: Record<string, any> = {};

    for (const [key, values] of Object.entries(query)) {
      const valueArray = Array.isArray(values) ? values : [values];

      if (valueArray.length > 0) {
        whereCondition[key] = { [Op.in]: valueArray };
      }
    }

    const data = await this._rpcQueryRepo.getByList(
      whereCondition as CondType
    );
    new ResponseSuccessList<Entity[]>(data).send(res);
  };
  getByCondRPC = async (req: Request, res: Response) => {
    const query = req.query;
    const whereCondition: Record<string, any> = {};

    for (const [key, value] of Object.entries(query)) {
      whereCondition[key] = value;
    }

    const entity = await this._rpcQueryRepo.getByCond(whereCondition as CondType);
    if (!entity) throw new ResponseErrorNotFound();

    new ResponseSuccessOk<Entity>(entity).send(res);
  };
}