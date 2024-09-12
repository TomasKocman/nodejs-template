import { Module } from "@nestjs/common"
import { UserService } from "./service"
import { UserAdminController, UserController } from "./controller"
import { TypeOrmModule } from "@nestjs/typeorm"
import { User } from "./entity/user"
import { UserRepository } from "./entity/repository"
import { FirebaseModule } from "../auth/firebase/module"
import { UserAdminResolver, UserResolver } from "./resolver"

@Module({
    imports: [
        TypeOrmModule.forFeature([User]),
        FirebaseModule,
    ],
    controllers: [UserController, UserAdminController],
    providers: [UserResolver, UserAdminResolver, UserService, UserRepository],
})
export class UserModule {}
