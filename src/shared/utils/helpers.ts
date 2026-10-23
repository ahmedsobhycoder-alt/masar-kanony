import ApiError from "../errors/apiError";
import { printGreen } from "./printColors";
  export const fromStringToList = (value: unknown): string[] => {
      const values = Array.isArray(value) ? value : [value];
      return values.flatMap(item => typeof item === "string" ? stringToList(item) : []);
  };

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
 export function buildBilingualFuzzyRegex(searchTerm: string): string {
        if (!searchTerm) return "";

        const cleanTerm = searchTerm.replace(/[\u064B-\u065F\u0670]/g, "").trim();
        const tokens: string[] = [];

        for (const char of cleanTerm) {
            if (/[أإآا]/.test(char)) {
                tokens.push("[أإآا]");
            } else if (/[يى]/.test(char)) {
                tokens.push("[يى]");
            } else if (/[ةه]/.test(char)) {
                tokens.push("[ةه]");
            } else if (/\s+/.test(char)) {
                tokens.push("\\s*");
            } else {
                tokens.push(char.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"));
            }
        }

        return tokens.join(".*?");
    }
export const throwError = (code: number, message: string): never => {
    throw new ApiError(
        code,
        message,
    );
}
// export const formatImage = (image: string,path:string) =>{
//     if (image) {
//     if (process.env.NODE_ENV === "production") {
//       image = `${process.env.BASE_URL}:/uploads/${path}/${image}`/$}`;
//     } else {
//       doc.receiptImageUrl = `${process.env.BASE_URL}:${process.env.PORT}/uploads/payments/${doc.receiptImageUrl}`;
//     }
// }
