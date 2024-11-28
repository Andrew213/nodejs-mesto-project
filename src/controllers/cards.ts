import { NextFunction, Request, Response } from 'express';
import { Types } from 'mongoose';
import { CardsModel } from '../models/card';
import { BadRequestError } from '../middlewares/BadRequest';
import { CustomRequest } from '../app';
import { cardsErrors } from '../errors/cards';

export const getCards = async (_req: Request, res: Response) => {
  const cards = await CardsModel.find();
  res.json(cards);
};

export const createCard = async (req: CustomRequest, res: Response) => {
  const {
    name, link,
  } = req.body;
  const owner = req.user?._id;
  // const tokenHeader = req.headers.authorization!.split(' ')[1];
  // const owner = jwt.verify(tokenHeader, 'some-secret-key');
  const card = new CardsModel({
    name, link, owner,
  });
  await card.save();

  res.status(201).json(card);
};

export const getCardById = async (req: Request<{id: string}>, res: Response, next: NextFunction) => {
  const { id } = req.params;
  const card = await CardsModel.findById(id);
  if (!card) {
    next(new BadRequestError({ code: 404, message: cardsErrors[404] }));
  }
  res.json(card);
};

export const deleteCardById = async (req: Request<{id: string}>, res: Response) => {
  const { id } = req.params;
  const card = await CardsModel.findOneAndDelete({ _id: id });
  if (!card) {
    res.status(404).json({ message: cardsErrors[404] });
  }
  res.json({ ok: 'Удалено' });
};

export const putLike = async (req: CustomRequest, res: Response, next: NextFunction) => {
  const userId = req.user!._id!;
  const cardId = req.params.id;
  if (!cardId || !userId) {
    next(new BadRequestError({ code: 400, message: cardsErrors[400] }));
  }
  const card = await CardsModel.findById(cardId);

  if (!card) {
    next(new BadRequestError({ code: 404, message: cardsErrors[404] }));

    return;
  }

  if (card.likes.includes(userId as Types.ObjectId)) {
    next(new BadRequestError({ code: 400, message: cardsErrors[417] }));
  }

  await card.updateOne({
    $addToSet: { likes: userId },
  }, { new: true });

  res.json(card);
};

export const deleteLike = async (req: Request, res: Response, next: NextFunction) => {
  const userId = (req as any).user._id;
  const cardId = req.params.id;
  if (!cardId || !userId) {
    next(new BadRequestError({ code: 400, message: cardsErrors[400] }));
  }
  const card = await CardsModel.findByIdAndUpdate(cardId, {
    $pull: { likes: userId },
  }, { new: true });

  if (!card) {
    next(new BadRequestError({ code: 404, message: 'Card not found' }));
    return;
  }
  const index = card.likes.indexOf(userId);
  if (index === -1) {
    next(new BadRequestError({ code: 400, message: 'User did not like this card' }));
  }

  res.json(card);
};