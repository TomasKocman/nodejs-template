import { Injectable } from "@nestjs/common"
import { UpdateUserInput, User } from "./entity/user"
import { UserRepository } from "./entity/repository"
import { CreateUserDto } from "./dto/user"

@Injectable()
export class Service {
    constructor(
        private readonly userRepository: UserRepository
    ) {}

    async create(createUserDto: CreateUserDto): Promise<User> {
        const user = new User(createUserDto.name, createUserDto.email)
        await this.userRepository.create(user)
        return user
    }

    findAll() {
        return this.userRepository.findAll()
    }

    findOne(id: string): Promise<User> {
        return this.userRepository.findOne(id)
    }

    update(id: string, input: UpdateUserInput): Promise<User> {
        return this.userRepository.update(id, (user) => {
            user.update(input)
            return user
        })
    }

    async delete(id: string) {
        await this.userRepository.delete(id)
    }
}
