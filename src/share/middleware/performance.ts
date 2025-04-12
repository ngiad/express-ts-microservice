import { NextFunction, Request, Response } from "express";

export const performenceMiddleware = (req : Request,res : Response,next : NextFunction) => {
    res.locals.startTime = Date.now();
    next();
}