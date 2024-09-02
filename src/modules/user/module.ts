import { Module } from "@nestjs/common";
import { Service } from "./service";
import { UserController } from "./controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "./entity/user";
import { UserRepository } from "./entity/repository"

@Module({
    imports: [TypeOrmModule.forFeature([User])],
    controllers: [UserController],
    providers: [Service, UserRepository],
})
export class UserModule {}
