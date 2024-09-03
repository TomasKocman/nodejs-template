export class AppException extends Error {
    code: string
    data?: Record<string, unknown>

    constructor(
        message: string,
        code: string,
        cause?: Error,
    ) {
        super(message, { cause: cause })
        this.code = code
    }

    withData(data: Record<string, unknown>): AppException {
        this.data = data
        return this
    }
}
