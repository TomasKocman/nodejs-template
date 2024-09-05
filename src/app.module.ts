import * as nest from "@nestjs/core"
import { MiddlewareConsumer, Module, NestModule } from "@nestjs/common"
import { UserModule } from "./modules/user/module"
import { ConfigModule } from "@nestjs/config"
import { AppConfig, appConfig } from "./app.config"
import { DatabaseModule } from "./modules/database/module"
import { AppExceptionFilter, HttpExceptionFilter, SinkExceptionFilter } from "./filters/app.exception"
import { validationPipe } from "./pipes/validation-pipe"
import { LoggingMiddleware } from "./middlewares/logging"
import { LoggerModule } from "nestjs-pino"
import * as pino from "pino"
import { v7 as uuidv7 } from "uuid"
import { load } from "./common/config/load"
import { RequestIdMiddleware } from "./middlewares/requestid"

@Module({
    imports: [
        LoggerModule.forRootAsync({
            useFactory: () => {
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
                        genReqId: () => uuidv7()
                    }
                }
            },
        }),
        UserModule,
        ConfigModule.forRoot({
            cache: true,
            load: [appConfig]
        }),
        DatabaseModule,
    ],
    providers: [
        {
            provide: nest.APP_FILTER,
            useClass: SinkExceptionFilter
        },
        {
            provide: nest.APP_FILTER,
            useClass: HttpExceptionFilter
        },
        {
            provide: nest.APP_FILTER,
            useClass: AppExceptionFilter
        },
        {
            provide: nest.APP_PIPE,
            useFactory: validationPipe
        }
    ]
})

export class AppModule implements NestModule {
    configure(consumer: MiddlewareConsumer) {
        consumer
            .apply(RequestIdMiddleware, LoggingMiddleware)
            .forRoutes("*")
    }
}
