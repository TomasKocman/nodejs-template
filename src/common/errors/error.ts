export class ServiceException extends Error {
    code: string
    data?: Map<string, any>

    constructor(
        message: string,
        code: string,
        cause?: Error,
    ) {
        super(message, { cause: cause })
        this.code = code
    }

    withData(data: Map<string, any>): ServiceException {
        this.data = data
        return this
    }
}
