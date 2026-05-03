import express from 'express';
import TasksDB from './db/db.js';

const app = express();
app.use(express.json());

// Home page
app.get('/', (req, res) => {
  if ((req.headers.accept || '').includes('text/html')) {
    res.send(`
      <html><body>
          <h1>Task Tracker API</h1>
          <ul>
              <li>GET /tasks - list</li>
              <li>POST /tasks - create</li>
              <li>POST /tasks/:id/done - change status</li>
          </ul>
      </body></html>
    `);
  } else {
    res.status(406).send('Only text/html supported for root');
  }
});

// GET tasks
app.get('/tasks', async (req, res) => {
  try {
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
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST task
app.post('/tasks', async (req, res) => {
  const { title } = req.body;
  if (!title) return res.status(400).send('Title is required');
  try {
    const result = await TasksDB.createTask(title);
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Changing status of the task to "done" (POST)
app.post('/tasks/:id/done', async (req, res) => {
  try {
    const result = await TasksDB.completeTask(req.params.id);
    if (result.rowCount === 0) return res.status(404).send('Not found');
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Health checks
app.get('/health/alive', (req, res) => res.send('OK'));
app.get('/health/ready', async (req, res) => {
  try {
    await TasksDB.ping();
    res.send('OK');
  } catch {
    res.status(500).send('DB Error');
  }
});

export default app;
