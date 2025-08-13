import { Router } from 'express';
import { body, param } from 'express-validator';
import {
  getUserById, getAllUsers, updateUserProfile, updateUserAvatar, getCurrentUser,
} from '../controllers/user';
import { validateRequest } from '../middlewares/validation';
import { URL_REGEX } from '../util/constants';

const router = Router();

router.get('/me', getCurrentUser);
router.get(
  '/:userId',
  [
    param('userId')
      .isMongoId()
      .withMessage('Некорректный ID пользователя'),
    validateRequest,
  ],
  getUserById,
);
router.get('/', getAllUsers);
router.patch(
  '/me',
  [
    body('name')
      .optional()
      .isLength({ min: 2, max: 30 })
      .withMessage('Имя должно быть от 2 до 30 символов'),
    body('about')
      .optional()
      .isLength({ min: 2, max: 200 })
      .withMessage('Информация о себе должна быть от 2 до 200 символов'),
    validateRequest,
  ],
  updateUserProfile,
);
router.patch(
  '/me/avatar',
  [
    body('avatar')
      .isURL()
      .withMessage('Некорректный URL аватара')
      .matches(URL_REGEX)
      .withMessage('Некорректный формат URL аватара'),
    validateRequest,
  ],
  updateUserAvatar,
);

export default router;
