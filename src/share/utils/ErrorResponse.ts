import { NextFunction, Request, Response } from "express";
import { ResponseError } from "../response/response.error";
import { config } from "../component/config";
import { ZodError } from "zod";
import { AppError } from "../component/AppError";

export const errorResponse = (
  err: ResponseError | ZodError | Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const isProduction = config.product === "PRODUCTION";

  let appError: AppError;

  if (err instanceof ResponseError || err instanceof ZodError) {
    appError = AppError.from(err);
  } else if (err instanceof Error) {
    appError = AppError.from(new ResponseError(500, err.message)).wrap(err as any);
  } else {
    appError = AppError.from(new ResponseError(500, "Unknown error")).wrap(err as any);
  }

  res.status(appError.getStatusCode()).json(appError.toJSON(isProduction));
};