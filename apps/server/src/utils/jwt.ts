import env from "@/env";
import { SignJWT, jwtVerify } from "jose";

/**
 * These are mainly 3 functions here
 *  - generateAuthTokens- to generate accessToken and refreshToken
 *  - parseAccessToken - validate accessToken and return decoded accessToken if it's signature is correct and it is not expired
 *  - parseRefreshToken - validate refreshToken and return decoded refreshToken if it's signature is correct and it is not expired
 */

const accessSecret = new TextEncoder().encode(env.ACCESS_SECRET_KEY);
const refreshSecret = new TextEncoder().encode(env.REFRESH_SECRET_KEY);

/**
 * Function for creating authentication tokens using jose
 * @param id - takes a payload, here we are using id which we assume will come from database
 * @returns tokens:{accessToken,refreshToken}
 */
export async function generateAuthToken(id: string) {


  const accessToken = await new SignJWT({ id })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(env.ACCESS_EXPIRATION_DURATION) // jose accepts "1h", "2h", or number as seconds from now if passed to setExpirationTime? No, it usually takes a shorthand string
    // Actually, jose .setExpirationTime takes a string like '2h' or a number (timestamp).
    // Since we have duration in seconds, it's easier to verify what 'jose' expects.
    // Usually '2h', '10s'. So we can append 's'.
    .sign(accessSecret);

  const refreshToken = await new SignJWT({ id })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(env.REFRESH_EXPIRATION_DURATION)
    .sign(refreshSecret);

  const tokens = { accessToken, refreshToken };

  return tokens;
}

export interface DecodedTokenResponse {
  id: string;
  iat: number;
  exp: number;
  [key: string]: unknown; // jose returns JWTPayload which has index signature
}

/**
 *  For validating accessToken and to check if it is expired or not
 * @param token - takes accessToken as parameter
 * @returns decodedToken | null(if expired or not valid)
 */
export async function parseAccessToken(token: string) {
  try {
    const { payload } = await jwtVerify(token, accessSecret);
    return payload as DecodedTokenResponse;
  } catch {
    return null;
  }
}

/**
 *  For validating refreshToken and to check if it is expired or not
 * @param token - takes accessToken as parameter
 * @returns decodedToken | null(if expired or not valid)
 */
export async function parseRefreshToken(token: string) {
  try {
    const { payload } = await jwtVerify(token, refreshSecret);
    return payload as DecodedTokenResponse;
  } catch {
    return null;
  }
}
