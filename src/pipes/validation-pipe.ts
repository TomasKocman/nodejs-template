import { ValidationPipe } from "@nestjs/common"
import { AppException } from "../common/errors/error"
import { ParseUUIDPipe } from "@nestjs/common/pipes/parse-uuid.pipe"

class ValidationException extends AppException {
    constructor(cause?: Error) {
        super("validation error", "ERR_INVALID_INPUT", cause)
    }
}

function validationPipe(): ValidationPipe {
    return new ValidationPipe({
        exceptionFactory: (errors) => {
            const errorFields = errors.map(error => error.property)
            throw new ValidationException().withData({fields: errorFields})
        },
    })
}

function parseUUIDPipe(): ParseUUIDPipe {
    return new ParseUUIDPipe({
        exceptionFactory: () => {
            throw new ValidationException().withData({fields: ["id path param"]})
        },
    })
}

export {
    ValidationException,
    validationPipe,
    parseUUIDPipe
}
