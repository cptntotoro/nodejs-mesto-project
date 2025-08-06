import mongoose from 'mongoose';
import validator from 'validator';
import bcrypt from 'bcryptjs';

interface IUser {
  email: string;
  password: string;
  name: string;
  about: string;
  avatar: string;
}

interface IUserModel extends mongoose.Model<IUser> {
  findUserByCredentials(
    _email: string,
    _password: string
  ): Promise<mongoose.HydratedDocument<IUser>>;
}

const userSchema = new mongoose.Schema<IUser, IUserModel>(
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
      select: false,
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

userSchema.static('findUserByCredentials', function findUserByCredentials(email: string, password: string) {
  return this.findOne({ email }).select('+password') // Add select('+password')
    .then((user) => {
      if (!user) {
        return Promise.reject(new Error('Неправильные почта или пароль'));
      }

      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            return Promise.reject(new Error('Неправильные почта или пароль'));
          }

          return user;
        });
    });
});

const User = mongoose.model<IUser, IUserModel>('user', userSchema);

export default User;
