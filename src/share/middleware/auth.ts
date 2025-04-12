import { NextFunction, Request, Response } from "express"
import { ICommandHandler, IVerifyGlobalCommand, UserResponseGlobalType, UserStatus } from "../interface"
import { ResponseErrorBadRequest, ResponseErrorUnauthorized } from "../response/response.error"


export const authGlobalMiddleware = (verifyGlobalCommand : ICommandHandler<IVerifyGlobalCommand, UserResponseGlobalType>) => {
    return async (req : Request, res : Response, next : NextFunction) => {
        const token = req.headers.token ?? req.cookies.token ?? ""

        if(!token) throw new ResponseErrorUnauthorized()
        const user =await verifyGlobalCommand.execute({data : token})
        
        if(!user) throw new ResponseErrorBadRequest("Invalid or expired token")
        if( user.status === UserStatus.Deleted) throw new ResponseErrorBadRequest("user deleted")
        if(user.status === UserStatus.Banner) throw new ResponseErrorBadRequest("user banner")
            
        res.locals.user = user   
        next() 
    }
}