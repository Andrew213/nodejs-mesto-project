/* eslint-disable consistent-return */
import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import mongoose from "mongoose";
import { UserModel } from "../models/user";
import { BadRequestError } from "../middlewares/BadRequest";

export type JWTpayload = {
  _id: mongoose.Types.ObjectId
}

export const signIn = (req: Request, res: Response, next: NextFunction) => {
  const { email, password } = req.body;
  return UserModel.findUserByCredentials(email, password).then((user) => {
    const token = jwt.sign({ _id: user._id }, 'some-secret-key', { expiresIn: 3600 });
    res.send({ token });
  }).catch((err) => {
    console.log(`err `, err);
    next(new BadRequestError({ code: 401, message: 'Err with auth' }));
  });
};

export const signUp = async (req: Request, res: Response, next: NextFunction) => {
  const { email, password } = req.body;
  console.log(19);
  try {
    const user = await UserModel.findOne({ email });
    console.log(`user `, user);
    if (user) {
      next(new BadRequestError({ code: 409, message: 'User already exists' }));
    } else {
      const hashPassword = await bcrypt.hash(password, 10);
      const newUser = new UserModel({ email, password: hashPassword });
      await newUser.save();
      res.status(201).json({ user: newUser });
    }
  } catch (error) {
    console.log(`ERRR`, error);
    next(new BadRequestError({ code: 401, message: 'Err with auth' }));
  }
};
