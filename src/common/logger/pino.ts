import { Params } from "nestjs-pino/params"
import { load } from "../config/load"
import { AppConfig } from "../../app.config"
import * as pino from "pino"

export function pinoFactory(_: any[]): Params | Promise<Params> {
    const config = load(AppConfig)
    const transport = config.LOG_PRETTY ? {
        target: "pino-pretty",
    } : undefined
    return {
        pinoHttp: {
            level: config.LOG_LEVEL,
            autoLogging: false,
            formatters: {
                level: (label) => ({ level: label }),
                bindings: () => ({}),
            },
            timestamp: pino.stdTimeFunctions.isoTime,
            serializers: {
                err: pino.stdSerializers.err,
                req: () => {},
                res: () => {}
            },
            transport: transport,
        }
    }
}
