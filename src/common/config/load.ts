import { type ClassConstructor, plainToInstance } from "class-transformer"
import { validateSync } from "class-validator"

export function load<T extends object>(configType: ClassConstructor<T>): T {
    const env = plainToInstance(configType, process.env, {
        enableImplicitConversion: true,
    })

    const errors = validateSync(env)
    if (errors.length) {
        throw new Error(errors.toString())
    }

    return env
}
