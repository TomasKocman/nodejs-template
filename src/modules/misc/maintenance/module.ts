import { Module } from "@nestjs/common"
import { MaintenanceController } from "./controller"
import { MaintenanceResolver } from "./resolver"

@Module({
    controllers: [MaintenanceController],
    providers: [MaintenanceResolver]
})
export class MaintenanceModule {}
