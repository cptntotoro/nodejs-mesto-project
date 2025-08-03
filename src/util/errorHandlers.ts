import { Response } from 'express';
import HTTP_STATUS from './constants';

export const handleNotFoundError = (res: Response, message: string) => {
  res.status(HTTP_STATUS.NOT_FOUND).send({ message });
};

export const handleValidationError = (res: Response, message?: string) => {
  res.status(HTTP_STATUS.BAD_REQUEST).send({ message: message || 'Некорректный запрос' });
};

export const handleForbiddenError = (res: Response) => {
  res.status(HTTP_STATUS.FORBIDDEN).send({ message: 'Недостаточно прав для совершения действия' });
};

export const handleServerError = (res: Response) => {
  res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).send({ message: 'Ошибка сервера' });
};
