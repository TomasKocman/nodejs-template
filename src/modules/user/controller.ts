import {
    Body,
    Controller,
    Delete,
    Get,
    HttpCode,
    HttpException,
    HttpStatus,
    Param,
    Post,
    Put
} from "@nestjs/common"
import { Service } from "./service"
import { CreateUserDto, UpdateUserDto, UserDto } from "./dto/user"
import { UpdateUserInput } from "./entity/user"

@Controller("users")
export class UserController {
    constructor(private readonly userService: Service) {}

    @Post()
    async create(@Body() createUserDto: CreateUserDto): Promise<UserDto> {
        const user = await this.userService.create(createUserDto)
        return new UserDto(user)
    }

    @Get("/")
    async findAll() {
        const users = await this.userService.findAll()
        return users.map(user => new UserDto(user))
    }

    @Get("/:id")
    async findOne(@Param("id") id: string): Promise<UserDto> {
        const user = await this.userService.findOne(id)
        return new UserDto(user)
    }

    @Put("/:id")
    update(@Param("id") id: string, @Body() updateUserDto: UpdateUserDto) {
        return this.userService.update(id, Object.assign(new UpdateUserInput(), updateUserDto))
    }

    @Delete("/:id")
    @HttpCode(HttpStatus.NO_CONTENT)
    delete(@Param("id") id: string) {
        return this.userService.delete(id)
    }
}
