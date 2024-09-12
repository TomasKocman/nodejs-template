import { Args, Mutation, Query, Resolver } from "@nestjs/graphql"
import { SignInResp, User } from "./gqlmodel/user"
import { UserService } from "./service"
import { UUIDScalar } from "../../common/graphql/scalar"
import { Als } from "../../common/als/als"
import { UnauthorizedException } from "./entity/error"

@Resolver()
class UserResolver {
    constructor(
        private readonly userService: UserService,
    ) {}

    @Mutation(() => SignInResp)
    async signIn(): Promise<SignInResp> {
        const { verifiedToken } = Als.getContext()
        if (!verifiedToken) {
            throw new UnauthorizedException()
        }
        const resp = await this.userService.signIn(verifiedToken)
        return new SignInResp(resp.user, resp.created)
    }

    @Query(() => [User])
    async users(): Promise<User[]> {
        const { verifiedToken } = Als.getContext()
        if (!verifiedToken) {
            throw new UnauthorizedException()
        }
        const users = await this.userService.listUsers()
        return users.map(user => new User(user))
    }

    @Query(() => User)
    async me(): Promise<User> {
        const { verifiedToken } = Als.getContext()
        const userId = verifiedToken?.claims.custom.userId
        if (!userId) {
            throw new UnauthorizedException()
        }

        const user = await this.userService.readUser(userId)
        return new User(user)
    }

    @Query(() => User)
    async user(@Args("id", { type: () => UUIDScalar }) id: string): Promise<User> {
        const { verifiedToken } = Als.getContext()
        if (!verifiedToken) {
            throw new UnauthorizedException()
        }
        const user = await this.userService.readUser(id)
        return new User(user)
    }
}

export {
    UserResolver
}
