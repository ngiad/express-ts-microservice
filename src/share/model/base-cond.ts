import { z } from "zod";
import { Op } from "sequelize";

const SequelizeOperators = z.object({
  [Op.eq]: z.any().optional(),
  [Op.ne]: z.any().optional(),
  [Op.is]: z.any().optional(),
  [Op.not]: z.any().optional(),
  [Op.gt]: z.any().optional(),
  [Op.gte]: z.any().optional(),
  [Op.lt]: z.any().optional(),
  [Op.lte]: z.any().optional(),
  [Op.between]: z.tuple([z.any(), z.any()]).optional(),
  [Op.notBetween]: z.tuple([z.any(), z.any()]).optional(),
  [Op.in]: z.array(z.any()).optional(),
  [Op.notIn]: z.array(z.any()).optional(),
  [Op.like]: z.string().optional(),
  [Op.notLike]: z.string().optional(),
  [Op.iLike]: z.string().optional(),
  [Op.notILike]: z.string().optional(),
  [Op.startsWith]: z.string().optional(),
  [Op.endsWith]: z.string().optional(),
  [Op.substring]: z.string().optional(),
  [Op.regexp]: z.union([z.string(), z.instanceof(RegExp)]).optional(),
  [Op.notRegexp]: z.union([z.string(), z.instanceof(RegExp)]).optional(),
  [Op.and]: z.array(z.record(z.any())).optional(),
  [Op.or]: z.array(z.record(z.any())).optional(),
});


export const BaseCondSchema = z
  .object({})
  .passthrough() 
  .merge(SequelizeOperators); 


export type BaseCondType = z.infer<typeof BaseCondSchema>;
