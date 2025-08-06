import { Router } from 'express';
import {
  getUserById, getAllUsers, updateUserProfile, updateUserAvatar, getCurrentUser,
} from '../controllers/user';

const router = Router();

router.get('/me', getCurrentUser);
router.get('/:userId', getUserById);
router.get('/', getAllUsers);
router.patch('/me', updateUserProfile);
router.patch('/me/avatar', updateUserAvatar);

export default router;
