import mongoose from 'mongoose';
import validator from 'validator';

interface IUser {
  email: string;
  password: string;
  name: string;
  about: string;
  avatar: string;
}

const userSchema = new mongoose.Schema<IUser>(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      validate: {
        validator: (v: string) => validator.isEmail(v),
        message: 'Некорректный email',
      },
    },
    password: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: false,
      minlength: 2,
      maxlength: 30,
      default: 'Жак-Ив Кусто',
    },
    about: {
      type: String,
      required: false,
      minLength: 2,
      maxLength: 200,
      default: 'Исследователь',
    },
    avatar: {
      type: String,
      required: false,
      validate: {
        validator: (v: string) => validator.isURL(v),
        message: 'Некорректный URL аватара',
      },
      default: 'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png',
    },
  },
  { versionKey: false },
);

export default mongoose.model<IUser>('user', userSchema);
