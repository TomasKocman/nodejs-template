import { Controller, Get, HttpCode } from "@nestjs/common"
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger"
import { MaintenanceConfig } from "./config"
import { load } from "../../../common/config/load"
import { AboutDto } from "./dto/about"

@ApiTags("maintenance")
@Controller()
class MaintenanceController {
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

    @Get("/about")
    @HttpCode(200)
    @ApiOperation({
        summary: "Info about the app",
        description: "Info about the app like version",
        operationId: "about",
    })
    @ApiResponse({ status: 200, type: AboutDto, description: "About" })
    about() {
        return new AboutDto(this.appVersion)
    }
}

export {
    MaintenanceController
}
