import { v7 as uuidv7 } from "uuid"
import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity()
export class User {
    @PrimaryColumn({type: "uuid"})
    readonly id: string

    @Column({type: "text"})
    readonly name: string

    @Column({type: "text"})
    readonly email: string

    @Column({type: "timestamptz"})
    readonly createdAt: Date

    @Column({type: "timestamptz"})
    readonly updatedAt: Date

    constructor(name: string, email: string) {
        this.id = uuidv7()
        this.name = name
        this.email = email
        this.createdAt = new Date()
        this.updatedAt = new Date()
    }
}
