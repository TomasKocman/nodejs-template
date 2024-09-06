import { IsString } from "class-validator"

export class MaintenanceConfig {
    @IsString()
    APP_VERSION: string
}
