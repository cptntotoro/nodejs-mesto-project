import { Router } from 'express';
import { body, param } from 'express-validator';
import {
  getAllCards, deleteCardById, createCard, setLikeToCard, removeLikeFromCard,
} from '../controllers/card';
import { validateRequest, validateUrl } from '../middlewares/validation';

const router = Router();

router.get('/', getAllCards);
router.delete(
  '/:cardId',
  [
    param('cardId')
      .isMongoId()
      .withMessage('Некорректный ID карточки'),
    validateRequest,
  ],
  deleteCardById,
);
router.post(
  '/',
  [
    body('name')
      .trim()
      .isLength({ min: 2, max: 30 })
      .withMessage('Название карточки должно быть от 2 до 30 символов'),
    body('link')
      .trim()
      .custom(validateUrl)
      .withMessage('Некорректный URL изображения'),
    validateRequest,
  ],
  createCard,
);
router.put(
  '/:cardId/likes',
  [
    param('cardId')
      .isMongoId()
      .withMessage('Некорректный ID карточки'),
    validateRequest,
  ],
  setLikeToCard,
);
router.delete(
  '/:cardId/likes',
  [
    param('cardId')
      .isMongoId()
      .withMessage('Некорректный ID карточки'),
    validateRequest,
  ],
  removeLikeFromCard,
);

export default router;
