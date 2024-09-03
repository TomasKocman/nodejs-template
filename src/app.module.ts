import * as nest from '@nestjs/core'
import { Module } from "@nestjs/common"
import { UserModule } from "./modules/user/module"
import { ConfigModule } from "@nestjs/config"
import { appConfig } from "./app.config"
import { DatabaseModule } from "./modules/database/module"
import { AppExceptionFilter, HttpExceptionFilter, SinkExceptionFilter } from "./common/filters/app.exception"
import { validationPipe } from "./common/pipes/validationPipe"

@Module({
    imports: [
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
export class AppModule {}
