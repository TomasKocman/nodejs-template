import { IsString, Min, MinLength } from "class-validator"

export class ApiKeyConfig {
    @IsString()
    @MinLength(32)
    API_KEY: string
}
