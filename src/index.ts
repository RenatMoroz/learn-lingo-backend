import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';

import { initMongoDB } from './database/initMongoDb.js';
import { printRoutes } from './helpers/printRoutes.js';
import { errorHandler } from './middlewares/errorHandler.js';
import router from './routes/index.js';
import { requestLogger } from './middlewares/requestLogger.js';

const app = express();

app.use(express.json());
app.use(cors());
app.use(cookieParser());

app.use(initMongoDB);
app.use(requestLogger);
app.use(router);
app.use(errorHandler);

printRoutes(app);

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
