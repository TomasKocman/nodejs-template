import { Injectable } from "@nestjs/common"
import { credential } from "firebase-admin"
import { initializeApp } from "firebase-admin/app"
import { getAuth, Auth } from "firebase-admin/auth"
import { load } from "../../../common/config/load"
import { FirebaseConfig } from "./config"
import { Claims, CustomClaims, VerifiedToken } from "./token"
import { UnauthorizedException } from "../../user/entity/error"

@Injectable()
export class FirebaseService {
    private readonly authClient: Auth

    constructor() {
        const config = load(FirebaseConfig)
        const app = initializeApp({
            credential: credential.cert(JSON.parse(config.FIREBASE_CONFIG)),
        })
        this.authClient = getAuth(app)
    }

    async authenticate(idToken: string): Promise<VerifiedToken> {
        try {
            const token = await this.authClient.verifyIdToken(idToken)
            const claims: Claims = {
                displayName: token.name,
                email: token.email,
                phone: token.phone_number,
                avatarUrl: token.picture,
                custom: {
                    userId: token.custom?.userId
                }
            }
            return new VerifiedToken(claims, token.uid)
        } catch (e) {
            throw new UnauthorizedException(e)
        }
    }

    setCustomClaims(uid: string, claims: CustomClaims) {
        return this.authClient.setCustomUserClaims(uid, {
            custom: {
                userId: claims.userId
            }
        })
    }
}
