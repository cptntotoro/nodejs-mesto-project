import { Request, Response } from 'express';
import { Error } from 'mongoose';
import { RequestWithUser } from '../types';
import Card from '../models/card';
import {
  handleNotFoundError, handleValidationError, handleServerError, handleForbiddenError,
} from '../util/errorHandlers';
import HTTP_STATUS from '../util/constants';

const { ValidationError, CastError } = Error;

/**
 * Получить все карточки
 */
export const getAllCards = async (req: Request, res: Response) => {
  try {
    const cards = await Card.find({}).populate('owner likes');
    res.send({ data: cards });
  } catch (err) {
    handleServerError(res);
  }
};

/**
 * Создать карточку
 */
export const createCard = async (req: Request, res: Response) => {
  try {
    const { name, link } = req.body;
    const owner = (req as RequestWithUser).user?._id;
    const card = await Card.create({ name, link, owner });
    res.status(HTTP_STATUS.CREATED).send({ data: card });
  } catch (err) {
    if (err instanceof ValidationError) {
      handleValidationError(res);
    } else {
      handleServerError(res);
    }
  }
};

/**
 * Удалить карточку по идентификатору
 */
export const deleteCardById = async (req: Request, res: Response) => {
  try {
    const { cardId } = req.params;
    const userId = (req as RequestWithUser).user?._id;
    const card = await Card.findById(cardId);
    if (!card) {
      return handleNotFoundError(res, 'Карточка не найдена');
    }

    if (card.owner.toString() !== userId) {
      return handleForbiddenError(res);
    }

    const deletedCard = await Card.findByIdAndDelete(cardId);
    return res.send({ data: deletedCard });
  } catch (err) {
    if (err instanceof CastError) {
      return handleValidationError(res);
    }
    return handleServerError(res);
  }
};

/**
 * Поставить лайк карточке
 */
export const setLikeToCard = async (req: Request, res: Response) => {
  try {
    const { cardId } = req.params;
    const userId = (req as RequestWithUser).user?._id;
    const card = await Card.findByIdAndUpdate(
      cardId,
      { $addToSet: { likes: userId } },
      { new: true, runValidators: true },
    ).populate('owner likes');

    if (!card) {
      return handleNotFoundError(res, 'Карточка не найдена');
    }

    return res.send({ data: card });
  } catch (err) {
    if (err instanceof CastError) {
      return handleValidationError(res);
    }
    return handleServerError(res);
  }
};

/**
 * Убрать лайк с карточки
 */
export const removeLikeFromCard = async (req: Request, res: Response) => {
  try {
    const { cardId } = req.params;
    const userId = (req as RequestWithUser).user?._id;
    const card = await Card.findByIdAndUpdate(
      cardId,
      { $pull: { likes: userId } },
      { new: true, runValidators: true },
    ).populate('owner likes');

    if (!card) {
      return handleNotFoundError(res, 'Карточка не найдена');
    }

    return res.send({ data: card });
  } catch (err) {
    if (err instanceof CastError) {
      return handleValidationError(res);
    }
    return handleServerError(res);
  }
};
