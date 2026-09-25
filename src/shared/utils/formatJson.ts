interface FormatResponseParams {
    data?: any;
    message: string;
    status: boolean;
}

export const formatJson = ({ data, message, status }: FormatResponseParams) => {
    return data ? {
        message,
        status,
        data
    } : {
        message,
        status
    };
};