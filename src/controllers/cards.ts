import { NextFunction, Request, Response } from 'express';
import { Error } from 'mongoose';
import { CardsModel } from '../models/cards';
import { cardsErrors } from '../errors/cards';
import { AuthContext } from '../types';
import NotFoundError from '../errors/not-found-error';
import BadRequestError from '../errors/bad-request-error';

export const getCards = async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const cards = await CardsModel.find();
    res.json(cards);
  } catch (error) {
    next(error);
  }
};

export const createCard = async (req: Request, res: Response<unknown, AuthContext>, next: NextFunction) => {
  try {
    const {
      name, link,
    } = req.body;
    const owner = res.locals.user?._id;
    const card = new CardsModel({
      name, link, owner,
    });
    await card.save();

    res.status(201).json(card);
  } catch (error) {
    if (error instanceof Error && error.name === "ValidationError") {
      next(new BadRequestError(cardsErrors[400]));
    } else {
      next(error);
    }
  }
};

export const getCardById = async (req: Request<{id: string}>, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const card = await CardsModel.findById(id);
    if (!card) {
      next(new NotFoundError(cardsErrors[404]));
    }
    res.json(card);
  } catch (error) {
    if (error instanceof Error && error.name === "CastError") {
      next(new NotFoundError(cardsErrors[404]));
    } else {
      next(error);
    }
  }
};

export const deleteCardById = async (req: Request<{id: string}>, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const card = await CardsModel.findOneAndDelete({ _id: id });
    if (!card) {
      next(new NotFoundError(cardsErrors[404]));
      return;
    }
    res.json({ ok: 'Удалено' });
  } catch (error) {
    if (error instanceof Error && error.name === "CastError") {
      next(new NotFoundError(cardsErrors[404]));
    } else {
      next(error);
    }
  }
};

export const putLike = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = res.locals.user._id;
    const cardId = req.params.id;

    const card = await CardsModel.findByIdAndUpdate(
      cardId,
      {
        $addToSet: { likes: userId },
      },
      { new: true },
    );

    if (!card) {
      next(new NotFoundError(cardsErrors[404]));
      return;
    }

    res.json(card);
  } catch (error) {
    if (error instanceof Error && error.name === "CastError") {
      next(new NotFoundError(cardsErrors[404]));
    } else {
      next(error);
    }
  }
};

export const deleteLike = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = res.locals.user._id;
    const cardId = req.params.id;

    const card = await CardsModel.findByIdAndUpdate(cardId, {
      $pull: { likes: userId },
    }, { new: true });

    if (!card) {
      next(new NotFoundError(cardsErrors[404]));
      return;
    }

    res.json(card);
  } catch (error) {
    if (error instanceof Error && error.name === "CastError") {
      next(new NotFoundError(cardsErrors[404]));
    } else {
      next(error);
    }
  }
};
