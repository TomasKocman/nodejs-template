import { AsyncLocalStorage } from "node:async_hooks"
import { VerifiedToken } from "../../modules/auth/firebase/token"

type Context = {
    requestId: string
    verifiedToken?: VerifiedToken
    authAsAdmin?: boolean
    exception?: Error
}

class Als {
    public static storage = new AsyncLocalStorage<Context>()

    public static getContext(): Context {
        return Als.storage.getStore()!
    }

    public static setContext(context: Context) {
        Als.storage.enterWith(context)
    }
}

export {
    Context,
    Als
}
