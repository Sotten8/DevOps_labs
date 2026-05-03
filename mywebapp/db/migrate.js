import pg from 'pg';
import config from '../config/config.js';

const { Client } = pg;

async function migrate() {
  const client = new Client({ connectionString: config.db_url });
  await client.connect();
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
    await client.query(query);
    console.log('Migration successful: "tasks" table is ready');
  } catch (err) {
    console.error('Migration failed:', err);
  } finally {
    await client.end();
  }
}

migrate();
