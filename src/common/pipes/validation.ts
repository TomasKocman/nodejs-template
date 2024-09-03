import { ValidationPipe } from "@nestjs/common"
import { AppException } from "../errors/error"

class ValidationException extends AppException {
    constructor(cause?: Error) {
        super("validation error", "ERR_INVALID_INPUT", cause)
    }
}

function validation(): ValidationPipe {
    return new ValidationPipe({
        exceptionFactory: (errors) => {
            const errorFields = errors.map(error => error.property)
            throw new ValidationException().withData({fields: errorFields})
        },
    })
}

export {
    validation,
    ValidationException
}
