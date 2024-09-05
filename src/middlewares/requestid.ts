import { Injectable, NestMiddleware } from "@nestjs/common"
import { Request, Response } from "express"
import { v7 as uuidv7 } from "uuid"
import { Als, Context } from "../common/als/als"

@Injectable()
export class RequestIdMiddleware implements NestMiddleware {
  use(req: Request, _: Response, next: () => void) {
    const ctx: Context = {
      requestId: req.headers["x-request-id"] as string ?? uuidv7(),
    }
    Als.storage.run(ctx, () => next())
  }
}
