import ApiError from "../errors/apiError";
import { printGreen } from "./printColors";

export const stringToList = (value: string) => {
    if (!(value === 'string' && value.trim() !== '')) {
        printGreen('value', value);
        return value
            // 1. Remove all single and double quotes completely
            .replace(/['"]/g, "")
            // 2. Split by comma
            .split(",")
            // 3. Trim extra whitespace from each governorate name
            .map((item) => item.trim())
            // 4. Drop any empty strings (e.g. from trailing commas)
            .filter(Boolean);
    }

    return []
}
export const throwError = (code: number, message: string): never => {
    throw new ApiError(
        code,
        message,
    );
}