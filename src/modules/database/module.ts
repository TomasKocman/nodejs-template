import { Module } from "@nestjs/common"
import { TypeOrmModule, TypeOrmModuleOptions } from "@nestjs/typeorm"
import { configToTypeOrmOptions, DatabaseConfig, config } from "./config"
import { ConfigModule } from "@nestjs/config"

@Module({
    imports: [
        TypeOrmModule.forRootAsync({
            useFactory: (config: DatabaseConfig): TypeOrmModuleOptions => ({
                ...configToTypeOrmOptions(config),
                autoLoadEntities: true,
                entities: ["./src/modules/**/entity/*.{js}"],
            }),
            imports: [ConfigModule.forFeature(config)],
            inject: [config.KEY]
        })
    ]
})
export class DatabaseModule {}
