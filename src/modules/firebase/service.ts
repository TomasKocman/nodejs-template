import { Injectable } from "@nestjs/common"
import { initializeApp } from "firebase-admin/app"
import { getAuth, Auth } from "firebase-admin/auth"
import { load } from "../../common/config/load"
import { FirebaseConfig } from "./config"
import { claimKeyUserId, Claims, CustomClaims, VerifiedToken } from "./token"

@Injectable()
export class FirebaseService {
    readonly authClient: Auth

    constructor() {
        const config = load(FirebaseConfig)
        const app = initializeApp(JSON.parse(config.FIREBASE_CONFIG))
        this.authClient = getAuth(app)
    }

    async authenticate(idToken: string): Promise<VerifiedToken> {
        const token = await this.authClient.verifyIdToken(idToken)
        const claims: Claims = {
            displayName: token.name,
            email: token.email,
            phone: token.phone_number,
            avatarUrl: token.picture,
            custom: {
                userId: token[claimKeyUserId]
            }
        }
        return new VerifiedToken(claims, token.uid)
    }

    setCustomClaims(uid: string, claims: CustomClaims) {
        return this.authClient.setCustomUserClaims(uid, claims)
    }
}
