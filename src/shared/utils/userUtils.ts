import bcrypt from "bcrypt";
import jsonWebToken , { SignOptions } from "jsonwebtoken";
import crypto from 'crypto';

class UserUtils {
    static hashPassword = async (password: string): Promise<string> => {
        return bcrypt.hash(password, 10);
    };

    static comparePassword = async (
        password: string,
        hashedPassword: string
    ): Promise<boolean> => {
        return bcrypt.compare(password, hashedPassword);
    };


  static createToken = (payload: object): string => {
    return jsonWebToken.sign(payload, process.env.JWT_SECRET as string, {
      expiresIn: (process.env.JWT_EXPIRES_IN || "90d") as SignOptions["expiresIn"],
    });
  };

    static generateOTP = (): string => {
        // Generates a number between 1000 and 9999
        return crypto.randomInt(1000, 10000).toString();
    };
}
export default UserUtils; 