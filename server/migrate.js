const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

// Migration tracking model
const migrationSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  executedAt: { type: Date, default: Date.now }
});

const Migration = mongoose.model('Migration', migrationSchema);

async function runMigrations() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/closetothepin');
    console.log('Connected to MongoDB for migrations');

    // Get all migration files
    const migrationsDir = path.join(__dirname, 'migrations');
    const migrationFiles = fs.readdirSync(migrationsDir)
      .filter(file => file.endsWith('.js'))
      .sort();

    // Get executed migrations
    const executedMigrations = await Migration.find({});
    const executedNames = executedMigrations.map(m => m.name);

    console.log(`Found ${migrationFiles.length} migration files`);
    console.log(`${executedNames.length} migrations already executed`);

    // Run pending migrations
    for (const file of migrationFiles) {
      const migrationName = path.basename(file, '.js');

      if (!executedNames.includes(migrationName)) {
        console.log(`Running migration: ${migrationName}`);

        const migration = require(path.join(migrationsDir, file));
        await migration.up();

        // Mark as executed
        await Migration.create({ name: migrationName });
        console.log(`✓ Completed migration: ${migrationName}`);
      } else {
        console.log(`⚠ Skipping already executed migration: ${migrationName}`);
      }
    }

    console.log('All migrations completed successfully!');
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  } finally {
    await mongoose.connection.close();
  }
}

// Run migrations if called directly
if (require.main === module) {
  runMigrations();
}

module.exports = { runMigrations, Migration };