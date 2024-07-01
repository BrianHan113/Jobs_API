require('dotenv').config();
require('express-async-errors');

// Security middleware
const helmet = require('helmet')
const cors = require('cors')
const xss = require('xss-clean')
const rateLimiter = require('express-rate-limit')

const express = require('express');
const app = express();

const connectDB = require("./db/connect")

const authRouter = require('./routes/auth')
const jobsRouter = require('./routes/jobs')

const authProtect = require('./middleware/authentication')

// error handler
const notFoundMiddleware = require('./middleware/not-found');
const errorHandlerMiddleware = require('./middleware/error-handler');

app.set('trust proxy', 1)
app.use(rateLimiter({
  windowMs: 15*60*1000, // 15 mins
  max: 100, // Each IP can do up to 100 reqs per windowMs
}))
app.use(express.json());
app.use(helmet())
app.use(cors())
app.use(xss())

// routes
app.get('/', (req, res) => {
  res.send('jobs api');
});

app.use('/api/v1/auth', authRouter)
app.use('/api/v1/jobs', authProtect, jobsRouter) // All job routes require auth


app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

const port = process.env.PORT || 3000;

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI)
    app.listen(port, () =>
      console.log(`Server is listening on port ${port}...`)
    );
  } catch (error) {
    console.log(error);
  }
};

start();
