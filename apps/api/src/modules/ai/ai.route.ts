import { Router } from 'express';
import { generateForm } from './ai.controller';
import { protect } from '../../middleware/auth.middleware';

const router = Router();

router.use(protect);
router.post('/generate', generateForm);

export default router;