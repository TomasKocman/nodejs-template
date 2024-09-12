import { Module } from "@nestjs/common"
import { ApiKeyService } from "./service"

@Module({
    providers: [ApiKeyService],
    exports: [ApiKeyService],
})
export class ApiKeyModule {}
