import { Module } from "@nestjs/common"
import { TypeOrmModule } from "@nestjs/typeorm"
import { configToTypeOrmOptions, databaseConfig } from "./database.config"
import { ConfigModule } from "@nestjs/config"

@Module({
    imports: [
        TypeOrmModule.forRootAsync({
            useFactory: configToTypeOrmOptions,
            imports: [ConfigModule.forFeature(databaseConfig)],
            inject: [databaseConfig.KEY]
        })
    ]
})
export class DatabaseModule {}
