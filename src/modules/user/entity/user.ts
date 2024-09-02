import { v7 as uuidv7 } from "uuid"
import { Entity, Column, PrimaryColumn } from "typeorm";

@Entity()
class User {
    @PrimaryColumn({type: "uuid"})
    readonly id: string

    @Column({type: "text"})
    name: string

    @Column({type: "text"})
    email: string

    @Column({type: "timestamptz"})
    readonly createdAt: Date

    @Column({type: "timestamptz"})
    updatedAt: Date

    constructor(name: string, email: string) {
        this.id = uuidv7()
        this.name = name
        this.email = email
        this.createdAt = new Date()
        this.updatedAt = new Date()
    }

    update(input: UpdateUserInput) {
        this.name = input.name
        this.email = input.email
        this.updatedAt = new Date()
    }
}

class UpdateUserInput {
    name: string
    email: string
}

export {
    User,
    UpdateUserInput
}
