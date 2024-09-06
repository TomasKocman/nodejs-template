import { Module } from "@nestjs/common"
import { Maintenance } from "./controller"

@Module({
    controllers: [Maintenance]
})
export class MaintenanceModule {}
