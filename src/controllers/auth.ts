import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/user';
import ConflictError from '../errors/ConflictError';
import { SECRET_KEY } from '../config';

export const signIn = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body;
    const user = await User.findUserByCredentials(email, password);
    const token = jwt.sign({ _id: user._id }, SECRET_KEY, { expiresIn: '7d' });

    res.cookie('jwt', token, {
      httpOnly: true,
      maxAge: 604800000, // 7 дней
      sameSite: 'strict',
    });

    res.send({ message: 'Авторизация успешна' });
  } catch (err) {
    next(err);
  }
};

export const signUp = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const {
      email, password, name, about, avatar,
    } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      email,
      password: hashedPassword,
      name,
      about,
      avatar,
    });

    res.status(201).send({
      _id: user._id,
      email: user.email,
      name: user.name,
      about: user.about,
      avatar: user.avatar,
    });
  } catch (err) {
    if ((err as any).code === 11000) {
      next(new ConflictError('Пользователь с таким email или паролем уже существует'));
    } else {
      next(err);
    }
  }
};
