import { Query, Resolver } from "@nestjs/graphql"
import { About } from "./gqlmodel/about"
import { load } from "../../../common/config/load"
import { MaintenanceConfig } from "./config"

@Resolver()
class MaintenanceResolver {
    readonly appVersion: string

    constructor() {
        const config = load(MaintenanceConfig)
        this.appVersion = config.APP_VERSION
    }

    @Query(() => About)
    about() {
        return new About(this.appVersion)
    }
}

export {
    MaintenanceResolver
}
