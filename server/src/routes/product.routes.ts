import express from 'express';
import { authenticate } from '../middleware/auth.middleware';
import { checkRole } from '../middleware/role.middleware';
import { UserRole } from '../models/User';
import { upload } from '../middleware/upload.middleware';
import {
  getAllProducts,
  getProducerProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  getProductById
} from '../controllers/product.controller';

const router = express.Router();

// Public routes
router.get('/', getAllProducts);

// Protected routes
router.get('/producer', authenticate, checkRole([UserRole.PRODUCER]), getProducerProducts);
router.get('/:id', getProductById);
router.post(
  '/',
  authenticate,
  checkRole([UserRole.PRODUCER]),
  upload.single('image'),
  createProduct
);
router.put('/:id', authenticate, checkRole([UserRole.PRODUCER]), updateProduct);
router.delete('/:id', authenticate, checkRole([UserRole.PRODUCER]), deleteProduct);

export default router; 