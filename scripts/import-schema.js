import dotenv from 'dotenv';
import fs from 'fs';
import mysql from 'mysql2/promise';

dotenv.config({ path: '.env.aiven' });

const file = process.argv[2];
if (!file) {
  console.error('Usage: node scripts/import-schema.js path/to/file.sql');
  process.exit(1);
}

const connection = await mysql.createConnection({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  ssl: { rejectUnauthorized: false },
  multipleStatements: true,
});

await connection.query(fs.readFileSync(file, 'utf8'));
const [tables] = await connection.query('SHOW TABLES');
console.log('Done. Tables:', tables.map(t => Object.values(t)[0]));
await connection.end();