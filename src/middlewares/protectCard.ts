import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { Types } from "mongoose";
import { AuthContext, JWTpayload } from "../types";
import { CardsModel } from "../models/cards";
import { BadRequestError } from "./BadRequest";
import { cardsErrors } from "../errors/cards";
import { serverErrors } from "../errors/server";

export default async (req: Request<{id: string}>, _res: Response<unknown, AuthContext>, next: NextFunction) => {
  try {
    const hashedToken = req.headers.authorization!;
    const token = hashedToken.split(" ")[1];
    const userId = jwt.verify(token, 'some-secret-key') as JWTpayload;
    const { id } = req.params;
    const card = await CardsModel.findById(id);
    if (!card) {
      next(new BadRequestError({ code: 404, message: cardsErrors[404] }));
    }
    const userObjectId = new Types.ObjectId(userId._id);
    if (!userObjectId.equals(card?.owner)) {
      next(new BadRequestError({ code: 403, message: serverErrors[403] }));
    }
    next();
  } catch (error) {
    next(new BadRequestError({
      code: 500, message: serverErrors[500], context: [error], logging: true,
    }));
  }
};
