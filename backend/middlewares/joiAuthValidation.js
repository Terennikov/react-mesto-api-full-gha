import { celebrate, Joi } from 'celebrate';
import URLREGEXP from '../utils/constans.js';

export const checkSignupValidation = celebrate({
  body: Joi.object().keys({
    email: Joi.string().email().required(),
    password: Joi.string().min(2).max(30).required(),
    about: Joi.string().max(30).min(2),
    name: Joi.string().max(30).min(2),
    avatar: Joi.string().pattern(URLREGEXP),
  }),
});

export const checkSigninValidation = celebrate({
  body: Joi.object().keys({
    email: Joi.string().email().required(),
    password: Joi.string().min(2).max(30).required(),
  }),
});
