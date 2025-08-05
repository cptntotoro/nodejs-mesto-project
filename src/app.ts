import express, { NextFunction, Request, Response } from 'express';
import mongoose from 'mongoose';
import cookieParser from 'cookie-parser';
import { body } from 'express-validator';
import cardsRouter from './routes/card';
import usersRouter from './routes/user';
import 'dotenv/config';
import { signIn, signUp } from './controllers/auth';
import auth from './middlewares/auth';
import errorHandler from './middlewares/errorHandler';
import { logRequest } from './util/logger';
import NotFoundError from './errors/NotFoundError';
import { validateRequest, validateUrl } from './middlewares/validation';
import { PORT, MONGO_URL } from './config';

const app = express();

mongoose.connect(MONGO_URL);

app.use(cookieParser());
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use(logRequest);

/**
 * Публичные роуты
 */
app.post(
  '/signin',
  [
    body('email')
      .isEmail()
      .normalizeEmail()
      .withMessage('Некорректный email'),
    body('password')
      .notEmpty()
      .withMessage('Пароль обязателен'),
    validateRequest,
  ],
  signIn,
);

app.post(
  '/signup',
  [
    body('email')
      .isEmail()
      .normalizeEmail()
      .withMessage('Некорректный email'),
    body('password')
      .isLength({ min: 8 })
      .withMessage('Пароль должен содержать минимум 8 символов'),
    body('name')
      .optional()
      .trim()
      .isLength({ min: 2, max: 30 })
      .withMessage('Имя должно содержать от 2 до 30 символов'),
    body('about')
      .optional()
      .trim()
      .isLength({ min: 2, max: 200 })
      .withMessage('Информация о себе должна содержать от 2 до 200 символов'),
    body('avatar')
      .optional()
      .trim()
      .custom(validateUrl)
      .withMessage('Некорректный URL аватара. URL должен начинаться с http:// или https://, содержать домен и доменную зону'),
    validateRequest,
  ],
  signUp,
);

/**
 * Роуты, требующие авторизации
 */
app.use(auth);
app.use('/cards', cardsRouter);
app.use('/users', usersRouter);

/**
 * Обработка несуществующих роутов
 */
app.use('*', (_req: Request, _res: Response, next: NextFunction) => {
  next(new NotFoundError('Ресурс не найден'));
});

/**
 * Централизованная обработка ошибок
 */
app.use(errorHandler);

app.listen(PORT);
