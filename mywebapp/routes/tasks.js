import { Router } from 'express';
import TasksDB from '../db/db.js';
import { asyncHandler } from '../middlewares/error.js';

const router = Router();

// Home page
router.get('/', (req, res) => {
  if ((req.headers.accept || '').includes('text/html')) {
    res.send(`
      <html>
        <body>
          <h1>Task Tracker API</h1>
          <ul>
            <li>GET /tasks - list</li>
            <li>POST /tasks - create</li>
            <li>POST /tasks/:id/done - change status</li>
          </ul>
        </body>
      </html>
    `);
  } else {
    res
      .status(406)
      .json({ status: 406, error: 'Only text/html supported for root' });
  }
});

// GET tasks
router.get(
  '/tasks',
  asyncHandler(async (req, res) => {
    const result = await TasksDB.getAllTasks();
    const tasks = result.rows;

    if ((req.headers.accept || '').includes('text/html')) {
      const rows = tasks
        .map(
          (t) => `
        <tr>
          <td>${t.id}</td>
          <td>${t.title}</td>
          <td>${t.status}</td>
          <td>${t.created_at}</td>
        </tr>
      `,
        )
        .join('');

      res.send(`
      <html>
        <body>
          <h2>Tasks List</h2>
          <table border="1" style="border-collapse: collapse;" cellpadding="5">
            <tr>
              <th>ID</th>
              <th>Title</th>
              <th>Status</th>
              <th>Created</th>
            </tr>
            ${rows}
          </table>
        </body>
      </html>
    `);
    } else {
      res.json(tasks);
    }
  }),
);

// POST create task
router.post(
  '/tasks',
  asyncHandler(async (req, res) => {
    const { title } = req.body;

    if (!title) {
      const error = new Error('Title is required');
      error.status = 400;
      throw error;
    }

    const result = await TasksDB.createTask(title);
    res.status(201).json(result.rows[0]);
  }),
);

// POST task done
router.post(
  '/tasks/:id/done',
  asyncHandler(async (req, res) => {
    const result = await TasksDB.completeTask(req.params.id);

    if (result.rowCount === 0) {
      const error = new Error('Task not found');
      error.status = 404;
      throw error;
    }

    res.json(result.rows[0]);
  }),
);

export default router;
