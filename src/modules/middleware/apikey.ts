import { HttpStatus, Injectable, Logger, NestMiddleware } from "@nestjs/common"
import { Request, Response } from "express"
import { ApiKeyService } from "../auth/apikey/service"
import { Als } from "../../common/als/als"
import { GraphQLError } from "graphql/index"
import { defaultErrorCode, defaultErrorMessage } from "../../common/errors/error"
import { UnauthorizedException } from "../user/entity/error"

const apiKeyHeader = "x-auth-apikey"

@Injectable()
class HttpApiKeyAuthenticationMiddleware implements NestMiddleware {
    constructor(
        private readonly apiKeyService: ApiKeyService
    ) {}

    use(req: Request, _: Response, next: () => void) {
        const apiKey = req.headers[apiKeyHeader] as string
        if (!apiKey) {
            throw new UnauthorizedException()
        }

        this.apiKeyService.authenticate(apiKey)

        const ctx = Als.getContext()
        ctx.authAsAdmin = true
        Als.setContext(ctx)

        next()
    }
}

@Injectable()
class GqlApiKeyAuthenticationMiddleware implements NestMiddleware {
    private readonly logger = new Logger(GqlApiKeyAuthenticationMiddleware.name)

    constructor(
        private readonly apiKeyService: ApiKeyService
    ) {}

    use(req: Request, res: Response, next: () => void) {
        const apiKey = req.headers[apiKeyHeader] as string
        if (!apiKey) {
            next()
            return
        }

        const ctx = Als.getContext()
        try {
            this.apiKeyService.authenticate(apiKey)
        } catch (e) {
            const gqlError = new GraphQLError(defaultErrorMessage, {
                extensions: {
                    code: defaultErrorCode,
                    requestId: ctx.requestId
                },
            })
            if (e instanceof UnauthorizedException) {
                gqlError.message = e.message
                gqlError.extensions.code = e.code
                gqlError.extensions.data = e.data
            }
            res.status(HttpStatus.OK).json({
                errors: [gqlError],
                data: null
            })
            this.logger.error(gqlError, "request processed")
            return
        }

        ctx.authAsAdmin = true
        Als.setContext(ctx)

        next()
    }
}

export {
    HttpApiKeyAuthenticationMiddleware,
    GqlApiKeyAuthenticationMiddleware
}
