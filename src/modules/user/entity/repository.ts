import { Injectable } from "@nestjs/common"
import { InjectRepository } from "@nestjs/typeorm"
import { DataSource, Repository } from "typeorm"
import { User } from "./user"
import { UserAlreadyExistsException, UserNotFoundException } from "./error"
import { isUniqueError } from "../../database/errors"

@Injectable()
export class UserRepository {
    constructor(
        private dataSource: DataSource,
        @InjectRepository(User) private readonly userRepository: Repository<User>
    ) {}

    async createUser(user: User) {
        try {
            await this.userRepository.insert(user)
        } catch (e) {
            if (isUniqueError(e)) {
                throw new UserAlreadyExistsException(e)
            }
            throw e
        }
    }

    async listUsers(): Promise<User[]> {
        return await this.userRepository.find()
    }

    async readUser(id: string): Promise<User> {
        const user = await this.userRepository.findOneBy({
            id: id
        })
        if (!user) {
            throw new UserNotFoundException()
        }
        return user
    }

    async updateUser(id: string, updateFn: (user: User) => User): Promise<User> {
        return await this.dataSource.transaction(async (manager) => {
            let user = await manager.createQueryBuilder(User, "user")
                .where("user.id = :id", { id: id })
                .setLock("pessimistic_write")
                .getOne()
            if (!user)
                throw new Error("user not found")

            user = updateFn(user)
            await manager.update(User, { id: user.id }, user)

            return user
        })
    }

    async deleteUser(id: string) {
        const result = await this.userRepository.delete({ id: id })
        if (!result.affected) {
            throw new UserNotFoundException()
        }
    }
}
