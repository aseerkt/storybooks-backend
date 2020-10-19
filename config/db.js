const mongoose = require('mongoose');

module.exports = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_REMOTE_URI, {
      useCreateIndex: true,
      useFindAndModify: false,
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(`Connected to MongoDB: ${conn.connection.host}`);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};
