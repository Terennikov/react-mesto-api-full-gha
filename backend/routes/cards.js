import { Router } from 'express';
import { celebrate, Joi } from 'celebrate';
import {
  createCard, getCards, deleteCard, likeCard, deleteLike,
} from '../controllers/cards';
import URLREGEXP from '../utils/constans';

const cardRouter = Router();

cardRouter.get('/', getCards);
cardRouter.post('/', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    link: Joi.string().required().pattern(URLREGEXP),
  }),
}), createCard);
cardRouter.delete('/:id', celebrate({
  params: Joi.object().keys({
    id: Joi.string().length(24).hex().required(),
  }),
}), deleteCard);
cardRouter.put('/:id/likes', celebrate({
  params: Joi.object().keys({
    id: Joi.string().length(24).hex().required(),
  }),
}), likeCard);
cardRouter.delete('/:id/likes', celebrate({
  params: Joi.object().keys({
    id: Joi.string().length(24).hex().required(),
  }),
}), deleteLike);

export default cardRouter;
