import { Router } from 'express';
import { authenticate } from '../middleware/auth.middleware';
import { checkRole } from '../middleware/role.middleware';
import { UserRole } from '../models/User';
import {
  getAllProducts,
  getProducerProducts,
  createProduct,
  updateProduct,
  deleteProduct
} from '../controllers/product.controller';

const router = Router();

// Public routes (for customers)
router.get('/', getAllProducts);

// Protected routes (for producers)
router.get('/my-products', authenticate, checkRole([UserRole.PRODUCER]), getProducerProducts);
router.post('/', authenticate, checkRole([UserRole.PRODUCER]), createProduct);
router.put('/:id', authenticate, checkRole([UserRole.PRODUCER]), updateProduct);
router.delete('/:id', authenticate, checkRole([UserRole.PRODUCER]), deleteProduct);

export default router; 