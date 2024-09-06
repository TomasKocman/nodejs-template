import { AsyncLocalStorage } from "node:async_hooks"

type Context = {
    requestId: string
    internalServerError?: Error
}

class Als {
    public static storage = new AsyncLocalStorage<Context>()

    public static getContext(): Context {
        return Als.storage.getStore()!
    }
}

export {
    Context,
    Als
}
