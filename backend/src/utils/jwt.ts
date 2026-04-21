import * as jose from 'jose';

import { env } from '@/env';

export interface DecodedTokenResponse {
  sub: string;
  iat: number;
  exp: number;
}

function toUint8Array(secret: string) {
  return new TextEncoder().encode(secret);
}

export class Jwt {
  private readonly accessSecret = toUint8Array(env.ACCESS_SECRET_KEY);
  private readonly accessExpireDuration = env.ACCESS_EXPIRATION_DURATION;

  private readonly refreshSecret = toUint8Array(env.REFRESH_SECRET_KEY);
  private readonly refreshExpireDuration = env.REFRESH_EXPIRATION_DURATION;

  public async generateAuthTokens(
    sub: string,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const accessToken = await this.generateAccessToken(sub);
    const refreshToken = await this.generateRefreshToken(sub);

    return { accessToken, refreshToken };
  }

  public async generateAccessToken(sub: string): Promise<string> {
    return await new jose.SignJWT({ sub })
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt(new Date())
      .setExpirationTime(this.accessExpireDuration)
      .sign(this.accessSecret);
  }

  public async generateRefreshToken(sub: string): Promise<string> {
    return await new jose.SignJWT({ sub })
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt(new Date())
      .setExpirationTime(this.refreshExpireDuration)
      .sign(this.refreshSecret);
  }

  public async parseAccessToken(
    token: string,
  ): Promise<DecodedTokenResponse | null> {
    try {
      const { payload } = await jose.jwtVerify(token, this.accessSecret);
      return payload as DecodedTokenResponse;
    } catch {
      return null;
    }
  }

  public async parseRefreshToken(
    token: string,
  ): Promise<DecodedTokenResponse | null> {
    try {
      const { payload } = await jose.jwtVerify(token, this.refreshSecret);
      return payload as DecodedTokenResponse;
    } catch {
      return null;
    }
  }
}

export const jwt = new Jwt();
