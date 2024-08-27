import { Module } from "@nestjs/common"
import { UserModule } from "./modules/user/user.module"
import { ConfigModule } from "@nestjs/config";
import { appConfig } from "./app.config";
import { DatabaseModule } from './modules/database/database.module';

@Module({
    imports: [
        UserModule,
        ConfigModule.forRoot({
            cache: true,
            load: [appConfig]
        }),
        DatabaseModule,
    ]
})
export class AppModule {}
