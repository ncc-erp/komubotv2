export interface JwtPayload {
    sub: string;
    iat: number;
    exp: number;
    email: string;
}
