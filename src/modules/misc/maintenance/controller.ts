import { Controller, Get, HttpCode } from "@nestjs/common"
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger"
import { MaintenanceConfig } from "./config"
import { load } from "../../../common/config/load"
import { AppVersionDto } from "./dto/version"

@ApiTags("maintenance")
@Controller()
export class Maintenance {
    readonly appVersion: string

    constructor() {
        const config = load(MaintenanceConfig)
        this.appVersion = config.APP_VERSION
    }

    @Get("/ping")
    @HttpCode(204)
    @ApiOperation({
        summary: "Ping",
        description: "Ping",
        operationId: "ping",
    })
    @ApiResponse({ status: 204, description: "Ping" })
    ping() {}

    @Get("/version")
    @HttpCode(200)
    @ApiOperation({
        summary: "App version",
        description: "App version",
        operationId: "appVersion",
    })
    @ApiResponse({ status: 200, type: AppVersionDto, description: "App version" })
    version() {
        return new AppVersionDto(this.appVersion)
    }
}
