import jwt from "jsonwebtoken";
import { ITokenService, TokenPayloadType, TokenType } from "../../application/services/ITokenService";

export class JwtService implements ITokenService {
    constructor(
        private readonly secretKey: string,
        private readonly expirationTime: string | number
    ) {}

    generateToken(payload: TokenPayloadType): TokenType {
        const token = jwt.sign(
            payload, 
            this.secretKey as jwt.Secret, 
            { expiresIn: "7d"}
        );
        return { token };
    }

    verifyToken(token: string): TokenPayloadType {
        try {
            const decoded = jwt.verify(token, this.secretKey as jwt.Secret) as TokenPayloadType;
            return decoded;
        } catch (error) {
            throw new Error("Invalid or expired token");
        }
    }
}

