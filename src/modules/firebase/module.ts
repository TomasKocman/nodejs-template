import { Module } from "@nestjs/common"
import { FirebaseService } from "./service"

@Module({
    providers: [FirebaseService],
    exports: [FirebaseService],
})
export class FirebaseModule {}
