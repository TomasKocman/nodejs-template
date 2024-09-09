import { User } from "../entity/user"
import { ApiProperty } from "@nestjs/swagger"

class UserDto {
    @ApiProperty({
        description: "ID of the user",
        example: "78fd98ac-dbae-4e07-a9f0-eb92c2fb7128"
    })
    readonly id: string

    @ApiProperty({
        description: "Auth ID of the user",
        example: "OD3vRA5lUbZt4z23vselU9jMZsa2",
    })
    readonly authId: string

    @ApiProperty({
        description: "Display name of the user",
        example: "John Doe",
    })
    readonly displayName?: string

    @ApiProperty({
        description: "Email of the user",
        example: "john.doe@example.com",
    })
    readonly email?: string

    constructor(user: User) {
        this.id = user.id
        this.authId = user.authId
        this.displayName = user.displayName ?? undefined
        this.email = user.email ?? undefined
    }
}

class SignInResp {
    @ApiProperty({
        description: "Sign in response",
        type: UserDto,
    })
    readonly user: UserDto

    @ApiProperty({
        description: "Is new user",
        example: true,
    })
    readonly isNewUser: boolean

    constructor(user: User, isNewUser: boolean) {
        this.user = new UserDto(user)
        this.isNewUser = isNewUser
    }
}

export {
    UserDto,
    SignInResp,
}
