import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { Error } from 'mongoose';
import User from '../models/user';
import HTTP_STATUS from '../util/constants';
import {
  handleConflictError,
  handleServerError,
  handleValidationError,
  handleWrongCredentials,
} from '../util/errorHandlers';

const { ValidationError } = Error;

/**
 * Залогинить пользователя
 */
export const signIn = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!(email && password)) {
      handleWrongCredentials(res);
      return;
    }

    const user = await User.findUserByCredentials(email, password);
    const token = jwt.sign({ _id: user._id }, process.env.SECRET_KEY || 'some-secret-key', { expiresIn: '7d' });

    // Устанавливаем httpOnly куку с токеном
    res.cookie('jwt', token, {
      httpOnly: true,
      maxAge: 604_800_000, // 7 дней в миллисекундах
      sameSite: 'strict', // Защита от CSRF атак
    });
    res.send();
  } catch (err) {
    handleWrongCredentials(res);
  }
};

/**
 * Создать пользователя
 */
export const signUp = async (req : Request, res : Response) => {
  const {
    email, password, name, about, avatar,
  } = req.body;

  const hashedPassword = bcrypt.hash(password, 10);
  await User.create(
    {
      email, hashedPassword, name, about, avatar,
    },
  ).then((user) => res.status(HTTP_STATUS.CREATED).send({ data: user }))
    .catch((reason) => {
      if (reason.code === 11000) {
        handleConflictError(res);
      } else if (reason instanceof ValidationError) {
        handleValidationError(res);
      } else {
        handleServerError(res);
      }
    });
};
