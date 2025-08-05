import ErrorBase from './ErrorBase';
import { HTTP_STATUS } from '../util/constants';

/**
 * Кастомный класс ошибки Unauthorized, статус 401
 */
export default class UnauthorizedError extends ErrorBase {
  constructor(message?: string) {
    super(message || 'Необходима авторизация для совершения действия', HTTP_STATUS.UNAUTHORIZED);
  }
}
