import { ServiceException } from "../../../common/errors/error"

class UserNotFoundException extends ServiceException {
    constructor(cause?: Error) {
        super("user not found", "ERR_USER_NOT_FOUND", cause)
    }
}

export {
    UserNotFoundException
}
