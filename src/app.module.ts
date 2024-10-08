import * as nest from "@nestjs/core"
import { MiddlewareConsumer, Module, NestModule } from "@nestjs/common"
import { UserModule } from "./modules/user/module"
import { ConfigModule } from "@nestjs/config"
import { appConfig } from "./app.config"
import { DatabaseModule } from "./modules/database/module"
import { AppExceptionFilter } from "./filters/app.exception"
import { validationPipe } from "./pipes/validation-pipe"
import { LoggingMiddleware } from "./modules/middleware/logging"
import { LoggerModule } from "nestjs-pino"
import { RequestIdMiddleware } from "./modules/middleware/requestid"
import { MaintenanceModule } from "./modules/misc/maintenance/module"
import { GqlAuthenticationMiddleware, HttpAuthenticationMiddleware } from "./modules/middleware/auth"
import { MiddlewareModule } from "./modules/middleware/module"
import { FirebaseModule } from "./modules/auth/firebase/module"
import { UserAdminController, UserController } from "./modules/user/controller"
import { GraphQLModule } from "@nestjs/graphql"
import { ApolloDriver, ApolloDriverConfig } from "@nestjs/apollo"
import { ApolloServerPluginLandingPageLocalDefault } from '@apollo/server/plugin/landingPage/default'
import { UUIDScalar } from "./common/graphql/scalar"
import { pinoFactory } from "./common/logger/pino"
import { ApiKeyModule } from "./modules/auth/apikey/module"
import { GqlApiKeyAuthenticationMiddleware, HttpApiKeyAuthenticationMiddleware } from "./modules/middleware/apikey"
import { gqlFormatError } from "./common/graphql/error-format"

@Module({
    imports: [
        ConfigModule.forRoot({
            cache: true,
            load: [appConfig]
        }),
        LoggerModule.forRootAsync({
            useFactory: pinoFactory,
        }),
        GraphQLModule.forRoot<ApolloDriverConfig>({
            driver: ApolloDriver,
            autoSchemaFile: "schema.graphqls",
            introspection: true,
            playground: false,
            plugins: [ApolloServerPluginLandingPageLocalDefault()],
            resolvers: {
                UUID: UUIDScalar
            },
            formatError: gqlFormatError,
        }),
        DatabaseModule,
        UserModule,
        MaintenanceModule,
        FirebaseModule,
        ApiKeyModule,
        MiddlewareModule,
    ],
    providers: [
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
        consumer.
            apply(HttpAuthenticationMiddleware).
            forRoutes(UserController)
        consumer.
            apply(HttpApiKeyAuthenticationMiddleware).
            forRoutes(UserAdminController)
        consumer.
            apply(GqlApiKeyAuthenticationMiddleware, GqlAuthenticationMiddleware).
            forRoutes("/graphql")
    }
}
