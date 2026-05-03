import pg from 'pg';
import config from '../config.js';

const { Pool } = pg;

const pool = new Pool({
  connectionString: config.db_url,
});

pool.on('error', (err) => {
  console.error('Unexpected error on idle client', err);
  process.exit(-1);
});

const executeQuery = (query, values = []) => pool.query(query, values);

export default {
  getAllTasks: () =>
    executeQuery(
      `SELECT id, title, status, created_at
      FROM tasks
      ORDER BY id ASC`,
    ),
  createTask: (title) =>
    executeQuery(
      `INSERT INTO tasks (title, status)
      VALUES ($1, 'in progress') RETURNING *`,
      [title],
    ),
  completeTask: (id) =>
    executeQuery(
      `UPDATE tasks
      SET status = 'done'
      WHERE id = $1 RETURNING *`,
      [id],
    ),
  ping: () => executeQuery('SELECT 1'),
  pool,
};
