import bcrypt from "bcrypt";
import jsonWebToken, { SignOptions } from "jsonwebtoken";
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
        const secret = process.env.JWT_SECRET;
        if (!secret) {
            throw new Error("JWT_SECRET is not defined in environment variables");
        }

        const options: SignOptions = {
            expiresIn: (process.env.JWT_EXPIRES_IN || "90d") as any,
        };

        return jsonWebToken.sign(payload, secret, options);
    };

    static generateOTP = (): string => {
        // Generates a number between 1000 and 9999
        return crypto.randomInt(1000, 10000).toString();
    };
}
export default UserUtils; 