import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { JWTpayload } from "../controllers/auth";
import { BadRequestError } from "./BadRequest";

interface CustomRequest extends Request{
  user?: JWTpayload | string
}

export default (req: CustomRequest, res: Response, next: NextFunction) => {
  const { authorization } = req.headers;
  if (!authorization || !authorization.startsWith('Bearer ')) {
    next(new BadRequestError({ code: 401, message: 'Необходима авторизация' }));
    return;
  }
  const token = authorization.replace('Bearer ', '');

  try {
    const payload = jwt.verify(token, 'some-secret-key')as JWTpayload;
    req.user = payload; // записываем пейлоуд в объект запроса
  } catch (error) {
    next(new BadRequestError({ code: 401, message: 'Необходима авторизация' }));
  }

  next();
};
