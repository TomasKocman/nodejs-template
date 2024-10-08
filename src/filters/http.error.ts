import { AppException, defaultErrorCode, defaultErrorMessage } from "../common/errors/error"
import {
    UserAlreadyExistsException,
    UserNotFoundException,
    UnauthorizedException
} from "../modules/user/entity/error"
import { HttpStatus } from "@nestjs/common"
import { ValidationException } from "../pipes/validation-pipe"

type HttpErrorData = {
    statusCode: number
    code: string
    message: string
    data?: Record<string, unknown>
}

const defaultStatusCode = HttpStatus.INTERNAL_SERVER_ERROR

function getHttpErrorData(exception: AppException): HttpErrorData {
    const httpErrorData: HttpErrorData = {
        code: exception.code,
        message: exception.message,
        data: exception.data,
        statusCode: defaultStatusCode
    }

    if (exception instanceof ValidationException) { // API exceptions.
        httpErrorData.statusCode = HttpStatus.BAD_REQUEST
    } else if (exception instanceof UnauthorizedException) { // User exceptions.
        httpErrorData.statusCode = HttpStatus.UNAUTHORIZED
    } else if (exception instanceof UserNotFoundException) {
        httpErrorData.statusCode = HttpStatus.NOT_FOUND
    } else if (exception instanceof UserAlreadyExistsException) {
        httpErrorData.statusCode = HttpStatus.CONFLICT
    } else {
        httpErrorData.code = defaultErrorCode
        httpErrorData.message = defaultErrorMessage
    }

    return httpErrorData
}

export {
    defaultStatusCode,
    defaultErrorCode,
    getHttpErrorData
}
