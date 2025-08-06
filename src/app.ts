import express, { Request, Response } from 'express';
import mongoose from 'mongoose';
import cardsRouter from './routes/card';
import usersRouter from './routes/user';
import 'dotenv/config';
import { handleNotFoundError, handleUnauthorizedError } from './util/errorHandlers';
import { signUp, signIn } from './controllers/auth';
import auth from './middlewares/auth';

const { PORT = 3000, MONGO_URL = 'mongodb://localhost:27017/mestodb' } = process.env;

const app = express();

mongoose.connect(MONGO_URL);

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

/**
 * Публичные роуты
 */
app.post('/signin', signIn);
app.post('/signup', signUp);

/**
 * Роуты, требующие авторизации
 */
app.use(auth);
app.use('/cards', cardsRouter);
app.use('/users', usersRouter);

/**
 * Обработка несуществующих роутов
 */
app.use('*', (req: Request, res: Response) => {
  handleUnauthorizedError(res);
});

app.listen(PORT);
