import { Controller, Get, Param } from "@nestjs/common"
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger"
import { Service } from "./service"
import { UserDto } from "./dto/user"
import { AppExceptionOpenAPIModel } from "../../common/errors/error"
import { parseUUIDPipe } from "../../pipes/validation-pipe"

const apiResponseUnauthorized = {
    status: 401,
    type: AppExceptionOpenAPIModel,
    description: "Authentication token is not present or not valid"
}

const apiResponseForbidden = {
    status: 403,
    type: AppExceptionOpenAPIModel,
    description: "Authentication token is present, but the user is not authorized to perform this operation"
}

@ApiTags("users")
@Controller("users")
export class UserController {
    constructor(private readonly userService: Service) {}

    @Get("/")
    @ApiOperation({
        summary: "Read info about all users",
        description: "Read info about all users",
        operationId: "getUsers",
    })
    @ApiResponse({ status: 200, type: [UserDto], description: "List of users" })
    async listUsers() {
        const users = await this.userService.listUsers()
        return users.map(user => new UserDto(user))
    }

    @Get("/me")
    @ApiOperation({
        summary: "Read my user info",
        description: "Read info about the user based on the provided JWT token",
        operationId: "me",
    })
    @ApiResponse({ status: 200, type: UserDto, description: "User" })
    @ApiResponse(apiResponseUnauthorized)
    @ApiResponse(apiResponseForbidden)
    async me(): Promise<UserDto> {
        const user = await this.userService.readUser("84c334eb-c23c-4c8c-9fad-4bf2cd5d2855")
        return new UserDto(user)
    }

    @Get("/:uuid")
    @ApiOperation({
        summary: "Read info about arbitrary user",
        description: "Read info about arbitrary user",
        operationId: "readUser",
    })
    @ApiResponse({ status: 200, type: UserDto, description: "Read arbitrary user" })
    @ApiResponse({ status: 400, type: AppExceptionOpenAPIModel, description: "Wrong path param" })
    @ApiResponse(apiResponseUnauthorized)
    @ApiResponse(apiResponseForbidden)
    @ApiResponse({ status: 404, type: AppExceptionOpenAPIModel, description: "User not found" })
    async readUser(@Param("uuid", parseUUIDPipe()) id: string): Promise<UserDto> {
        const user = await this.userService.readUser(id)
        return new UserDto(user)
    }
}
