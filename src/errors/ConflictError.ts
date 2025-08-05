import ErrorBase from './ErrorBase';
import { HTTP_STATUS } from '../util/constants';

/**
 * Кастомный класс ошибки BadRequest, статус 409
 */
export default class ConflictError extends ErrorBase {
  constructor(message?: string) {
    super(message || 'Конфикт при обращении к ресурсу', HTTP_STATUS.CONFLICT);
  }
}
