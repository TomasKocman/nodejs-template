import { Args, Query, Resolver } from "@nestjs/graphql"
import { User } from "./gqlmodel/user"
import { UserService } from "./service"
import { UUIDScalar } from "../../common/graphql/scalar"

@Resolver()
class UserResolver {
    constructor(
        private readonly userService: UserService,
    ) {}

    @Query(() => User)
    async user(@Args("id", { type: () => UUIDScalar }) id: string): Promise<User> {
        const user = await this.userService.readUser(id)
        return new User(user)
    }
}

export {
    UserResolver
}
