import { Module } from "@nestjs/common"
import { FirebaseModule } from "../auth/firebase/module"
import { ApolloLoggingPlugin } from "./logging"

@Module({
    imports: [
        FirebaseModule,
    ],
    providers: [ApolloLoggingPlugin]
})
export class MiddlewareModule {}
