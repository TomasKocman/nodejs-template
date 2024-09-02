import { NestFactory } from "@nestjs/core"
import { AppModule } from "./app.module"
import { appConfig, AppConfig } from "./app.config";
import { ValidationPipe } from "@nestjs/common";

async function bootstrap() {
    const app = await NestFactory.create(AppModule)
    app.useGlobalPipes(new ValidationPipe())
    const config = app.get<AppConfig>(appConfig.KEY)
    await app.listen(config.PORT)
}
// eslint-disable-next-line no-console
bootstrap().catch(console.error)
