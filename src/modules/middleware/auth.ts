import { HttpStatus, Injectable, Logger, NestMiddleware } from "@nestjs/common"
import { Request, Response } from "express"
import { UnauthorizedException } from "../user/entity/error"
import { FirebaseService } from "../firebase/service"
import { Als } from "../../common/als/als"
import { VerifiedToken } from "../firebase/token"
import { GraphQLError } from "graphql/index"
import { defaultErrorCode, defaultErrorMessage } from "../../common/errors/error"

const authSchema = "Bearer"

function parseToken(authHeaderValue: string): string {
    const parts = authHeaderValue.split(" ")
    if (parts.length !== 2 || parts[0] !== authSchema) {
        throw new UnauthorizedException()
    }
    return parts[1]!
}

@Injectable()
class HttpAuthenticationMiddleware implements NestMiddleware {
    constructor(
        private readonly firebaseService: FirebaseService
    ) {}

    async use(req: Request, _: Response, next: () => void) {
        const authHeaderValue = req.headers.authorization as string
        if (!authHeaderValue) {
            throw new UnauthorizedException()
        }

        const idToken = parseToken(authHeaderValue)
        const verifiedToken = await this.firebaseService.authenticate(idToken)

        const ctx = Als.getContext()
        ctx.verifiedToken = verifiedToken
        Als.setContext(ctx)

        next()
    }
}

@Injectable()
class GqlAuthenticationMiddleware implements NestMiddleware {
    private readonly logger = new Logger(GqlAuthenticationMiddleware.name)

    constructor(
        private readonly firebaseService: FirebaseService,
    ) {}

    async use(req: Request, res: Response, next: () => void) {
        const authHeaderValue = req.headers.authorization as string
        if (!authHeaderValue) {
            next()
            return
        }

        const ctx = Als.getContext()
        let verifiedToken: VerifiedToken
        try {
            const idToken = parseToken(authHeaderValue)
            verifiedToken = await this.firebaseService.authenticate(idToken)
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

        ctx.verifiedToken = verifiedToken
        Als.setContext(ctx)

        next()
    }
}

export {
    HttpAuthenticationMiddleware,
    GqlAuthenticationMiddleware
}
