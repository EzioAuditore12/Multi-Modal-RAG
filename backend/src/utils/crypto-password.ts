import { hash, verify } from '@node-rs/argon2';

export class CryptoPassword {
  /**
   * Converts hash for the given input password
   * @param password - accepts passowrd as string
   * @returns - returns the generated hashed password
   */
  public async generateHashedPassword(password: string): Promise<string> {
    return await hash(password);
  }

  /**
   * Compare hashed password along with the given input passsord
   * @param inputPassword - Password to be compared with
   * @param storedHashedPassword - Stored Hashed Password
   * @returns boolean
   */
  public async validatePassword(
    passwordInput: string,
    passwordStored: string,
  ): Promise<boolean> {
    return await verify(passwordStored, passwordInput);
  }
}

export const cryptoPassword = new CryptoPassword();
