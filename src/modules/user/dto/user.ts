import { User } from "../entity/user"
import { IsEmail, IsNotEmpty, IsString } from "class-validator"
import { ApiProperty, ApiPropertyOptions, PartialType } from "@nestjs/swagger"

const userNameProperty: ApiPropertyOptions = {
    description: "The name of the user",
    example: "John Doe",
}

const userEmailProperty: ApiPropertyOptions = {
    description: "The email of the user",
    example: "john.doe@example.com",
}

class UserDto {
    @ApiProperty()
    readonly id: string

    @ApiProperty(userNameProperty)
    readonly name: string

    @ApiProperty(userEmailProperty)
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
    @ApiProperty(userNameProperty)
    readonly name: string

    @IsEmail()
    @ApiProperty(userEmailProperty)
    readonly email: string
}

class UpdateUserDto extends PartialType(CreateUserDto) {}

export {
    UserDto,
    CreateUserDto,
    UpdateUserDto
}
