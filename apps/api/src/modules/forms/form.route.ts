import { Router } from 'express';
import { create, deleteForm, getAll, getOne, updateContent } from './form.controller';
import { protect } from '../../middleware/auth.middleware';
import { exportSubmissions, getAIInsights, getFormAnalytics, getSubmissions, submitForm } from './submission.controller';

const router = Router();

router.get('/:id/public', getOne);
router.use(protect);
router.get('/:formId/submissions', getSubmissions);
router.post('/', create);
router.get('/', getAll); // ?workspaceId=123
router.get('/:id', getOne);
router.put('/:id/content', updateContent); // Save form builder changes
router.delete('/:id', deleteForm);
router.post('/:formId/submit', submitForm);
router.get('/:formId/export', exportSubmissions);
router.get('/:formId/analytics', getFormAnalytics);
router.get('/:formId/ai-insight', getAIInsights);
export default router;