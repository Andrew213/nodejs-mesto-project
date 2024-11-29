import { NextFunction, Request, Response } from "express";
import { Types } from "mongoose";
import { CardsModel } from "../models/cards";
import { cardsErrors } from "../errors/cards";
import { serverErrors } from "../errors/server";
import NotFoundError from "../errors/not-found-error";
import ForbiddenError from "../errors/forbidden-error";

export default async (req: Request<{id: string}>, res: Response, next: NextFunction) => {
  try {
    const userId = res.locals.user._id;
    const { id } = req.params;
    const card = await CardsModel.findById(id);
    if (!card) {
      next(new NotFoundError(cardsErrors[404]));
      return;
    }
    const userObjectId = new Types.ObjectId(userId);
    if (!userObjectId.equals(card.owner)) {
      next(new ForbiddenError(serverErrors[403]));
    }
    next();
  } catch (error) {
    next(error);
  }
};
