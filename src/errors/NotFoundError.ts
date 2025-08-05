import ErrorBase from './ErrorBase';
import { HTTP_STATUS } from '../util/constants';

/**
 * Кастомный класс ошибки NotFound, статус 404
 */
export default class NotFoundError extends ErrorBase {
  constructor(message: string) {
    super(message, HTTP_STATUS.NOT_FOUND);
  }
}
