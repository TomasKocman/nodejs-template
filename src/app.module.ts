import * as nest from '@nestjs/core'
import { Module } from "@nestjs/common"
import { UserModule } from "./modules/user/module"
import { ConfigModule } from "@nestjs/config"
import { appConfig } from "./app.config"
import { DatabaseModule } from "./modules/database/module"
import { AppExceptionFilter } from "./exception.filter"

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
            useClass: AppExceptionFilter
        }
    ]
})
export class AppModule {}
