import TasksDB from './db.js';

async function migrate() {
  const query = `
    DO $$ BEGIN
        CREATE TYPE task_status AS ENUM ('in progress', 'done');
    EXCEPTION
        WHEN duplicate_object THEN null;
    END $$;

    CREATE TABLE IF NOT EXISTS tasks (
        id SERIAL PRIMARY KEY,
        title TEXT NOT NULL,
        status task_status DEFAULT 'in progress',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `;

  try {
    await TasksDB.pool.query(query);
    console.log('Migration successful: "tasks" table is ready');
  } catch (err) {
    console.error('Migration failed:', err);
  } finally {
    await TasksDB.pool.end();
  }
}

migrate();
