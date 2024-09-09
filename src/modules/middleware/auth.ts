import { Injectable, NestMiddleware } from "@nestjs/common"
import { Request, Response } from "express"
import { UnauthorizedException } from "../user/entity/error"
import { FirebaseService } from "../firebase/service"
import { Als } from "../../common/als/als"

const authSchema = "Bearer"

@Injectable()
class AuthenticationMiddleware implements NestMiddleware {
    constructor(
        private readonly firebaseService: FirebaseService
    ) {}

    async use(req: Request, _: Response, next: () => void) {
        const authHeaderValue = req.headers.authorization as string
        if (!authHeaderValue) {
            throw new UnauthorizedException()
        }

        const idToken = this.parseToken(authHeaderValue)
        const verifiedToken = await this.firebaseService.authenticate(idToken)

        const ctx = Als.getContext()
        ctx.verifiedToken = verifiedToken
        Als.setContext(ctx)

        next()
    }

    private parseToken(authHeaderValue: string): string {
        const parts = authHeaderValue.split(" ")
        if (parts.length !== 2 || parts[0] !== authSchema) {
            throw new UnauthorizedException()
        }
        return parts[1]!
    }
}

export {
    AuthenticationMiddleware
}
