import { Field, ObjectType } from "@nestjs/graphql"
import { User as EntityUser } from "../entity/user"
import { UUIDScalar } from "../../../common/graphql/scalar"

@ObjectType()
class User {
    @Field(() => UUIDScalar)
    readonly id: string

    @Field()
    readonly authId: string

    @Field({ nullable: true })
    readonly displayName?: string

    @Field({ nullable: true })
    readonly email?: string

    constructor(user: EntityUser) {
        this.id = user.id
        this.authId = user.authId
        this.displayName = user.displayName ?? undefined
        this.email = user.email ?? undefined
    }
}

@ObjectType()
class SignInResp {
    @Field(() => User)
    readonly user: User

    @Field()
    readonly isNewUser: boolean

    constructor(user: EntityUser, isNewUser: boolean) {
        this.user = new User(user)
        this.isNewUser = isNewUser
    }
}

export {
    User,
    SignInResp
}
