import ErrorBase from './ErrorBase';
import { HTTP_STATUS } from '../util/constants';

/**
 * Кастомный класс ошибки Forbidden, статус 403
 */
export default class ForbiddenError extends ErrorBase {
  constructor(message?: string) {
    super(message || 'Недостаточно прав для совершения действия', HTTP_STATUS.FORBIDDEN);
  }
}
