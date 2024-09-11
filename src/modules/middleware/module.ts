import { Module } from "@nestjs/common"
import { FirebaseModule } from "../firebase/module"
import { ApolloLoggingPlugin } from "./logging"

@Module({
    imports: [
        FirebaseModule,
    ],
    providers: [ApolloLoggingPlugin]
})
export class MiddlewareModule {}
