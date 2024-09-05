import { Injectable } from "@nestjs/common"
import { CreateUserInput, UpdateUserInput, User } from "./entity/user"
import { UserRepository } from "./entity/repository"

@Injectable()
export class Service {
    constructor(
        private readonly userRepository: UserRepository
    ) {}

    async create(input: CreateUserInput): Promise<User> {
        const user = User.create(input)
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
