import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import * as correlationId from 'correlation-id';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class CorrelationIdMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const id = (req.headers['x-correlation-id'] as string) || uuidv4();

    correlationId.withId(id, () => {
      res.setHeader('x-correlation-id', id);
      next();
    });
  }
}
