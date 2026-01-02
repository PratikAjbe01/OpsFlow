

import { Router } from 'express';
import { create, getAll } from './workspace.controller';
import { protect } from '../../middleware/auth.middleware';

const router = Router();

// All workspace routes require login
router.use(protect);

router.post('/', create);
router.get('/', getAll);

export default router;