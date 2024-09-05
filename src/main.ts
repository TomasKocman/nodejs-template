import { NestFactory } from "@nestjs/core"
import { AppModule } from "./app.module"
import { appConfig, AppConfig } from "./app.config";
import { ValidationPipe } from "@nestjs/common";
import { DocumentBuilder, SwaggerDocumentOptions, SwaggerModule } from "@nestjs/swagger"
import { Logger } from "nestjs-pino"

async function bootstrap() {
    const app = await NestFactory.create(AppModule, {
        logger: false,
    })
    app.useGlobalPipes(new ValidationPipe())
    app.useLogger(app.get(Logger))

    const swaggerConfig = new DocumentBuilder()
        .setTitle("NodeJS template")
        .setDescription("This is an API for NodeJs project template, that can be used as a base for your own API.")
        .setVersion("0.1.0")
        .addServer("https://api.example.com/", "Server description, e.g. Main (production) server")
        .build()
    const options: SwaggerDocumentOptions = {
        operationIdFactory: (_: string, methodKey: string) => methodKey
    }
    const document = SwaggerModule.createDocument(app, swaggerConfig, options)
    SwaggerModule.setup("api/openapi.yaml", app, document)

    const globalAppConfig = app.get<AppConfig>(appConfig.KEY)
    await app.listen(globalAppConfig.PORT)
}
// eslint-disable-next-line no-console
bootstrap().catch(console.error)
