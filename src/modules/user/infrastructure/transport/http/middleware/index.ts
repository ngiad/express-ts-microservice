import { NextFunction, Request, Response } from "express";
import { UserResponseType, UserRole, UserStatus } from "../../../../application/dto";
import { IVerifyTokenCommand } from "../../../../application/services/IAuthService";
import { ICommandHandler } from "../../../../../../share/interface";
import { ResponseErrorBadRequest, ResponseErrorForbidden, ResponseErrorUnauthorized } from "../../../../../../share/response/response.error";


export const authMiddleware = (verifyTokenCommand : ICommandHandler<IVerifyTokenCommand,UserResponseType>) => {
    return async (req : Request, res : Response, next : NextFunction) => {
        const token = req.headers.token ?? req.cookies.token ?? ""

        if(!token) throw new ResponseErrorUnauthorized()
        const user =await verifyTokenCommand.execute({data : token})
        
        if(!user) throw new ResponseErrorBadRequest("Invalid or expired token")
        if( user.status === UserStatus.Deleted) throw new ResponseErrorBadRequest("user deleted")
        if(user.status === UserStatus.Banner) throw new ResponseErrorBadRequest("user banner")
            
        res.locals.user = user   
        next() 
    }
}


export const roleHandlingMiddleware = (requiredRoles: UserRole[]) => {
    return (req: Request, res: Response, next: NextFunction) => {
        const user = res.locals.user;

        if (!user) throw new ResponseErrorUnauthorized("User not authenticated");

        if (!requiredRoles.includes(user.role)) {
            throw new ResponseErrorForbidden("Access denied: insufficient permissions");
        }

        next();
    };
};