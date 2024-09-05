import { Injectable, Logger, NestMiddleware } from "@nestjs/common"
import { Request, Response } from "express"
import { Als } from "../common/als/als"

type LogFields = {
    requestId: string
    path: string
    method: string
    duration: string
    statusCode: number
    stackTrace?: string
}

@Injectable()
export class LoggingMiddleware implements NestMiddleware {
    private readonly logger = new Logger(LoggingMiddleware.name)

    use(req: Request, res: Response, next: () => void) {
        const { originalUrl, method } = req
        const requestStart = new Date()

        res.on("close", () => {
            const requestDuration = new Date().getTime() - requestStart.getTime()
            const statusCode = res.statusCode
            const { requestId, internalServerError } = Als.storage.getStore()!
            const logFields: LogFields = {
                requestId: requestId,
                path: originalUrl,
                method: method,
                duration: `${requestDuration}ms`,
                statusCode: statusCode,
                stackTrace: internalServerError?.stack
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
