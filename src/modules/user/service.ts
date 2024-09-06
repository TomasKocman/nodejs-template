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
        await this.userRepository.createUser(user)
        return user
    }

    listUsers() {
        return this.userRepository.listUsers()
    }

    readUser(id: string): Promise<User> {
        return this.userRepository.readUser(id)
    }

    updateUser(id: string, input: UpdateUserInput): Promise<User> {
        return this.userRepository.updateUser(id, (user) => {
            user.update(input)
            return user
        })
    }

    async deleteUser(id: string) {
        await this.userRepository.deleteUser(id)
    }
}
