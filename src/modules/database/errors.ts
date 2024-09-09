import { QueryFailedError } from "typeorm"

const foreignKeyErrorCode = "23503"
const uniqueErrorCode = "23505"

function isForeignKeyError(err: any): boolean {
    if (!(err instanceof QueryFailedError))
        return false
    return err.driverError.code === foreignKeyErrorCode
}

function isUniqueError(err: any): boolean {
    if (!(err instanceof QueryFailedError))
        return false
    return err.driverError.code === uniqueErrorCode
}

export {
    isForeignKeyError,
    isUniqueError
}
