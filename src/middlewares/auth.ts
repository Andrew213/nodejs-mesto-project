import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { BadRequestError } from "./BadRequest";
import { authErrors } from "../errors/auth";
import { AuthContext, JWTpayload } from "../types";

interface CustomRequest extends Request{
  user?: JWTpayload | string
}

export default (req: CustomRequest, res: Response<any, AuthContext>, next: NextFunction) => {
  const { authorization } = req.headers;
  if (!authorization || !authorization.startsWith('Bearer ')) {
    next(new BadRequestError({ code: 401, message: authErrors[401] }));
    return;
  }
  const token = authorization.replace('Bearer ', '');

  try {
    const payload = jwt.verify(token, 'some-secret-key')as JWTpayload;
    res.locals.user = payload; // записываем пейлоуд в объект запроса
  } catch (error) {
    next(new BadRequestError({ code: 401, message: authErrors[401] }));
  }

  next();
};
