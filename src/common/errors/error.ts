import { ApiProperty } from "@nestjs/swagger"

class AppException extends Error {
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

class AppExceptionOpenAPIModel {
    @ApiProperty({
        description: "Error message",
        example: "invalid field xyz",
    })
    erroMessage: string

    @ApiProperty({
        description: "Error code",
        example: "ERR_INVALID_INPUT",
    })
    errorCode: string

    @ApiProperty({
        description: "Error data",
        example: {},
        required: false
    })
    errorData?: Record<string, unknown>
}

export {
    AppException,
    AppExceptionOpenAPIModel
}
