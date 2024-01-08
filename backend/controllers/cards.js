import mongoose from 'mongoose';
import { StatusCodes } from 'http-status-codes';
import Card from '../models/Card';
import BadRequestError from '../utils/errors/BadRequestError';
import NotFoundError from '../utils/errors/NotFoundError';
import NoAccessRightsError from '../utils/errors/NoAccessRightsError';

export const getCards = async (req, res, next) => {
  try {
    const cards = await Card.find({});
    return res.status(StatusCodes.OK).send(cards); // массив карточек
  } catch (error) {
    return next(error);
  }
};

export const createCard = async (req, res, next) => {
  try {
    const card = await new Card({
      name: req.body.name,
      link: req.body.link,
      owner: req.user._id,
    });
    return res.status(StatusCodes.OK).send(await card.save({
      runValidators: true,
    }));
  } catch (error) {
    // if (error instanceof mongoose.Error.CastError) {
    //   return next(new BadRequestError(error));
    // }
    if (error instanceof mongoose.Error.ValidationError) {
      return next(new BadRequestError(error));
    }
    return next(error);
  }
};

export const deleteCard = async (req, res, next) => {
  try {
    const { id } = req.params;
    const card = await Card.findById({ _id: id });
    if (!card) {
      throw new NotFoundError('Карточка по id не найдена');
    }
    const cardOwner = card.owner.toString().replace('new ObjectId', '');
    if (cardOwner === req.user._id) {
      await Card.deleteOne(card);
      return res.status(StatusCodes.OK).send({ message: 'Пост удален' });
    } throw new NoAccessRightsError('Можно удалять только свои карточки');
  } catch (error) {
    if (error instanceof mongoose.Error.CastError) {
      return next(new BadRequestError('Передан не валидный id'));
    }
    return next(error);
  }
};

export const likeCard = async (req, res, next) => {
  try {
    const card = await Card.findByIdAndUpdate(
      req.params.id,
      { $addToSet: { likes: req.user._id } },
      { new: true },
    );
    if (!card) {
      throw new NotFoundError('Карточка по id не найдена');
    }
    return res.status(StatusCodes.OK).send(card); //  карточка
  } catch (error) {
    if (error instanceof mongoose.Error.CastError) {
      next(new BadRequestError('Передан не валидный id'));
    }
    return next(error);
  }
};

export const deleteLike = async (req, res, next) => {
  try {
    const card = await Card.findByIdAndUpdate(
      req.params.id,
      { $pull: { likes: req.user._id } },
      { new: true },
    );
    if (!card) {
      throw new NotFoundError('Карточка по id не найдена');
    }
    return res.status(StatusCodes.OK).send(card); //  карточка
  } catch (error) {
    if (error instanceof mongoose.Error.CastError) {
      return next(new BadRequestError('Передан не валидный id'));
    }
    return next(error);
  }
};
