import { User } from "../entity/user"
import { IsEmail, IsNotEmpty, IsString } from "class-validator"
import { PartialType } from "@nestjs/mapped-types"

class UserDto {
    readonly id: string
    readonly name: string
    readonly email: string

    constructor(user: User) {
        this.id = user.id
        this.name = user.name
        this.email = user.email
    }
}

class CreateUserDto {
    @IsString()
    @IsNotEmpty()
    readonly name: string

    @IsEmail()
    readonly email: string
}

class UpdateUserDto extends PartialType(CreateUserDto) {}

export {
    UserDto,
    CreateUserDto,
    UpdateUserDto
}
