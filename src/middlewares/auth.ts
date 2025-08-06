import { NextFunction, Request, Response } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import dotenv from 'dotenv';
import { handleUnauthorizedError } from '../util/errorHandlers';
import { RequestWithUser } from '../types';

dotenv.config();

const { SECRET_KEY = 'some-secret-key' } = process.env;

const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  let token = req.cookies.jwt;

  if (!token) {
    // Если нет токена в куках, проверяем заголовок
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      handleUnauthorizedError(res);
      return;
    }
    token = authHeader.replace('Bearer ', '');
  }

  try {
    const payload = jwt.verify(token, SECRET_KEY) as JwtPayload & { _id: string };
    (req as RequestWithUser).user = payload;
    next();
  } catch (err) {
    handleUnauthorizedError(res);
  }
};

export default authMiddleware;
