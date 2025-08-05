import { NextFunction, Request, Response } from 'express';
import { Error } from 'mongoose';
import { RequestWithUser } from '../types';
import Card from '../models/card';
import { HTTP_STATUS } from '../util/constants';
import BadRequestError from '../errors/BadRequestError';
import NotFoundError from '../errors/NotFoundError';
import ForbiddenError from '../errors/ForbiddenError';

const { ValidationError, CastError } = Error;

/**
 * Получить все карточки
 */
export const getAllCards = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const cards = await Card.find({}).populate('owner likes');
    res.send({ data: cards });
  } catch (err) {
    next(err);
  }
};

/**
 * Создать карточку
 */
export const createCard = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, link } = req.body;
    const owner = (req as RequestWithUser).user?._id;
    const card = await Card.create({ name, link, owner });
    res.status(HTTP_STATUS.CREATED).send({ data: card });
  } catch (err) {
    if (err instanceof ValidationError) {
      next(new BadRequestError('Ошибка валидации данных'));
    } else {
      next(err);
    }
  }
};

/**
 * Удалить карточку по идентификатору
 */
export const deleteCardById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { cardId } = req.params;
    const userId = (req as RequestWithUser).user?._id;
    const card = await Card.findById(cardId);
    if (!card) {
      throw new NotFoundError('Карточка не найдена');
    }

    if (card.owner.toString() !== userId) {
      throw new ForbiddenError('Нет прав для удаления карточки');
    }

    const deletedCard = await Card.findByIdAndDelete(cardId);
    return res.send({ data: deletedCard });
  } catch (err) {
    if (err instanceof CastError) {
      return next(new BadRequestError('Некорректный идентификатор карточки'));
    }
    return next(err);
  }
};

/**
 * Поставить лайк карточке
 */
export const setLikeToCard = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { cardId } = req.params;
    const userId = (req as RequestWithUser).user?._id;
    const card = await Card.findByIdAndUpdate(
      cardId,
      { $addToSet: { likes: userId } },
      { new: true, runValidators: true },
    ).populate('owner likes');

    if (!card) {
      throw new NotFoundError('Карточка не найдена');
    }

    return res.send({ data: card });
  } catch (err) {
    if (err instanceof CastError) {
      return next(new BadRequestError('Некорректный идентификатор карточки'));
    }
    return next(err);
  }
};

/**
 * Убрать лайк с карточки
 */
export const removeLikeFromCard = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { cardId } = req.params;
    const userId = (req as RequestWithUser).user?._id;
    const card = await Card.findByIdAndUpdate(
      cardId,
      { $pull: { likes: userId } },
      { new: true, runValidators: true },
    ).populate('owner likes');

    if (!card) {
      throw new NotFoundError('Карточка не найдена');
    }

    return res.send({ data: card });
  } catch (err) {
    if (err instanceof CastError) {
      return next(new BadRequestError('Некорректный идентификатор карточки'));
    }
    return next(err);
  }
};
