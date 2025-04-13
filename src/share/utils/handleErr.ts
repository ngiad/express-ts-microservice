import { NextFunction, Request, Response } from "express"
import { ResponseError } from "../response/response.error"

export function HandleError (cb : Function) {
    return (req : Request,res : Response,next : NextFunction) => {
        cb(req,res,next).catch((err : ResponseError) =>{
            next(err)
        })
    }
}