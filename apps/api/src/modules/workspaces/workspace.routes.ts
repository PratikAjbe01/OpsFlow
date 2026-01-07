

import { Router } from 'express';
import { addMember, create, getAll, getMembers, removeMember } from './workspace.controller';
import { protect } from '../../middleware/auth.middleware';

const router = Router();

// All workspace routes require login
router.use(protect);

router.post('/', create);
router.get('/', getAll);

router.get('/:id/members', getMembers);
router.post('/:id/members', addMember);
router.delete('/:id/members/:memberId', removeMember);
export default router;