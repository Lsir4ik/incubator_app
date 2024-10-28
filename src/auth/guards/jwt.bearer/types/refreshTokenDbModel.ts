export type RefreshTokenDbModel = {
    userId: string;
    validRefreshToken: string;
    expiredRefreshTokens: string[];
}