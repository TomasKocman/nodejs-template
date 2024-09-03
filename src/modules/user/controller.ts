import {
    Body,
    Controller,
    Delete,
    Get,
    HttpCode,
    HttpStatus,
    Param, Post,
    Put
} from "@nestjs/common"
import { Service } from "./service"
import { CreateUserDto, UpdateUserDto, UserDto } from "./dto/user"
import { UpdateUserInput } from "./entity/user"
import { parseUUIDPipe } from "../../common/pipes/validationPipe"
import { ApiResponse, ApiTags } from "@nestjs/swagger"
import { AppExceptionOpenAPIModel } from "../../common/errors/error"

@ApiTags("users")
@Controller("users")
export class UserController {
    constructor(private readonly userService: Service) {}

    @Post()
    @ApiResponse({ status: 201, type: UserDto, description: "Newly created user" })
    @ApiResponse({ status: 400, type: AppExceptionOpenAPIModel, description: "Wrong response body" })
    @ApiResponse({ status: 404, type: AppExceptionOpenAPIModel, description: "User not found" })
    @ApiResponse({ status: 409, type: AppExceptionOpenAPIModel, description: "User already exists" })
    async create(@Body() createUserDto: CreateUserDto): Promise<UserDto> {
        const user = await this.userService.create(createUserDto)
        return new UserDto(user)
    }

    @Get("/")
    @ApiResponse({ status: 200, type: [UserDto], description: "List of users" })
    async findAll() {
        const users = await this.userService.findAll()
        return users.map(user => new UserDto(user))
    }

    @Get("/:uuid")
    @ApiResponse({ status: 200, type: UserDto, description: "User" })
    @ApiResponse({ status: 400, type: AppExceptionOpenAPIModel, description: "Wrong path param" })
    @ApiResponse({ status: 404, type: AppExceptionOpenAPIModel, description: "User not found" })
    async findOne(@Param("uuid", parseUUIDPipe()) id: string): Promise<UserDto> {
        const user = await this.userService.findOne(id)
        return new UserDto(user)
    }

    @Put("/:uuid")
    @ApiResponse({ status: 200, type: UserDto, description: "Updated user" })
    @ApiResponse({ status: 400, type: AppExceptionOpenAPIModel, description: "Wrong response body or path param" })
    @ApiResponse({ status: 404, type: AppExceptionOpenAPIModel, description: "User not found" })
    update(@Param("uuid", parseUUIDPipe()) id: string, @Body() updateUserDto: UpdateUserDto) {
        return this.userService.update(id, Object.assign(new UpdateUserInput(), updateUserDto))
    }

    @Delete("/:uuid")
    @ApiResponse({ status: 204, description: "User deleted" })
    @ApiResponse({ status: 400, type: AppExceptionOpenAPIModel, description: "Wrong path param" })
    @ApiResponse({ status: 404, type: AppExceptionOpenAPIModel, description: "User not found" })
    @HttpCode(HttpStatus.NO_CONTENT)
    delete(@Param("uuid", parseUUIDPipe()) id: string) {
        return this.userService.delete(id)
    }
}
