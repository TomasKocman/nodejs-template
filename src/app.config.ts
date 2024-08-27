import { IsEnum, IsNumber, Max, Min } from "class-validator"
import { registerAs } from "@nestjs/config"
import { load } from "./common/config/load"

enum Environment {
    Dev = "dev",
    Stg = "stg",
    Prod = "prod"
}

class AppConfig {
    @IsEnum(Environment)
    ENV!: Environment

    @IsNumber()
    @Min(0)
    @Max(65535)
    PORT!: number
}

const appConfig = registerAs('appConfig', () => load(AppConfig))

export {
    Environment,
    AppConfig,
    appConfig
}
