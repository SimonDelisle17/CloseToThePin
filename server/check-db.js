const mongoose = require('mongoose');
require('dotenv').config();

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/closetothepin')
.then(async () => {
  console.log('Connected to MongoDB');

  // List all collections
  const collections = await mongoose.connection.db.listCollections().toArray();
  console.log('Collections:', collections.map(c => c.name));

  // Check users collection
  const User = require('./models/User');
  const users = await User.find({});
  console.log('Users count:', users.length);
  console.log('Users:', users);

  process.exit(0);
})
.catch(err => {
  console.error('MongoDB connection error:', err);
  process.exit(1);
});