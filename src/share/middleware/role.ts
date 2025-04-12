import { NextFunction, Request, Response } from "express";
import { UserRole } from "../interface";
import { ResponseErrorForbidden, ResponseErrorUnauthorized } from "../response/response.error";


export const roleHandlingGlobalMiddleware = (requiredRoles: UserRole[]) => {
    return (req: Request, res: Response, next: NextFunction) => {
        const user = res.locals.user;

        if (!user) throw new ResponseErrorUnauthorized("User not authenticated");

        if (!requiredRoles.includes(user.role)) {
            throw new ResponseErrorForbidden("Access denied: insufficient permissions");
        }

        next();
    };
};