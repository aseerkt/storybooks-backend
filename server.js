const express = require('express');
const cors = require('cors');
const logger = require('morgan');
const passport = require('passport');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const connectDB = require('./config/db');

// Load config vars
require('dotenv').config();

// Connect to DB
connectDB();

const app = express();

// CORS middleware
app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  })
);

// Logging
if (process.env.NODE_ENV === 'development') app.use(logger('dev'));
else app.use(logger('common'));

// Body parser middleware
app.use(express.json());

// Enable express sessions
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    store: new MongoStore({ mongooseConnection: mongoose.connection }),
    resave: false,
    saveUninitialized: false,
  })
);

// Passport config
require('./config/passport')(passport);

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Routes
app.use('/auth', require('./routes/auth'));
app.use('/api/stories', require('./routes/stories'));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(
    `Server ruuning in ${process.env.NODE_ENV} mode on http://localhost:${PORT}`
  );
});
