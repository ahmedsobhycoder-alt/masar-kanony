export default class ApiError extends Error {
    public statusCode: number;
    public status: string;
    public isOperational: boolean;

    constructor(statusCode: number, message: string = "") {
        super(message);
        this.statusCode = statusCode;
        // 4xx errors are "fail" (client error), 5xx are "error" (server error)
        this.status = statusCode.toString().startsWith("4") ? "fail" : "error";
        this.isOperational = true;

        Error.captureStackTrace(this, this.constructor);
    }

    getErrorJson() {
        if (process.env.NODE_ENV === "production") {
            return {
                status: false,
                message: this.message,
            };
        }
        return {
            status: this.status,
            statusCode: this.statusCode,
            message: this.message,
            stack: this.stack,
        };
    }
}