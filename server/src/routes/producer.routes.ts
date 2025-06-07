import { Router } from 'express';
import { authenticate } from '../middleware/auth.middleware';
import { checkRole } from '../middleware/role.middleware';
import { UserRole } from '../models/User';
import { getProducerProfile, updateProducerProfile } from '../controllers/producer.controller';
import { upload } from '../middleware/upload.middleware';

const router = Router();

router.get(
  '/profile',
  authenticate,
  checkRole([UserRole.PRODUCER]),
  getProducerProfile
);

router.put(
  '/profile',
  authenticate,
  checkRole([UserRole.PRODUCER]),
  upload.single('shopImage'),
  updateProducerProfile
);

export default router; 