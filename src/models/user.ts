import mongoose, { Schema, Model, Document } from 'mongoose';
import isEmail from 'validator/lib/isEmail';
import bcrypt from 'bcryptjs';
import { validLinkRegexp } from '../utils/constants';
import UnauthorizedError from '../errors/UnauthorizedError';
import ErrorMessage from '../types/ErrorMessage';

export interface IUser {
  name: string,
  about: string,
  avatar: string,
  email: string,
  password?: string,
  _id: string,
}

export interface IUserModel extends Model<IUser> {
  // eslint-disable-next-line no-unused-vars
  findUserByCredentials(email: string, password: string): Document<unknown, any, IUser>,
}

const userSchema = new Schema<IUser>({
  name: {
    type: String,
    default: 'Пользователь',
    minlength: 2,
    maxlength: 30,
  },
  about: {
    type: String,
    default: 'Гость',
    minlength: 2,
    maxlength: 200,
  },
  avatar: {
    type: String,
    default: 'https://www.pngmart.com/image/479979/png/479978 User Avatar Profile Download PNG Isolated Image',
    validate: {
      validator(link: string) {
        return validLinkRegexp.test(link);
      },
    },
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: isEmail,
    },
  },
  password: {
    type: String,
    required: true,
    select: false,
  },
}, {
  statics: {
    async findUserByCredentials(email: string, password: string) {
      const user = await this.findOne({ email }).select('+password');

      if (!user) {
        throw new UnauthorizedError(ErrorMessage.INVALID_EMAIL_OR_PASSWORD);
      }

      const isAuthorized = await bcrypt.compare(password, user.password as string);

      if (!isAuthorized) {
        throw new UnauthorizedError(ErrorMessage.INVALID_EMAIL_OR_PASSWORD);
      }

      return user;
    },
  },
});

export default mongoose.model<IUser, IUserModel>('user', userSchema);
