import { IsBoolean, IsEnum, IsNumber, IsOptional, IsString, Max, Min } from "class-validator"
import { registerAs } from "@nestjs/config"
import { load } from "./common/config/load"

enum Environment {
    DEV = "dev",
    STG = "stg",
    PROD = "prod"
}

class AppConfig {
    @IsEnum(Environment)
    ENV!: Environment

    @IsString()
    LOG_LEVEL!: string

    @IsBoolean()
    @IsOptional()
    LOG_PRETTY: boolean

    @IsNumber()
    @Min(0)
    @Max(65535)
    PORT!: number
}

const appConfig = registerAs("appConfig", () => load(AppConfig))

export {
    Environment,
    AppConfig,
    appConfig
}
