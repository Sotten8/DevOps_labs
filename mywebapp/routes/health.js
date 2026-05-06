import { Router } from 'express';
import TasksDB from '../db/db.js';
import { asyncHandler } from '../middlewares/error.js';

const router = Router();

router.get('/alive', (req, res) => {
  res.status(200).send('OK');
});

router.get(
  '/ready',
  asyncHandler(async (req, res) => {
    await TasksDB.ping();
    res.status(200).send('OK');
  }),
);

export default router;
