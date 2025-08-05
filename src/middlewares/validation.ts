import { NextFunction, Request, Response } from 'express';
import { validationResult, Result, ValidationError } from 'express-validator';
import BadRequestError from '../errors/BadRequestError';
import { URL_REGEX } from '../util/constants';

export const validateRequest = (req: Request, _res: Response, next: NextFunction) => {
  const errors: Result<ValidationError> = validationResult(req);
  if (!errors.isEmpty()) {
    const errorMessages = errors.array().map((error) => error.msg).join(', ');
    next(new BadRequestError(errorMessages));
    return;
  }
  next();
};

export const validateUrl = (value: string): boolean => URL_REGEX.test(value);
