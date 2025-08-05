import ErrorBase from './ErrorBase';
import { HTTP_STATUS } from '../util/constants';

/**
 * Кастомный класс ошибки InternalServerError, статус 500
 */
export default class InternalServerError extends ErrorBase {
  constructor(message?: string) {
    super(message || 'Ошибка сервера', HTTP_STATUS.INTERNAL_SERVER_ERROR);
  }
}
