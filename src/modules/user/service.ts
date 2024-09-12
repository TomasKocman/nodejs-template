import { Injectable } from "@nestjs/common"
import { CreateUserInput, UpdateUserInput, User } from "./entity/user"
import { UserRepository } from "./entity/repository"
import { VerifiedToken } from "../auth/firebase/token"
import { FirebaseService } from "../auth/firebase/service"

type SignInResp = {
    user: User
    created: boolean
}

@Injectable()
export class UserService {
    constructor(
        private readonly userRepository: UserRepository,
        private readonly firebaseService: FirebaseService
    ) {}

    async signIn(verifiedToken: VerifiedToken): Promise<SignInResp> {
        if (verifiedToken.hasUserId()) {
            const user = await this.userRepository.readUser(verifiedToken.claims.custom.userId!)
            return {
                user, created: false
            }
        }

        const input: CreateUserInput = {
            authId:  verifiedToken.subjectId,
            displayName: verifiedToken.claims.displayName ?? null,
            email: verifiedToken.claims.email ?? null,
        }
        const user = User.create(input)
        await this.userRepository.createUser(user)

        await this.firebaseService.setCustomClaims(verifiedToken.subjectId, {
            userId: user.id
        })

        return {
            user, created: true
        }
    }

    async listUsers(): Promise<User[]> {
        return await this.userRepository.listUsers()
    }

    async readUser(id: string): Promise<User> {
        return await this.userRepository.readUser(id)
    }

    async updateUser(id: string, input: UpdateUserInput): Promise<User> {
        return await this.userRepository.updateUser(id, (user) => {
            user.update(input)
            return user
        })
    }

    async deleteUser(id: string) {
        await this.userRepository.deleteUser(id)
    }
}
