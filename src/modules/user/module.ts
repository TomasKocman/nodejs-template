import { Module } from "@nestjs/common"
import { UserService } from "./service"
import { UserController } from "./controller"
import { TypeOrmModule } from "@nestjs/typeorm"
import { User } from "./entity/user"
import { UserRepository } from "./entity/repository"
import { FirebaseModule } from "../firebase/module"

@Module({
    imports: [
        TypeOrmModule.forFeature([User]),
        FirebaseModule,
    ],
    controllers: [UserController],
    providers: [UserService, UserRepository],
})
export class UserModule {}
