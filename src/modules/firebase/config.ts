import { IsJSON } from "class-validator"

class FirebaseConfig {
    @IsJSON()
    FIREBASE_CONFIG: string
}

export {
    FirebaseConfig
}
