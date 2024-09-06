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

type Payload = {
    requestId: string
    errorCode: string
    errorMessage: string
    errorData?: Record<string, unknown>
}

@Catch(AppException)
class AppExceptionFilter implements ExceptionFilter {
    catch(exception: any, host: ArgumentsHost) {
        const httpCtx = host.switchToHttp()
        const response = httpCtx.getResponse<ExpressResponse>()
        const httpData = getHttpStatusWithMessage(exception)
        const ctx = Als.getContext()
        const payload: Payload = {
            requestId: ctx.requestId,
            errorCode: httpData.code,
            errorMessage: httpData.message,
        }
        if (httpData.data) {
            payload.errorData = httpData.data
        }
        response.status(httpData.statusCode).json(payload)
    }
}

@Catch(HttpException)
class HttpExceptionFilter implements ExceptionFilter {
    catch(exception: any, host: ArgumentsHost) {
        const httpCtx = host.switchToHttp()
        const response = httpCtx.getResponse<ExpressResponse>()
        const ctx = Als.getContext()
        const payload: Payload = {
            requestId: ctx.requestId,
            errorCode: defaultErrorCode,
            errorMessage: typeof exception.response === "string" ? exception.response : exception.response.message
        }
        response.status(exception.getStatus()).json(payload)
    }
}

@Catch()
class SinkExceptionFilter implements ExceptionFilter {
    catch(exception: any, host: ArgumentsHost) {
        const httpCtx = host.switchToHttp()
        const response = httpCtx.getResponse<ExpressResponse>()
        const ctx = Als.getContext()
        const payload: Payload = {
            requestId: ctx.requestId,
            errorCode: defaultErrorCode,
            errorMessage: defaultErrorMessage,
            errorData: {
                stackTrace: exception.stack
            }
        }
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
