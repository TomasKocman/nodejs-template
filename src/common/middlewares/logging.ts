import { Injectable, Logger, NestMiddleware } from "@nestjs/common"
import { Request, Response } from "express"

type LogFields = {
    path: string
    method: string
    duration: string
    statusCode: number
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
            const logFields: LogFields = {
                path: originalUrl,
                method: method,
                duration: `${requestDuration}ms`,
                statusCode: statusCode,
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
