import type { Request, Response, NextFunction } from 'express';
import { ApiError } from '../types/errors';

const UUID_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export function validateUuidParam(paramName = 'id') {
  return (req: Request, _res: Response, next: NextFunction) => {
    const value = req.params[paramName];
    if (!UUID_REGEX.test(value)) {
      return next(
        new ApiError(400, `Invalid UUID format for parameter: ${paramName}`),
      );
    }
    next();
  };
}
