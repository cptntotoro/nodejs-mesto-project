import { Router } from 'express';
import {
  createUser, getUserById, getAllUsers, updateUserProfile, updateUserAvatar,
} from '../controllers/user';

const router = Router();

router.get('/:userId', getUserById);
router.post('/', createUser);
router.get('/', getAllUsers);
router.patch('/me', updateUserProfile);
router.patch('/me/avatar', updateUserAvatar);

export default router;
