import { NextFunction, Request, Response } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { RequestWithUser } from '../types';
import UnauthorizedError from '../errors/UnauthorizedError';
import { SECRET_KEY } from '../config';

const authMiddleware = (req: Request, _res: Response, next: NextFunction) => {
  let token = req.cookies.jwt;

  if (!token) {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return next(new UnauthorizedError('Необходима авторизация'));
    }
    token = authHeader.replace('Bearer ', '');
  }

  try {
    const payload = jwt.verify(token, SECRET_KEY) as JwtPayload & { _id: string };
    (req as RequestWithUser).user = payload;
    return next();
  } catch (err) {
    return next(new UnauthorizedError('Неверный или истекший токен'));
  }
};

export default authMiddleware;
