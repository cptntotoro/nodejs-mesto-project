import { Request, Response } from 'express';
import { Error } from 'mongoose';
import User from '../models/user';
import { handleNotFoundError, handleServerError, handleValidationError } from '../util/errorHandlers';
import HTTP_STATUS from '../util/constants';
import { RequestWithUser } from '../types';

const { ValidationError, CastError } = Error;

/**
 * Создать пользователя
 */
export const createUser = async (req : Request, res : Response) => {
  try {
    const { name, about, avatar } = req.body;
    const user = await User.create({ name, about, avatar });
    res.status(HTTP_STATUS.CREATED).send({ data: user });
  } catch (err) {
    if (err instanceof ValidationError) {
      handleValidationError(res);
    } else {
      handleServerError(res);
    }
  }
};

/**
 * Получить пользователя по идентификатору
 */
export const getUserById = async (req: Request, res: Response) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return handleNotFoundError(res, 'Пользователь не найден');
    }
    return res.send({ data: user });
  } catch (err) {
    if (err instanceof CastError) {
      return handleValidationError(res, 'Некорректный идентификатор пользователя');
    }
    return handleServerError(res);
  }
};

/**
 * Получить всех пользователей
 */
export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const users = await User.find({});
    res.send({ data: users });
  } catch (err) {
    handleServerError(res);
  }
};

/**
 * Обновить профиль пользователя
 */
export const updateUserProfile = async (req: Request, res: Response) => {
  try {
    const { name, about } = req.body;
    const userId = (req as RequestWithUser).user?._id;
    const user = await User.findByIdAndUpdate(
      userId,
      { name, about },
      { new: true, runValidators: true },
    );
    if (!user) {
      return handleNotFoundError(res, 'Пользователь не найден');
    }
    return res.send({ data: user });
  } catch (err) {
    if (err instanceof ValidationError) {
      return handleValidationError(res, 'Некорректные данные');
    }
    if (err instanceof CastError) {
      return handleValidationError(res, 'Некорректный идентификатор пользователя');
    }
    return handleServerError(res);
  }
};

/**
 * Обновить аватар пользователя
 */
export const updateUserAvatar = async (req: Request, res: Response) => {
  try {
    const { avatar } = req.body;
    const userId = (req as RequestWithUser).user?._id;
    const user = await User.findByIdAndUpdate(
      userId,
      { avatar },
      { new: true, runValidators: true },
    );

    if (!user) {
      return handleNotFoundError(res, 'Пользователь не найден');
    }

    return res.send({ data: user });
  } catch (err) {
    if (err instanceof ValidationError || err instanceof CastError) {
      return handleValidationError(res, 'Некорректные данные пользователя');
    }
    return handleServerError(res);
  }
};
