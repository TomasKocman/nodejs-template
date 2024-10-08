import { IsNumber, IsString, IsNotEmpty, Max, Min } from "class-validator"
import { registerAs } from "@nestjs/config"
import { DataSourceOptions } from "typeorm"
import { load } from "../../common/config/load"
import * as path from "node:path"

const config = registerAs("databaseConfig", () => load(DatabaseConfig))

class DatabaseConfig {
    @IsString()
    @IsNotEmpty()
    DATABASE_HOST: string

    @IsNumber()
    @Min(0)
    @Max(65535)
    DATABASE_PORT: number

    @IsString()
    @IsNotEmpty()
    DATABASE_USERNAME: string

    @IsString()
    @IsNotEmpty()
    DATABASE_PASSWORD: string

    @IsString()
    @IsNotEmpty()
    DATABASE_DB_NAME: string
}

function configToTypeOrmOptions(config: DatabaseConfig): DataSourceOptions {
    return {
        type: "postgres",
        host: config.DATABASE_HOST,
        port: config.DATABASE_PORT,
        username: config.DATABASE_USERNAME,
        password: config.DATABASE_PASSWORD,
        database: config.DATABASE_DB_NAME,
        migrations: [path.join(__dirname, "./migrations/*.{js,ts}")],
        entities: ["./src/modules/**/entity/*.ts"],
        migrationsRun: true,
        synchronize: false,
        logging: false
    }
}

export {
    config,
    DatabaseConfig,
    configToTypeOrmOptions
}
