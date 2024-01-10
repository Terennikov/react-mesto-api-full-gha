import { Router } from 'express';
import { celebrate, Joi } from 'celebrate';
import {
  getUsers, getUsersById, updateProfile, updateAvatar, getCurrentUser,
} from '../controllers/users.js';
import URLREGEXP from '../utils/constans.js';

const userRouter = Router();

userRouter.get('/', getUsers);
userRouter.get('/me', getCurrentUser);
userRouter.get('/:id', celebrate({
  params: Joi.object().keys({
    id: Joi.string().length(24).hex().required(),
  }),
}), getUsersById);
userRouter.patch('/me', celebrate({
  body: Joi.object().keys({
    email: Joi.string().email(),
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
  }),
}), updateProfile);
userRouter.patch('/me/avatar', celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().pattern(URLREGEXP).required(),
  }),
}), updateAvatar);

export default userRouter;

