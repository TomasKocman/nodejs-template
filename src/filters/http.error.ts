import { AppException } from "../common/errors/error"
import { UserNotFoundException } from "../modules/user/entity/error"
import { HttpStatus } from "@nestjs/common"
import { ValidationException } from "../pipes/validation-pipe"

type HttpErrorData = {
    statusCode: number
    code: string
    message: string
    data?: Record<string, unknown>
}

const defaultStatusCode = HttpStatus.INTERNAL_SERVER_ERROR
const defaultErrorCode = "ERR_UNKNOWN"
const defaultErrorMessage = "internal server error"

function getHttpStatusWithMessage(exception: AppException): HttpErrorData {
    const httpErrorData: HttpErrorData = {
        code: exception.code,
        message: exception.message,
        data: exception.data,
        statusCode: defaultStatusCode
    }

    if (exception instanceof ValidationException) { // API exceptions.
        httpErrorData.statusCode = HttpStatus.BAD_REQUEST
    } else if (exception instanceof UserNotFoundException) { // User exceptions.
        httpErrorData.statusCode = HttpStatus.NOT_FOUND
    } else {
        httpErrorData.code = defaultErrorCode
        httpErrorData.message = defaultErrorMessage
    }

    return httpErrorData
}

export {
    defaultStatusCode,
    defaultErrorCode,
    defaultErrorMessage,
    getHttpStatusWithMessage
}
