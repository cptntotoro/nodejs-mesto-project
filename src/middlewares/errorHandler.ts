import { NextFunction, Request, Response } from 'express';
import { logError } from '../util/logger';
import BadRequestError from '../errors/BadRequestError';
import ConflictError from '../errors/ConflictError';
import ForbiddenError from '../errors/ForbiddenError';
import NotFoundError from '../errors/NotFoundError';
import UnauthorizedError from '../errors/UnauthorizedError';
import { HTTP_STATUS } from '../util/constants';

const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  _next: NextFunction,
) => {
  logError(err, req);

  if (err instanceof BadRequestError) {
    return res.status(HTTP_STATUS.BAD_REQUEST).json({
      message: err.message,
    });
  }

  if (err instanceof UnauthorizedError) {
    return res.status(HTTP_STATUS.UNAUTHORIZED).json({
      message: err.message,
    });
  }

  if (err instanceof ForbiddenError) {
    return res.status(HTTP_STATUS.FORBIDDEN).json({
      message: err.message,
    });
  }

  if (err instanceof NotFoundError) {
    return res.status(HTTP_STATUS.NOT_FOUND).json({
      message: err.message,
    });
  }

  if (err instanceof ConflictError) {
    return res.status(HTTP_STATUS.CONFLICT).json({
      message: err.message,
    });
  }

  // Обработка ошибок MongoDB
  // Пользователь пытается зарегистрироваться по уже существующему в базе email
  if ((err as any).code === 11000) {
    return res.status(HTTP_STATUS.CONFLICT).json({
      message: 'Пользователь с таким email уже существует',
    });
  }

  // Ошибки валидации Mongoose
  if (err.name === 'ValidationError') {
    return res.status(HTTP_STATUS.BAD_REQUEST).json({
      message: err.message,
    });
  }

  // Все остальные ошибки
  return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
    message: 'На сервере произошла ошибка',
  });
};

export default errorHandler;
