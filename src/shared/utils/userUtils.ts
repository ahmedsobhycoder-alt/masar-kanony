import bycrpt from "bcrypt";
import jsonWebToken from "jsonwebtoken";
import crypto from 'crypto';

class UserUtils {
    hashPassword = async (password: string): Promise<string> => await bycrpt.hash(password, 10);

    comparePassword = async (password: string, hashedPassword: string): Promise<boolean> => await bycrpt.compare(password, hashedPassword);


    createToken = (payload: object) => {
        return jsonWebToken.sign(payload, process.env.JWT_SECRET as string, {
            expiresIn: parseInt(process.env.JWT_EXPIRES_IN), // Changed to 'as any'
        });
    };

    generateOTP = (): string => {
        // Generates a number between 1000 and 9999
        return crypto.randomInt(1000, 10000).toString();
    };
}
export default new UserUtils(); 