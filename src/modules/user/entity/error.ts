import { AppException } from "../../../common/errors/error"

class UnauthorizedException extends AppException {
    constructor(cause?: unknown) {
        super("unauthorized", "ERR_UNAUTHORIZED", cause)
    }
}

class UserNotFoundException extends AppException {
    constructor(cause?: unknown) {
        super("user not found", "ERR_USER_NOT_FOUND", cause)
    }
}

class UserAlreadyExistsException extends AppException {
    constructor(cause?: unknown) {
        super("user already exists", "ERR_USER_ALREADY_EXISTS", cause)
    }
}

export {
    UnauthorizedException,
    UserNotFoundException,
    UserAlreadyExistsException,
}
