import ErrorBase from './ErrorBase';
import { HTTP_STATUS } from '../util/constants';

/**
 * Кастомный класс ошибки BadRequest, статус 400
 */
export default class BadRequestError extends ErrorBase {
  constructor(message?: string) {
    super(message || 'Некорректный запрос', HTTP_STATUS.BAD_REQUEST);
  }
}
