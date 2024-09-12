import { Controller, Get, HttpCode, Param, Post } from "@nestjs/common"
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger"
import { UserService } from "./service"
import { SignInResp, User } from "./dto/user"
import { AppExceptionOpenAPIModel } from "../../common/errors/error"
import { parseUUIDPipe } from "../../pipes/validation-pipe"
import { Als } from "../../common/als/als"
import { UnauthorizedException } from "./entity/error"

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
class UserController {
    constructor(
        private readonly userService: UserService,
    ) {}

    @Post("/sign-in")
    @HttpCode(200)
    @ApiOperation({
        summary: "Sign in or create a new user if not exists",
        description: "Sign in if the user can be authenticated based on the provided JWT token, otherwise create a new account",
        operationId: "signIn",
    })
    @ApiBearerAuth()
    @ApiResponse({ status: 200, type: SignInResp, description: "Successfully created user or successfully logged in as existing user" })
    @ApiResponse(apiResponseUnauthorized)
    @ApiResponse({ status: 409, type: AppExceptionOpenAPIModel, description: "A user with the same email already exists." })
    async signIn(): Promise<SignInResp> {
        const ctx = Als.getContext()
        const resp = await this.userService.signIn(ctx.verifiedToken!)
        return new SignInResp(resp.user, resp.created)
    }

    @Get("/me")
    @ApiOperation({
        summary: "Read my user info",
        description: "Read info about the user based on the provided JWT token",
        operationId: "me",
    })
    @ApiBearerAuth()
    @ApiResponse({ status: 200, type: User, description: "User" })
    @ApiResponse(apiResponseUnauthorized)
    @ApiResponse(apiResponseForbidden)
    async me(): Promise<User> {
        const { verifiedToken } = Als.getContext()
        const user = await this.userService.readUser(verifiedToken?.claims.custom.userId!)
        return new User(user)
    }
}

@ApiTags("admin/users")
@Controller("admin/users")
class UserAdminController {
    constructor(
        private readonly userService: UserService,
    ) {}

    @Get("/")
    @ApiOperation({
        summary: "Read info about all users",
        description: "Read info about all users",
        operationId: "getUsers",
    })
    @ApiBearerAuth()
    @ApiResponse({ status: 200, type: [User], description: "List of users" })
    async listUsers(): Promise<User[]> {
        const { authAsAdmin } = Als.getContext()
        if (!authAsAdmin) {
            throw new UnauthorizedException()
        }
        const users = await this.userService.listUsers()
        return users.map(user => new User(user))
    }

    @Get("/:id")
    @ApiOperation({
        summary: "Read info about arbitrary user",
        description: "Read info about arbitrary user",
        operationId: "readUser",
    })
    @ApiBearerAuth()
    @ApiResponse({ status: 200, type: User, description: "Read arbitrary user" })
    @ApiResponse({ status: 400, type: AppExceptionOpenAPIModel, description: "Wrong path param" })
    @ApiResponse(apiResponseUnauthorized)
    @ApiResponse(apiResponseForbidden)
    @ApiResponse({ status: 404, type: AppExceptionOpenAPIModel, description: "User not found" })
    async readUser(@Param("id", parseUUIDPipe()) id: string): Promise<User> {
        const { authAsAdmin } = Als.getContext()
        if (!authAsAdmin) {
            throw new UnauthorizedException()
        }
        const user = await this.userService.readUser(id)
        return new User(user)
    }
}

export {
    UserController,
    UserAdminController
}
