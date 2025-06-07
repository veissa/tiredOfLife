import { Router } from 'express';
import { authenticate } from '../middleware/auth.middleware';
import { checkRole } from '../middleware/role.middleware';
import { UserRole } from '../models/User';
import { getProducerProfile, updateProducerProfile, createProducer } from '../controllers/producer.controller';
import { upload } from '../middleware/upload.middleware';

const router = Router();

// Get producer profile(s) - fetches all profiles for the authenticated user
router.get(
  '/profile',
  authenticate,
  checkRole([UserRole.PRODUCER]),
  getProducerProfile
);

// Get a specific producer profile by ID
router.get(
  '/profile/:id',
  authenticate,
  checkRole([UserRole.PRODUCER]),
  getProducerProfile
);

// Create a new producer profile (shop)
router.post(
  '/profile',
  authenticate,
  checkRole([UserRole.PRODUCER]),
  upload.single('shopImage'),
  createProducer
);

// Update a specific producer profile (shop) by ID
router.put(
  '/profile/:id',
  authenticate,
  checkRole([UserRole.PRODUCER]),
  upload.single('shopImage'),
  updateProducerProfile
);

export default router;