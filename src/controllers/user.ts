import { NextFunction, Request, Response } from 'express';
import { Error } from 'mongoose';
import User from '../models/user';
import { RequestWithUser } from '../types';
import NotFoundError from '../errors/NotFoundError';
import BadRequestError from '../errors/BadRequestError';

const { ValidationError, CastError } = Error;

/**
 * Получить пользователя по идентификатору
 */
export const getUserById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      throw new NotFoundError('Пользователь не найден');
    }
    return res.send({ data: user });
  } catch (err) {
    if (err instanceof CastError) {
      return next(new BadRequestError('Некорректный идентификатор пользователя'));
    }
    return next(err);
  }
};

/**
 * Получить всех пользователей
 */
export const getAllUsers = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const users = await User.find({});
    return res.send({ data: users });
  } catch (err) {
    return next(err);
  }
};

/**
 * Обновить профиль пользователя
 */
export const updateUserProfile = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, about } = req.body;
    const userId = (req as RequestWithUser).user?._id;
    const user = await User.findByIdAndUpdate(
      userId,
      { name, about },
      { new: true, runValidators: true },
    );
    if (!user) {
      throw new NotFoundError('Пользователь не найден');
    }
    return res.send({ data: user });
  } catch (err) {
    if (err instanceof ValidationError) {
      return next(new BadRequestError('Некорректные данные'));
    }
    if (err instanceof CastError) {
      return next(new BadRequestError('Некорректный идентификатор пользователя'));
    }
    return next(err);
  }
};

/**
 * Обновить аватар пользователя
 */
export const updateUserAvatar = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { avatar } = req.body;
    const userId = (req as RequestWithUser).user?._id;
    const user = await User.findByIdAndUpdate(
      userId,
      { avatar },
      { new: true, runValidators: true },
    );

    if (!user) {
      throw new NotFoundError('Пользователь не найден');
    }

    return res.send({ data: user });
  } catch (err) {
    if (err instanceof ValidationError || err instanceof CastError) {
      return next(new BadRequestError('Некорректные данные пользователя'));
    }
    return next(err);
  }
};

/**
 * Получить информацию о текущем пользователе
 */
export const getCurrentUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = (req as RequestWithUser).user?._id;
    const user = await User.findById(userId);
    if (!user) {
      throw new NotFoundError('Пользователь не найден');
    }
    return res.send({ data: user });
  } catch (err) {
    if (err instanceof CastError) {
      return next(new BadRequestError('Некорректный идентификатор пользователя'));
    }
    return next(err);
  }
};
