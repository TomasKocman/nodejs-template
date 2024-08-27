import { IsEmail, IsNotEmpty, IsString } from "class-validator"
import { User } from "../entities/user.entity";

export class CreateUserDto {
    @IsString()
    @IsNotEmpty()
    readonly name: string

    @IsEmail()
    readonly email: string
}

export class UserDto {
    readonly id: string
    readonly name: string
    readonly email: string

    constructor(user: User) {
        this.id = user.id
        this.name = user.name
        this.email = user.email
    }
}
