import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { authErrors } from "../errors/auth";
import { AuthContext, JWTpayload } from "../types";
import UnauthorizedError from "../errors/unauthorized-error";

interface CustomRequest extends Request{
  user?: JWTpayload | string
}

export default (req: CustomRequest, res: Response<any, AuthContext>, next: NextFunction) => {
  const { authorization } = req.headers;
  if (!authorization || !authorization.startsWith('Bearer ')) {
    next(new UnauthorizedError(authErrors[401]));
    return;
  }
  const token = authorization.replace('Bearer ', '');

  try {
    const payload = jwt.verify(token, process.env.TOKEN_SECRET)as JWTpayload;
    res.locals.user = payload; // записываем пейлоуд в объект запроса
  } catch (error) {
    next(new UnauthorizedError(authErrors[401]));
  }

  next();
};
