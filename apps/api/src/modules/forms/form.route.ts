import { Router } from 'express';
import { create, deleteForm, getAll, getOne, updateContent } from './form.controller';
import { protect } from '../../middleware/auth.middleware';

const router = Router();

router.use(protect);

router.post('/', create);
router.get('/', getAll); // ?workspaceId=123
router.get('/:id', getOne);
router.put('/:id/content', updateContent); // Save form builder changes
router.delete('/:id', deleteForm);
export default router;