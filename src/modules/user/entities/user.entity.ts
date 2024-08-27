import { v7 as uuidv7 } from "uuid"

export class User {
    readonly id: string
    readonly name: string
    readonly email: string

    constructor(name: string, email: string) {
        this.id = uuidv7()
        this.name = name
        this.email = email
    }
}
