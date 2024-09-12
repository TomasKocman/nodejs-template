import { Field, ObjectType } from "@nestjs/graphql"

@ObjectType()
class About {
    @Field()
    readonly version: string

    constructor(version: string) {
        this.version = version
    }
}

export {
    About
}
