import { GqlExceptionFilter } from "@nestjs/graphql"
import { GraphQLError, GraphQLFormattedError } from "graphql/index"
import { Als } from "../common/als/als"
import { AppException, defaultErrorCode, defaultErrorMessage } from "../common/errors/error"

class GqlAppExceptionFilter implements GqlExceptionFilter {
    catch(exception: any) {
        throw exception
    }
}

type GqlErrorData = {
    code: string
    message: string
    data?: Record<string, unknown>
}

function gqlFormatError(formattedError: GraphQLFormattedError, error: unknown) {
    const { requestId } = Als.getContext()
    const gqlErrorData: GqlErrorData = {
        code: defaultErrorCode,
        message: defaultErrorMessage
    }
    const gqlError = error as GraphQLError

    if (gqlError.originalError instanceof AppException) {
        const appError = gqlError.originalError as AppException
        gqlErrorData.code = appError.code
        gqlErrorData.message = appError.message
        gqlErrorData.data = appError.data
    } else {
        if (formattedError.extensions) {
            formattedError.extensions.requestId = requestId
        }
        return formattedError
    }

    return {
        message: gqlErrorData.message,
        path: formattedError.path,
        extensions: {
            code: gqlErrorData.code,
            data: gqlErrorData.data,
            requestId: requestId
        },
    }
}

export {
    GqlAppExceptionFilter,
    gqlFormatError
}
