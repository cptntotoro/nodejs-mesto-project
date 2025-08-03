import express, { NextFunction, Request, Response } from 'express';
import mongoose from 'mongoose';
import cardsRouter from './routes/card';
import usersRouter from './routes/user';
import { RequestWithUser } from './types';
import 'dotenv/config';
import { handleNotFoundError } from './util/errorHandlers';

const { PORT = 3000, MONGO_URL = 'mongodb://localhost:27017/mestodb' } = process.env;

const app = express();

app.use((req: Request, res: Response, next: NextFunction) => {
  (req as RequestWithUser).user = {
    _id: '6892006dfc31c6c15938ab9c',
  };
  next();
});

mongoose.connect(MONGO_URL);

app.use(express.json());
app.use('/cards', cardsRouter);
app.use('/users', usersRouter);

// Обработка несуществующих роутов
app.use('*', (req: Request, res: Response) => {
  handleNotFoundError(res, 'Запрашиваемый ресурс не найден');
});

app.listen(PORT);
