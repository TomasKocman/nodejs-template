import { Module } from "@nestjs/common"
import { FirebaseService } from "./service"

@Module({
    providers: [FirebaseService]
})
export class FirebaseModule {}
