const fs = require('fs').promises;
const path = require('path');
const { Client } = require('pg');
require('dotenv').config();

const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
  console.error('❌ Error: DATABASE_URL not found in .env file');
  process.exit(1);
}

console.log('🗑️  Starting database cleanup...\n');

async function main() {
  const dropPath = path.join(__dirname, '..', 'database', 'drop.sql');

  const client = new Client({
    connectionString: DATABASE_URL,
  });

  try {
    console.log('🔌 Connecting to database...');
    await client.connect();
    console.log('✅ Connected successfully\n');

    console.log('📄 Dropping all tables, functions, and views...');
    const dropSQL = await fs.readFile(dropPath, 'utf8');
    
    const statements = dropSQL
      .split(';')
      .map(stmt => stmt.trim())
      .filter(stmt => stmt.length > 0 && !stmt.startsWith('--'));
    
    for (const statement of statements) {
      if (statement && statement.length > 0) {
        try {
          await client.query(statement);
        } catch (error) {
          if (!error.message.includes('does not exist')) {
            console.error(`⚠️  Warning: ${error.message}`);
          }
        }
      }
    }

    console.log('✅ All database objects dropped successfully\n');
    console.log('💡 Run "npm run db:setup" to recreate tables with seed data');

  } catch (error) {
    console.error('\n❌ Database connection error:', error.message);
    process.exit(1);
  } finally {
    await client.end();
  }
}

main().catch(error => {
  console.error('\n❌ Unexpected error:', error);
  process.exit(1);
});
