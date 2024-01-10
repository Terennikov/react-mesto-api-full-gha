import mongoose from 'mongoose';
import isEmail from 'validator/lib/isEmail.js';
import URLREGEXP from '../utils/constans.js';

const userSheme = new mongoose.Schema(
  {
    name: {
      type: String,
      default: 'Жак-Ив Кусто',
      minlength: [2, 'Минимальная длинна 2 символа'],
      maxlenght: [30, 'Максимальная длинна 30 символов'],
    },
    about: {
      type: String,
      default: 'Исследователь',
      minlength: [2, 'Минимальная длинна 2 символа'],
      maxlenght: [30, 'Максимальная длинна 30 символов'],
    },
    avatar: {
      type: String,
      default: 'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png',
      validate: {
        validator: (v) => URLREGEXP.test(v),
        message: (props) => `${props.value} Не валидный URL адрес`,
      },

    },
    email: {
      type: String,
      required: true,
      unique: true,
      validate: {
        validator: (v) => isEmail(v),
        message: (props) => `${props.value} не валидный email`,
      },
    },
    password: {
      type: String,
      required: true,
      select: false,
    },
  },
  
  {
    versionKey: false,
    timestamps: true,
  },
);

export default mongoose.model('user', userSheme);
