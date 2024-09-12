import { GraphQLScalarType } from "graphql/type"
import { validate as isValidUUID } from "uuid"

function validate(uuid: unknown): string {
    const uuidAsStr: string = uuid as string
    if (!isValidUUID(uuidAsStr)) {
        throw new Error("invalid uuid")
    }
    return uuidAsStr
}

const UUIDScalar = new GraphQLScalarType({
    name: "UUID",
    description: "UUID parser",
    serialize: (value) => validate(value),
    parseValue: (value) => validate(value),
})

export {
    UUIDScalar
}
