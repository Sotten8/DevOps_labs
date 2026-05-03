import { Router } from 'express';
import TasksDB from '../db/db.js';
import { asyncHandler } from '../middlewares/error.js';

const router = Router();

router.get('/alive', (req, res) => {
  res.json({ status: 200, message: 'OK' });
});

router.get(
  '/ready',
  asyncHandler(async (req, res) => {
    await TasksDB.ping();
    res.json({ status: 200, message: 'OK' });
  }),
);

export default router;
