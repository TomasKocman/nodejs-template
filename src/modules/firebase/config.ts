import { IsJSON } from "class-validator"

export class FirebaseConfig {
    @IsJSON()
    FIREBASE_CONFIG: string
}
