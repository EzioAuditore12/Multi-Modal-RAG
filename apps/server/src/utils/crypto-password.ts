import { hash, verify } from "@node-rs/argon2";

/**
 * Converts hash for the given input password
 * @param password - accepts passowrd as string
 * @returns - returns the generated hashed password
 */
export async function generateHashedPassword(password: string) {
  return await hash(password);
}

/**
 * Compare hashed password along with the given input passsord
 * @param inputPassword - Password to be compared with
 * @param storedHashedPassword - Stored Hashed Password
 * @returns boolean
 */
export async function validatePassword(
  passwordInput: string,
  passwordStored: string
): Promise<boolean> {
  return await verify(passwordStored, passwordInput);
}
