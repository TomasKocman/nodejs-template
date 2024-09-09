import { v7 as uuidv7 } from "uuid"
import { Entity, Column, PrimaryColumn } from "typeorm"

type CreateUserInput = {
    authId: string
    displayName: string | null
    email: string | null
}

type UpdateUserInput = {
    displayName: string | null
}

@Entity()
class User {
    static create(input: CreateUserInput): User {
        const user = new User()
        user.id = uuidv7()
        user.authId = input.authId
        user.displayName = input.displayName
        user.email = input.email
        user.createdAt = new Date()
        user.updatedAt = new Date()
        return user
    }

    @PrimaryColumn({name: "id", type: "uuid"})
    id: string

    @Column({name: "auth_id", type: "text", unique: true})
    authId: string

    @Column({name: "display_name", type: "text", nullable: true})
    displayName: string | null

    @Column({name: "email", type: "text", nullable: true, unique: true})
    email: string | null

    @Column({name: "created_at", type: "timestamptz"})
    createdAt: Date

    @Column({name: "updated_at", type: "timestamptz"})
    updatedAt: Date

    update(input: UpdateUserInput) {
        if (input.displayName) {
            this.displayName = input.displayName
        }
        this.updatedAt = new Date()
    }
}

export {
    User,
    CreateUserInput,
    UpdateUserInput
}
