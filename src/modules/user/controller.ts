import { Controller, Get, Param} from "@nestjs/common"
import { Service } from "./service"
import { UserDto } from "./dto/user"
import { parseUUIDPipe } from "../../pipes/validation-pipe"
import { ApiResponse, ApiTags } from "@nestjs/swagger"
import { AppExceptionOpenAPIModel } from "../../common/errors/error"

@ApiTags("users")
@Controller("users")
export class UserController {
    constructor(private readonly userService: Service) {}

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
}
