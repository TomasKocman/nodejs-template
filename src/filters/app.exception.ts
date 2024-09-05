import {
    ArgumentsHost,
    Catch,
    ExceptionFilter,
    HttpException
} from "@nestjs/common"
import { type Response as ExpressResponse } from "express"
import { AppException } from "../common/errors/error"
import { defaultErrorCode, defaultErrorMessage, defaultStatusCode, getHttpStatusWithMessage } from "./http.error"
import { Als } from "../common/als/als"

@Catch(AppException)
class AppExceptionFilter implements ExceptionFilter {
    catch(exception: any, host: ArgumentsHost) {
        const ctx = host.switchToHttp()
        const response = ctx.getResponse<ExpressResponse>()
        const payload: Record<string, unknown> = {}
        const httpData = getHttpStatusWithMessage(exception)

        payload.errorCode = httpData.code
        payload.errorMessage = httpData.message
        if (httpData.data) {
            payload.errorData = httpData.data
        }

        response.status(httpData.statusCode).json(payload)
    }
}

@Catch(HttpException)
class HttpExceptionFilter implements ExceptionFilter {
    catch(exception: any, host: ArgumentsHost) {
        const ctx = host.switchToHttp()
        const response = ctx.getResponse<ExpressResponse>()
        const payload: Record<string, unknown> = {}

        if (typeof exception.response === "string") {
            payload.errorMessage = exception.response
        } else {
            payload.errorCode = defaultErrorCode
            payload.errorMessage = exception.response.message
        }

        response.status(exception.getStatus()).json(payload)
    }
}

@Catch()
class SinkExceptionFilter implements ExceptionFilter {
    catch(exception: any, host: ArgumentsHost) {
        const httpCtx = host.switchToHttp()
        const response = httpCtx.getResponse<ExpressResponse>()
        const payload: Record<string, unknown> = {}

        payload.errorCode = defaultErrorCode
        payload.errorMessage = defaultErrorMessage
        payload.errorData = { stackTrace: exception.stack }

        response.status(defaultStatusCode).json(payload)

        const alsCtx = Als.storage.getStore()!
        alsCtx.internalServerError = exception
        Als.storage.enterWith(alsCtx)
    }
}

export {
    AppExceptionFilter,
    HttpExceptionFilter,
    SinkExceptionFilter
}