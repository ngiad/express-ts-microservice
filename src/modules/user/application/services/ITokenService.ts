export interface TokenPayloadType {
  sub: string;
}

export interface TokenType {
  token: string;
}

export interface ITokenService {
  generateToken(payload: TokenPayloadType): TokenType;
  verifyToken(token: string): TokenPayloadType;
}
