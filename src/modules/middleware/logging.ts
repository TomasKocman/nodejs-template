import { Injectable, Logger, NestMiddleware } from "@nestjs/common"
import { Request, Response } from "express"
import { Als } from "../../common/als/als"
import { Plugin } from "@nestjs/apollo"
import { ApolloServerPlugin, GraphQLRequestListener } from "@apollo/server"
import { AppException } from "../../common/errors/error"
import { GraphQLError } from "graphql/index"

type ErrorFields = {
    message: string
    stackTrace: string
}

type LogFields = {
    requestId: string
    path: string
    method: string
    duration: string
    statusCode: number
    error?: ErrorFields
}

function errorMessage(err: Error): string {
    let message = err.message
    if (err.cause instanceof Error) {
        message += `: ${errorMessage(err.cause)}`
    }
    return message
}

@Injectable()
class LoggingMiddleware implements NestMiddleware {
    private readonly logger = new Logger(LoggingMiddleware.name)

    use(req: Request, res: Response, next: () => void) {
        const { originalUrl, method } = req
        const requestStart = new Date()

        res.on("close", () => {
            const requestDuration = new Date().getTime() - requestStart.getTime()
            const statusCode = res.statusCode
            const { requestId, exception } = Als.getContext()
            const logFields: LogFields = {
                requestId: requestId,
                path: originalUrl,
                method: method,
                duration: `${requestDuration}ms`,
                statusCode: statusCode,
            }
            if (exception) {
                logFields.error = {
                    message: errorMessage(exception),
                    stackTrace: exception.stack!
                }
            }
            if (statusCode >= 500) {
                this.logger.error(logFields, "request processed")
            } else {
                this.logger.log(logFields, "request processed")
            }
        })

        next()
    }
}

type GqlErrorFields = {
    message: string
    code: string
    data: any
    path: typeof GraphQLError.prototype.path
}

@Plugin()
class ApolloLoggingPlugin implements ApolloServerPlugin {
    private readonly logger = new Logger(ApolloLoggingPlugin.name)

    async requestDidStart(): Promise<GraphQLRequestListener<any>> {
        const requestStart = new Date()
        return {
            didEncounterErrors: async (ctx) => {
                const { requestId } = Als.getContext()
                const requestDuration = new Date().getTime() - requestStart.getTime()
                const errors: (GraphQLError | GqlErrorFields)[] = []
                ctx.errors.forEach((error) => {
                    if (error.originalError instanceof AppException) {
                        const appError = error.originalError as AppException
                        const errorFields: GqlErrorFields = {
                            message: errorMessage(appError),
                            code: appError.code,
                            data: appError.data,
                            path: error.path
                        }
                        errors.push(errorFields)
                    } else {
                        errors.push(error)
                    }
                })
                const logFields = {
                    errors: errors,
                    duration: `${requestDuration}ms`,
                    requestId: requestId,
                }
                this.logger.error(logFields, "request processed")
            },
        }
    }
}

export {
    LoggingMiddleware,
    ApolloLoggingPlugin
}
