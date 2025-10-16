const fs = require('fs').promises;
const path = require('path');
const { Client } = require('pg');
require('dotenv').config();

const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
  console.error('❌ Error: DATABASE_URL not found in .env file');
  process.exit(1);
}

console.log('🚀 Starting database setup...\n');

async function runSQLFile(client, filePath, description) {
  try {
    console.log(`📄 Running ${description}...`);
    
    const sqlContent = await fs.readFile(filePath, 'utf8');
    
    const lines = sqlContent.split('\n');
    const cleanedLines = lines.filter(line => {
      const trimmed = line.trim();
      return trimmed.length > 0 && !trimmed.startsWith('--');
    });
    
    const cleanedSQL = cleanedLines.join('\n');
    
    const statements = [];
    let currentStmt = '';
    let insideDollarQuote = false;
    
    for (let i = 0; i < cleanedSQL.length; i++) {
      const char = cleanedSQL[i];
      currentStmt += char;
      
      if (char === '$' && cleanedSQL[i + 1] === '$') {
        insideDollarQuote = !insideDollarQuote;
        currentStmt += '$';
        i++; 
      }
      
      if (char === ';' && !insideDollarQuote) {
        const stmt = currentStmt.trim();
        if (stmt) {
          statements.push(stmt);
        }
        currentStmt = '';
      }
    }
    
    if (currentStmt.trim()) {
      statements.push(currentStmt.trim());
    }
    
    let successCount = 0;
    for (let i = 0; i < statements.length; i++) {
      const stmt = statements[i];
      if (!stmt) continue;
      
      try {
        await client.query(stmt);
        successCount++;
      } catch (error) {
        console.error(`❌ Error in statement ${i + 1}:`, error.message);
        const preview = stmt.substring(0, 200).replace(/\s+/g, ' ');
        console.error('Statement preview:', preview + '...\n');
        return false;
      }
    }
    
    console.log(`✅ ${description} completed successfully (${successCount} statements)\n`);
    return true;
  } catch (error) {
    console.error(`❌ Error reading ${description}:`, error.message);
    return false;
  }
}

async function main() {
  const schemaPath = path.join(__dirname, '..', 'database', 'schema.sql');
  const seedPath = path.join(__dirname, '..', 'database', 'seed.sql');

  const client = new Client({
    connectionString: DATABASE_URL,
  });

  try {
    console.log('🔌 Connecting to database...');
    await client.connect();
    console.log('✅ Connected successfully\n');

    const schemaSuccess = await runSQLFile(client, schemaPath, 'Schema Creation (Tables & Triggers)');
    
    if (!schemaSuccess) {
      console.error('\n❌ Schema creation failed. Stopping setup.');
      await client.end();
      process.exit(1);
    }

    const seedSuccess = await runSQLFile(client, seedPath, 'Database Seeding (Test Data)');
    
    if (!seedSuccess) {
      console.error('\n❌ Database seeding failed.');
      await client.end();
      process.exit(1);
    }

    console.log('\n🎉 Database setup completed successfully!');
    console.log('\n📊 Database Contents:');
    console.log('  - 3 test users created');
    console.log('  - 12 accounts created (4 per user)');
    console.log('  - 12 transactions with ledger entries');
    console.log('\n🔐 Test User Credentials:');
    console.log('  - john.doe@example.com / password123');
    console.log('  - jane.smith@example.com / password123');
    console.log('  - mike.johnson@example.com / password123');
    console.log('\n✨ You can now start the server with: npm run start:dev\n');

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
