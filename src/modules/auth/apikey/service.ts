import { Injectable } from "@nestjs/common"
import { load } from "../../../common/config/load"
import { ApiKeyConfig } from "./config"
import { UnauthorizedException } from "../../user/entity/error"

@Injectable()
export class ApiKeyService {
    private readonly apiKey: string

    constructor() {
        const config = load(ApiKeyConfig)
        this.apiKey = config.API_KEY
    }

    authenticate(apiKey: string) {
        if (!(apiKey === this.apiKey)) {
            throw new UnauthorizedException()
        }
    }
}
