const mongoose = require('mongoose');

const migration = {
  name: '001_create_users_table',
  description: 'Create users collection with indexes',

  async up() {
    const db = mongoose.connection.db;

    // Create users collection if it doesn't exist
    const collections = await db.listCollections({ name: 'users' }).toArray();
    if (collections.length === 0) {
      await db.createCollection('users');
    }

    // Create indexes
    await db.collection('users').createIndex({ email: 1 }, { unique: true });
    await db.collection('users').createIndex({ createdAt: -1 });

    console.log('✓ Migration 001_create_users_table completed');
  },

  async down() {
    const db = mongoose.connection.db;

    // Drop indexes
    await db.collection('users').dropIndex({ email: 1 });
    await db.collection('users').dropIndex({ createdAt: -1 });

    // Drop collection (optional - uncomment if needed)
    // await db.collection('users').drop();

    console.log('✓ Migration 001_create_users_table rolled back');
  }
};

module.exports = migration;