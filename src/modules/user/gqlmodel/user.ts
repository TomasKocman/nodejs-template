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

export {
    User
}
