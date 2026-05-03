import pg from 'pg';
import config from './config.js';

const { Client } = pg;

const executeQuery = async (query, values = []) => {
  const client = new Client({ connectionString: config.db_url });
  await client.connect();
  try {
    return await client.query(query, values);
  } finally {
    await client.end();
  }
};

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
};
