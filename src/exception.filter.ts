import {
    ArgumentsHost,
    Catch,
    ExceptionFilter,
    HttpException,
    HttpStatus
} from "@nestjs/common"
import { type Response as ExpressResponse } from "express"
import { ServiceException } from "./common/errors/error"
import { UserNotFoundException } from "./modules/user/entity/error"

const defaultStatusCode = HttpStatus.INTERNAL_SERVER_ERROR
const defaultErrorCode = "ERR_UNKNOWN"
const defaultErrorMessage = "internal server error"

@Catch(HttpException, ServiceException)
export class AppExceptionFilter implements ExceptionFilter {
    catch(exception: any, host: ArgumentsHost) {
        const ctx = host.switchToHttp()
        const response = ctx.getResponse<ExpressResponse>()

        let statusCode = defaultStatusCode
        const payload: Record<string, unknown> = {
            errorCode: defaultErrorCode,
            errorMessage: defaultErrorMessage
        }

        if (exception instanceof HttpException) {
            statusCode = exception.getStatus()
            payload.errorMessage = exception.getResponse() as string | Record<string, unknown>
        }
        if (exception instanceof ServiceException) {
            const httpData = getHttpStatusWithMessage(exception)
            statusCode = httpData.statusCode
            payload.errorCode = httpData.code
            payload.errorMessage = httpData.message
        }

        response.status(statusCode).json(payload)
    }
}

type HttpErrorData = {
    statusCode: number
    code: string
    message: string
}

function getHttpStatusWithMessage(exception: ServiceException): HttpErrorData {
    if (exception instanceof UserNotFoundException) {
        return {
            statusCode: HttpStatus.NOT_FOUND,
            code: exception.code,
            message: exception.message
        }
    }

    return {
        statusCode: defaultStatusCode,
        code: defaultErrorCode,
        message: defaultErrorMessage
    }
}
