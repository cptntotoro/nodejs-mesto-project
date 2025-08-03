import { Router } from 'express';
import {
  getAllCards, deleteCardById, createCard, setLikeToCard, removeLikeFromCard,
} from '../controllers/card';

const router = Router();

router.get('/', getAllCards);
router.delete('/:cardId', deleteCardById);
router.post('/', createCard);
router.put('/:cardId/likes', setLikeToCard);
router.delete('/:cardId/likes', removeLikeFromCard);

export default router;
