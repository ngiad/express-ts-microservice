import jwt from "jsonwebtoken";
import { ITokenService, TokenPayloadType, TokenType } from "../../application/services/ITokenService";
import { ResponseErrorUnauthorized } from "../../../../share/response/response.error";

export class JwtService implements ITokenService {
    constructor(
        private readonly secretKey: string,
        private readonly expirationTime: string | number
    ) {}

    generateToken(payload: TokenPayloadType): TokenType {
        const token = jwt.sign(
            payload, 
            this.secretKey as jwt.Secret, 
            { expiresIn: this.expirationTime as any}
        );
        return { token };
    }

    verifyToken(token: string): TokenPayloadType {
        try {
            const decoded = jwt.verify(token, this.secretKey as jwt.Secret) as TokenPayloadType;
            return decoded;
        } catch (error: any) {
            if (error.name === "TokenExpiredError") {
                throw new ResponseErrorUnauthorized("Token has expired");
            }
            if (error.name === "JsonWebTokenError") {
                throw new ResponseErrorUnauthorized("Invalid token");
            }
            throw new ResponseErrorUnauthorized("Token verification failed");
        }
    }
}

