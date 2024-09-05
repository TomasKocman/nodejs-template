import { Injectable } from "@nestjs/common"
import { initializeApp } from "firebase/app"
import { getAuth, Auth, signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth"
import { load } from "../../common/config/load"
import { FirebaseConfig } from "./config"

@Injectable()
export class FirebaseService {
    readonly authClient: Auth

    constructor() {
        const config = load(FirebaseConfig)
        const app = initializeApp(JSON.parse(config.FIREBASE_CONFIG))
        this.authClient = getAuth(app)
    }

    createUserWithEmailAndPassword(email: string, password: string) {
        const userCredentials = createUserWithEmailAndPassword(this.authClient, email, password)
        return userCredentials
    }

    signInWithEmailAndPassword(email: string, password: string) {
        const userCredentials = signInWithEmailAndPassword(this.authClient, email, password)
        return userCredentials
    }
}
